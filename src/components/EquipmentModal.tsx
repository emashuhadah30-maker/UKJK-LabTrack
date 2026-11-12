import React, { useState, useEffect } from 'react';
import { X, Cpu, AlertCircle, Save } from 'lucide-react';
import { Equipment, OperationalStatus, User } from '../types';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipmentData: Omit<Equipment, 'id' | 'updatedAt'>, editingId?: string) => void;
  editingEquipment?: Equipment | null;
  currentUser: User | null;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEquipment,
  currentUser,
}) => {
  const [name, setName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');
  const [acquisitionYear, setAcquisitionYear] = useState<number>(new Date().getFullYear());
  const [operationalStatus, setOperationalStatus] = useState<OperationalStatus>('ACTIVE');
  const [requiresCalibration, setRequiresCalibration] = useState(true);
  const [calibrationFreqMonths, setCalibrationFreqMonths] = useState(12);
  const [requiresVerification, setRequiresVerification] = useState(true);
  const [verificationFreqMonths, setVerificationFreqMonths] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingEquipment) {
      setName(editingEquipment.name);
      setAssetCode(editingEquipment.assetCode);
      setBrandModel(editingEquipment.brandModel);
      setSerialNumber(editingEquipment.serialNumber || '');
      setLocation(editingEquipment.location);
      setAcquisitionYear(editingEquipment.acquisitionYear);
      setOperationalStatus(editingEquipment.operationalStatus);
      setRequiresCalibration(editingEquipment.requiresCalibration);
      setCalibrationFreqMonths(editingEquipment.calibrationFreqMonths || 12);
      setRequiresVerification(editingEquipment.requiresVerification);
      setVerificationFreqMonths(editingEquipment.verificationFreqMonths || 1);
    } else {
      setName('');
      setAssetCode('');
      setBrandModel('');
      setSerialNumber('');
      setLocation('');
      setAcquisitionYear(new Date().getFullYear());
      setOperationalStatus('ACTIVE');
      setRequiresCalibration(true);
      setCalibrationFreqMonths(12);
      setRequiresVerification(true);
      setVerificationFreqMonths(1);
    }
    setError(null);
  }, [editingEquipment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Nama Peralatan wajib diisi.');
      return;
    }
    if (!assetCode.trim()) {
      setError('Kod / ID Aset wajib diisi.');
      return;
    }
    if (!brandModel.trim()) {
      setError('Jenama & Model wajib diisi.');
      return;
    }
    if (!location.trim()) {
      setError('Lokasi Makmal wajib diisi.');
      return;
    }
    if (!acquisitionYear || acquisitionYear < 1990 || acquisitionYear > 2050) {
      setError('Tahun Perolehan mestilah 4 digit tahun yang sah (cth: 2026).');
      return;
    }

    try {
      onSave(
        {
          name: name.trim(),
          assetCode: assetCode.trim().toUpperCase(),
          brandModel: brandModel.trim(),
          serialNumber: serialNumber.trim() || undefined,
          location: location.trim(),
          acquisitionYear: Number(acquisitionYear),
          operationalStatus,
          requiresCalibration,
          calibrationFreqMonths: requiresCalibration ? Number(calibrationFreqMonths) : 0,
          lastCalibrationDate: editingEquipment?.lastCalibrationDate || null,
          nextCalibrationDate: editingEquipment?.nextCalibrationDate || null,
          requiresVerification,
          verificationFreqMonths: requiresVerification ? Number(verificationFreqMonths) : 0,
          lastVerificationDate: editingEquipment?.lastVerificationDate || null,
          nextVerificationDate: editingEquipment?.nextVerificationDate || null,
          createdBy: editingEquipment?.createdBy || currentUser?.name || 'Admin',
        },
        editingEquipment?.id
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ralat menyimpan data peralatan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
              <Cpu size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {editingEquipment ? 'Kemaskini Data Induk Peralatan' : 'Pendaftaran Peralatan Tambahan Baharu'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {editingEquipment ? `Kemaskini maklumat bagi ${editingEquipment.assetCode}` : 'Daftar peralatan baharu makmal mengikut tahun perolehan'}
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-2.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded">
              <AlertCircle size={15} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Peralatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Analytical Balance 0.01mg, AAS Spectrometer"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kod / ID Aset Makmal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                placeholder="cth. UKJK-EQ-009"
                className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tahun Perolehan <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={2000}
                max={2030}
                value={acquisitionYear}
                onChange={(e) => setAcquisitionYear(Number(e.target.value))}
                placeholder="cth. 2026"
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenama & Model <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={brandModel}
                onChange={(e) => setBrandModel(e.target.value)}
                placeholder="cth. Mettler Toledo XPR205"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Siri Peralatan
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="cth. SN-88219-MY"
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lokasi Makmal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="cth. Bilik Timbangan, Makmal Basah"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Operasi Peralatan
              </label>
              <select
                value={operationalStatus}
                onChange={(e) => setOperationalStatus(e.target.value as OperationalStatus)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
              >
                <option value="ACTIVE">Aktif (Sedang Beroperasi)</option>
                <option value="MAINTENANCE">Penyelenggaraan (Maintenance)</option>
                <option value="BROKEN">Rosak (Out of Order)</option>
              </select>
            </div>
          </div>

          {/* Compliance Requirements */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Kekerapan Pematuhan Kalibrasi & Verifikasi
            </span>

            {/* Calibration */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresCalibration}
                  onChange={(e) => setRequiresCalibration(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-600"
                />
                <span className="font-semibold text-slate-800">
                  Memerlukan Kalibrasi Pihak Ketiga (Calibration)
                </span>
              </label>

              {requiresCalibration && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Kekerapan:</span>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={calibrationFreqMonths}
                    onChange={(e) => setCalibrationFreqMonths(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs rounded border border-slate-300 font-mono text-center bg-white"
                  />
                  <span className="text-slate-500">bulan sekali</span>
                </div>
              )}
            </div>

            {/* Verification */}
            <div className="p-3 rounded border border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresVerification}
                  onChange={(e) => setRequiresVerification(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-600"
                />
                <span className="font-semibold text-slate-800">
                  Memerlukan Pemeriksaan Berkala Dalaman (Verification)
                </span>
              </label>

              {requiresVerification && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Kekerapan:</span>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    value={verificationFreqMonths}
                    onChange={(e) => setVerificationFreqMonths(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs rounded border border-slate-300 font-mono text-center bg-white"
                  />
                  <span className="text-slate-500">bulan sekali</span>
                </div>
              )}
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
              <span>{editingEquipment ? 'Simpan Perubahan' : 'Daftar Peralatan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
