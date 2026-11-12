import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Mail, AlertCircle, Share2, FileText } from 'lucide-react';
import { EquipmentStatusSummary, ChemicalStatusSummary, User } from '../types';
import { dataService } from '../services/dataService';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'EQUIPMENT' | 'CHEMICAL';
  itemSummary: EquipmentStatusSummary | ChemicalStatusSummary | null;
  currentUser: User | null;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  type,
  itemSummary,
  currentUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  if (!isOpen || !itemSummary) return null;

  const senderName = currentUser
    ? `${currentUser.name} (${currentUser.role === 'ADMIN' ? 'Admin/Penyelia' : 'Staf Makmal'})`
    : 'Staf Makmal UKJK';
  const reminder = dataService.generateReminderText(type, itemSummary, senderName);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(reminder.text);
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 2500);
      } else {
        throw new Error('Clipboard API tidak disokong');
      }
    } catch {
      setCopyError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-100">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Peringatan Makmal Rasmi (WhatsApp & E-mel)
              </h3>
              <p className="text-[11px] text-slate-500">
                Salin teks berstruktur atau terus hantar peringatan jadual/stok
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 text-xs">
          {copied && (
            <div className="flex items-center gap-2 p-2.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
              <Check size={15} className="text-emerald-700 shrink-0" />
              <span>Teks peringatan berjaya disalin ke papan klip!</span>
            </div>
          )}

          {copyError && (
            <div className="flex items-center gap-2 p-2.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded">
              <AlertCircle size={15} className="text-amber-700 shrink-0" />
              <span>Pelayar menyekat papan klip automatik. Sila salin manual teks di bawah.</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Pratonton Teks Peringatan:
            </label>
            <textarea
              readOnly
              rows={10}
              value={reminder.text}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className="w-full p-3 font-mono text-[11px] text-slate-800 bg-slate-50 rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:bg-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-colors shadow-xs ${
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Telah Disalin' : 'Salin Teks'}</span>
            </button>

            {/* WhatsApp */}
            <a
              href={reminder.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] transition-colors shadow-xs"
            >
              <MessageSquare size={14} />
              <span>Buka WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href={reminder.mailtoUrl}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors shadow-xs"
            >
              <Mail size={14} />
              <span>Buka E-mel</span>
            </a>
          </div>
        </div>

        {/* Footer */}
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
