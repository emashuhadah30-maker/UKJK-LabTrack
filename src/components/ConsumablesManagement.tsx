import React, { useState, useMemo } from 'react';
import {
  Boxes,
  PackageMinus,
  Search,
  Filter,
  Flame,
  Package,
  Tag,
  Box,
  Scale,
  FileText,
  Building2,
  Calendar,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  Edit3,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { ConsumableItem, ConsumableUsageRecord, User } from '../types';

interface ConsumablesManagementProps {
  consumables: ConsumableItem[];
  usageRecords: ConsumableUsageRecord[];
  currentUser: User | null;
  onOpenUpdateModal: (consumableId?: string) => void;
  onRefreshData?: () => void;
}

export const ConsumablesManagement: React.FC<ConsumablesManagementProps> = ({
  consumables,
  usageRecords,
  currentUser,
  onOpenUpdateModal,
  onRefreshData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'RECORDS' | 'MASTER'>('RECORDS');
  const [searchTerm, setSearchTerm] = useState('');
  const [quarterFilter, setQuarterFilter] = useState<string>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');
  const [itemFilter, setItemFilter] = useState<string>('ALL');

  // Extract unique companies and items for filters
  const companies = useMemo(() => {
    const set = new Set<string>();
    usageRecords.forEach((r) => set.add(r.unitOrCompany));
    return Array.from(set).sort();
  }, [usageRecords]);

  const itemTypes = useMemo(() => {
    const set = new Set<string>();
    usageRecords.forEach((r) => set.add(r.itemProduced));
    return Array.from(set).sort();
  }, [usageRecords]);

  // Filtered usage records
  const filteredRecords = useMemo(() => {
    return usageRecords.filter((record) => {
      if (quarterFilter !== 'ALL' && record.quarter !== quarterFilter) return false;
      if (companyFilter !== 'ALL' && record.unitOrCompany !== companyFilter) return false;
      if (itemFilter !== 'ALL' && record.itemProduced !== itemFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchCompany = record.unitOrCompany.toLowerCase().includes(q);
        const matchItem = record.itemProduced.toLowerCase().includes(q);
        const matchDate = record.productionDate.toLowerCase().includes(q);
        const matchNote = (record.referenceNote || '').toLowerCase().includes(q);
        if (!matchCompany && !matchItem && !matchDate && !matchNote) return false;
      }

      return true;
    });
  }, [usageRecords, quarterFilter, companyFilter, itemFilter, searchTerm]);

  // Dynamic Subtotals based on filtered records
  const dynamicTotals = useMemo(() => {
    return filteredRecords.reduce(
      (acc, r) => {
        acc.gas += r.gasTank || 0;
        acc.aluBag += r.aluBagPcs || 0;
        acc.sticker += r.stickerSet || 0;
        acc.box += r.brownBox || 0;
        acc.rubberTsr += r.rubberTsrKg || 0;
        acc.a4 += r.a4CoverPcs || 0;
        acc.samples += r.quantityProduced || 0;
        return acc;
      },
      { gas: 0, aluBag: 0, sticker: 0, box: 0, rubberTsr: 0, a4: 0, samples: 0 }
    );
  }, [filteredRecords]);

  // Find consumable balances
  const gasItem = consumables.find((c) => c.id === 'csm-gas');
  const aluItem = consumables.find((c) => c.id === 'csm-alubag');
  const stickerItem = consumables.find((c) => c.id === 'csm-sticker');
  const boxItem = consumables.find((c) => c.id === 'csm-box');
  const tsrItem = consumables.find((c) => c.id === 'csm-tsr');
  const a4Item = consumables.find((c) => c.id === 'csm-a4');

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Boxes size={22} className="text-teal-700" />
              Pengurusan & Penggunaan Barang Guna Habis (Consumables)
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-teal-100 text-teal-800 border border-teal-200">
              {usageRecords.length} REKOD PENGGUNAAN 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kawalan stok barang pembungkusan, gas pemanasan, stiker barcode dan getah TSR bagi kelompok sampel piawai LGM.
          </p>
        </div>

        {/* Action Button: Kemas Kini Penggunaan Consumable */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onOpenUpdateModal()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <PackageMinus size={16} />
            <span>+ Kemas Kini Penggunaan Consumable</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards for the Consumables */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* 1. Refill Gas */}
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-teal-300 transition-all group relative">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Flame size={14} className="text-amber-500" />
              <span>Refill Gas</span>
            </div>
            <button
              onClick={() => onOpenUpdateModal('csm-gas')}
              title="Kemas kini penggunaan gas"
              className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors"
            >
              <Edit3 size={13} />
            </button>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {gasItem?.totalUsed2026 ?? 19}{' '}
            <span className="text-xs font-normal text-slate-500">Tank Digunakan</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Baki Stor:</span>
            <span className="font-semibold text-teal-700 font-mono">
              {gasItem?.currentStock ?? 35} Tank
            </span>
          </div>
        </div>

        {/* 2. Alu Bag */}
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-teal-300 transition-all group relative">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Package size={14} className="text-blue-500" />
              <span>Beg Aluminium</span>
            </div>
            <button
              onClick={() => onOpenUpdateModal('csm-alubag')}
              title="Kemas kini penggunaan beg aluminium"
              className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors"
            >
              <Edit3 size={13} />
            </button>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {(aluItem?.totalUsed2026 ?? 7511).toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-500">Pcs</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Baki Stor:</span>
            <span className="font-semibold text-teal-700 font-mono">
              {(aluItem?.currentStock ?? 12489).toLocaleString()} Pcs
            </span>
          </div>
        </div>

        {/* 3. Stiker 1-200 */}
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-teal-300 transition-all group relative">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Tag size={14} className="text-emerald-500" />
              <span>Stiker 1-200</span>
            </div>
            <button
              onClick={() => onOpenUpdateModal('csm-sticker')}
              title="Kemas kini penggunaan stiker"
              className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors"
            >
              <Edit3 size={13} />
            </button>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {stickerItem?.totalUsed2026 ?? 83}{' '}
            <span className="text-xs font-normal text-slate-500">Set</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Baki Stor:</span>
            <span className="font-semibold text-teal-700 font-mono">
              {stickerItem?.currentStock ?? 117} Set
            </span>
          </div>
        </div>

        {/* 4. Kotak Coklat */}
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-teal-300 transition-all group relative">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Box size={14} className="text-amber-700" />
              <span>Kotak Coklat</span>
            </div>
            <button
              onClick={() => onOpenUpdateModal('csm-box')}
              title="Kemas kini penggunaan kotak coklat"
              className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors"
            >
              <Edit3 size={13} />
            </button>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {boxItem?.totalUsed2026 ?? 17}{' '}
            <span className="text-xs font-normal text-slate-500">Box</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Baki Stor:</span>
            <span className="font-semibold text-teal-700 font-mono">
              {boxItem?.currentStock ?? 43} Box
            </span>
          </div>
        </div>

        {/* 5. Getah TSR */}
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-teal-300 transition-all group relative">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Scale size={14} className="text-rose-500" />
              <span>Getah TSR</span>
            </div>
            <button
              onClick={() => onOpenUpdateModal('csm-tsr')}
              title="Kemas kini penggunaan getah TSR"
              className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors"
            >
              <Edit3 size={13} />
            </button>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {tsrItem?.totalUsed2026 ?? 366.7}{' '}
            <span className="text-xs font-normal text-slate-500">KG</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Baki Stor:</span>
            <span className="font-semibold text-teal-700 font-mono">
              {tsrItem?.currentStock ?? 633.3} KG
            </span>
          </div>
        </div>

        {/* 6. A4 Cover / Transparan */}
        <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-teal-300 transition-all group relative">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <FileText size={14} className="text-indigo-500" />
              <span>A4 Cover</span>
            </div>
            <button
              onClick={() => onOpenUpdateModal('csm-a4')}
              title="Kemas kini penggunaan cover A4"
              className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors"
            >
              <Edit3 size={13} />
            </button>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {a4Item?.totalUsed2026 ?? 83}{' '}
            <span className="text-xs font-normal text-slate-500">Pcs</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Baki Stor:</span>
            <span className="font-semibold text-teal-700 font-mono">
              {a4Item?.currentStock ?? 217} Pcs
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Toggle Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('RECORDS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'RECORDS'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Buku Rekod Penggunaan 2026 ({usageRecords.length} Transaksi)
          </button>
          <button
            onClick={() => setActiveSubTab('MASTER')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'MASTER'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Senarai Master Baki Stok ({consumables.length} Item)
          </button>
        </div>

        <div className="text-[11px] text-slate-500 hidden sm:block">
          Sistem Pengurusan Consumable Makmal LGM
        </div>
      </div>

      {activeSubTab === 'RECORDS' ? (
        <div className="space-y-3">
          {/* Filters Bar */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Cari entiti, tarikh, item sampel, catatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Quarter Filter */}
              <select
                value={quarterFilter}
                onChange={(e) => setQuarterFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-700"
              >
                <option value="ALL">Semua Suku (Q1-Q3)</option>
                <option value="Q1">Suku Pertama (Q1 - 32)</option>
                <option value="2nd">Suku Ke-2 (2nd - 29)</option>
                <option value="3rd">Suku Ke-3 (3rd - 22)</option>
              </select>

              {/* Company Filter */}
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-700 max-w-[160px] truncate"
              >
                <option value="ALL">Semua Unit / Syarikat</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Item Filter */}
              <select
                value={itemFilter}
                onChange={(e) => setItemFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-700 max-w-[140px] truncate"
              >
                <option value="ALL">Semua Item</option>
                {itemTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {(quarterFilter !== 'ALL' || companyFilter !== 'ALL' || itemFilter !== 'ALL' || searchTerm) && (
                <button
                  onClick={() => {
                    setQuarterFilter('ALL');
                    setCompanyFilter('ALL');
                    setItemFilter('ALL');
                    setSearchTerm('');
                  }}
                  className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Summary Strip for Filtered Records */}
          <div className="px-4 py-2 bg-teal-50/70 border border-teal-200 rounded-lg flex items-center justify-between text-xs text-teal-900 flex-wrap gap-2">
            <div className="font-semibold flex items-center gap-1.5">
              <span>Subjumlah Paparan:</span>
              <span className="font-mono bg-teal-200/80 px-1.5 py-0.5 rounded text-[11px] font-bold">
                {filteredRecords.length} Rekod
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono font-medium flex-wrap">
              <span>Gas: <strong>{dynamicTotals.gas}</strong> Tank</span>
              <span>Beg Alu: <strong>{dynamicTotals.aluBag.toLocaleString()}</strong> Pcs</span>
              <span>Stiker: <strong>{dynamicTotals.sticker}</strong> Set</span>
              <span>Kotak: <strong>{dynamicTotals.box}</strong> Box</span>
              <span>Getah TSR: <strong>{dynamicTotals.rubberTsr.toFixed(1)}</strong> KG</span>
              <span>A4 Cover: <strong>{dynamicTotals.a4}</strong> Pcs</span>
            </div>
          </div>

          {/* Usage Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Tarikh</th>
                    <th className="py-2.5 px-2.5">Suku</th>
                    <th className="py-2.5 px-3">Unit / Syarikat</th>
                    <th className="py-2.5 px-3">Item Dihasilkan</th>
                    <th className="py-2.5 px-2.5 text-right">Jumlah (Pcs)</th>
                    <th className="py-2.5 px-2.5 text-center bg-amber-50/60 text-amber-900">Gas (Tank)</th>
                    <th className="py-2.5 px-2.5 text-right bg-blue-50/60 text-blue-900">Beg Alu</th>
                    <th className="py-2.5 px-2.5 text-center bg-emerald-50/60 text-emerald-900">Stiker</th>
                    <th className="py-2.5 px-2.5 text-center bg-amber-100/40 text-amber-950">Kotak</th>
                    <th className="py-2.5 px-2.5 text-right bg-rose-50/60 text-rose-900">Getah (KG)</th>
                    <th className="py-2.5 px-2.5 text-center bg-indigo-50/60 text-indigo-900">A4 Cover</th>
                    <th className="py-2.5 px-3 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-slate-500">
                        Tiada rekod penggunaan consumable ditemui untuk carian ini.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r, idx) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                          {r.productionDate}
                        </td>
                        <td className="py-2 px-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                              r.quarter === 'Q1'
                                ? 'bg-blue-100 text-blue-800'
                                : r.quarter === '2nd'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {r.quarter}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-800 whitespace-nowrap">
                          {r.unitOrCompany}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {r.itemProduced}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-slate-700">
                          {r.quantityProduced > 0 ? r.quantityProduced : '-'}
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono font-bold text-amber-700 bg-amber-50/30">
                          {r.gasTank > 0 ? r.gasTank : '-'}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono font-semibold text-blue-700 bg-blue-50/30">
                          {r.aluBagPcs > 0 ? r.aluBagPcs.toLocaleString() : '-'}
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono text-emerald-700 bg-emerald-50/30">
                          {r.stickerSet > 0 ? r.stickerSet : '-'}
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono font-bold text-amber-800 bg-amber-100/20">
                          {r.brownBox > 0 ? r.brownBox : '-'}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono font-semibold text-rose-700 bg-rose-50/30">
                          {r.rubberTsrKg > 0 ? r.rubberTsrKg.toFixed(1) : '-'}
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono text-indigo-700 bg-indigo-50/30">
                          {r.a4CoverPcs > 0 ? r.a4CoverPcs : '-'}
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => onOpenUpdateModal()}
                            title="Kemas kini penggunaan tambahan"
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded transition-colors"
                          >
                            <Edit3 size={12} />
                            <span>Kemas kini</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Senarai Master Stok Consumables */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {consumables.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        {item.code}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Boxes size={18} />
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-3">{item.notes}</p>

                <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Lokasi Penyimpanan:</span>
                    <span className="font-semibold text-slate-800">{item.location}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Jumlah Penggunaan 2026:</span>
                    <span className="font-bold font-mono text-slate-900">
                      {item.totalUsed2026.toLocaleString()} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Baki Stok Semasa:</span>
                    <span className="font-bold font-mono text-teal-700 text-sm">
                      {item.currentStock.toLocaleString()} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Had Minimum (Par Level):</span>
                    <span className="font-mono">{item.minThreshold} {item.unit}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Kemas kini: {new Date(item.updatedAt).toLocaleDateString('ms-MY')}
                </span>
                <button
                  onClick={() => onOpenUpdateModal(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
                >
                  <PackageMinus size={13} />
                  <span>Update Stok</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
