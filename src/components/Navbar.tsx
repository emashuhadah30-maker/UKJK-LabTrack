import React, { useState } from 'react';
import {
  Menu,
  X,
  Beaker,
  LogOut,
  LayoutDashboard,
  Cpu,
  FlaskConical,
  Layers,
  Settings,
  ChevronDown,
  Calendar,
  Shield,
  UserCheck,
  Boxes,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onSwitchUser?: (user: User) => void;
  allUsers: User[];
  actionRequiredCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onSwitchUser,
  allUsers,
  actionRequiredCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'equipment', label: 'Peralatan', icon: Cpu },
    { id: 'chemicals', label: 'Bahan Kimia', icon: FlaskConical },
    { id: 'consumables', label: 'Consumables', icon: Boxes },
    { id: 'standard_samples', label: 'Standard Sample', icon: Layers },
  ];

  if (isAdmin) {
    navItems.push({ id: 'settings', label: 'Tetapan', icon: Settings });
  }

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          {/* Left: Mobile Toggle & Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-teal-600 text-white flex items-center justify-center lg:hidden shadow-xs">
                <Beaker size={15} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
                  UKJK <span className="text-teal-700">LabTrack</span>
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-500 font-medium border-l border-slate-200 pl-2">
                  Unit Kawalan Jaminan Kualiti
                </span>
              </div>
            </div>
          </div>

          {/* Right: Operational Date & User Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* System Date Badge (PRD date reference) */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
              <Calendar size={13} className="text-slate-400" />
              <span>12 Nov 2026</span>
            </div>

            {/* User Account / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-colors text-xs text-slate-800"
                title="Tukar Peranan Pengguna (Testing)"
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold ${
                    isAdmin ? 'bg-amber-600' : 'bg-teal-600'
                  }`}
                >
                  {currentUser?.name.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="font-semibold block leading-tight">{currentUser?.name}</span>
                </div>
                <span
                  className={`hidden sm:inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                    isAdmin
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-teal-50 text-teal-800 border-teal-200'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'Staf'}
                </span>
                <ChevronDown size={13} className="text-slate-400 ml-0.5" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Tukar Akaun Pengguna (Simulasi Sesi)
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {allUsers.map((u) => {
                      const isSelected = u.id === currentUser?.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            if (onSwitchUser) onSwitchUser(u);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-teal-50 text-teal-900 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold truncate">{u.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{u.email}</div>
                          </div>
                          <span
                            className={`text-[9px] px-1 rounded font-bold uppercase shrink-0 ${
                              u.role === 'ADMIN'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-2 pt-1.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded transition-colors font-medium"
                    >
                      <LogOut size={13} />
                      <span>Log Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-3 py-2 space-y-1 shadow-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'dashboard' && actionRequiredCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded bg-amber-500 text-slate-950 font-bold">
                      {actionRequiredCount}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md"
              >
                <LogOut size={16} />
                <span>Log Keluar</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (<1024px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded transition-colors relative ${
                isActive ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                {item.id === 'dashboard' && actionRequiredCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center" />
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
