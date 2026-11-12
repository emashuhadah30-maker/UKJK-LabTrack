import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  FlaskConical,
  Layers,
  Settings,
  LogOut,
  Beaker,
  Database,
  Building2,
  Boxes,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  actionRequiredCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  actionRequiredCount,
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      sublabel: 'Status Pematuhan & Amaran',
      icon: LayoutDashboard,
      badge: actionRequiredCount > 0 ? actionRequiredCount : undefined,
    },
    {
      id: 'equipment',
      label: 'Peralatan Makmal',
      sublabel: 'Daftar Aset & Rekod Kalibrasi',
      icon: Cpu,
    },
    {
      id: 'chemicals',
      label: 'Inventori Bahan Kimia',
      sublabel: 'Baki Stok & Penerimaan Lot',
      icon: FlaskConical,
    },
    {
      id: 'consumables',
      label: 'Barang Guna Habis',
      sublabel: 'Penggunaan & Stok Consumable',
      icon: Boxes,
    },
    {
      id: 'standard_samples',
      label: 'Standard Sample',
      sublabel: 'Penyediaan Batch & Penolakan',
      icon: Layers,
    },
  ];

  if (isAdmin) {
    navItems.push({
      id: 'settings',
      label: 'Tetapan Makmal',
      sublabel: 'Ambang Amaran & Staf',
      icon: Settings,
      badge: undefined,
    });
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-[#0c1824] text-slate-200 border-r border-[#1a2c3f] select-none">
      {/* Brand & Lab Header */}
      <div className="px-5 py-4 border-b border-[#1a2c3f]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-sm tracking-tighter shrink-0 shadow-xs">
            <Beaker size={18} className="stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-tight">UKJK</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                LabTrack
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              Unit Kawalan Jaminan Kualiti
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          Menu Operasi
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-teal-700/30 text-teal-300 font-semibold border-l-[3px] border-teal-400 pl-[9px]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  size={17}
                  className={`${
                    isActive ? 'text-teal-400' : 'text-slate-400'
                  } shrink-0`}
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold leading-tight truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span className="flex items-center justify-center h-4.5 min-w-4.5 px-1 rounded text-[10px] font-bold bg-amber-500 text-slate-950 ml-1.5 shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Operational Lab Notice */}
      <div className="px-3 py-2.5 mx-2.5 mb-2.5 rounded-lg bg-[#112233] border border-[#1d354d] text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-teal-400 font-semibold mb-0.5">
          <Database size={12} />
          <span>Mod Storan Tempatan</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400">
          Penyimpanan data peranti makmal (Supabase-ready).
        </p>
      </div>

      {/* User Session Footer */}
      <div className="p-3 border-t border-[#1a2c3f] bg-[#09131d]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                isAdmin ? 'bg-amber-600' : 'bg-teal-600'
              }`}
            >
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {isAdmin ? 'Admin / Penyelia' : 'Staf Makmal'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log Keluar Sesi"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
