import React, { useState } from 'react';
import { Beaker, ShieldCheck, UserCheck, Lock, Mail, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import { User } from '../types';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Sila masukkan E-mel atau ID Staf.');
      return;
    }
    if (!password.trim()) {
      setError('Sila masukkan kata laluan.');
      return;
    }

    const matched = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matched) {
      setError('Akaun pengguna tidak dijumpai. Sila gunakan akaun demo sedia ada di bawah.');
      return;
    }

    if (!matched.isActive) {
      setError('Akaun ini telah dinyahaktifkan. Sila hubungi pentadbir makmal.');
      return;
    }

    onLogin(matched);
  };

  const handleQuickLogin = (user: User) => {
    onLogin(user);
  };

  const adminUsers = users.filter((u) => u.role === 'ADMIN');
  const staffUsers = users.filter((u) => u.role === 'STAFF');

  return (
    <div className="min-h-screen bg-[#0c1824] flex flex-col justify-center items-center p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-300 overflow-hidden">
        {/* Institutional Card Header */}
        <div className="px-6 py-5 bg-[#09131d] text-white border-b border-slate-800 text-center">
          <div className="w-10 h-10 rounded-md bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Beaker size={22} className="stroke-[2.2]" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl font-bold tracking-tight">UKJK</span>
            <span className="px-1.5 py-0.2 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
              LabTrack
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Unit Kawalan Jaminan Kualiti &bull; Makmal ISO/IEC 17025
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-2.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded">
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Logins */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Log Masuk Pantas Akaun Makmal (Simulasi Sesi)
              </span>
              <span className="text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded font-semibold border border-teal-200">
                MVP Mode
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Admin Accounts */}
              {adminUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="w-full flex items-center justify-between p-2.5 rounded border border-amber-200 bg-amber-50/70 hover:bg-amber-100/90 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                      <ShieldCheck size={14} />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-amber-900">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-amber-800">
                        Peranan: Admin / Penyelia Kualiti UKJK
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}

              {/* Staff Accounts */}
              {staffUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="w-full flex items-center justify-between p-2.5 rounded border border-teal-200 bg-teal-50/70 hover:bg-teal-100/90 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                      <UserCheck size={14} />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-teal-900">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-teal-800">
                        Peranan: Staf Makmal UKJK (Ahli Kimia / Juruteknik)
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-teal-700 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold">
                atau log masuk manual
              </span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">
                E-mel Staf
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cth. halimahn@lgm.gov.my"
                  className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">
                Kata Laluan
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold transition-colors shadow-xs"
            >
              Log Masuk Sesi
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          UKJK LabTrack v1.0 &bull; Mod Storan Tempatan (Supabase-Ready)
        </div>
      </div>
    </div>
  );
};
