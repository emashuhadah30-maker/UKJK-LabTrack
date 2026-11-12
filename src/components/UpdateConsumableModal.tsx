import React, { useState } from 'react';
import {
  X,
  PackageMinus,
  Check,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  Flame,
  Package,
  Tag,
  Box,
  Scale,
  FileText,
} from 'lucide-react';
import { User, ConsumableItem, ConsumableUsageInput } from '../types';

interface UpdateConsumableModalProps {
  isOpen: boolean;
  onClose: () => void;
  consumables: ConsumableItem[];
  currentUser: User | null;
  onSubmitUsage: (input: ConsumableUsageInput) => void;
  onQuickUpdate?: (consumableId: string, quantityUsed: number, note: string) => void;
  preSelectedConsumableId?: string;
}

const COMMON_COMPANIES = [
  'RM Lab',
  'SMR Instrument Service (SIS)',
  'SMR Control Lab (SCL)',
  'Lab Inspectorate (LI)',
  'Hock Hin',
  'Eco Instrument',
  'An Bo Trading Pte Ltd',
  'LRG Rubber Kuala Krai',
  'Tuaran Crumb',
];

const COMMON_SAMPLE_ITEMS = [
  'SS PRI',
  'SS VR',
  'SS VR Batch 1',
  'SS VR Batch 2',
  'SS VR B',
  'SS VR C',
  'SS VR D',
  'SS P0 B',
  'SS P0 C',
  'SS TWO ROLL MILL',
  'CS Ash',
  'CS VM',
  'CS Dirt',
  'SS Nitrogen',
];

export const UpdateConsumableModal: React.FC<UpdateConsumableModalProps> = ({
  isOpen,
  onClose,
  consumables,
  currentUser,
  onSubmitUsage,
  onQuickUpdate,
  preSelectedConsumableId,
}) => {
  const [mode, setMode] = useState<'BATCH' | 'SINGLE'>(
    preSelectedConsumableId ? 'SINGLE' : 'BATCH'
  );

  // Batch Form State
  const [productionDate, setProductionDate] = useState('2026-11-12');
  const [quarter, setQuarter] = useState<'Q1' | '2nd' | '3rd' | '4th'>('3rd');
  const [unitOrCompany, setUnitOrCompany] = useState('RM Lab');
  const [customCompany, setCustomCompany] = useState('');
  const [itemProduced, setItemProduced] = useState('SS PRI');
  const [customItem, setCustomItem] = useState('');
  const [quantityProduced, setQuantityProduced] = useState<number>(100);

  // Consumable quantities
  const [gasTank, setGasTank] = useState<number>(0);
  const [aluBagPcs, setAluBagPcs] = useState<number>(100);
  const [stickerSet, setStickerSet] = useState<number>(1);
  const [brownBox, setBrownBox] = useState<number>(0);
  const [rubberTsrKg, setRubberTsrKg] = useState<number>(5.0);
  const [a4CoverPcs, setA4CoverPcs] = useState<number>(1);
  const [referenceNote, setReferenceNote] = useState('');

  // Single Item Adjustment State
  const [selectedConsumableId, setSelectedConsumableId] = useState<string>(
    preSelectedConsumableId || (consumables[0]?.id ?? 'csm-alubag')
  );
  const [singleQuantity, setSingleQuantity] = useState<number>(1);
  const [singleNote, setSingleNote] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetCompany = unitOrCompany === 'OTHER' ? customCompany.trim() : unitOrCompany;
    const targetItem = itemProduced === 'OTHER' ? customItem.trim() : itemProduced;

    if (!targetCompany) {
      setErrorMsg('Sila nyatakan Unit atau Syarikat penerima/pemohon.');
      return;
    }
    if (!targetItem) {
      setErrorMsg('Sila nyatakan jenis sampel piawai yang dihasilkan.');
      return;
    }

    const payload: ConsumableUsageInput = {
      productionDate,
      quarter,
      unitOrCompany: targetCompany,
      itemProduced: targetItem,
      quantityProduced: Number(quantityProduced) || 0,
      gasTank: Number(gasTank) || 0,
      aluBagPcs: Number(aluBagPcs) || 0,
      stickerSet: Number(stickerSet) || 0,
      brownBox: Number(brownBox) || 0,
      rubberTsrKg: Number(rubberTsrKg) || 0,
      a4CoverPcs: Number(a4CoverPcs) || 0,
      referenceNote: referenceNote.trim() || undefined,
    };

    onSubmitUsage(payload);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (singleQuantity <= 0) {
      setErrorMsg('Kuantiti penggunaan mestilah lebih daripada 0.');
      return;
    }

    if (onQuickUpdate) {
      onQuickUpdate(selectedConsumableId, singleQuantity, singleNote);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 900);
    }
  };

  const selectedConsumable = consumables.find((c) => c.id === selectedConsumableId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
              <PackageMinus size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Kemas Kini Penggunaan Stok Consumable
                <span className="px-2 py-0.2 rounded text-[10px] bg-teal-400/20 text-teal-200 border border-teal-400/30 uppercase font-mono">
                  Guna Habis 2026
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Tolak baki stok masa nyata dan rekod penggunaan bahan pembungkusan/gas makmal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('BATCH')}
              className={`px-3 py-1 rounded-md transition-all ${
                mode === 'BATCH'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rekod Kelompok (Batch Run)
            </button>
            <button
              type="button"
              onClick={() => setMode('SINGLE')}
              className={`px-3 py-1 rounded-md transition-all ${
                mode === 'SINGLE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pelarasan Item Tunggal
            </button>
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Pegawai: <span className="font-semibold text-slate-700">{currentUser?.name}</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-2 text-xs text-teal-800 font-medium">
              <Check size={16} className="text-teal-600 shrink-0" />
              <span>Penggunaan stok consumable telah berjaya dikemas kini dan ditolak serta-merta!</span>
            </div>
          )}

          {mode === 'BATCH' ? (
            <form id="consumable-batch-form" onSubmit={handleSubmitBatch} className="space-y-4">
              {/* Row 1: Tarikh, Suku, Kuantiti Dihasilkan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    Tarikh Penggunaan
                  </label>
                  <input
                    type="date"
                    required
                    value={productionDate}
                    onChange={(e) => setProductionDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Suku Tahun (Quarter)
                  </label>
                  <select
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  >
                    <option value="Q1">Suku Pertama (Q1)</option>
                    <option value="2nd">Suku Ke-2 (2nd)</option>
                    <option value="3rd">Suku Ke-3 (3rd)</option>
                    <option value="4th">Suku Ke-4 (4th)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Sampel (Pcs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantityProduced}
                    onChange={(e) => setQuantityProduced(Number(e.target.value))}
                    placeholder="Contoh: 100"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 focus:border-teal-600 font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Unit/Syarikat & Jenis Item */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Building2 size={13} className="text-slate-400" />
                    Unit / Syarikat Pemohon
                  </label>
                  <select
                    value={unitOrCompany}
                    onChange={(e) => setUnitOrCompany(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  >
                    {COMMON_COMPANIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="OTHER">+ Lain-lain (Nyatakan)...</option>
                  </select>
                  {unitOrCompany === 'OTHER' && (
                    <input
                      type="text"
                      placeholder="Masukkan nama unit / kilang getah..."
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      className="mt-1.5 w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Layers size={13} className="text-slate-400" />
                    Item Sampel Piawai
                  </label>
                  <select
                    value={itemProduced}
                    onChange={(e) => setItemProduced(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  >
                    {COMMON_SAMPLE_ITEMS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                    <option value="OTHER">+ Lain-lain (Nyatakan)...</option>
                  </select>
                  {itemProduced === 'OTHER' && (
                    <input
                      type="text"
                      placeholder="Contoh: SS P0 Khas..."
                      value={customItem}
                      onChange={(e) => setCustomItem(e.target.value)}
                      className="mt-1.5 w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600"
                    />
                  )}
                </div>
              </div>

              {/* Consumables Inputs Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <PackageMinus size={14} className="text-teal-600" />
                    Kuantiti Barang Guna Habis Digunakan
                  </h3>
                  <span className="text-[11px] text-slate-500">Akan ditolak daripada baki stor</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  {/* Refill Gas */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                      <Flame size={13} className="text-amber-500" />
                      <span className="text-xs font-semibold">Refill Gas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={gasTank}
                        onChange={(e) => setGasTank(Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">Tank</span>
                    </div>
                  </div>

                  {/* Alu Bag */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                      <Package size={13} className="text-blue-500" />
                      <span className="text-xs font-semibold">Beg Aluminium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={aluBagPcs}
                        onChange={(e) => setAluBagPcs(Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">Pcs</span>
                    </div>
                  </div>

                  {/* Stiker No 1-200 */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                      <Tag size={13} className="text-emerald-500" />
                      <span className="text-xs font-semibold">Stiker 1-200</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={stickerSet}
                        onChange={(e) => setStickerSet(Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">Set</span>
                    </div>
                  </div>

                  {/* Kotak Coklat */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                      <Box size={13} className="text-amber-700" />
                      <span className="text-xs font-semibold">Kotak Coklat</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={brownBox}
                        onChange={(e) => setBrownBox(Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">Box</span>
                    </div>
                  </div>

                  {/* Getah TSR */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                      <Scale size={13} className="text-rose-500" />
                      <span className="text-xs font-semibold">Getah TSR</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={rubberTsrKg}
                        onChange={(e) => setRubberTsrKg(Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">KG</span>
                    </div>
                  </div>

                  {/* A4 Cover */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                      <FileText size={13} className="text-indigo-500" />
                      <span className="text-xs font-semibold">A4 Cover / Label</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={a4CoverPcs}
                        onChange={(e) => setA4CoverPcs(Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 font-medium">Pcs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reference Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Rujukan / No. Batch (Pilihan)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Penghasilan kelompok agihan SMR SIS..."
                  value={referenceNote}
                  onChange={(e) => setReferenceNote(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </form>
          ) : (
            /* Single Consumable Quick Adjustment Form */
            <form id="consumable-single-form" onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Barang Guna Habis
                </label>
                <select
                  value={selectedConsumableId}
                  onChange={(e) => setSelectedConsumableId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600"
                >
                  {consumables.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Baki semasa: {c.currentStock} {c.unit} | Digunakan 2026: {c.totalUsed2026} {c.unit})
                    </option>
                  ))}
                </select>
              </div>

              {selectedConsumable && (
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-teal-900">
                    <span>{selectedConsumable.name}</span>
                    <span className="font-mono">{selectedConsumable.code}</span>
                  </div>
                  <div className="text-slate-600">Lokasi: {selectedConsumable.location}</div>
                  <div className="text-slate-600">
                    Baki Stok Sedia Ada:{' '}
                    <span className="font-bold font-mono text-teal-700">
                      {selectedConsumable.currentStock} {selectedConsumable.unit}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kuantiti Penggunaan / Tolakan ({selectedConsumable?.unit})
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={singleQuantity}
                  onChange={(e) => setSingleQuantity(Number(e.target.value))}
                  placeholder="Masukkan bilangan unit digunakan..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sebab Penggunaan / Catatan Makmal
                </label>
                <textarea
                  rows={2}
                  value={singleNote}
                  onChange={(e) => setSingleNote(e.target.value)}
                  placeholder="Contoh: Penggunaan untuk ujian rawak / pembungkusan semula..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>

          <button
            type="submit"
            form={mode === 'BATCH' ? 'consumable-batch-form' : 'consumable-single-form'}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Check size={14} />
            <span>Simpan & Tolak Stok Masa Nyata</span>
          </button>
        </div>
      </div>
    </div>
  );
};
