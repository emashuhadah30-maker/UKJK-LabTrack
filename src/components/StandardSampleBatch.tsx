import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  ShieldAlert,
  Info,
  Search,
  Building2,
  FileCheck2,
  Clock,
  Filter,
  Check,
  Boxes,
} from 'lucide-react';
import {
  Chemical,
  StandardSampleBatch as BatchType,
  User,
} from '../types';

interface StandardSampleBatchProps {
  chemicals: Chemical[];
  batches: BatchType[];
  currentUser: User | null;
  onOpenConsumableModal?: () => void;
  onSaveBatch: (params: {
    sampleName: string;
    batchCode: string;
    preparedDate: string;
    notes?: string;
    items: Array<{
      chemicalId: string;
      quantity: number;
    }>;
    user: User;
  }) => void;
}

interface FormChemicalRow {
  chemicalId: string;
  quantity: number | '';
}

export const StandardSampleBatch: React.FC<StandardSampleBatchProps> = ({
  chemicals,
  batches,
  currentUser,
  onOpenConsumableModal,
  onSaveBatch,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'REGISTER' | 'FORMULATION'>('REGISTER');

  // Register Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [quarterFilter, setQuarterFilter] = useState<string>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');
  const [itemTypeFilter, setItemTypeFilter] = useState<string>('ALL');
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  // Modal / Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sampleName, setSampleName] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [preparedDate, setPreparedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [rows, setRows] = useState<FormChemicalRow[]>([
    { chemicalId: chemicals[0]?.id || '', quantity: '' },
  ]);

  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Unique companies
  const availableCompanies = useMemo(() => {
    const comps = Array.from(new Set(batches.map((b) => b.unitOrCompany).filter(Boolean))) as string[];
    return comps.sort();
  }, [batches]);

  // Unique item names
  const availableItemNames = useMemo(() => {
    const items = Array.from(new Set(batches.map((b) => b.sampleName).filter(Boolean))) as string[];
    return items.sort();
  }, [batches]);

  // Total quantity pcs
  const totalPcs = useMemo(() => {
    return batches.reduce((sum, b) => sum + (b.quantityPcs || 0), 0);
  }, [batches]);

  // Filtered batches for Register
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      // Text search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const mCert = b.certificateNumber?.toLowerCase().includes(q) || false;
        const mRef = b.referenceNumber?.toLowerCase().includes(q) || false;
        const mName = b.sampleName.toLowerCase().includes(q);
        const mComp = b.unitOrCompany?.toLowerCase().includes(q) || false;
        const mCode = b.batchCode.toLowerCase().includes(q);
        if (!mCert && !mRef && !mName && !mComp && !mCode) return false;
      }

      // Quarter filter
      if (quarterFilter !== 'ALL') {
        if (b.quarter !== quarterFilter) return false;
      }

      // Company filter
      if (companyFilter !== 'ALL') {
        if (b.unitOrCompany !== companyFilter) return false;
      }

      // Item type filter
      if (itemTypeFilter !== 'ALL') {
        if (b.sampleName !== itemTypeFilter) return false;
      }

      return true;
    });
  }, [batches, searchTerm, quarterFilter, companyFilter, itemTypeFilter]);

  const openNewBatchForm = () => {
    if (chemicals.length === 0) {
      setFormError('Sila daftarkan sekurang-kurangnya satu bahan kimia dalam inventori terlebih dahulu.');
      return;
    }
    setShowCreateModal(true);
    setFormError(null);
    setSampleName('');
    const todayStr = new Date().toISOString().split('T')[0];
    setPreparedDate(todayStr);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setBatchCode(`SS-LGM-${todayStr.replace(/-/g, '')}-${randomSuffix}`);
    setNotes('');
    setRows([{ chemicalId: chemicals[0]?.id || '', quantity: '' }]);
  };

  const addRow = () => {
    const usedIds = new Set(rows.map((r) => r.chemicalId));
    const available = chemicals.find((c) => !usedIds.has(c.id));
    setRows([
      ...rows,
      { chemicalId: available ? available.id : chemicals[0]?.id || '', quantity: '' },
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, idx) => idx !== index));
  };

  const updateRow = (index: number, field: keyof FormChemicalRow, value: any) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
    setFormError(null);
  };

  const getRowValidation = (row: FormChemicalRow, index: number) => {
    const chem = chemicals.find((c) => c.id === row.chemicalId);
    if (!chem) return { isOver: false, isDuplicate: false, message: '' };

    const isDuplicate = rows.some((r, i) => i !== index && r.chemicalId === row.chemicalId);
    const qty = typeof row.quantity === 'number' ? row.quantity : 0;
    const isOver = qty > chem.currentStock;

    let message = '';
    if (isDuplicate) {
      message = 'Bahan kimia dipilih berulang kali dalam borang ini.';
    } else if (isOver) {
      message = `Kuantiti melebihi baki stok semasa (${chem.currentStock} ${chem.unit})`;
    }

    return { isOver, isDuplicate, message, chem };
  };

  const hasValidationErrors = rows.some((row, idx) => {
    const val = getRowValidation(row, idx);
    return val.isOver || val.isDuplicate || !row.quantity || Number(row.quantity) <= 0;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!sampleName.trim()) {
      setFormError('Nama / Kod Standard Sample diperlukan.');
      return;
    }
    if (!batchCode.trim()) {
      setFormError('No. Batch / Rujukan Sampel diperlukan.');
      return;
    }
    if (rows.length === 0) {
      setFormError('Sila masukkan sekurang-kurangnya 1 bahan kimia.');
      return;
    }

    const ids = rows.map((r) => r.chemicalId);
    if (new Set(ids).size !== ids.length) {
      setFormError('Terdapat bahan kimia yang sama dipilih lebih daripada sekali.');
      return;
    }

    for (const [idx, row] of rows.entries()) {
      const chem = chemicals.find((c) => c.id === row.chemicalId);
      if (!chem) {
        setFormError(`Bahan kimia pada baris #${idx + 1} tidak sah.`);
        return;
      }
      const qty = Number(row.quantity);
      if (isNaN(qty) || qty <= 0) {
        setFormError(`Sila masukkan kuantiti yang sah (> 0) untuk "${chem.name}".`);
        return;
      }
      if (qty > chem.currentStock) {
        setFormError(
          `Bahan "${chem.name}" tidak mencukupi (Dipohon: ${qty} ${chem.unit}, Baki semasa: ${chem.currentStock} ${chem.unit}). Transaksi dibatalkan sepenuhnya.`
        );
        return;
      }
    }

    try {
      onSaveBatch({
        sampleName: sampleName.trim(),
        batchCode: batchCode.trim(),
        preparedDate,
        notes: notes.trim() || undefined,
        items: rows.map((r) => ({
          chemicalId: r.chemicalId,
          quantity: Number(r.quantity),
        })),
        user: currentUser || {
          id: 'usr-guest',
          name: 'Staf Makmal',
          email: '',
          role: 'STAFF',
          isActive: true,
          createdAt: '',
        },
      });

      setShowCreateModal(false);
      setSuccessToast(`Standard Sample "${sampleName}" berjaya direkodkan! Stok bahan kimia ditolak secara automatik.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Ralat penolakan stok berkelompok.');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Buku Rekod Standard Sample & Kawalan Mutu SMR
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-200 text-slate-800">
              {batches.length} REKOD
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendaftaran rasmi pengeluaran sampel piawai (SS PRI, SS VR, CS Ash, CS VM, CS Dirt, SS Nitrogen) dan penjejakan status agihan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenConsumableModal && (
            <button
              onClick={onOpenConsumableModal}
              title="Kemas kini penggunaan barang guna habis bagi sampel piawai"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Boxes size={15} />
              <span>Update Penggunaan Consumable</span>
            </button>
          )}

          <button
            onClick={openNewBatchForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>+ Formulasi Batch Baharu</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Jumlah Agihan Rasmi</span>
          <span className="text-lg font-bold text-slate-900 font-mono">{batches.length}</span>
          <span className="text-[10px] text-teal-700 block mt-0.5">Suku 1, 2 & 3 (2026)</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Jumlah Kuantiti Sampel</span>
          <span className="text-lg font-bold text-slate-900 font-mono">{totalPcs.toLocaleString()} pcs</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Kepingan getah standard</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Syarikat / Agensi Terlibat</span>
          <span className="text-lg font-bold text-slate-900 font-mono">{availableCompanies.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">SIS, SCL, Hock Hin, LI, dll.</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Status Agihan</span>
          <span className="text-lg font-bold text-emerald-700 font-mono">100% SELESAI</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Semua sijil disahkan</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md text-xs">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('REGISTER')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeSubTab === 'REGISTER'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 size={15} />
          <span>Buku Rekod Pengeluaran & Agihan ({filteredBatches.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('FORMULATION')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeSubTab === 'FORMULATION'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={15} />
          <span>Formulasi Kimia Kelompok (Zero Negative Stock)</span>
        </button>
      </div>

      {activeSubTab === 'REGISTER' && (
        <div className="space-y-3">
          {/* Filter Toolbar */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari No. Sijil (SS2026/...), No. Rujukan, Syarikat / Unit, atau Item Sampel..."
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

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Suku Tahun */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1">
                  <Calendar size={13} className="text-slate-400" />
                  <label className="text-slate-600 font-medium">Suku:</label>
                  <select
                    value={quarterFilter}
                    onChange={(e) => setQuarterFilter(e.target.value)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    <option value="ALL">Semua Suku</option>
                    <option value="1st">Suku 1 (1st Quarter)</option>
                    <option value="2nd">Suku 2 (2nd Quarter)</option>
                    <option value="3rd">Suku 3 (3rd Quarter)</option>
                  </select>
                </div>

                {/* Syarikat / Unit */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1">
                  <Building2 size={13} className="text-slate-400" />
                  <label className="text-slate-600 font-medium">Syarikat/Unit:</label>
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer max-w-[150px] truncate"
                  >
                    <option value="ALL">Semua Syarikat/Unit</option>
                    {availableCompanies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jenis Item */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1">
                  <label className="text-slate-600 font-medium">Item:</label>
                  <select
                    value={itemTypeFilter}
                    onChange={(e) => setItemTypeFilter(e.target.value)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer max-w-[120px] truncate"
                  >
                    <option value="ALL">Semua Item</option>
                    {availableItemNames.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {(searchTerm || quarterFilter !== 'ALL' || companyFilter !== 'ALL' || itemTypeFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setQuarterFilter('ALL');
                      setCompanyFilter('ALL');
                      setItemTypeFilter('ALL');
                    }}
                    className="text-xs text-teal-700 hover:underline px-1 font-semibold"
                  >
                    Set Semula
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table of Batches */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Suku</th>
                    <th className="py-2.5 px-3">Unit / Syarikat</th>
                    <th className="py-2.5 px-3">Item Standard Sample</th>
                    <th className="py-2.5 px-3">No. Sijil</th>
                    <th className="py-2.5 px-3 text-right">Kuantiti</th>
                    <th className="py-2.5 px-3">Tarikh Mohon</th>
                    <th className="py-2.5 px-3">Tarikh Hantar</th>
                    <th className="py-2.5 px-3">No. Rujukan</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBatches.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        Tiada rekod standard sample yang sepadan dengan carian.
                      </td>
                    </tr>
                  ) : (
                    filteredBatches.map((batch) => {
                      const isExpanded = expandedBatchId === batch.id;
                      return (
                        <React.Fragment key={batch.id}>
                          <tr className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2 px-3 font-semibold text-slate-600">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                                {batch.quarter || '1st'}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-medium text-slate-900">
                              {batch.unitOrCompany || 'Makmal UKJK'}
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-800">
                              {batch.sampleName}
                            </td>
                            <td className="py-2 px-3 font-mono text-teal-800 font-semibold">
                              {batch.certificateNumber || batch.batchCode}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                              {batch.quantityPcs ? `${batch.quantityPcs} pcs` : '-'}
                            </td>
                            <td className="py-2 px-3 text-slate-600">
                              {batch.requestDate || '-'}
                            </td>
                            <td className="py-2 px-3 text-slate-600">
                              {batch.deliveryDate || batch.preparedDate}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">
                              {batch.referenceNumber || '-'}
                            </td>
                            <td className="py-2 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check size={10} />
                                {batch.registryStatus || 'DONE'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                                className="p-1 rounded text-slate-500 hover:text-teal-700 hover:bg-teal-50 text-[11px] font-medium"
                              >
                                {isExpanded ? 'Tutup' : 'Perincian'}
                              </button>
                            </td>
                          </tr>

                          {/* Expandable Details Row */}
                          {isExpanded && (
                            <tr className="bg-slate-50 border-t border-slate-200">
                              <td colSpan={10} className="p-3 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded border border-slate-200">
                                  <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                      Tempoh Pengeluaran (Production Date)
                                    </span>
                                    <span className="font-medium text-slate-800">
                                      {batch.productionPeriod || 'N/A'}
                                    </span>
                                    {batch.timeToComplete && (
                                      <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
                                        Masa Siap: {batch.timeToComplete}
                                      </span>
                                    )}
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                      Tarikh PO & Masa Dari PO
                                    </span>
                                    <span className="font-medium text-slate-800">
                                      {batch.poPeriod || 'N/A'}
                                    </span>
                                    {batch.timeFromPo && (
                                      <span className="text-[11px] text-slate-600 block mt-0.5">
                                        Tempoh dari PO: {batch.timeFromPo}
                                      </span>
                                    )}
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                      Catatan / Pegawai
                                    </span>
                                    <span className="text-slate-700 text-[11px] block">
                                      {batch.notes || 'Pengeluaran standard sample berkala UKJK.'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                                      Disahkan oleh: {batch.preparedByName}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'FORMULATION' && (
        <div className="space-y-3">
          {/* Strict ISO Policy Card */}
          <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-700 flex items-start gap-2.5">
            <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900">Peraturan Integriti Transaksi Atomik (Zero Negative Stock):</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Semua bahan kimia yang digunakan dalam satu formulasi kumpulan mesti mempunyai baki stok yang mencukupi. Jika mana-mana satu bahan tidak cukup, transaksi disekat secara automatik bagi menjamin ketepatan rekod ISO/IEC 17025.
              </p>
            </div>
          </div>

          {/* Batches with Chemical Formulations */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                Senarai Formulasi Kumpulan Bahan Kimia
              </span>
              <button
                onClick={openNewBatchForm}
                className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold"
              >
                + Cipta Formulasi Baharu
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {batches.filter((b) => b.items && b.items.length > 0).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Tiada rekod formulasi campuran kimia kelompok. Klik butang "+ Formulasi Batch Baharu" untuk mencipta formulasi pertama.
                </div>
              ) : (
                batches
                  .filter((b) => b.items && b.items.length > 0)
                  .map((batch) => (
                    <div key={batch.id} className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {batch.sampleName}
                          </span>
                          <span className="ml-2 font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {batch.batchCode}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {batch.preparedDate}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          Bahan Kimia Ditolak:
                        </span>
                        <div className="divide-y divide-slate-200 text-xs">
                          {batch.items.map((item, idx) => (
                            <div key={idx} className="py-1 flex items-center justify-between">
                              <span className="text-slate-800">{item.chemicalName}</span>
                              <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 rounded text-[11px]">
                                - {item.quantity} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal / Batch Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Borang Kelompok Standard Sample (Batch Formulation)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Penyediaan batch sampel & penolakan automatik stok bahan kimia
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="flex items-center gap-2 p-2.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Sample Batch Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama / Kod Standard Sample <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sampleName}
                    onChange={(e) => setSampleName(e.target.value)}
                    placeholder="cth. SS PRI Batch Pengujian Getah, SS VR Mooney Relaxation"
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. Batch / Rujukan Sampel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tarikh Penyediaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={preparedDate}
                    onChange={(e) => setPreparedDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Formulasi / Rujukan SOP
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="cth. Kaedah ujian mengikut ISO 2930 / SMR Bulletin"
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>
              </div>

              {/* Chemical Ingredients List */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 block">
                    Komponen Bahan Kimia yang Digunakan <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addRow}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded border border-teal-200 transition-colors"
                  >
                    <Plus size={13} />
                    <span>+ Tambah Bahan</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {rows.map((row, index) => {
                    const validation = getRowValidation(row, index);
                    const chem = validation.chem;

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-md border space-y-2 ${
                          validation.isOver || validation.isDuplicate
                            ? 'bg-rose-50/50 border-rose-300'
                            : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                              Pilih Bahan Kimia #{index + 1}
                            </label>
                            <select
                              value={row.chemicalId}
                              onChange={(e) => updateRow(index, 'chemicalId', e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-600"
                            >
                              {chemicals.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} (Baki: {c.currentStock} {c.unit} @ {c.location})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="w-full sm:w-36">
                            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                              Kuantiti Ditolak
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                min="0.01"
                                required
                                value={row.quantity}
                                onChange={(e) =>
                                  updateRow(
                                    index,
                                    'quantity',
                                    e.target.value === '' ? '' : parseFloat(e.target.value)
                                  )
                                }
                                placeholder="0.0"
                                className="w-full px-2 py-1 text-xs font-mono rounded border border-slate-300 pr-10 bg-white"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                                {chem?.unit || ''}
                              </span>
                            </div>
                          </div>

                          {rows.length > 1 && (
                            <div className="sm:pt-4 self-end sm:self-auto">
                              <button
                                type="button"
                                onClick={() => removeRow(index)}
                                title="Buang baris"
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Row status feedback */}
                        <div className="flex flex-wrap items-center justify-between text-[11px] pt-0.5">
                          <span className="text-slate-500">
                            Baki Stok Semasa:{' '}
                            <strong className="font-mono text-slate-800">
                              {chem ? `${chem.currentStock} ${chem.unit}` : '-'}
                            </strong>
                            {chem && row.quantity && !validation.isOver && Number(row.quantity) > 0 && (
                              <span className="text-teal-800 font-mono ml-2">
                                &rarr; Baki baru: {(chem.currentStock - Number(row.quantity)).toFixed(2)} {chem.unit}
                              </span>
                            )}
                          </span>

                          {validation.message && (
                            <span className="font-semibold text-rose-700 flex items-center gap-1">
                              <AlertCircle size={12} />
                              <span>{validation.message}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                <UserIcon size={12} className="text-slate-400" />
                <span>Staf penyedia: <strong>{currentUser?.name || 'Staf Makmal'}</strong></span>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={hasValidationErrors}
                  className={`px-4 py-1.5 font-semibold rounded shadow-xs transition-colors ${
                    hasValidationErrors
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-teal-700 hover:bg-teal-800 text-white'
                  }`}
                >
                  Simpan Rekod & Tolak Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
