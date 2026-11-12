import React, { useState } from 'react';
import {
  Settings,
  Clock,
  Users,
  Shield,
  RotateCcw,
  Database,
  Check,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { SystemSettings, User, UserRole } from '../types';
import { dataService } from '../services/dataService';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  users: User[];
  currentUser: User | null;
  onSaveUser: (userData: Omit<User, 'id' | 'createdAt'>, editingId?: string) => void;
  onDeleteUser: (userId: string) => void;
  onResetDemoData: () => void;
  onLoadDemoData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  users,
  currentUser,
  onSaveUser,
  onDeleteUser,
  onResetDemoData,
  onLoadDemoData,
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  const [thresholdDays, setThresholdDays] = useState(settings.warningThresholdDays);
  const [thresholdSaved, setThresholdSaved] = useState(false);
  const [thresholdError, setThresholdError] = useState<string | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('STAFF');
  const [userIsActive, setUserIsActive] = useState(true);
  const [userFormError, setUserFormError] = useState<string | null>(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLoadDemoConfirm, setShowLoadDemoConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const storageInfo = dataService.getStorageUsage();

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-lg border border-rose-200 p-8 text-center max-w-sm mx-auto my-12 shadow-xs">
        <div className="w-10 h-10 rounded bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-2">
          <Shield size={22} />
        </div>
        <h2 className="text-sm font-bold text-slate-900">Akses Ditolak</h2>
        <p className="text-xs text-slate-600 mt-1">
          Halaman Tetapan Makmal dihadkan kepada peranan Admin / Penyelia Makmal UKJK sahaja.
        </p>
      </div>
    );
  }

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    setThresholdError(null);
    const val = Number(thresholdDays);
    if (isNaN(val) || val < 1 || val > 180) {
      setThresholdError('Sila masukkan nombor bulat antara 1 hingga 180 hari.');
      return;
    }

    try {
      onUpdateSettings({ warningThresholdDays: val });
      setThresholdSaved(true);
      setTimeout(() => setThresholdSaved(false), 2500);
    } catch (err: any) {
      setThresholdError(err.message || 'Ralat mengemas kini ambang.');
    }
  };

  const openAddUser = () => {
    setEditingUserId(null);
    setUserName('');
    setUserEmail('');
    setUserRole('STAFF');
    setUserIsActive(true);
    setUserFormError(null);
    setShowUserModal(true);
  };

  const openEditUser = (user: User) => {
    setEditingUserId(user.id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserIsActive(user.isActive);
    setUserFormError(null);
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError(null);

    if (!userName.trim()) {
      setUserFormError('Nama penuh pengguna diperlukan.');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setUserFormError('E-mel staf yang sah diperlukan.');
      return;
    }

    try {
      onSaveUser(
        {
          name: userName.trim(),
          email: userEmail.trim().toLowerCase(),
          role: userRole,
          isActive: userIsActive,
        },
        editingUserId || undefined
      );
      setShowUserModal(false);
    } catch (err: any) {
      setUserFormError(err.message || 'Ralat menyimpan data pengguna.');
    }
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      try {
        onDeleteUser(userToDelete.id);
        setUserToDelete(null);
      } catch (err: any) {
        setUserFormError(err.message);
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Tetapan Sistem & Pentadbiran Makmal
          </h1>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
            Akses Admin
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Pelarasan hari ambang lampu isyarat amaran awal, pengurusan staf makmal dan jejak storan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Warning Threshold & Storage */}
        <div className="space-y-4">
          {/* FR-008: Ambang Hari Amaran */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock size={16} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Ambang Hari Amaran Awal
                </h3>
                <p className="text-[11px] text-slate-500">
                  Kriteria amaran lampu Kuning di Dashboard
                </p>
              </div>
            </div>

            {thresholdSaved && (
              <div className="p-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded flex items-center gap-1.5">
                <Check size={14} className="text-emerald-700 shrink-0" />
                <span>Ambang dikemas kini! Lampu isyarat dikira semula serta-merta.</span>
              </div>
            )}

            {thresholdError && (
              <div className="p-2 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded flex items-center gap-1.5">
                <AlertCircle size={14} className="text-rose-600 shrink-0" />
                <span>{thresholdError}</span>
              </div>
            )}

            <form onSubmit={handleSaveThreshold} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bilangan Hari Amaran Awal (1 - 180 hari):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    required
                    value={thresholdDays}
                    onChange={(e) => setThresholdDays(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    Hari
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Peralatan dengan baki tarikh &le; nilai ini bertukar kepada <strong>Kuning</strong>.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded shadow-xs transition-colors"
                >
                  <Save size={13} />
                  <span>Kemas Kini Ambang</span>
                </button>
              </div>
            </form>
          </div>

          {/* Storage Box */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
                <Database size={16} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Status Storan Tempatan
                </h3>
                <p className="text-[11px] text-slate-500">
                  Penyimpanan pelayar kekal (Supabase-ready)
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Penggunaan LocalStorage:</span>
                <span className="font-mono font-bold text-slate-900">{storageInfo.usedKb} KB / ~5,120 KB</span>
              </div>
              <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded"
                  style={{ width: `${Math.max(2, storageInfo.percent)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400">
                Sijil PDF dihadkan kepada 1MB setiap fail bagi menjamin kestabilan storan.
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
              >
                <Trash2 size={13} />
                <span>Kosongkan Semua Rekod Makmal</span>
              </button>
              {onLoadDemoData && (
                <button
                  type="button"
                  onClick={() => setShowLoadDemoConfirm(true)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Muat Semula Data Rasmi PDF (74 Peralatan & 14 Bahan Kimia)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: User Management */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Daftar Pengguna Makmal UKJK
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pengurusan akaun staf & kawalan capaian peranan (RBAC)
                </p>
              </div>
            </div>

            <button
              onClick={openAddUser}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs self-start sm:self-auto"
            >
              <Plus size={13} />
              <span>+ Tambah Pengguna</span>
            </button>
          </div>

          {/* User List Table */}
          <div className="divide-y divide-slate-100 text-xs">
            {users.map((u) => {
              const isCurrent = currentUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 rounded px-2 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                        u.role === 'ADMIN' ? 'bg-amber-600' : 'bg-teal-600'
                      }`}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 truncate">
                          {u.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-1 rounded">
                            Sesi Anda
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 truncate">{u.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-teal-100 text-teal-900 border border-teal-300'
                      }`}
                    >
                      {u.role === 'ADMIN' ? 'Admin / Penyelia' : 'Staf Makmal'}
                    </span>

                    <button
                      onClick={() => openEditUser(u)}
                      className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                      title="Edit Pengguna"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      disabled={isCurrent}
                      onClick={() => setUserToDelete(u)}
                      className={`p-1 rounded ${
                        isCurrent
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title={isCurrent ? 'Tidak boleh memadam akaun semasa' : 'Padam Pengguna'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Add/Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-white rounded-lg p-5 shadow-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                {editingUserId ? 'Kemaskini Pengguna Makmal' : 'Tambah Pengguna Makmal Baharu'}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {userFormError && (
              <div className="p-2 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded flex items-center gap-1.5">
                <AlertCircle size={14} className="text-rose-600 shrink-0" />
                <span>{userFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Penuh Staf <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="cth. Dr. Norazman Alias"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  E-mel / ID Staf <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="cth. norazman@ukjk.gov.my"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Peranan Akses Sistem <span className="text-rose-500">*</span>
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                >
                  <option value="STAFF">Staf Makmal</option>
                  <option value="ADMIN">Admin / Penyelia</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-3 py-1 font-medium text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-white rounded-lg p-5 shadow-xl border border-slate-200 space-y-3">
            <div className="w-9 h-9 rounded bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Sahkan Pemadaman Pengguna
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Adakah anda pasti mahu memadam akaun <strong className="text-slate-800">{userToDelete.name}</strong>?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kosongkan Semua Data Makmal (Buang Dummy) Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-white rounded-lg p-5 shadow-xl border border-slate-200 space-y-3">
            <div className="w-9 h-9 rounded bg-rose-100 text-rose-700 flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Kosongkan Semua Data Makmal?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tindakan ini akan mengosongkan semua rekod peralatan, log servis, inventori bahan kimia, pergerakan stok, dan formulasi standard sample (membuang data dummy). Sistem akan bersih dan bersedia untuk input data sebenar makmal UKJK.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onResetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs"
              >
                Ya, Kosongkan Semua Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Muat Semula Data Rasmi PDF Modal */}
      {showLoadDemoConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-white rounded-lg p-5 shadow-xl border border-slate-200 space-y-3">
            <div className="w-9 h-9 rounded bg-teal-100 text-teal-800 flex items-center justify-center">
              <RotateCcw size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Muat Semula Data Rasmi PDF Makmal?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tindakan ini akan memuatkan semula 74 senarai peralatan rasmi makmal UKJK LGM lengkap dengan jadual kalibrasi (Obsnap, SIS, GTACR, UPPF, Metcal) dan rekod verifikasi berkala SIS LGM, serta 14 bahan kimia & consumable rasmi (Systerm, Merck, Sigma).
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowLoadDemoConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onLoadDemoData?.();
                  setShowLoadDemoConfirm(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded shadow-xs"
              >
                Ya, Muat Data Rasmi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
