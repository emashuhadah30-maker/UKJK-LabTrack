import React, { useState, useEffect, useMemo } from 'react';
import { dataService } from './services/dataService';
import {
  User,
  Equipment,
  Chemical,
  StandardSampleBatch as BatchType,
  SystemSettings,
  StatusColor,
  EquipmentStatusSummary,
  ChemicalStatusSummary,
  ConsumableItem,
  ConsumableUsageRecord,
  ConsumableUsageInput,
} from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { EquipmentList } from './components/EquipmentList';
import { EquipmentModal } from './components/EquipmentModal';
import { EquipmentDetailModal } from './components/EquipmentDetailModal';
import { ChemicalList } from './components/ChemicalList';
import { ChemicalModal } from './components/ChemicalModal';
import { StockInModal } from './components/StockInModal';
import { ChemicalDetailModal } from './components/ChemicalDetailModal';
import { StandardSampleBatch } from './components/StandardSampleBatch';
import { ConsumablesManagement } from './components/ConsumablesManagement';
import { UpdateConsumableModal } from './components/UpdateConsumableModal';
import { SettingsView } from './components/SettingsView';
import { ReminderModal } from './components/ReminderModal';
import { LoginView } from './components/LoginView';

export default function App() {
  // Initialize services and seed data
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({ warningThresholdDays: 30 });
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [batches, setBatches] = useState<BatchType[]>([]);
  const [consumables, setConsumables] = useState<ConsumableItem[]>([]);
  const [consumableUsages, setConsumableUsages] = useState<ConsumableUsageRecord[]>([]);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [tabFilterParams, setTabFilterParams] = useState<any>(null);

  // Modals state
  const [reminderData, setReminderData] = useState<{
    isOpen: boolean;
    type: 'EQUIPMENT' | 'CHEMICAL';
    item: any;
  }>({ isOpen: false, type: 'EQUIPMENT', item: null });

  // Consumables modal
  const [consumableModal, setConsumableModal] = useState<{
    isOpen: boolean;
    preSelectedId?: string;
  }>({ isOpen: false });

  // Equipment modals
  const [equipmentModal, setEquipmentModal] = useState<{
    isOpen: boolean;
    editingEquipment: Equipment | null;
  }>({ isOpen: false, editingEquipment: null });

  const [detailEquipmentId, setDetailEquipmentId] = useState<string | null>(null);

  // Chemical modals
  const [chemicalModal, setChemicalModal] = useState<{
    isOpen: boolean;
    editingChemical: Chemical | null;
  }>({ isOpen: false, editingChemical: null });

  const [stockInModal, setStockInModal] = useState<{
    isOpen: boolean;
    preSelectedId?: string;
  }>({ isOpen: false });

  const [detailChemicalId, setDetailChemicalId] = useState<string | null>(null);

  // Load and refresh state from dataService
  const refreshData = () => {
    dataService.init();
    setAllUsers(dataService.getUsers());
    setCurrentUser(dataService.getCurrentUser());
    setSettings(dataService.getSettings());
    setEquipments(dataService.getEquipments());
    setChemicals(dataService.getChemicals());
    setBatches(dataService.getStandardSampleBatches());
    setConsumables(dataService.getConsumables());
    setConsumableUsages(dataService.getConsumableUsage());
  };

  useEffect(() => {
    refreshData();
    setIsInitialized(true);
  }, []);

  // Compute live traffic light statuses
  const equipmentSummaries: EquipmentStatusSummary[] = useMemo(() => {
    return equipments.map((eq) =>
      dataService.evaluateEquipmentStatus(eq, settings.warningThresholdDays)
    );
  }, [equipments, settings.warningThresholdDays]);

  const chemicalSummaries: ChemicalStatusSummary[] = useMemo(() => {
    return chemicals.map((chem) =>
      dataService.evaluateChemicalStatus(chem, settings.warningThresholdDays)
    );
  }, [chemicals, settings.warningThresholdDays]);

  // Action required items count for badge
  const actionRequiredCount = useMemo(() => {
    const critEq = equipmentSummaries.filter(
      (s) => s.overallStatus === 'RED' || s.overallStatus === 'YELLOW'
    ).length;
    const critChem = chemicalSummaries.filter(
      (s) => s.status === 'RED' || s.status === 'YELLOW'
    ).length;
    return critEq + critChem;
  }, [equipmentSummaries, chemicalSummaries]);

  // Authentication Handlers (FR-001)
  const handleLogin = (user: User) => {
    dataService.setCurrentUser(user);
    setCurrentUser(user);
    // If regular staff tries to stay on settings tab, switch to dashboard
    if (user.role === 'STAFF' && currentTab === 'settings') {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    dataService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleSwitchUser = (user: User) => {
    dataService.setCurrentUser(user);
    setCurrentUser(user);
    if (user.role === 'STAFF' && currentTab === 'settings') {
      setCurrentTab('dashboard');
    }
  };

  // Tab navigation with optional filters
  const handleNavigateTab = (tab: string, filterParams?: any) => {
    setCurrentTab(tab);
    setTabFilterParams(filterParams || null);
  };

  // Reminder trigger
  const handleOpenReminder = (type: 'EQUIPMENT' | 'CHEMICAL', item: any) => {
    setReminderData({ isOpen: true, type, item });
  };

  // Equipment Handlers
  const handleSaveEquipment = (
    data: Omit<Equipment, 'id' | 'updatedAt'>,
    editingId?: string
  ) => {
    dataService.saveEquipment(data, editingId);
    refreshData();
  };

  const handleDeleteEquipment = (id: string) => {
    dataService.deleteEquipment(id);
    refreshData();
  };

  const handleAddEquipmentLog = (logData: any) => {
    dataService.addEquipmentLog(logData);
    refreshData();
  };

  // Chemical Handlers
  const handleSaveChemical = (
    data: Omit<Chemical, 'id' | 'updatedAt'>,
    editingId?: string
  ) => {
    dataService.saveChemical(data, editingId);
    refreshData();
  };

  const handleDeleteChemical = (id: string) => {
    dataService.deleteChemical(id);
    refreshData();
  };

  const handleSaveStockIn = (params: any) => {
    dataService.recordStockIn(params);
    refreshData();
  };

  // Standard Sample Batch Handler
  const handleSaveBatch = (params: any) => {
    dataService.recordStandardSampleBatch(params);
    refreshData();
  };

  // Settings & User Handlers
  const handleUpdateSettings = (newSettings: SystemSettings) => {
    dataService.updateSettings(newSettings);
    refreshData();
  };

  const handleSaveUser = (userData: any, editingId?: string) => {
    dataService.saveUser(userData, editingId);
    refreshData();
  };

  const handleDeleteUser = (userId: string) => {
    dataService.deleteUser(userId);
    refreshData();
  };

  const handleResetDemoData = () => {
    dataService.clearDummyData();
    refreshData();
  };

  const handleLoadDemoData = () => {
    dataService.loadDemoData();
    refreshData();
  };

  const handleRecordConsumableUsage = (input: ConsumableUsageInput) => {
    dataService.recordConsumableUsage(
      input,
      currentUser || {
        id: 'usr-guest',
        name: 'Staf Makmal',
        email: '',
        role: 'STAFF',
        isActive: true,
        createdAt: '',
      }
    );
    refreshData();
  };

  const handleQuickUpdateConsumable = (consumableId: string, quantityUsed: number, note: string) => {
    dataService.quickUpdateConsumableStock(
      consumableId,
      quantityUsed,
      note,
      currentUser || {
        id: 'usr-guest',
        name: 'Staf Makmal',
        email: '',
        role: 'STAFF',
        isActive: true,
        createdAt: '',
      }
    );
    refreshData();
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-teal-400 font-semibold text-sm">
        Memuatkan UKJK LabTrack...
      </div>
    );
  }

  // If no user is logged in, show Login Screen (FR-001)
  if (!currentUser) {
    return <LoginView users={allUsers} onLogin={handleLogin} />;
  }

  // Selected Equipment Detail
  const selectedEquipment = equipments.find((e) => e.id === detailEquipmentId) || null;
  const selectedEquipmentSummary = selectedEquipment
    ? equipmentSummaries.find((s) => s.equipment.id === selectedEquipment.id) || null
    : null;
  const selectedEquipmentLogs = selectedEquipment
    ? dataService.getEquipmentLogs(selectedEquipment.id)
    : [];

  // Selected Chemical Detail
  const selectedChemical = chemicals.find((c) => c.id === detailChemicalId) || null;
  const selectedChemicalSummary = selectedChemical
    ? chemicalSummaries.find((s) => s.chemical.id === selectedChemical.id) || null
    : null;
  const selectedChemicalTransactions = selectedChemical
    ? dataService.getChemicalTransactions(selectedChemical.id)
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      {/* Desktop Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setTabFilterParams(null);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        actionRequiredCount={actionRequiredCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-6">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setTabFilterParams(null);
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchUser={handleSwitchUser}
          allUsers={allUsers}
          actionRequiredCount={actionRequiredCount}
        />

        {/* Dynamic Screen View */}
        <main className="p-3.5 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              equipmentSummaries={equipmentSummaries}
              chemicalSummaries={chemicalSummaries}
              warningThresholdDays={settings.warningThresholdDays}
              currentUser={currentUser}
              onNavigateTab={handleNavigateTab}
              onOpenReminder={handleOpenReminder}
              onOpenEquipmentDetail={(eqId) => setDetailEquipmentId(eqId)}
              onOpenStockIn={(chemId) => setStockInModal({ isOpen: true, preSelectedId: chemId })}
            />
          )}

          {currentTab === 'equipment' && (
            <EquipmentList
              equipments={equipments}
              summaries={equipmentSummaries}
              currentUser={currentUser}
              onOpenAddModal={() => setEquipmentModal({ isOpen: true, editingEquipment: null })}
              onOpenEditModal={(eq) => setEquipmentModal({ isOpen: true, editingEquipment: eq })}
              onDeleteEquipment={handleDeleteEquipment}
              onOpenDetailModal={(eqId) => setDetailEquipmentId(eqId)}
              onOpenReminder={handleOpenReminder}
              initialFilter={tabFilterParams}
            />
          )}

          {currentTab === 'chemicals' && (
            <ChemicalList
              chemicals={chemicals}
              summaries={chemicalSummaries}
              currentUser={currentUser}
              onOpenAddModal={() => setChemicalModal({ isOpen: true, editingChemical: null })}
              onOpenEditModal={(chem) => setChemicalModal({ isOpen: true, editingChemical: chem })}
              onDeleteChemical={handleDeleteChemical}
              onOpenStockIn={(chemId) => setStockInModal({ isOpen: true, preSelectedId: chemId })}
              onOpenDetailModal={(chemId) => setDetailChemicalId(chemId)}
              onOpenReminder={handleOpenReminder}
              onOpenConsumableModal={() => setConsumableModal({ isOpen: true })}
              initialFilter={tabFilterParams}
            />
          )}

          {currentTab === 'consumables' && (
            <ConsumablesManagement
              consumables={consumables}
              usageRecords={consumableUsages}
              currentUser={currentUser}
              onOpenUpdateModal={(cId) => setConsumableModal({ isOpen: true, preSelectedId: cId })}
              onRefreshData={refreshData}
            />
          )}

          {currentTab === 'standard_samples' && (
            <StandardSampleBatch
              chemicals={chemicals}
              batches={batches}
              currentUser={currentUser}
              onOpenConsumableModal={() => setConsumableModal({ isOpen: true })}
              onSaveBatch={handleSaveBatch}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              users={allUsers}
              currentUser={currentUser}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              onResetDemoData={handleResetDemoData}
              onLoadDemoData={handleLoadDemoData}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Quick Reminder Modal (FR-003) */}
      <ReminderModal
        isOpen={reminderData.isOpen}
        onClose={() => setReminderData({ isOpen: false, type: 'EQUIPMENT', item: null })}
        type={reminderData.type}
        itemSummary={reminderData.item}
        currentUser={currentUser}
      />

      {/* 2. Equipment Master Add/Edit Modal (FR-004) */}
      <EquipmentModal
        isOpen={equipmentModal.isOpen}
        onClose={() => setEquipmentModal({ isOpen: false, editingEquipment: null })}
        onSave={handleSaveEquipment}
        editingEquipment={equipmentModal.editingEquipment}
        currentUser={currentUser}
      />

      {/* 3. Equipment Detail & Log Modal (FR-005) */}
      <EquipmentDetailModal
        isOpen={!!detailEquipmentId}
        onClose={() => setDetailEquipmentId(null)}
        equipment={selectedEquipment}
        summary={selectedEquipmentSummary}
        logs={selectedEquipmentLogs}
        onAddLog={handleAddEquipmentLog}
        currentUser={currentUser}
        onOpenReminder={handleOpenReminder}
      />

      {/* 4. Chemical Master Add/Edit Modal (FR-006) */}
      <ChemicalModal
        isOpen={chemicalModal.isOpen}
        onClose={() => setChemicalModal({ isOpen: false, editingChemical: null })}
        onSave={handleSaveChemical}
        editingChemical={chemicalModal.editingChemical}
        currentUser={currentUser}
      />

      {/* 5. Chemical Stock-In Modal (FR-006) */}
      <StockInModal
        isOpen={stockInModal.isOpen}
        onClose={() => setStockInModal({ isOpen: false })}
        chemicals={chemicals}
        preSelectedChemicalId={stockInModal.preSelectedId}
        onSaveStockIn={handleSaveStockIn}
        currentUser={currentUser}
      />

      {/* 6. Chemical Detail & Transactions Modal */}
      <ChemicalDetailModal
        isOpen={!!detailChemicalId}
        onClose={() => setDetailChemicalId(null)}
        chemical={selectedChemical}
        summary={selectedChemicalSummary}
        transactions={selectedChemicalTransactions}
        currentUser={currentUser}
        onOpenStockIn={(chemId) => setStockInModal({ isOpen: true, preSelectedId: chemId })}
        onOpenReminder={handleOpenReminder}
      />

      {/* 7. Consumables Usage Update Modal */}
      <UpdateConsumableModal
        isOpen={consumableModal.isOpen}
        onClose={() => setConsumableModal({ isOpen: false, preSelectedId: undefined })}
        consumables={consumables}
        currentUser={currentUser}
        onSubmitUsage={handleRecordConsumableUsage}
        onQuickUpdate={handleQuickUpdateConsumable}
        preSelectedConsumableId={consumableModal.preSelectedId}
      />
    </div>
  );
}
