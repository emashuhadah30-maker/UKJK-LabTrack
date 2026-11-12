import React, { useState, useEffect } from 'react';
import { X, FlaskConical, AlertCircle, Save } from 'lucide-react';
import { Chemical, ChemicalUnit, User } from '../types';

interface ChemicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (chemData: Omit<Chemical, 'id' | 'updatedAt'>, editingId?: string) => void;
  editingChemical?: Chemical | null;
  currentUser: User | null;
}

export const ChemicalModal: React.FC<ChemicalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingChemical,
  currentUser,
}) => {
  const [name, setName] = useState('');
  const [casOrCode, setCasOrCode] = useState('');
  const [formulaOrGrade, setFormulaOrGrade] = useState('');
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState<ChemicalUnit>('ml');
  const [currentStock, setCurrentStock] = useState<number | ''>(0);
  const [minStockThreshold, setMinStockThreshold] = useState<number | ''>(100);
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingChemical) {
      setName(editingChemical.name);
      setCasOrCode(editingChemical.casOrCode);
      setFormulaOrGrade(editingChemical.formulaOrGrade);
      setLocation(editingChemical.location);
      setUnit(editingChemical.unit);
      setCurrentStock(editingChemical.currentStock);
      setMinStockThreshold(editingChemical.minStockThreshold);
      setExpiryDate(editingChemical.expiryDate);
    } else {
      setName('');
      setCasOrCode('');
      setFormulaOrGrade('');
      setLocation('');
      setUnit('ml');
      setCurrentStock(0);
      setMinStockThreshold(100);
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setExpiryDate(nextYear.toISOString().split('T')[0]);
    }
    setError(null);
  }, [editingChemical, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Nama Bahan Kimia wajib diisi.');
      return;
    }
    if (!casOrCode.trim()) {
      setError('No. CAS / Kod Dalaman wajib diisi.');
      return;
    }
    if (!formulaOrGrade.trim()) {
      setError('Formula / Gred bahan kimia wajib diisi.');
      return;
    }
    if (!location.trim()) {
      setError('Lokasi Simpanan makmal wajib diisi.');
      return;
    }
    if (currentStock === '' || Number(currentStock) < 0) {
      setError('Baki stok mestilah nombor ≥ 0.');
      return;
    }
    if (minStockThreshold === '' || Number(minStockThreshold) <= 0) {
      setError('Had Minimum Stok (Reorder Level) mestilah nombor > 0.');
      return;
    }
    if (!expiryDate) {
      setError('Tarikh Luput wajib diisi.');
      return;
    }

    try {
      onSave(
        {
          name: name.trim(),
          casOrCode: casOrCode.trim(),
          formulaOrGrade: formulaOrGrade.trim(),
          location: location.trim(),
          unit,
          currentStock: Number(currentStock),
          minStockThreshold: Number(minStockThreshold),
          expiryDate,
        },
        editingChemical?.id
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ralat menyimpan bahan kimia.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
              <FlaskConical size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {editingChemical ? 'Kemaskini Data Induk Bahan Kimia' : 'Daftar Bahan Kimia Baharu'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Data inventori induk, had reorder & spesifikasi penyimpanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-2.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded">
              <AlertCircle size={15} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Bahan Kimia / Reagen <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. Nitric Acid 65%, Lead Standard Solution 1000 mg/L"
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. CAS / Kod Dalaman <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={casOrCode}
                onChange={(e) => setCasOrCode(e.target.value)}
                placeholder="cth. 7697-37-2"
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Formula / Gred Bahan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formulaOrGrade}
                onChange={(e) => setFormulaOrGrade(e.target.value)}
                placeholder="cth. HNO₃ / AR Grade"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lokasi Simpanan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="cth. Bilik Asid / Kabinet A1"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Unit Ukuran <span className="text-rose-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as ChemicalUnit)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="ml">ml (Mililiter)</option>
                <option value="L">L (Liter)</option>
                <option value="g">g (Gram)</option>
                <option value="mg">mg (Miligram)</option>
                <option value="botol">botol (Unit Botol)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {editingChemical ? 'Baki Stok Semasa' : 'Baki Stok Awal'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.0"
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Had Min (Reorder Level) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.0"
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Tarikh Luput Botol Semasa <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded shadow-xs"
            >
              <Save size={14} />
              <span>{editingChemical ? 'Simpan Perubahan' : 'Daftar Bahan Kimia'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
