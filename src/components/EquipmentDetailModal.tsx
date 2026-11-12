import React, { useState } from 'react';
import {
  X,
  Cpu,
  Calendar,
  FileText,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Plus,
  User as UserIcon,
  ShieldCheck,
  Building,
} from 'lucide-react';
import {
  Equipment,
  EquipmentLog,
  EquipmentStatusSummary,
  User,
  LogType,
  VerificationResult,
} from '../types';
import { TrafficLightBadge } from './TrafficLightBadge';

interface EquipmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  summary: EquipmentStatusSummary | null;
  logs: EquipmentLog[];
  onAddLog: (logData: Omit<EquipmentLog, 'id' | 'createdAt'>) => void;
  currentUser: User | null;
  onOpenReminder: (type: 'EQUIPMENT', item: EquipmentStatusSummary) => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  isOpen,
  onClose,
  equipment,
  summary,
  logs,
  onAddLog,
  currentUser,
  onOpenReminder,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CALIBRATION' | 'VERIFICATION'>('OVERVIEW');
  const [showLogForm, setShowLogForm] = useState<LogType | null>(null);

  // Form states
  const [performedDate, setPerformedDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState('');
  const [providerOrResult, setProviderOrResult] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult>('PASS');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [certificateFileBase64, setCertificateFileBase64] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen || !equipment || !summary) return null;

  const initForm = (type: LogType) => {
    setShowLogForm(type);
    setFormError(null);
    const todayStr = new Date().toISOString().split('T')[0];
    setPerformedDate(todayStr);

    const freq = type === 'CALIBRATION' ? equipment.calibrationFreqMonths || 12 : equipment.verificationFreqMonths || 1;
    const calcDate = new Date();
    calcDate.setMonth(calcDate.getMonth() + freq);
    setNextDueDate(calcDate.toISOString().split('T')[0]);

    if (type === 'CALIBRATION') {
      setProviderOrResult('SIRIM Standards Technology');
    } else {
      setProviderOrResult('PASS');
      setVerificationResult('PASS');
    }
    setCertificateNumber('');
    setCertificateUrl('');
    setCertificateFileBase64(null);
    setCertificateFileName(null);
    setNotes('');
  };

  const handleDateChange = (newPerformedDate: string) => {
    setPerformedDate(newPerformedDate);
    if (!newPerformedDate) return;
    const baseDate = new Date(newPerformedDate);
    const freq = showLogForm === 'CALIBRATION' ? equipment.calibrationFreqMonths || 12 : equipment.verificationFreqMonths || 1;
    baseDate.setMonth(baseDate.getMonth() + freq);
    setNextDueDate(baseDate.toISOString().split('T')[0]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFormError('Hanya fail format PDF (.pdf) dibenarkan untuk sijil.');
      e.target.value = '';
      return;
    }

    const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE_BYTES) {
      setFormError(
        'Saiz fail melebihi had 1MB untuk storan pelayar. Sila gunakan ruangan "Pautan URL Sijil" (Google Drive / SharePoint makmal).'
      );
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCertificateFileBase64(reader.result as string);
      setCertificateFileName(file.name);
      setFormError(null);
    };
    reader.onerror = () => {
      setFormError('Ralat membaca fail.');
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!performedDate) {
      setFormError('Tarikh pelaksanaan wajib diisi.');
      return;
    }
    if (!nextDueDate) {
      setFormError('Tarikh luput seterusnya wajib diisi.');
      return;
    }
    if (new Date(nextDueDate) <= new Date(performedDate)) {
      setFormError('Tarikh luput seterusnya mestilah selepas tarikh pelaksanaan.');
      return;
    }

    if (showLogForm === 'CALIBRATION') {
      if (!providerOrResult.trim()) {
        setFormError('Nama pembekal/makmal kalibrasi wajib diisi.');
        return;
      }
      if (!certificateNumber.trim()) {
        setFormError('Nombor sijil kalibrasi wajib diisi.');
        return;
      }
    }

    try {
      onAddLog({
        equipmentId: equipment.id,
        type: showLogForm!,
        performedDate,
        nextDueDate,
        providerOrResult: showLogForm === 'CALIBRATION' ? providerOrResult.trim() : verificationResult,
        certificateNumber: certificateNumber.trim() || null,
        certificateUrl: certificateUrl.trim() || null,
        certificateFileBase64: certificateFileBase64 || null,
        certificateFileName: certificateFileName || null,
        notes: notes.trim() || null,
        recordedByUserId: currentUser?.id || 'usr-guest',
        recordedByName: currentUser?.name || 'Staf Makmal',
      });

      setShowLogForm(null);
    } catch (err: any) {
      setFormError(err.message || 'Ralat menyimpan rekod.');
    }
  };

  const calibrationLogs = logs.filter((l) => l.type === 'CALIBRATION');
  const verificationLogs = logs.filter((l) => l.type === 'VERIFICATION');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Cpu size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-200 px-1.5 py-0.2 rounded">
                  {equipment.assetCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {equipment.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {equipment.brandModel} &bull; Lokasi: {equipment.location} &bull; Perolehan: {equipment.acquisitionYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={() => onOpenReminder('EQUIPMENT', summary)}
              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded border border-slate-200"
              title="Kongsi Peringatan Rasmi"
            >
              <FileText size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 px-5 pt-2.5 border-b border-slate-200 bg-slate-50/50 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('OVERVIEW');
              setShowLogForm(null);
            }}
            className={`pb-2 px-3 border-b-2 transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'border-teal-700 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ringkasan & Status
          </button>
          {equipment.requiresCalibration && (
            <button
              onClick={() => {
                setActiveTab('CALIBRATION');
                setShowLogForm(null);
              }}
              className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'CALIBRATION'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Calibration</span>
              {summary.calibrationStatus && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    summary.calibrationStatus.status === 'RED'
                      ? 'bg-rose-500'
                      : summary.calibrationStatus.status === 'YELLOW'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
              )}
            </button>
          )}
          {equipment.requiresVerification && (
            <button
              onClick={() => {
                setActiveTab('VERIFICATION');
                setShowLogForm(null);
              }}
              className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'VERIFICATION'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Verification</span>
              {summary.verificationStatus && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    summary.verificationStatus.status === 'RED'
                      ? 'bg-rose-500'
                      : summary.verificationStatus.status === 'YELLOW'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
              )}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Active Log Form (Calibration / Verification) */}
          {showLogForm && (
            <div className="p-4 rounded-lg bg-teal-50/60 border border-teal-200 space-y-3">
              <div className="flex items-center justify-between border-b border-teal-200/60 pb-2">
                <span className="font-bold text-slate-900 text-xs">
                  Borang Kemas Kini {showLogForm === 'CALIBRATION' ? 'Calibration' : 'Verification'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowLogForm(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Batal
                </button>
              </div>

              {formError && (
                <div className="p-2 text-rose-800 bg-rose-50 border border-rose-200 rounded flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tarikh Pelaksanaan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={performedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tarikh Luput Seterusnya <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={nextDueDate}
                      onChange={(e) => setNextDueDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono bg-white"
                    />
                  </div>

                  {showLogForm === 'CALIBRATION' ? (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Nama Makmal / Pembekal Kalibrasi <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={providerOrResult}
                          onChange={(e) => setProviderOrResult(e.target.value)}
                          placeholder="cth. SIRIM Standards Technology"
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Nombor Sijil Kalibrasi <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={certificateNumber}
                          onChange={(e) => setCertificateNumber(e.target.value)}
                          placeholder="cth. SST-CAL-2026-9901"
                          className="w-full px-2.5 py-1.5 font-mono uppercase rounded border border-slate-300 bg-white"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Keputusan Verification <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="flex items-center gap-1 font-semibold text-emerald-800 cursor-pointer">
                            <input
                              type="radio"
                              name="verResult"
                              value="PASS"
                              checked={verificationResult === 'PASS'}
                              onChange={() => setVerificationResult('PASS')}
                              className="text-emerald-700 focus:ring-emerald-600"
                            />
                            <span>LULUS (PASS)</span>
                          </label>
                          <label className="flex items-center gap-1 font-semibold text-rose-800 cursor-pointer">
                            <input
                              type="radio"
                              name="verResult"
                              value="FAIL"
                              checked={verificationResult === 'FAIL'}
                              onChange={() => setVerificationResult('FAIL')}
                              className="text-rose-700 focus:ring-rose-600"
                            />
                            <span>GAGAL (FAIL)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          No. Rujukan Verifikasi Dalaman
                        </label>
                        <input
                          type="text"
                          value={certificateNumber}
                          onChange={(e) => setCertificateNumber(e.target.value)}
                          placeholder="cth. VER-UKJK-2026-11-01"
                          className="w-full px-2.5 py-1.5 font-mono rounded border border-slate-300 bg-white"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Sijil Document */}
                <div className="p-2.5 rounded border border-slate-200 bg-white space-y-2">
                  <span className="font-semibold text-slate-800 block">
                    Dokumen Bukti Sijil (Pilihan):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">
                        Muat Naik Fail PDF (&le; 1MB):
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        className="w-full text-[11px] text-slate-500 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                      />
                      {certificateFileName && (
                        <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">
                          ✓ {certificateFileName}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">
                        Atau Pautan URL Sijil Awan:
                      </label>
                      <input
                        type="url"
                        value={certificateUrl}
                        onChange={(e) => setCertificateUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Teknikal
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="cth. Beban piawai kelas E2 ralat dalam had toleransi"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-teal-200/60">
                  <button
                    type="button"
                    onClick={() => setShowLogForm(null)}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded shadow-xs"
                  >
                    Simpan Rekod
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* Properties Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">No. Siri</span>
                  <span className="font-mono font-semibold text-slate-800">{equipment.serialNumber || 'Tiada'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tahun Perolehan</span>
                  <span className="font-mono font-semibold text-slate-800">{equipment.acquisitionYear}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Operasi</span>
                  <span className="font-semibold text-slate-800">
                    {equipment.operationalStatus === 'ACTIVE'
                      ? 'Aktif'
                      : equipment.operationalStatus === 'MAINTENANCE'
                      ? 'Penyelenggaraan'
                      : 'Rosak'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Didaftar Oleh</span>
                  <span className="font-semibold text-slate-800">{equipment.createdBy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kemaskini Terakhir</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {new Date(equipment.updatedAt).toLocaleDateString('ms-MY')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Semasa</span>
                  <TrafficLightBadge status={summary.overallStatus} size="sm" />
                </div>
              </div>

              {/* Dual Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Calibration Box */}
                {equipment.requiresCalibration ? (
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Status Calibration
                      </span>
                      {summary.calibrationStatus && (
                        <TrafficLightBadge
                          status={summary.calibrationStatus.status}
                          label={summary.calibrationStatus.label}
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="space-y-0.5 text-slate-600">
                      <div>Kekerapan: Setiap {equipment.calibrationFreqMonths} bulan</div>
                      <div>Tarikh Terakhir: <span className="font-mono">{equipment.lastCalibrationDate || 'Belum direkod'}</span></div>
                      <div className="font-semibold text-slate-900">
                        Tarikh Seterusnya: <span className="font-mono">{equipment.nextCalibrationDate || 'Belum ditetapkan'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {summary.calibrationStatus?.details}
                      </div>
                    </div>
                    <button
                      onClick={() => initForm('CALIBRATION')}
                      className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors"
                    >
                      <Plus size={13} />
                      <span>Kemas Kini Calibration</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                    Peralatan ini tidak memerlukan kalibrasi luaran.
                  </div>
                )}

                {/* Verification Box */}
                {equipment.requiresVerification ? (
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Status Verification
                      </span>
                      {summary.verificationStatus && (
                        <TrafficLightBadge
                          status={summary.verificationStatus.status}
                          label={summary.verificationStatus.label}
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="space-y-0.5 text-slate-600">
                      <div>Kekerapan: Setiap {equipment.verificationFreqMonths} bulan</div>
                      <div>Tarikh Terakhir: <span className="font-mono">{equipment.lastVerificationDate || 'Belum direkod'}</span></div>
                      <div className="font-semibold text-slate-900">
                        Tarikh Seterusnya: <span className="font-mono">{equipment.nextVerificationDate || 'Belum ditetapkan'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {summary.verificationStatus?.details}
                      </div>
                    </div>
                    <button
                      onClick={() => initForm('VERIFICATION')}
                      className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors"
                    >
                      <Plus size={13} />
                      <span>Kemas Kini Verification</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                    Peralatan ini tidak memerlukan verifikasi dalaman.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Calibration History Tab */}
          {activeTab === 'CALIBRATION' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Sejarah Kalibrasi ({calibrationLogs.length})
                </span>
                <button
                  onClick={() => initForm('CALIBRATION')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded"
                >
                  <Plus size={13} />
                  <span>Kemas Kini Kalibrasi</span>
                </button>
              </div>

              {calibrationLogs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
                  Tiada rekod kalibrasi terdahulu.
                </div>
              ) : (
                <div className="space-y-2">
                  {calibrationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded border border-slate-200 bg-white space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {log.providerOrResult}
                          </span>
                          {log.certificateNumber && (
                            <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              Sijil: {log.certificateNumber}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">
                          {log.performedDate} &rarr; Tamat: {log.nextDueDate}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px]">
                          {log.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <UserIcon size={12} />
                          <span>Direkod oleh: <strong>{log.recordedByName}</strong></span>
                        </span>

                        <div className="flex items-center gap-2">
                          {log.certificateFileBase64 && (
                            <a
                              href={log.certificateFileBase64}
                              download={log.certificateFileName || `Sijil_${equipment.assetCode}.pdf`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-teal-800 bg-teal-50 hover:bg-teal-100 font-semibold border border-teal-200"
                            >
                              <Download size={11} />
                              <span>Muat Turun PDF</span>
                            </a>
                          )}
                          {log.certificateUrl && (
                            <a
                              href={log.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium"
                            >
                              <ExternalLink size={11} />
                              <span>Pautan Sijil</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Verification History Tab */}
          {activeTab === 'VERIFICATION' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Sejarah Verifikasi Dalaman ({verificationLogs.length})
                </span>
                <button
                  onClick={() => initForm('VERIFICATION')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded"
                >
                  <Plus size={13} />
                  <span>Kemas Kini Verifikasi</span>
                </button>
              </div>

              {verificationLogs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
                  Tiada rekod verifikasi terdahulu.
                </div>
              ) : (
                <div className="space-y-2">
                  {verificationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded border border-slate-200 bg-white space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                              log.providerOrResult === 'PASS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {log.providerOrResult === 'PASS' ? 'LULUS (PASS)' : 'GAGAL (FAIL)'}
                          </span>
                          {log.certificateNumber && (
                            <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              Ruj: {log.certificateNumber}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">
                          {log.performedDate} &rarr; Seterusnya: {log.nextDueDate}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px]">
                          {log.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <UserIcon size={12} />
                          <span>Direkod oleh: <strong>{log.recordedByName}</strong></span>
                        </span>

                        <div className="flex items-center gap-2">
                          {log.certificateFileBase64 && (
                            <a
                              href={log.certificateFileBase64}
                              download={log.certificateFileName || `Verifikasi_${equipment.assetCode}.pdf`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-teal-800 bg-teal-50 hover:bg-teal-100 font-semibold border border-teal-200"
                            >
                              <Download size={11} />
                              <span>Muat Turun PDF</span>
                            </a>
                          )}
                          {log.certificateUrl && (
                            <a
                              href={log.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium"
                            >
                              <ExternalLink size={11} />
                              <span>Pautan Dokumen</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
