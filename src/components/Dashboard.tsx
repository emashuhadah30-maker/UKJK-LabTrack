import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Cpu,
  FlaskConical,
  ArrowRight,
  PlusCircle,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet,
  Building2,
  Plus,
} from 'lucide-react';
import {
  EquipmentStatusSummary,
  ChemicalStatusSummary,
  User,
} from '../types';
import { TrafficLightBadge } from './TrafficLightBadge';

interface DashboardProps {
  equipmentSummaries: EquipmentStatusSummary[];
  chemicalSummaries: ChemicalStatusSummary[];
  warningThresholdDays: number;
  currentUser: User | null;
  onNavigateTab: (tab: string, filterParams?: any) => void;
  onOpenReminder: (type: 'EQUIPMENT' | 'CHEMICAL', item: any) => void;
  onOpenEquipmentDetail: (equipmentId: string) => void;
  onOpenStockIn: (chemicalId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  equipmentSummaries,
  chemicalSummaries,
  warningThresholdDays,
  currentUser,
  onNavigateTab,
  onOpenReminder,
  onOpenEquipmentDetail,
  onOpenStockIn,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'EQUIPMENT' | 'CHEMICAL'>('ALL');

  // Counts for equipments
  const eqRed = equipmentSummaries.filter((s) => s.overallStatus === 'RED').length;
  const eqYellow = equipmentSummaries.filter((s) => s.overallStatus === 'YELLOW').length;
  const eqGreen = equipmentSummaries.filter((s) => s.overallStatus === 'GREEN').length;

  // Counts for chemicals
  const chemRed = chemicalSummaries.filter((s) => s.status === 'RED').length;
  const chemYellow = chemicalSummaries.filter((s) => s.status === 'YELLOW').length;
  const chemGreen = chemicalSummaries.filter((s) => s.status === 'GREEN').length;

  // Priority action items: Red first, then Yellow
  const criticalEquipments = equipmentSummaries.filter(
    (s) => s.overallStatus === 'RED' || s.overallStatus === 'YELLOW'
  );
  const criticalChemicals = chemicalSummaries.filter(
    (s) => s.status === 'RED' || s.status === 'YELLOW'
  );

  const totalActionNeeded = criticalEquipments.length + criticalChemicals.length;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Laboratory Shift Banner (Clean institutional header without bloated gradients) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck size={12} className="text-teal-700" />
                Pematuhan Kualiti ISO/IEC 17025
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">&bull;</span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Makmal UKJK
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Pusat Kawalan Status Peralatan & Reagen Makmal
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemantauan berjadual bagi mengelakkan instrumen tamat tempoh dan kehabisan stok kimia secara mendadak.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-medium">
              <Clock size={13} className="text-slate-400" />
              <span>Ambang Amaran: <strong className="font-mono text-slate-900">{warningThresholdDays} Hari</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-medium">
              <Calendar size={13} className="text-slate-400" />
              <span>Tarikh Rujukan: <strong className="font-mono text-slate-900">12/11/2026</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Light Overview Control Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Peralatan Makmal Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Cpu size={15} />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                  Peralatan Makmal
                </h2>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Calibration & Verification
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('equipment')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 hover:underline"
            >
              <span>Daftar Penuh</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-3">
            {/* Merah */}
            <button
              onClick={() => onNavigateTab('equipment', { status: 'RED' })}
              className="p-3 rounded-md bg-[#FEE2E2]/70 hover:bg-[#FEE2E2] border border-[#FECACA] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#991B1B] uppercase tracking-wider">
                  Tamat Tempoh
                </span>
                <AlertOctagon size={14} className="text-[#DC2626]" />
              </div>
              <div className="mt-1 text-2xl font-extrabold text-[#991B1B] font-mono tabular-nums">
                {eqRed}
              </div>
              <div className="text-[10px] text-[#991B1B]/80 mt-0.5">Lewat kalibrasi</div>
            </button>

            {/* Kuning */}
            <button
              onClick={() => onNavigateTab('equipment', { status: 'YELLOW' })}
              className="p-3 rounded-md bg-[#FEF3C7]/70 hover:bg-[#FEF3C7] border border-[#FDE68A] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#92400E] uppercase tracking-wider">
                  Hampir Tamat
                </span>
                <AlertTriangle size={14} className="text-[#D97706]" />
              </div>
              <div className="mt-1 text-2xl font-extrabold text-[#92400E] font-mono tabular-nums">
                {eqYellow}
              </div>
              <div className="text-[10px] text-[#92400E]/80 mt-0.5">&le; {warningThresholdDays} hari</div>
            </button>

            {/* Hijau */}
            <button
              onClick={() => onNavigateTab('equipment', { status: 'GREEN' })}
              className="p-3 rounded-md bg-[#DCFCE7]/70 hover:bg-[#DCFCE7] border border-[#BBF7D0] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                  Sah & Aktif
                </span>
                <CheckCircle2 size={14} className="text-[#16A34A]" />
              </div>
              <div className="mt-1 text-2xl font-extrabold text-[#166534] font-mono tabular-nums">
                {eqGreen}
              </div>
              <div className="text-[10px] text-[#166534]/80 mt-0.5">Mematuhi jadual</div>
            </button>
          </div>
        </div>

        {/* Bahan Kimia Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <FlaskConical size={15} />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                  Inventori Bahan Kimia
                </h2>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Had Minimum & Tarikh Luput
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('chemicals')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 hover:underline"
            >
              <span>Daftar Penuh</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-3">
            {/* Merah */}
            <button
              onClick={() => onNavigateTab('chemicals', { status: 'RED' })}
              className="p-3 rounded-md bg-[#FEE2E2]/70 hover:bg-[#FEE2E2] border border-[#FECACA] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#991B1B] uppercase tracking-wider">
                  Kritikal / Luput
                </span>
                <AlertOctagon size={14} className="text-[#DC2626]" />
              </div>
              <div className="mt-1 text-2xl font-extrabold text-[#991B1B] font-mono tabular-nums">
                {chemRed}
              </div>
              <div className="text-[10px] text-[#991B1B]/80 mt-0.5">&le; Had Min / Luput</div>
            </button>

            {/* Kuning */}
            <button
              onClick={() => onNavigateTab('chemicals', { status: 'YELLOW' })}
              className="p-3 rounded-md bg-[#FEF3C7]/70 hover:bg-[#FEF3C7] border border-[#FDE68A] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#92400E] uppercase tracking-wider">
                  Hampir Had Min
                </span>
                <AlertTriangle size={14} className="text-[#D97706]" />
              </div>
              <div className="mt-1 text-2xl font-extrabold text-[#92400E] font-mono tabular-nums">
                {chemYellow}
              </div>
              <div className="text-[10px] text-[#92400E]/80 mt-0.5">&le; 120% Min / Luput</div>
            </button>

            {/* Hijau */}
            <button
              onClick={() => onNavigateTab('chemicals', { status: 'GREEN' })}
              className="p-3 rounded-md bg-[#DCFCE7]/70 hover:bg-[#DCFCE7] border border-[#BBF7D0] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                  Stok Selamat
                </span>
                <CheckCircle2 size={14} className="text-[#16A34A]" />
              </div>
              <div className="mt-1 text-2xl font-extrabold text-[#166534] font-mono tabular-nums">
                {chemGreen}
              </div>
              <div className="text-[10px] text-[#166534]/80 mt-0.5">Mencukupi</div>
            </button>
          </div>
        </div>
      </div>

      {/* Action Required Priority Register (Workstation Task Focus) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Header Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Senarai Tindakan Segera Makmal (Action Required)
              </h2>
              {totalActionNeeded > 0 ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  {totalActionNeeded} ITEM
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Peralatan dan stok kimia berstatus Tamat Tempoh (Merah) atau Hampir Tamat (Kuning).
            </p>
          </div>

          {/* Filter segment control */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-md text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({totalActionNeeded})
            </button>
            <button
              onClick={() => setFilterType('EQUIPMENT')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'EQUIPMENT'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peralatan ({criticalEquipments.length})
            </button>
            <button
              onClick={() => setFilterType('CHEMICAL')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'CHEMICAL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bahan Kimia ({criticalChemicals.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {equipmentSummaries.length === 0 && chemicalSummaries.length === 0 ? (
          /* Clean Slate Empty State */
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 border border-teal-200">
              <Building2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Pangkalan Data Makmal Bersih</h3>
            <p className="text-xs text-slate-500 max-w-md mt-1">
              Data dummy telah dibuangkan. Sedia untuk pendaftaran peralatan dan bahan kimia makmal UKJK yang sebenar.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onNavigateTab('equipment')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus size={14} />
                <span>+ Daftar Peralatan Makmal</span>
              </button>
              <button
                onClick={() => onNavigateTab('chemicals')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus size={14} />
                <span>+ Daftar Bahan Kimia</span>
              </button>
            </div>
          </div>
        ) : totalActionNeeded === 0 ? (
          /* Positive All-Green Empty State */
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Semua Peralatan & Bahan Kimia Teratur</h3>
            <p className="text-xs text-slate-600 max-w-sm mt-1">
              Semua peralatan dan stok bahan kimia dalam keadaan baik dan mematuhi jadual.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Equipment Action Items */}
            {(filterType === 'ALL' || filterType === 'EQUIPMENT') &&
              criticalEquipments.map((item) => {
                const eq = item.equipment;
                const isRed = item.overallStatus === 'RED';
                return (
                  <div
                    key={`crit-eq-${eq.id}`}
                    className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors ${
                      isRed ? 'bg-rose-50/20' : 'bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                          isRed
                            ? 'bg-rose-100 text-rose-700 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <Cpu size={16} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {eq.name}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {eq.assetCode}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Perolehan {eq.acquisitionYear} &bull; {eq.location}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {eq.requiresCalibration && item.calibrationStatus && (
                            <TrafficLightBadge
                              status={item.calibrationStatus.status}
                              label={`Calibration: ${item.calibrationStatus.label}`}
                              subtext={item.calibrationStatus.details}
                              size="sm"
                            />
                          )}
                          {eq.requiresVerification && item.verificationStatus && (
                            <TrafficLightBadge
                              status={item.verificationStatus.status}
                              label={`Verification: ${item.verificationStatus.label}`}
                              subtext={item.verificationStatus.details}
                              size="sm"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onOpenReminder('EQUIPMENT', item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
                        title="Kongsi amaran rasmi ke WhatsApp / E-mel"
                      >
                        <Share2 size={13} className="text-teal-700" />
                        <span>Kongsi</span>
                      </button>

                      <button
                        onClick={() => onOpenEquipmentDetail(eq.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition-colors"
                      >
                        <span>Kemas Kini</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* Chemical Action Items */}
            {(filterType === 'ALL' || filterType === 'CHEMICAL') &&
              criticalChemicals.map((item) => {
                const chem = item.chemical;
                const isRed = item.status === 'RED';
                return (
                  <div
                    key={`crit-chem-${chem.id}`}
                    className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors ${
                      isRed ? 'bg-rose-50/20' : 'bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                          isRed
                            ? 'bg-rose-100 text-rose-700 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <FlaskConical size={16} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {chem.name}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            CAS: {chem.casOrCode}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {chem.formulaOrGrade} &bull; {chem.location}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <TrafficLightBadge
                            status={item.status}
                            label={item.status === 'RED' ? 'Kritikal' : 'Hampir Had Min / Luput'}
                            subtext={item.details}
                            size="sm"
                          />
                          <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            Baki: {chem.currentStock} {chem.unit} (Min: {chem.minStockThreshold} {chem.unit})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onOpenReminder('CHEMICAL', item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
                        title="Kongsi peringatan stok"
                      >
                        <Share2 size={13} className="text-teal-700" />
                        <span>Kongsi</span>
                      </button>

                      <button
                        onClick={() => onOpenStockIn(chem.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition-colors"
                      >
                        <PlusCircle size={13} />
                        <span>Stock-In</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
