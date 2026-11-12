import React from 'react';
import {
  X,
  FlaskConical,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  User as UserIcon,
  Calendar,
  Share2,
  PlusCircle,
} from 'lucide-react';
import {
  Chemical,
  ChemicalTransaction,
  ChemicalStatusSummary,
  User,
} from '../types';
import { TrafficLightBadge } from './TrafficLightBadge';

interface ChemicalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chemical: Chemical | null;
  summary: ChemicalStatusSummary | null;
  transactions: ChemicalTransaction[];
  currentUser: User | null;
  onOpenStockIn: (chemicalId: string) => void;
  onOpenReminder: (type: 'CHEMICAL', item: ChemicalStatusSummary) => void;
}

export const ChemicalDetailModal: React.FC<ChemicalDetailModalProps> = ({
  isOpen,
  onClose,
  chemical,
  summary,
  transactions,
  currentUser,
  onOpenStockIn,
  onOpenReminder,
}) => {
  if (!isOpen || !chemical || !summary) return null;

  const ratio = (chemical.currentStock / chemical.minStockThreshold) * 100;
  const barPercent = Math.min(100, Math.max(5, ratio));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <FlaskConical size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-200 px-1.5 py-0.2 rounded">
                  CAS: {chemical.casOrCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {chemical.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {chemical.formulaOrGrade} &bull; Lokasi: {chemical.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={() => onOpenReminder('CHEMICAL', summary)}
              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded border border-slate-200"
              title="Kongsi Peringatan Stok"
            >
              <Share2 size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Stock Level Card */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Baki Stok Terkini
                </span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {chemical.currentStock}{' '}
                  <span className="text-xs font-semibold text-slate-500 font-sans">{chemical.unit}</span>
                </div>
              </div>

              <div>
                <TrafficLightBadge status={summary.status} label={summary.details} size="md" />
              </div>
            </div>

            {/* Visual Level Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Paras Stok Semasa</span>
                <span className="font-mono">Had Min (Reorder): {chemical.minStockThreshold} {chemical.unit}</span>
              </div>
              <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    summary.status === 'RED'
                      ? 'bg-rose-600'
                      : summary.status === 'YELLOW'
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${barPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-2 border-t border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tarikh Luput</span>
                <span className="font-mono font-semibold text-slate-800">{chemical.expiryDate}</span>
                <span className="text-[10px] text-slate-500 block">
                  {summary.daysToExpiry < 0
                    ? `Telah lewat ${Math.abs(summary.daysToExpiry)} hari`
                    : `${summary.daysToExpiry} hari baki`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Lokasi Simpanan</span>
                <span className="font-semibold text-slate-800">{chemical.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tindakan Pantas</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenStockIn(chemical.id);
                  }}
                  className="mt-0.5 inline-flex items-center gap-1 px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs"
                >
                  <PlusCircle size={12} />
                  <span>Stock-In</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <History size={14} className="text-slate-500" />
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Jejak Transaksi Stok ({transactions.length})
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Log Audit Makmal</span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
                Tiada transaksi direkodkan.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden bg-white max-h-60 overflow-y-auto">
                {transactions.map((tx) => {
                  const isStockIn = tx.transactionType === 'STOCK_IN';
                  return (
                    <div key={tx.id} className="p-2.5 hover:bg-slate-50 transition-colors space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              isStockIn
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isStockIn ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                            {isStockIn ? 'MASUK' : 'KELUAR'}
                          </span>
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            {isStockIn ? '+' : '-'}{tx.quantity} {tx.unit}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          Baki: <strong>{tx.balanceAfter} {tx.unit}</strong>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 truncate">
                        {tx.referenceNote}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <UserIcon size={10} />
                          <span>{tx.recordedByName}</span>
                        </span>
                        <span className="font-mono">{new Date(tx.createdAt).toLocaleDateString('ms-MY')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
