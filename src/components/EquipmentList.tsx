import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Cpu,
  Share2,
  Calendar,
  AlertTriangle,
  Edit2,
  Trash2,
  ChevronRight,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Equipment,
  EquipmentStatusSummary,
  StatusColor,
  User,
} from '../types';
import { TrafficLightBadge } from './TrafficLightBadge';

interface EquipmentListProps {
  equipments: Equipment[];
  summaries: EquipmentStatusSummary[];
  currentUser: User | null;
  onOpenAddModal: () => void;
  onOpenEditModal: (equipment: Equipment) => void;
  onDeleteEquipment: (id: string, name: string) => void;
  onOpenDetailModal: (equipmentId: string) => void;
  onOpenReminder: (type: 'EQUIPMENT', item: EquipmentStatusSummary) => void;
  initialFilter?: { status?: StatusColor; year?: number };
}

export const EquipmentList: React.FC<EquipmentListProps> = ({
  equipments,
  summaries,
  currentUser,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteEquipment,
  onOpenDetailModal,
  onOpenReminder,
  initialFilter,
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>(initialFilter?.year ? String(initialFilter.year) : 'ALL');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter?.status || 'ALL');
  const [operationalFilter, setOperationalFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  // Delete Confirmation State (BR-006)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  // Collect unique acquisition years sorted descending
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(equipments.map((e) => e.acquisitionYear)));
    return years.sort((a, b) => b - a);
  }, [equipments]);

  // Collect unique laboratory locations
  const availableLocations = useMemo(() => {
    const locs = Array.from(new Set(equipments.map((e) => e.location))).filter(Boolean);
    return locs.sort();
  }, [equipments]);

  // Filtered Equipment List
  const filteredSummaries = useMemo(() => {
    return summaries.filter((summary) => {
      const eq = summary.equipment;

      // Text search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = eq.name.toLowerCase().includes(query);
        const matchCode = eq.assetCode.toLowerCase().includes(query);
        const matchBrand = eq.brandModel.toLowerCase().includes(query);
        const matchSerial = eq.serialNumber?.toLowerCase().includes(query);
        const matchLocation = eq.location.toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchBrand && !matchSerial && !matchLocation) {
          return false;
        }
      }

      // Year filter (FR-004 Acceptance Criteria 1)
      if (yearFilter !== 'ALL') {
        if (eq.acquisitionYear !== Number(yearFilter)) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        if (summary.overallStatus !== statusFilter) return false;
      }

      // Operational status filter
      if (operationalFilter !== 'ALL') {
        if (eq.operationalStatus !== operationalFilter) return false;
      }

      // Location filter (e.g. R&D LAB vs CRM LAB)
      if (locationFilter !== 'ALL') {
        if (eq.location !== locationFilter) return false;
      }

      return true;
    });
  }, [summaries, searchTerm, yearFilter, statusFilter, operationalFilter, locationFilter]);

  const confirmDelete = () => {
    if (itemToDelete) {
      onDeleteEquipment(itemToDelete.id, itemToDelete.name);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Daftar Peralatan & Instrumen Makmal
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-200 text-slate-800">
              {equipments.length} ASET
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Penjejakan pematuhan jadual kalibrasi luaran, verifikasi dalaman dan penapisan tahun perolehan.
          </p>
        </div>

        {/* FR-004: Only Admin can see "+ Tambah Peralatan" button */}
        {isAdmin && (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>+ Daftar Peralatan Baharu</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama peralatan, kod aset (UKJK-EQ-...), model, atau lokasi makmal..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filter Tahun Perolehan */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1">
              <Calendar size={13} className="text-slate-400" />
              <label className="text-slate-600 font-medium">Tahun:</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Semua Tahun</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    Tahun {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1">
              <label className="text-slate-600 font-medium">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="RED">🔴 Tamat Tempoh (Merah)</option>
                <option value="YELLOW">🟡 Hampir Tamat (Kuning)</option>
                <option value="GREEN">🟢 Sah (Hijau)</option>
              </select>
            </div>

            {/* Filter Operasi */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1">
              <label className="text-slate-600 font-medium">Operasi:</label>
              <select
                value={operationalFilter}
                onChange={(e) => setOperationalFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Semua Operasi</option>
                <option value="ACTIVE">Aktif</option>
                <option value="MAINTENANCE">Penyelenggaraan (KIV)</option>
                <option value="BROKEN">Rosak</option>
              </select>
            </div>

            {/* Filter Lokasi Makmal */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1">
              <label className="text-slate-600 font-medium">Lokasi:</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Semua Makmal</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || yearFilter !== 'ALL' || statusFilter !== 'ALL' || operationalFilter !== 'ALL' || locationFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setYearFilter('ALL');
                  setStatusFilter('ALL');
                  setOperationalFilter('ALL');
                  setLocationFilter('ALL');
                }}
                className="text-xs text-teal-700 hover:underline px-1 font-semibold"
              >
                Set Semula
              </button>
            )}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between items-center">
          <span>
            Memaparkan <strong>{filteredSummaries.length}</strong> daripada {equipments.length} peralatan
            {yearFilter !== 'ALL' && ` (Tahun Perolehan ${yearFilter})`}
          </span>
        </div>
      </div>

      {/* Equipment Table (Desktop) / Cards (Mobile) */}
      {equipments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <div className="w-10 h-10 rounded bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2.5">
            <Cpu size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Pangkalan Data Peralatan Kosong</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Data dummy telah dibuangkan. Sedia untuk mendaftar peralatan dan instrumen sebenar makmal UKJK.
          </p>
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs"
            >
              <Plus size={14} />
              <span>+ Daftar Peralatan Baharu</span>
            </button>
          )}
        </div>
      ) : filteredSummaries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <div className="w-10 h-10 rounded bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
            <Cpu size={20} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800">Tiada Peralatan Ditemui</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
            Tiada rekod peralatan yang sepadan dengan carian atau penapis tahun/status.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setYearFilter('ALL');
              setStatusFilter('ALL');
              setOperationalFilter('ALL');
            }}
            className="mt-2 text-xs text-teal-700 font-semibold hover:underline"
          >
            Lihat Semua Peralatan
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Kod Aset & Nama Peralatan</th>
                  <th className="py-2.5 px-3.5">Model & Jenama</th>
                  <th className="py-2.5 px-3.5">Tahun</th>
                  <th className="py-2.5 px-3.5">Lokasi</th>
                  <th className="py-2.5 px-3.5">Jadual Calibration</th>
                  <th className="py-2.5 px-3.5">Jadual Verification</th>
                  <th className="py-2.5 px-3.5 text-center">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSummaries.map((summary) => {
                  const eq = summary.equipment;
                  const isRed = summary.overallStatus === 'RED';
                  const isYellow = summary.overallStatus === 'YELLOW';

                  return (
                    <tr
                      key={eq.id}
                      className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                        isRed ? 'bg-rose-50/15' : isYellow ? 'bg-amber-50/15' : ''
                      }`}
                      onClick={() => onOpenDetailModal(eq.id)}
                    >
                      <td className="py-2.5 px-3.5">
                        <div className="font-mono font-bold text-slate-900 group-hover:text-teal-700">
                          {eq.assetCode}
                        </div>
                        <div className="text-xs text-slate-700 font-medium">
                          {eq.name}
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5 text-slate-600">
                        <div>{eq.brandModel}</div>
                        {eq.serialNumber && (
                          <div className="text-[10px] font-mono text-slate-400">SN: {eq.serialNumber}</div>
                        )}
                      </td>

                      <td className="py-2.5 px-3.5">
                        <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {eq.acquisitionYear}
                        </span>
                      </td>

                      <td className="py-2.5 px-3.5 text-slate-600">
                        {eq.location}
                      </td>

                      <td className="py-2.5 px-3.5">
                        {eq.requiresCalibration && summary.calibrationStatus ? (
                          <div>
                            <div className="font-mono font-semibold text-slate-800">
                              {eq.nextCalibrationDate || '-'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {summary.calibrationStatus.label}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">&ndash;</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3.5">
                        {eq.requiresVerification && summary.verificationStatus ? (
                          <div>
                            <div className="font-mono font-semibold text-slate-800">
                              {eq.nextVerificationDate || '-'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {summary.verificationStatus.label}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">&ndash;</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3.5 text-center">
                        <TrafficLightBadge status={summary.overallStatus} size="sm" />
                      </td>

                      <td
                        className="py-2.5 px-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenReminder('EQUIPMENT', summary)}
                            title="Kongsi Peringatan"
                            className="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Share2 size={14} />
                          </button>

                          <button
                            onClick={() => onOpenDetailModal(eq.id)}
                            title="Buka Rekod Penuh"
                            className="p-1 text-slate-600 hover:text-teal-800 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Eye size={14} />
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => onOpenEditModal(eq)}
                                title="Edit Maklumat Induk"
                                className="p-1 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setItemToDelete({ id: eq.id, name: `${eq.assetCode} - ${eq.name}` })}
                                title="Padam Peralatan"
                                className="p-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredSummaries.map((summary) => {
              const eq = summary.equipment;
              return (
                <div
                  key={eq.id}
                  onClick={() => onOpenDetailModal(eq.id)}
                  className="p-3.5 space-y-2 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {eq.assetCode}
                      </div>
                      <div className="font-semibold text-xs text-slate-800">
                        {eq.name}
                      </div>
                    </div>
                    <TrafficLightBadge status={summary.overallStatus} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Tahun {eq.acquisitionYear}
                    </span>
                    <span>&bull;</span>
                    <span>{eq.brandModel}</span>
                    <span>&bull;</span>
                    <span>{eq.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Calibration
                      </span>
                      <span className="font-mono font-semibold text-slate-800 text-xs">
                        {eq.nextCalibrationDate || 'Tiada'}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Verification
                      </span>
                      <span className="font-mono font-semibold text-slate-800 text-xs">
                        {eq.nextVerificationDate || 'Tiada'}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Actions Bar */}
                  <div
                    className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onOpenReminder('EQUIPMENT', summary)}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-teal-700 font-medium"
                    >
                      <Share2 size={12} />
                      <span>Kongsi Peringatan</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onOpenEditModal(eq)}
                            className="p-1 text-slate-500 hover:text-amber-600"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setItemToDelete({ id: eq.id, name: `${eq.assetCode} - ${eq.name}` })}
                            className="p-1 text-slate-500 hover:text-rose-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onOpenDetailModal(eq.id)}
                        className="inline-flex items-center gap-0.5 text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
                      >
                        <span>Butiran</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (BR-006) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-white rounded-lg p-5 shadow-xl border border-slate-200 space-y-3">
            <div className="w-9 h-9 rounded bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Sahkan Pemadaman Peralatan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Adakah anda pasti mahu memadam <strong className="text-slate-800 font-mono">{itemToDelete.name}</strong>?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
