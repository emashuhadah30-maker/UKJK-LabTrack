import React, { useState, useEffect } from 'react';
import { X, PackageCheck, AlertCircle, Calendar, User as UserIcon } from 'lucide-react';
import { Chemical, User } from '../types';

interface StockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  chemicals: Chemical[];
  preSelectedChemicalId?: string;
  onSaveStockIn: (params: {
    chemicalId: string;
    quantity: number;
    lotNumber: string;
    newExpiryDate: string;
    receiveDate: string;
    user: User;
  }) => void;
  currentUser: User | null;
}

export const StockInModal: React.FC<StockInModalProps> = ({
  isOpen,
  onClose,
  chemicals,
  preSelectedChemicalId,
  onSaveStockIn,
  currentUser,
}) => {
  const [selectedChemicalId, setSelectedChemicalId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [lotNumber, setLotNumber] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preSelectedChemicalId) {
      setSelectedChemicalId(preSelectedChemicalId);
    } else if (chemicals.length > 0 && !selectedChemicalId) {
      setSelectedChemicalId(chemicals[0].id);
    }
    setQuantity('');
    setLotNumber('');
    setReceiveDate(new Date().toISOString().split('T')[0]);
    setError(null);
  }, [preSelectedChemicalId, isOpen, chemicals]);

  if (!isOpen) return null;

  const targetChem = chemicals.find((c) => c.id === selectedChemicalId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedChemicalId) {
      setError('Sila pilih bahan kimia.');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Kuantiti masuk mestilah lebih besar daripada 0.');
      return;
    }
    if (!lotNumber.trim()) {
      setError('No. Lot / Batch pembekal wajib diisi.');
      return;
    }
    if (!newExpiryDate) {
      setError('Tarikh luput stok baharu wajib diisi.');
      return;
    }
    if (!receiveDate) {
      setError('Tarikh terima stok wajib diisi.');
      return;
    }

    try {
      onSaveStockIn({
        chemicalId: selectedChemicalId,
        quantity: Number(quantity),
        lotNumber: lotNumber.trim(),
        newExpiryDate,
        receiveDate,
        user: currentUser || {
          id: 'usr-guest',
          name: 'Staf Bertugas',
          email: '',
          role: 'STAFF',
          isActive: true,
          createdAt: '',
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ralat semasa menyimpan stok masuk.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
              <PackageCheck size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Penerimaan Stok Baharu (Stock-In)
              </h3>
              <p className="text-[11px] text-slate-500">
                Penambahan baki stok & pendaftaran no. lot pembekal
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
              Pilih Bahan Kimia <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedChemicalId}
              onChange={(e) => {
                setSelectedChemicalId(e.target.value);
                const chem = chemicals.find((c) => c.id === e.target.value);
                if (chem) setNewExpiryDate(chem.expiryDate);
              }}
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
            >
              {chemicals.map((chem) => (
                <option key={chem.id} value={chem.id}>
                  {chem.name} ({chem.casOrCode}) &bull; Baki: {chem.currentStock} {chem.unit}
                </option>
              ))}
            </select>
          </div>

          {targetChem && (
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500">Baki Semasa:</span>{' '}
                <strong className="font-mono text-slate-900">
                  {targetChem.currentStock} {targetChem.unit}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Had Min:</span>{' '}
                <strong className="font-mono text-slate-900">
                  {targetChem.minStockThreshold} {targetChem.unit}
                </strong>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kuantiti Masuk <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.001"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.0"
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 pr-10 bg-white"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                  {targetChem?.unit || ''}
                </span>
              </div>
              {targetChem && quantity && Number(quantity) > 0 && (
                <span className="text-[10px] text-teal-800 font-medium mt-0.5 block">
                  &rarr; Baki baru: {(targetChem.currentStock + Number(quantity)).toFixed(2)} {targetChem.unit}
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Lot / Batch Pembekal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="cth. LOT-MERCK-2026-11B"
                className="w-full px-2.5 py-1.5 text-xs font-mono uppercase rounded border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tarikh Luput Stok Baharu <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tarikh Terima Stok <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={receiveDate}
                onChange={(e) => setReceiveDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <UserIcon size={12} className="text-slate-400" />
            <span>Staf bertugas: <strong>{currentUser?.name || 'Staf Makmal'}</strong></span>
          </div>

          {/* Footer */}
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
              className="px-4 py-1.5 font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded shadow-xs"
            >
              Simpan Stok Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
