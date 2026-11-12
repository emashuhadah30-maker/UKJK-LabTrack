import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  FlaskConical,
  Share2,
  AlertTriangle,
  Edit2,
  Trash2,
  Eye,
  PackageCheck,
  Boxes,
} from 'lucide-react';
import {
  Chemical,
  ChemicalStatusSummary,
  StatusColor,
  User,
} from '../types';
import { TrafficLightBadge } from './TrafficLightBadge';

interface ChemicalListProps {
  chemicals: Chemical[];
  summaries: ChemicalStatusSummary[];
  currentUser: User | null;
  onOpenAddModal: () => void;
  onOpenEditModal: (chemical: Chemical) => void;
  onDeleteChemical: (id: string, name: string) => void;
  onOpenStockIn: (chemicalId?: string) => void;
  onOpenDetailModal: (chemicalId: string) => void;
  onOpenReminder: (type: 'CHEMICAL', item: ChemicalStatusSummary) => void;
  onOpenConsumableModal?: () => void;
  initialFilter?: { status?: StatusColor };
}

export const ChemicalList: React.FC<ChemicalListProps> = ({
  chemicals,
  summaries,
  currentUser,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteChemical,
  onOpenStockIn,
  onOpenDetailModal,
  onOpenReminder,
  onOpenConsumableModal,
  initialFilter,
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter?.status || 'ALL');

  // Delete Confirmation State (BR-006)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  // Filtered Chemicals
  const filteredSummaries = useMemo(() => {
    return summaries.filter((summary) => {
      const chem = summary.chemical;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = chem.name.toLowerCase().includes(query);
        const matchCas = chem.casOrCode.toLowerCase().includes(query);
        const matchFormula = chem.formulaOrGrade.toLowerCase().includes(query);
        const matchLocation = chem.location.toLowerCase().includes(query);
        if (!matchName && !matchCas && !matchFormula && !matchLocation) {
          return false;
        }
      }

      if (statusFilter !== 'ALL') {
        if (summary.status !== statusFilter) return false;
      }

      return true;
    });
  }, [summaries, searchTerm, statusFilter]);

  const confirmDelete = () => {
    if (itemToDelete) {
      onDeleteChemical(itemToDelete.id, itemToDelete.name);
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
              Inventori Bahan Kimia & Reagen Makmal
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-200 text-slate-800">
              {chemicals.length} REAGEN
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengurusan baki stok masa nyata, had minimum pesanan semula (reorder level), dan penerimaan lot baharu.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenConsumableModal && (
            <button
              onClick={onOpenConsumableModal}
              title="Kemas kini penggunaan barang guna habis makmal"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Boxes size={15} />
              <span>Update Penggunaan Consumable</span>
            </button>
          )}

          <button
            onClick={() => onOpenStockIn()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <PackageCheck size={15} />
            <span>+ Stok Masuk (Stock-In)</span>
          </button>

          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus size={15} />
              <span>+ Bahan Baharu</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama bahan kimia, CAS (7697-37-2), formula atau lokasi simpanan..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
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

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs">
            <label className="text-slate-600 font-medium">Status Stok:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="RED">🔴 Bawah Had / Luput (Merah)</option>
              <option value="YELLOW">🟡 Menghampiri Min / Luput (Kuning)</option>
              <option value="GREEN">🟢 Stok Selamat (Hijau)</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              className="text-xs text-teal-700 hover:underline px-1 font-semibold"
            >
              Set Semula
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between items-center">
          <span>
            Memaparkan <strong>{filteredSummaries.length}</strong> daripada {chemicals.length} bahan kimia
          </span>
        </div>
      </div>

      {/* Table (Desktop) / Cards (Mobile) */}
      {chemicals.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <div className="w-10 h-10 rounded bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2.5">
            <FlaskConical size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Pangkalan Data Bahan Kimia Kosong</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Data dummy telah dibuangkan. Sedia untuk mendaftar inventori bahan kimia dan reagen makmal UKJK.
          </p>
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs"
            >
              <Plus size={14} />
              <span>+ Daftar Bahan Kimia Baharu</span>
            </button>
          )}
        </div>
      ) : filteredSummaries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <div className="w-10 h-10 rounded bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
            <FlaskConical size={20} />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800">Tiada Bahan Kimia Ditemui</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
            Tiada rekod reagen yang sepadan dengan kriteria carian atau penapis.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
            className="mt-2 text-xs text-teal-700 font-semibold hover:underline"
          >
            Lihat Semua Bahan Kimia
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Nama Bahan & Formula/Gred</th>
                  <th className="py-2.5 px-3.5">No. CAS / Kod</th>
                  <th className="py-2.5 px-3.5">Lokasi Simpanan</th>
                  <th className="py-2.5 px-3.5 font-mono text-right">Baki Semasa</th>
                  <th className="py-2.5 px-3.5 font-mono text-right">Had Min</th>
                  <th className="py-2.5 px-3.5">Tarikh Luput</th>
                  <th className="py-2.5 px-3.5 text-center">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSummaries.map((summary) => {
                  const chem = summary.chemical;
                  const isRed = summary.status === 'RED';
                  const isYellow = summary.status === 'YELLOW';

                  return (
                    <tr
                      key={chem.id}
                      className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                        isRed ? 'bg-rose-50/15' : isYellow ? 'bg-amber-50/15' : ''
                      }`}
                      onClick={() => onOpenDetailModal(chem.id)}
                    >
                      <td className="py-2.5 px-3.5">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700">
                          {chem.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {chem.formulaOrGrade}
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5 font-mono text-slate-600">
                        {chem.casOrCode}
                      </td>

                      <td className="py-2.5 px-3.5 text-slate-600">
                        {chem.location}
                      </td>

                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            isRed
                              ? 'bg-rose-100 text-rose-800'
                              : isYellow
                              ? 'bg-amber-100 text-amber-800'
                              : 'text-slate-900'
                          }`}
                        >
                          {chem.currentStock} {chem.unit}
                        </span>
                      </td>

                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-500 tabular-nums">
                        {chem.minStockThreshold} {chem.unit}
                      </td>

                      <td className="py-2.5 px-3.5">
                        <div className="font-mono text-slate-800">{chem.expiryDate}</div>
                        <div className="text-[10px] text-slate-400">
                          {summary.daysToExpiry < 0 ? 'Telah tamat' : `${summary.daysToExpiry}h baki`}
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5 text-center">
                        <TrafficLightBadge status={summary.status} size="sm" />
                      </td>

                      <td
                        className="py-2.5 px-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenStockIn(chem.id)}
                            title="Tambah Stok (Stock-In)"
                            className="p-1 text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded"
                          >
                            <PackageCheck size={15} />
                          </button>

                          <button
                            onClick={() => onOpenReminder('CHEMICAL', summary)}
                            title="Kongsi Peringatan Stok"
                            className="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded"
                          >
                            <Share2 size={14} />
                          </button>

                          <button
                            onClick={() => onOpenDetailModal(chem.id)}
                            title="Lihat Butiran & Transaksi"
                            className="p-1 text-slate-600 hover:text-teal-800 hover:bg-slate-100 rounded"
                          >
                            <Eye size={14} />
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => onOpenEditModal(chem)}
                                title="Edit Maklumat Induk"
                                className="p-1 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setItemToDelete({ id: chem.id, name: `${chem.name} (${chem.casOrCode})` })}
                                title="Padam Bahan Kimia"
                                className="p-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded"
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
              const chem = summary.chemical;
              const isRed = summary.status === 'RED';
              const isYellow = summary.status === 'YELLOW';

              return (
                <div
                  key={chem.id}
                  onClick={() => onOpenDetailModal(chem.id)}
                  className={`p-3.5 space-y-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                    isRed ? 'bg-rose-50/15' : isYellow ? 'bg-amber-50/15' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {chem.name}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        CAS: {chem.casOrCode} &bull; {chem.formulaOrGrade}
                      </div>
                    </div>
                    <TrafficLightBadge status={summary.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Baki Semasa
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {chem.currentStock} {chem.unit}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Min: {chem.minStockThreshold} {chem.unit}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Tarikh Luput
                      </span>
                      <span className="font-mono font-medium text-slate-800 text-xs block">
                        {chem.expiryDate}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {summary.daysToExpiry < 0 ? 'Tamat Tempoh' : `${summary.daysToExpiry}h baki`}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Lokasi: {chem.location}
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onOpenStockIn(chem.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded shadow-2xs"
                    >
                      <PackageCheck size={13} />
                      <span>Stock-In</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenReminder('CHEMICAL', summary)}
                        className="p-1 text-slate-500 hover:text-teal-700"
                      >
                        <Share2 size={14} />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onOpenEditModal(chem)}
                            className="p-1 text-slate-500 hover:text-amber-600"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setItemToDelete({ id: chem.id, name: `${chem.name} (${chem.casOrCode})` })}
                            className="p-1 text-slate-500 hover:text-rose-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onOpenDetailModal(chem.id)}
                        className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
                      >
                        Butiran
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
                Sahkan Pemadaman Bahan Kimia
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
