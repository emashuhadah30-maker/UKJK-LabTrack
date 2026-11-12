import {
  User,
  Equipment,
  EquipmentLog,
  Chemical,
  StandardSampleBatch,
  ChemicalTransaction,
  SystemSettings,
  StatusColor,
  StatusEvaluation,
  EquipmentStatusSummary,
  ChemicalStatusSummary,
  ConsumableItem,
  ConsumableUsageRecord,
  ConsumableUsageInput,
} from '../types';
import {
  OFFICIAL_EQUIPMENTS,
  OFFICIAL_EQUIPMENT_LOGS,
  OFFICIAL_CHEMICALS,
  OFFICIAL_CHEMICAL_TRANSACTIONS,
  OFFICIAL_BATCHES,
} from '../data/officialLabData';
import {
  OFFICIAL_CONSUMABLES,
  OFFICIAL_CONSUMABLE_USAGE,
} from '../data/officialConsumables';

// Storage Keys
const USERS_KEY = 'ukjk_users';
const CURRENT_USER_KEY = 'ukjk_current_user';
const EQUIPMENTS_KEY = 'ukjk_equipments';
const LOGS_KEY = 'ukjk_equipment_logs';
const CHEMICALS_KEY = 'ukjk_chemicals';
const BATCHES_KEY = 'ukjk_standard_batches';
const TRANSACTIONS_KEY = 'ukjk_chemical_transactions';
const SETTINGS_KEY = 'ukjk_system_settings';
const CONSUMABLES_KEY = 'ukjk_consumables';
const CONSUMABLE_USAGE_KEY = 'ukjk_consumable_usage';

// Default initial users
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-01',
    name: 'Dr. Halimah Nasir',
    email: 'halimahn@lgm.gov.my',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'usr-staff-01',
    name: 'Ahmad Razali',
    email: 'ahmad.razali@ukjk.gov.my',
    role: 'STAFF',
    isActive: true,
    createdAt: '2026-02-01T08:30:00.000Z',
  },
  {
    id: 'usr-staff-02',
    name: 'Siti Noraini',
    email: 'noraini@ukjk.gov.my',
    role: 'STAFF',
    isActive: true,
    createdAt: '2026-02-15T09:00:00.000Z',
  },
];

const DEFAULT_SETTINGS: SystemSettings = {
  warningThresholdDays: 30,
};

// Seed Equipments (2024, 2025, 2026 perolehan)
const DEFAULT_EQUIPMENTS: Equipment[] = [
  {
    id: 'eq-001',
    assetCode: 'UKJK-EQ-001',
    name: 'Analytical Balance (Bilik Timbangan)',
    brandModel: 'Mettler Toledo XPR205 (0.01 mg)',
    serialNumber: 'MT-XPR-88219',
    location: 'Bilik Timbangan Kering (Makmal 1)',
    acquisitionYear: 2025,
    operationalStatus: 'ACTIVE',
    requiresCalibration: true,
    calibrationFreqMonths: 12,
    lastCalibrationDate: '2025-11-24',
    nextCalibrationDate: '2026-11-24', // 12 days remaining -> YELLOW!
    requiresVerification: true,
    verificationFreqMonths: 1,
    lastVerificationDate: '2026-10-15',
    nextVerificationDate: '2026-11-15', // 3 days remaining -> YELLOW!
    createdBy: 'Dr. Halimah Nasir',
    updatedAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'eq-002',
    assetCode: 'UKJK-EQ-002',
    name: 'Atomic Absorption Spectrophotometer (AAS)',
    brandModel: 'PerkinElmer PinAAcle 900T',
    serialNumber: 'PE-AAS-44102',
    location: 'Makmal Instrumen Logam Berat',
    acquisitionYear: 2024,
    operationalStatus: 'ACTIVE',
    requiresCalibration: true,
    calibrationFreqMonths: 12,
    lastCalibrationDate: '2025-11-05',
    nextCalibrationDate: '2026-11-05', // 7 days overdue -> RED!
    requiresVerification: true,
    verificationFreqMonths: 3,
    lastVerificationDate: '2026-08-20',
    nextVerificationDate: '2026-11-20', // 8 days remaining -> YELLOW
    createdBy: 'Dr. Halimah Nasir',
    updatedAt: '2026-08-20T11:30:00.000Z',
  },
  {
    id: 'eq-003',
    assetCode: 'UKJK-EQ-003',
    name: 'Benchtop pH / Ion Meter',
    brandModel: 'Hanna Instruments HI5221-02',
    serialNumber: 'HI-77621-MY',
    location: 'Makmal Basah & Titrasi',
    acquisitionYear: 2025,
    operationalStatus: 'ACTIVE',
    requiresCalibration: true,
    calibrationFreqMonths: 12,
    lastCalibrationDate: '2026-03-10',
    nextCalibrationDate: '2027-03-10', // Safe -> GREEN
    requiresVerification: true,
    verificationFreqMonths: 1,
    lastVerificationDate: '2026-10-25',
    nextVerificationDate: '2026-11-25', // 13 days remaining -> YELLOW
    createdBy: 'Ahmad Razali',
    updatedAt: '2026-10-25T14:15:00.000Z',
  },
  {
    id: 'eq-004',
    assetCode: 'UKJK-EQ-004',
    name: 'UV-Vis Spectrophotometer Double Beam',
    brandModel: 'Shimadzu UV-1900i',
    serialNumber: 'SHIM-UV-2026-90',
    location: 'Makmal Spektroskopi Molekul',
    acquisitionYear: 2026, // Peralatan Tambahan Baharu 2026
    operationalStatus: 'ACTIVE',
    requiresCalibration: true,
    calibrationFreqMonths: 12,
    lastCalibrationDate: '2026-08-15',
    nextCalibrationDate: '2027-08-15', // Safe -> GREEN
    requiresVerification: true,
    verificationFreqMonths: 6,
    lastVerificationDate: '2026-08-15',
    nextVerificationDate: '2027-02-15', // Safe -> GREEN
    createdBy: 'Dr. Halimah Nasir',
    updatedAt: '2026-08-15T09:00:00.000Z',
  },
  {
    id: 'eq-005',
    assetCode: 'UKJK-EQ-005',
    name: 'Ultrapure Water Purification System (Milli-Q)',
    brandModel: 'Merck Millipore Direct-Q 3 UV',
    serialNumber: 'MM-DQ-55201',
    location: 'Makmal Basah & Penyediaan Reagen',
    acquisitionYear: 2026, // Peralatan Tambahan Baharu 2026
    operationalStatus: 'ACTIVE',
    requiresCalibration: true,
    calibrationFreqMonths: 6,
    lastCalibrationDate: '2026-05-01',
    nextCalibrationDate: '2026-11-01', // 11 days overdue -> RED!
    requiresVerification: true,
    verificationFreqMonths: 1,
    lastVerificationDate: '2026-10-10',
    nextVerificationDate: '2026-11-10', // 2 days overdue -> RED!
    createdBy: 'Dr. Halimah Nasir',
    updatedAt: '2026-10-10T08:30:00.000Z',
  },
  {
    id: 'eq-006',
    assetCode: 'UKJK-EQ-006',
    name: 'Ductless Fume Hood Kanan',
    brandModel: 'Esco Frontier Acela (EFA-4UD)',
    serialNumber: 'ESCO-FA-3301',
    location: 'Makmal Sintesis & Pengekstrakan',
    acquisitionYear: 2024,
    operationalStatus: 'ACTIVE',
    requiresCalibration: false,
    calibrationFreqMonths: 0,
    lastCalibrationDate: null,
    nextCalibrationDate: null,
    requiresVerification: true,
    verificationFreqMonths: 12,
    lastVerificationDate: '2026-02-15',
    nextVerificationDate: '2027-02-15', // Safe -> GREEN
    createdBy: 'Dr. Halimah Nasir',
    updatedAt: '2026-02-15T11:00:00.000Z',
  },
  {
    id: 'eq-007',
    assetCode: 'UKJK-EQ-007',
    name: 'ICP-OES Optical Emission Spectrometer',
    brandModel: 'Agilent 5110 Synchronous Vertical Dual View',
    serialNumber: 'AG-5110-2026-01',
    location: 'Makmal Analisis Elemen Surih',
    acquisitionYear: 2026, // Peralatan Tambahan Baharu 2026
    operationalStatus: 'ACTIVE',
    requiresCalibration: true,
    calibrationFreqMonths: 12,
    lastCalibrationDate: '2026-10-10',
    nextCalibrationDate: '2027-10-10', // Safe -> GREEN
    requiresVerification: true,
    verificationFreqMonths: 1,
    lastVerificationDate: '2026-10-14',
    nextVerificationDate: '2026-11-14', // 2 days left -> YELLOW!
    createdBy: 'Dr. Halimah Nasir',
    updatedAt: '2026-10-14T16:00:00.000Z',
  },
  {
    id: 'eq-008',
    assetCode: 'UKJK-EQ-008',
    name: 'Centrifuge Berkelajuan Tinggi Sejuk Beku',
    brandModel: 'Eppendorf 5810 R Refrigerated',
    serialNumber: 'EPP-5810R-772',
    location: 'Bilik Pemprosesan Sampel',
    acquisitionYear: 2025,
    operationalStatus: 'ACTIVE',
    requiresCalibration: true,
    calibrationFreqMonths: 12,
    lastCalibrationDate: '2026-05-15',
    nextCalibrationDate: '2027-05-15', // Safe -> GREEN
    requiresVerification: true,
    verificationFreqMonths: 6,
    lastVerificationDate: '2026-05-15',
    nextVerificationDate: '2026-11-15', // 3 days left -> YELLOW!
    createdBy: 'Ahmad Razali',
    updatedAt: '2026-05-15T13:00:00.000Z',
  },
];

// Seed Chemicals
const DEFAULT_CHEMICALS: Chemical[] = [
  {
    id: 'chem-001',
    casOrCode: '7697-37-2',
    name: 'Nitric Acid 65% (HNO₃) AR Grade',
    formulaOrGrade: 'HNO₃ / Analytical Reagent (AR)',
    location: 'Bilik Asid Makmal 1 / Kabinet Tahan Karat A1',
    unit: 'ml',
    currentStock: 250, // min is 500 => RED!
    minStockThreshold: 500,
    expiryDate: '2027-06-30',
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'chem-002',
    casOrCode: '7439-92-1',
    name: 'Lead (Pb) Standard Solution 1000 mg/L (NIST Traceable)',
    formulaOrGrade: 'Pb in 2% HNO₃ / TraceCERT',
    location: 'Peti Sejuk Piawai Analitikal (4°C)',
    unit: 'ml',
    currentStock: 45, // min is 50 => RED! And expired 2026-11-10 => RED!
    minStockThreshold: 50,
    expiryDate: '2026-11-10', // Expired 2 days ago!
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'chem-003',
    casOrCode: '7732-18-5',
    name: 'Deionized Water Ultrapure (Type I / Milli-Q)',
    formulaOrGrade: 'H₂O / Resistivity 18.2 MΩ·cm',
    location: 'Stesen Bekalan Air Suling Makmal Basah',
    unit: 'L',
    currentStock: 11, // min is 10. 11 <= 10 * 1.2 (12) => YELLOW!
    minStockThreshold: 10,
    expiryDate: '2027-12-31',
    updatedAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'chem-004',
    casOrCode: '7647-01-0',
    name: 'Hydrochloric Acid 37% (HCl) ACS Grade',
    formulaOrGrade: 'HCl / ACS Reagent',
    location: 'Bilik Asid Makmal 1 / Kabinet A2',
    unit: 'ml',
    currentStock: 2500, // Safe stock
    minStockThreshold: 1000,
    expiryDate: '2026-11-28', // 16 days remaining <= 30 => YELLOW!
    updatedAt: '2026-10-20T11:00:00.000Z',
  },
  {
    id: 'chem-005',
    casOrCode: '7447-40-7',
    name: 'Potassium Chloride (KCl) 99.5% Powder',
    formulaOrGrade: 'KCl / P.A. Grade',
    location: 'Almari Reagen Garam / Rak B3',
    unit: 'g',
    currentStock: 800,
    minStockThreshold: 200,
    expiryDate: '2028-04-15', // Safe -> GREEN
    updatedAt: '2026-09-12T14:00:00.000Z',
  },
  {
    id: 'chem-006',
    casOrCode: '1310-73-2',
    name: 'Sodium Hydroxide Pellets (NaOH) Pure',
    formulaOrGrade: 'NaOH / Pellets Gred Makmal',
    location: 'Almari Reagen Bes / Rak C1',
    unit: 'g',
    currentStock: 1500,
    minStockThreshold: 300,
    expiryDate: '2027-11-20', // Safe -> GREEN
    updatedAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'chem-007',
    casOrCode: '67-56-1',
    name: 'Methanol HPLC Grade 99.9%',
    formulaOrGrade: 'CH₃OH / For HPLC & Spectroscopy',
    location: 'Kabinet Bahan Mudah Terbakar (Flammable Yellow)',
    unit: 'L',
    currentStock: 8,
    minStockThreshold: 2,
    expiryDate: '2027-09-15', // Safe -> GREEN
    updatedAt: '2026-07-01T15:30:00.000Z',
  },
];

// Seed Equipment Logs
const DEFAULT_LOGS: EquipmentLog[] = [
  {
    id: 'log-001',
    equipmentId: 'eq-001',
    type: 'CALIBRATION',
    performedDate: '2025-11-24',
    nextDueDate: '2026-11-24',
    providerOrResult: 'SIRIM Standards Technology Sdn Bhd',
    certificateNumber: 'SST-CAL-2025-8812',
    certificateUrl: 'https://drive.google.com/file/d/demo-sirim-cert-eq001/view',
    notes: 'Kalibrasi tahunan memenuhi piawaian MS ISO/IEC 17025.',
    recordedByUserId: 'usr-admin-01',
    recordedByName: 'Dr. Halimah Nasir',
    createdAt: '2025-11-24T14:00:00.000Z',
  },
  {
    id: 'log-002',
    equipmentId: 'eq-001',
    type: 'VERIFICATION',
    performedDate: '2026-10-15',
    nextDueDate: '2026-11-15',
    providerOrResult: 'PASS',
    certificateNumber: 'VER-UKJK-2026-10-01',
    notes: 'Pemeriksaan harian menggunakan anak batu piawai Kelas E2 (100g, 50g, 10g). Ralat di dalam toleransi.',
    recordedByUserId: 'usr-staff-01',
    recordedByName: 'Ahmad Razali',
    createdAt: '2026-10-15T10:10:00.000Z',
  },
  {
    id: 'log-003',
    equipmentId: 'eq-004',
    type: 'CALIBRATION',
    performedDate: '2026-08-15',
    nextDueDate: '2027-08-15',
    providerOrResult: 'Shimadzu Malaysia Sdn Bhd',
    certificateNumber: 'SHIM-CAL-2026-088',
    certificateUrl: 'https://sharepoint.ukjk.gov.my/cert/eq-004-2026.pdf',
    notes: 'Pemasangan baharu & pentauliahan (IQ/OQ/PQ) lulus sepenuhnya.',
    recordedByUserId: 'usr-admin-01',
    recordedByName: 'Dr. Halimah Nasir',
    createdAt: '2026-08-15T09:30:00.000Z',
  },
];

// Seed Standard Sample Batches
const DEFAULT_BATCHES: StandardSampleBatch[] = [
  {
    id: 'batch-001',
    sampleName: 'Piawai Logam Berat AAS 5.0 ppm (Pb-Matrix)',
    batchCode: 'STD-AAS-2026-11-01',
    preparedDate: '2026-11-01',
    notes: 'Penyediaan batch piawai untuk analisis rutin sampel lateks getah mentah.',
    preparedByUserId: 'usr-staff-01',
    preparedByName: 'Ahmad Razali',
    createdAt: '2026-11-01T11:00:00.000Z',
    items: [
      {
        chemicalId: 'chem-001',
        chemicalName: 'Nitric Acid 65% (HNO₃) AR Grade',
        quantity: 50,
        unit: 'ml',
      },
      {
        chemicalId: 'chem-002',
        chemicalName: 'Lead (Pb) Standard Solution 1000 mg/L (NIST Traceable)',
        quantity: 5,
        unit: 'ml',
      },
      {
        chemicalId: 'chem-003',
        chemicalName: 'Deionized Water Ultrapure (Type I / Milli-Q)',
        quantity: 1,
        unit: 'L',
      },
    ],
  },
];

// Seed Chemical Transactions
const DEFAULT_TRANSACTIONS: ChemicalTransaction[] = [
  {
    id: 'tx-001',
    chemicalId: 'chem-001',
    chemicalName: 'Nitric Acid 65% (HNO₃) AR Grade',
    transactionType: 'STOCK_IN',
    quantity: 1000,
    unit: 'ml',
    balanceAfter: 300,
    lotNumber: 'LOT-MERCK-2026-09A',
    referenceNote: 'Penerimaan stok bulanan pembekal Makmal Jaya Sdn Bhd',
    recordedByUserId: 'usr-staff-01',
    recordedByName: 'Ahmad Razali',
    createdAt: '2026-09-15T09:00:00.000Z',
  },
  {
    id: 'tx-002',
    chemicalId: 'chem-001',
    chemicalName: 'Nitric Acid 65% (HNO₃) AR Grade',
    transactionType: 'STOCK_OUT',
    quantity: 50,
    unit: 'ml',
    balanceAfter: 250,
    standardSampleBatchId: 'batch-001',
    referenceNote: 'Penghasilan Standard Sample: Piawai Logam Berat AAS 5.0 ppm (Pb-Matrix) [STD-AAS-2026-11-01]',
    recordedByUserId: 'usr-staff-01',
    recordedByName: 'Ahmad Razali',
    createdAt: '2026-11-01T11:00:00.000Z',
  },
  {
    id: 'tx-003',
    chemicalId: 'chem-002',
    chemicalName: 'Lead (Pb) Standard Solution 1000 mg/L (NIST Traceable)',
    transactionType: 'STOCK_OUT',
    quantity: 5,
    unit: 'ml',
    balanceAfter: 45,
    standardSampleBatchId: 'batch-001',
    referenceNote: 'Penghasilan Standard Sample: Piawai Logam Berat AAS 5.0 ppm (Pb-Matrix) [STD-AAS-2026-11-01]',
    recordedByUserId: 'usr-staff-01',
    recordedByName: 'Ahmad Razali',
    createdAt: '2026-11-01T11:00:00.000Z',
  },
  {
    id: 'tx-004',
    chemicalId: 'chem-003',
    chemicalName: 'Deionized Water Ultrapure (Type I / Milli-Q)',
    transactionType: 'STOCK_OUT',
    quantity: 1,
    unit: 'L',
    balanceAfter: 11,
    standardSampleBatchId: 'batch-001',
    referenceNote: 'Penghasilan Standard Sample: Piawai Logam Berat AAS 5.0 ppm (Pb-Matrix) [STD-AAS-2026-11-01]',
    recordedByUserId: 'usr-staff-01',
    recordedByName: 'Ahmad Razali',
    createdAt: '2026-11-01T11:00:00.000Z',
  },
];

// Helper to safely access localStorage
class DataService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to localStorage key ${key}:`, e);
      throw new Error('Gagal menyimpan ke storan pelayar. Had storan mungkin telah dicapai.');
    }
  }

  // System Initialization & Seeding (Clean Slate: Dummy data cleared)
  public init(): void {
    if (!localStorage.getItem(USERS_KEY)) {
      this.setStorage(USERS_KEY, DEFAULT_USERS);
    }
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      // Default logged in user: Dr. Halimah Nasir (Admin)
      this.setStorage(CURRENT_USER_KEY, DEFAULT_USERS[0]);
    }
    if (!localStorage.getItem(SETTINGS_KEY)) {
      this.setStorage(SETTINGS_KEY, DEFAULT_SETTINGS);
    }

    // Auto-load Official UKJK Equipment and Verification data from official PDF schedules
    const OFFICIAL_LOADED_FLAG = 'ukjk_official_pdf_data_v1';
    if (!localStorage.getItem(OFFICIAL_LOADED_FLAG)) {
      this.loadOfficialData();
      localStorage.setItem(OFFICIAL_LOADED_FLAG, 'true');
    } else {
      if (!localStorage.getItem(EQUIPMENTS_KEY)) {
        this.setStorage(EQUIPMENTS_KEY, OFFICIAL_EQUIPMENTS);
      }
      if (!localStorage.getItem(LOGS_KEY)) {
        this.setStorage(LOGS_KEY, OFFICIAL_EQUIPMENT_LOGS);
      }
    }

    // Auto-load Official Standard Sample Batches from PDF
    const BATCHES_LOADED_FLAG = 'ukjk_official_batches_v1';
    if (!localStorage.getItem(BATCHES_LOADED_FLAG)) {
      this.setStorage(BATCHES_KEY, OFFICIAL_BATCHES);
      localStorage.setItem(BATCHES_LOADED_FLAG, 'true');
    } else {
      if (!localStorage.getItem(BATCHES_KEY)) {
        this.setStorage(BATCHES_KEY, OFFICIAL_BATCHES);
      }
    }

    // Auto-load Official Chemicals & Consumables from PDF
    const CHEMICALS_LOADED_FLAG = 'ukjk_official_chemicals_v1';
    if (!localStorage.getItem(CHEMICALS_LOADED_FLAG)) {
      this.setStorage(CHEMICALS_KEY, OFFICIAL_CHEMICALS);
      this.setStorage(TRANSACTIONS_KEY, OFFICIAL_CHEMICAL_TRANSACTIONS);
      localStorage.setItem(CHEMICALS_LOADED_FLAG, 'true');
    } else {
      if (!localStorage.getItem(CHEMICALS_KEY)) {
        this.setStorage(CHEMICALS_KEY, OFFICIAL_CHEMICALS);
      }
      if (!localStorage.getItem(TRANSACTIONS_KEY)) {
        this.setStorage(TRANSACTIONS_KEY, OFFICIAL_CHEMICAL_TRANSACTIONS);
      }
    }

    // Auto-load Official Consumables & 2026 Usage Records from PDF
    const CONSUMABLES_LOADED_FLAG = 'ukjk_official_consumables_v1';
    if (!localStorage.getItem(CONSUMABLES_LOADED_FLAG)) {
      this.setStorage(CONSUMABLES_KEY, OFFICIAL_CONSUMABLES);
      this.setStorage(CONSUMABLE_USAGE_KEY, OFFICIAL_CONSUMABLE_USAGE);
      localStorage.setItem(CONSUMABLES_LOADED_FLAG, 'true');
    } else {
      if (!localStorage.getItem(CONSUMABLES_KEY)) {
        this.setStorage(CONSUMABLES_KEY, OFFICIAL_CONSUMABLES);
      }
      if (!localStorage.getItem(CONSUMABLE_USAGE_KEY)) {
        this.setStorage(CONSUMABLE_USAGE_KEY, OFFICIAL_CONSUMABLE_USAGE);
      }
    }
  }

  // Load official laboratory equipment, chemicals, verification schedules & standard samples from PDF
  public loadOfficialData(): void {
    this.setStorage(EQUIPMENTS_KEY, OFFICIAL_EQUIPMENTS);
    this.setStorage(LOGS_KEY, OFFICIAL_EQUIPMENT_LOGS);
    this.setStorage(CHEMICALS_KEY, OFFICIAL_CHEMICALS);
    this.setStorage(TRANSACTIONS_KEY, OFFICIAL_CHEMICAL_TRANSACTIONS);
    this.setStorage(BATCHES_KEY, OFFICIAL_BATCHES);
    this.setStorage(CONSUMABLES_KEY, OFFICIAL_CONSUMABLES);
    this.setStorage(CONSUMABLE_USAGE_KEY, OFFICIAL_CONSUMABLE_USAGE);
  }

  // Clear all records leaving database fresh
  public clearDummyData(): void {
    this.setStorage(EQUIPMENTS_KEY, []);
    this.setStorage(LOGS_KEY, []);
    this.setStorage(CHEMICALS_KEY, []);
    this.setStorage(BATCHES_KEY, []);
    this.setStorage(TRANSACTIONS_KEY, []);
    this.setStorage(CONSUMABLES_KEY, []);
    this.setStorage(CONSUMABLE_USAGE_KEY, []);
  }

  // Load sample demo data if explicitly requested
  public loadDemoData(): void {
    this.loadOfficialData();
  }

  public resetDemoData(): void {
    this.loadOfficialData();
  }

  // User & Authentication
  public getUsers(): User[] {
    return this.getStorage<User[]>(USERS_KEY, DEFAULT_USERS);
  }

  public getCurrentUser(): User | null {
    return this.getStorage<User | null>(CURRENT_USER_KEY, null);
  }

  public setCurrentUser(user: User | null): void {
    this.setStorage(CURRENT_USER_KEY, user);
  }

  public saveUser(userData: Omit<User, 'id' | 'createdAt'>, editingId?: string): User {
    const users = this.getUsers();
    if (editingId) {
      const idx = users.findIndex((u) => u.id === editingId);
      if (idx === -1) throw new Error('Pengguna tidak dijumpai.');
      users[idx] = {
        ...users[idx],
        ...userData,
      };
      this.setStorage(USERS_KEY, users);
      // If updating current user, sync current session
      const currentUser = this.getCurrentUser();
      if (currentUser?.id === editingId) {
        this.setCurrentUser(users[idx]);
      }
      return users[idx];
    } else {
      // Check email uniqueness
      if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('E-mel pengguna ini telah berdaftar.');
      }
      const newUser: User = {
        id: `usr-${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      this.setStorage(USERS_KEY, users);
      return newUser;
    }
  }

  public deleteUser(userId: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      throw new Error('Anda tidak boleh memadam akaun yang sedang anda gunakan untuk log masuk.');
    }
    const users = this.getUsers().filter((u) => u.id !== userId);
    this.setStorage(USERS_KEY, users);
  }

  // System Settings
  public getSettings(): SystemSettings {
    return this.getStorage<SystemSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  }

  public updateSettings(settings: SystemSettings): void {
    if (settings.warningThresholdDays < 1 || settings.warningThresholdDays > 180) {
      throw new Error('Bilangan hari ambang amaran mestilah antara 1 hingga 180 hari.');
    }
    this.setStorage(SETTINGS_KEY, settings);
  }

  // Equipments
  public getEquipments(): Equipment[] {
    return this.getStorage<Equipment[]>(EQUIPMENTS_KEY, DEFAULT_EQUIPMENTS);
  }

  public getEquipmentById(id: string): Equipment | undefined {
    return this.getEquipments().find((eq) => eq.id === id);
  }

  public saveEquipment(equipmentData: Omit<Equipment, 'id' | 'updatedAt'>, editingId?: string): Equipment {
    const equipments = this.getEquipments();
    const cleanAssetCode = equipmentData.assetCode.trim();

    if (editingId) {
      const existing = equipments.find((eq) => eq.id !== editingId && eq.assetCode.toLowerCase() === cleanAssetCode.toLowerCase());
      if (existing) {
        throw new Error(`Kod/ID Aset "${cleanAssetCode}" telah digunakan oleh peralatan lain.`);
      }
      const idx = equipments.findIndex((eq) => eq.id === editingId);
      if (idx === -1) throw new Error('Peralatan tidak dijumpai.');
      const updated: Equipment = {
        ...equipments[idx],
        ...equipmentData,
        assetCode: cleanAssetCode,
        updatedAt: new Date().toISOString(),
      };
      equipments[idx] = updated;
      this.setStorage(EQUIPMENTS_KEY, equipments);
      return updated;
    } else {
      const existing = equipments.find((eq) => eq.assetCode.toLowerCase() === cleanAssetCode.toLowerCase());
      if (existing) {
        throw new Error(`Kod/ID Aset "${cleanAssetCode}" sudah wujud dalam pangkalan data.`);
      }
      const newEq: Equipment = {
        id: `eq-${Date.now()}`,
        ...equipmentData,
        assetCode: cleanAssetCode,
        updatedAt: new Date().toISOString(),
      };
      equipments.unshift(newEq);
      this.setStorage(EQUIPMENTS_KEY, equipments);
      return newEq;
    }
  }

  public deleteEquipment(id: string): void {
    const equipments = this.getEquipments().filter((eq) => eq.id !== id);
    this.setStorage(EQUIPMENTS_KEY, equipments);
  }

  // Equipment Logs (Calibration & Verification)
  public getEquipmentLogs(equipmentId?: string): EquipmentLog[] {
    const logs = this.getStorage<EquipmentLog[]>(LOGS_KEY, DEFAULT_LOGS);
    if (equipmentId) {
      return logs.filter((l) => l.equipmentId === equipmentId).sort((a, b) => new Date(b.performedDate).getTime() - new Date(a.performedDate).getTime());
    }
    return logs.sort((a, b) => new Date(b.performedDate).getTime() - new Date(a.performedDate).getTime());
  }

  public addEquipmentLog(
    logData: Omit<EquipmentLog, 'id' | 'createdAt'>
  ): EquipmentLog {
    const logs = this.getEquipmentLogs();
    const newLog: EquipmentLog = {
      id: `log-${Date.now()}`,
      ...logData,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    this.setStorage(LOGS_KEY, logs);

    // Update equipment's nextDueDate and lastDate
    const equipments = this.getEquipments();
    const eqIdx = equipments.findIndex((eq) => eq.id === logData.equipmentId);
    if (eqIdx !== -1) {
      const eq = equipments[eqIdx];
      if (logData.type === 'CALIBRATION') {
        eq.lastCalibrationDate = logData.performedDate;
        eq.nextCalibrationDate = logData.nextDueDate;
      } else if (logData.type === 'VERIFICATION') {
        eq.lastVerificationDate = logData.performedDate;
        eq.nextVerificationDate = logData.nextDueDate;
      }
      eq.updatedAt = new Date().toISOString();
      equipments[eqIdx] = eq;
      this.setStorage(EQUIPMENTS_KEY, equipments);
    }

    return newLog;
  }

  // Chemicals
  public getChemicals(): Chemical[] {
    return this.getStorage<Chemical[]>(CHEMICALS_KEY, DEFAULT_CHEMICALS);
  }

  public getChemicalById(id: string): Chemical | undefined {
    return this.getChemicals().find((c) => c.id === id);
  }

  public saveChemical(chemData: Omit<Chemical, 'id' | 'updatedAt'>, editingId?: string): Chemical {
    const chemicals = this.getChemicals();
    const cleanCas = chemData.casOrCode.trim();

    if (editingId) {
      const duplicate = chemicals.find((c) => c.id !== editingId && c.casOrCode.toLowerCase() === cleanCas.toLowerCase());
      if (duplicate) {
        throw new Error(`No. CAS / Kod Dalaman "${cleanCas}" telah digunakan oleh bahan kimia lain.`);
      }
      const idx = chemicals.findIndex((c) => c.id === editingId);
      if (idx === -1) throw new Error('Bahan kimia tidak dijumpai.');
      const updated: Chemical = {
        ...chemicals[idx],
        ...chemData,
        casOrCode: cleanCas,
        updatedAt: new Date().toISOString(),
      };
      chemicals[idx] = updated;
      this.setStorage(CHEMICALS_KEY, chemicals);
      return updated;
    } else {
      const duplicate = chemicals.find((c) => c.casOrCode.toLowerCase() === cleanCas.toLowerCase());
      if (duplicate) {
        throw new Error(`No. CAS / Kod Dalaman "${cleanCas}" sudah wujud dalam senarai.`);
      }
      const newChem: Chemical = {
        id: `chem-${Date.now()}`,
        ...chemData,
        casOrCode: cleanCas,
        updatedAt: new Date().toISOString(),
      };
      chemicals.unshift(newChem);
      this.setStorage(CHEMICALS_KEY, chemicals);
      return newChem;
    }
  }

  public deleteChemical(id: string): void {
    const chemicals = this.getChemicals().filter((c) => c.id !== id);
    this.setStorage(CHEMICALS_KEY, chemicals);
  }

  // Stock-In (FR-006)
  public recordStockIn(params: {
    chemicalId: string;
    quantity: number;
    lotNumber: string;
    newExpiryDate: string;
    receiveDate: string;
    user: User;
  }): Chemical {
    if (params.quantity <= 0) {
      throw new Error('Kuantiti stok masuk mestilah lebih besar daripada 0.');
    }
    const chemicals = this.getChemicals();
    const idx = chemicals.findIndex((c) => c.id === params.chemicalId);
    if (idx === -1) throw new Error('Bahan kimia tidak dijumpai.');

    const targetChem = chemicals[idx];
    const newStock = Number((targetChem.currentStock + params.quantity).toFixed(3));
    
    // Update chemical
    targetChem.currentStock = newStock;
    if (params.newExpiryDate) {
      targetChem.expiryDate = params.newExpiryDate;
    }
    targetChem.updatedAt = new Date().toISOString();
    chemicals[idx] = targetChem;
    this.setStorage(CHEMICALS_KEY, chemicals);

    // Record chemical transaction
    const transactions = this.getChemicalTransactions();
    const newTx: ChemicalTransaction = {
      id: `tx-${Date.now()}`,
      chemicalId: targetChem.id,
      chemicalName: targetChem.name,
      transactionType: 'STOCK_IN',
      quantity: params.quantity,
      unit: targetChem.unit,
      balanceAfter: newStock,
      lotNumber: params.lotNumber,
      referenceNote: `Stok Masuk (Stock-In) - Lot: ${params.lotNumber}, Diterima: ${params.receiveDate}`,
      recordedByUserId: params.user.id,
      recordedByName: params.user.name,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTx);
    this.setStorage(TRANSACTIONS_KEY, transactions);

    return targetChem;
  }

  // Standard Sample Batch & Atomic Stock-Out (FR-007, BR-003, BR-004)
  public getStandardSampleBatches(): StandardSampleBatch[] {
    const batches = this.getStorage<StandardSampleBatch[]>(BATCHES_KEY, DEFAULT_BATCHES);
    return batches.sort((a, b) => new Date(b.preparedDate).getTime() - new Date(a.preparedDate).getTime());
  }

  public getChemicalTransactions(chemicalId?: string): ChemicalTransaction[] {
    const txs = this.getStorage<ChemicalTransaction[]>(TRANSACTIONS_KEY, DEFAULT_TRANSACTIONS);
    if (chemicalId) {
      return txs.filter((t) => t.chemicalId === chemicalId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public recordStandardSampleBatch(params: {
    sampleName: string;
    batchCode: string;
    preparedDate: string;
    notes?: string;
    items: Array<{
      chemicalId: string;
      quantity: number;
    }>;
    user: User;
  }): StandardSampleBatch {
    if (!params.sampleName.trim()) throw new Error('Nama / Kod Standard Sample diperlukan.');
    if (!params.batchCode.trim()) throw new Error('No. Batch / Rujukan Sampel diperlukan.');
    if (!params.items || params.items.length === 0) {
      throw new Error('Sila masukkan sekurang-kurangnya 1 bahan kimia yang digunakan.');
    }

    // BR-004: Check duplicate chemicals in the form
    const chemIds = params.items.map((i) => i.chemicalId);
    const uniqueIds = new Set(chemIds);
    if (uniqueIds.size !== chemIds.length) {
      throw new Error('Bahan kimia tidak boleh dipilih berulang kali dalam satu borang kelompok.');
    }

    const chemicals = this.getChemicals();

    // BR-003: Critical Atomic Validation - check every chemical has sufficient stock
    for (const item of params.items) {
      if (item.quantity <= 0) {
        throw new Error('Kuantiti digunakan bagi setiap bahan kimia mestilah melebihi 0.');
      }
      const chem = chemicals.find((c) => c.id === item.chemicalId);
      if (!chem) {
        throw new Error(`Bahan kimia dengan ID "${item.chemicalId}" tidak ditemui.`);
      }
      if (item.quantity > chem.currentStock) {
        throw new Error(
          `Bahan kimia "${chem.name}" tidak mempunyai stok mencukupi! Kuantiti diperlukan: ${item.quantity} ${chem.unit}, baki stok semasa: ${chem.currentStock} ${chem.unit}. Keseluruhan transaksi dibatalkan (tiada stok ditolak).`
        );
      }
    }

    // Now execute atomic deduction
    const batchId = `batch-${Date.now()}`;
    const detailedItems: StandardSampleBatch['items'] = [];
    const transactions = this.getChemicalTransactions();

    for (const item of params.items) {
      const chemIdx = chemicals.findIndex((c) => c.id === item.chemicalId);
      const chem = chemicals[chemIdx];
      const newStock = Number((chem.currentStock - item.quantity).toFixed(3));

      chem.currentStock = newStock;
      chem.updatedAt = new Date().toISOString();
      chemicals[chemIdx] = chem;

      detailedItems.push({
        chemicalId: chem.id,
        chemicalName: chem.name,
        quantity: item.quantity,
        unit: chem.unit,
      });

      // Record transaction
      const newTx: ChemicalTransaction = {
        id: `tx-${Date.now()}-${chem.id}`,
        chemicalId: chem.id,
        chemicalName: chem.name,
        transactionType: 'STOCK_OUT',
        quantity: item.quantity,
        unit: chem.unit,
        balanceAfter: newStock,
        standardSampleBatchId: batchId,
        referenceNote: `Penghasilan Standard Sample: ${params.sampleName} [${params.batchCode}]`,
        recordedByUserId: params.user.id,
        recordedByName: params.user.name,
        createdAt: new Date().toISOString(),
      };
      transactions.unshift(newTx);
    }

    // Save updated chemicals & transactions
    this.setStorage(CHEMICALS_KEY, chemicals);
    this.setStorage(TRANSACTIONS_KEY, transactions);

    // Save Batch
    const newBatch: StandardSampleBatch = {
      id: batchId,
      sampleName: params.sampleName.trim(),
      batchCode: params.batchCode.trim(),
      preparedDate: params.preparedDate,
      notes: params.notes?.trim() || null,
      preparedByUserId: params.user.id,
      preparedByName: params.user.name,
      createdAt: new Date().toISOString(),
      items: detailedItems,
    };

    const batches = this.getStandardSampleBatches();
    batches.unshift(newBatch);
    this.setStorage(BATCHES_KEY, batches);

    return newBatch;
  }

  // ================= Consumables & Stock Usage Methods =================
  public getConsumables(): ConsumableItem[] {
    return this.getStorage<ConsumableItem[]>(CONSUMABLES_KEY, OFFICIAL_CONSUMABLES);
  }

  public getConsumableUsage(): ConsumableUsageRecord[] {
    return this.getStorage<ConsumableUsageRecord[]>(CONSUMABLE_USAGE_KEY, OFFICIAL_CONSUMABLE_USAGE);
  }

  public recordConsumableUsage(input: ConsumableUsageInput, user: User): ConsumableUsageRecord {
    const usages = this.getConsumableUsage();
    const consumables = this.getConsumables();

    const newUsage: ConsumableUsageRecord = {
      id: `csm-u-${Date.now()}`,
      quarter: input.quarter || 'Q1',
      productionDate: input.productionDate || new Date().toISOString().split('T')[0],
      unitOrCompany: input.unitOrCompany.trim(),
      itemProduced: input.itemProduced.trim(),
      quantityProduced: Number(input.quantityProduced) || 0,
      gasTank: Number(input.gasTank) || 0,
      aluBagPcs: Number(input.aluBagPcs) || 0,
      stickerSet: Number(input.stickerSet) || 0,
      brownBox: Number(input.brownBox) || 0,
      rubberTsrKg: Number(input.rubberTsrKg) || 0,
      a4CoverPcs: Number(input.a4CoverPcs) || 0,
      recordedByUserId: user.id,
      recordedByName: user.name,
      referenceNote: input.referenceNote?.trim(),
      createdAt: new Date().toISOString(),
    };

    // Update consumable stock levels & total used counts
    const updatedConsumables = consumables.map((csm) => {
      let deduction = 0;
      if (csm.id === 'csm-gas') deduction = newUsage.gasTank;
      else if (csm.id === 'csm-alubag') deduction = newUsage.aluBagPcs;
      else if (csm.id === 'csm-sticker') deduction = newUsage.stickerSet;
      else if (csm.id === 'csm-box') deduction = newUsage.brownBox;
      else if (csm.id === 'csm-tsr') deduction = newUsage.rubberTsrKg;
      else if (csm.id === 'csm-a4') deduction = newUsage.a4CoverPcs;

      if (deduction > 0) {
        return {
          ...csm,
          currentStock: Math.max(0, Number((csm.currentStock - deduction).toFixed(2))),
          totalUsed2026: Number((csm.totalUsed2026 + deduction).toFixed(2)),
          updatedAt: new Date().toISOString(),
        };
      }
      return csm;
    });

    usages.unshift(newUsage);
    this.setStorage(CONSUMABLE_USAGE_KEY, usages);
    this.setStorage(CONSUMABLES_KEY, updatedConsumables);

    return newUsage;
  }

  public quickUpdateConsumableStock(
    consumableId: string,
    quantityUsed: number,
    note: string,
    user: User
  ): void {
    const consumables = this.getConsumables();
    const target = consumables.find((c) => c.id === consumableId);
    if (!target) return;

    const diff = Number(quantityUsed) || 0;
    const updatedConsumables = consumables.map((c) => {
      if (c.id === consumableId) {
        return {
          ...c,
          currentStock: Math.max(0, Number((c.currentStock - diff).toFixed(2))),
          totalUsed2026: Number((c.totalUsed2026 + diff).toFixed(2)),
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    this.setStorage(CONSUMABLES_KEY, updatedConsumables);

    // Also record a quick usage entry
    const usages = this.getConsumableUsage();
    const quickRecord: ConsumableUsageRecord = {
      id: `csm-u-${Date.now()}`,
      quarter: 'Q3',
      productionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }).replace(/ /g, '-'),
      unitOrCompany: 'UKJK Lab Usage',
      itemProduced: `Pelarasan Penggunaan: ${target.name}`,
      quantityProduced: 0,
      gasTank: target.id === 'csm-gas' ? diff : 0,
      aluBagPcs: target.id === 'csm-alubag' ? diff : 0,
      stickerSet: target.id === 'csm-sticker' ? diff : 0,
      brownBox: target.id === 'csm-box' ? diff : 0,
      rubberTsrKg: target.id === 'csm-tsr' ? diff : 0,
      a4CoverPcs: target.id === 'csm-a4' ? diff : 0,
      recordedByUserId: user.id,
      recordedByName: user.name,
      referenceNote: note || 'Kemas kini stok manual',
      createdAt: new Date().toISOString(),
    };
    usages.unshift(quickRecord);
    this.setStorage(CONSUMABLE_USAGE_KEY, usages);
  }

  // Business Rules & Status Evaluators
  // BR-001: Equipment Traffic Light Calculation
  public evaluateEquipmentStatus(
    eq: Equipment,
    thresholdDays: number,
    referenceDate = new Date()
  ): EquipmentStatusSummary {
    const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

    const evalDueDate = (dueDateStr: string | null): StatusEvaluation => {
      if (!dueDateStr) {
        return {
          status: 'GREEN',
          label: 'Tiada Rekod Tarikh',
          daysRemaining: null,
          details: 'Tiada jadual aktif',
        };
      }
      const dueDate = new Date(dueDateStr);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return {
          status: 'RED',
          label: 'Tamat Tempoh',
          daysRemaining: diffDays,
          details: `Telah lewat ${Math.abs(diffDays)} hari (Tamat: ${dueDateStr})`,
        };
      } else if (diffDays <= thresholdDays) {
        return {
          status: 'YELLOW',
          label: 'Hampir Tamat Tempoh',
          daysRemaining: diffDays,
          details: `Baki ${diffDays} hari lagi (Tamat: ${dueDateStr})`,
        };
      } else {
        return {
          status: 'GREEN',
          label: 'Sah / Sahih',
          daysRemaining: diffDays,
          details: `Sah sehingga ${dueDateStr} (${diffDays} hari baki)`,
        };
      }
    };

    let calEval: StatusEvaluation | undefined;
    if (eq.requiresCalibration) {
      calEval = evalDueDate(eq.nextCalibrationDate);
    }

    let verEval: StatusEvaluation | undefined;
    if (eq.requiresVerification) {
      verEval = evalDueDate(eq.nextVerificationDate);
    }

    // Overall status is the worst between Calibration and Verification
    // Red > Yellow > Green
    let overall: StatusColor = 'GREEN';
    if (calEval?.status === 'RED' || verEval?.status === 'RED') {
      overall = 'RED';
    } else if (calEval?.status === 'YELLOW' || verEval?.status === 'YELLOW') {
      overall = 'YELLOW';
    }

    return {
      equipment: eq,
      overallStatus: overall,
      calibrationStatus: calEval,
      verificationStatus: verEval,
    };
  }

  // BR-002: Chemical Status Calculation
  public evaluateChemicalStatus(
    chem: Chemical,
    thresholdDays: number,
    referenceDate = new Date()
  ): ChemicalStatusSummary {
    const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
    const expDate = new Date(chem.expiryDate);
    const diffTime = expDate.getTime() - today.getTime();
    const daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Stock status check
    const isCriticalStock = chem.currentStock <= chem.minStockThreshold;
    const isWarningStock = !isCriticalStock && chem.currentStock <= chem.minStockThreshold * 1.2;

    // Expiry check
    const isExpired = daysToExpiry < 0;
    const isWarningExpiry = !isExpired && daysToExpiry <= thresholdDays;

    let status: StatusColor = 'GREEN';
    let details = `Stok mencukupi (${chem.currentStock} ${chem.unit}), tarikh luput sah (${chem.expiryDate})`;

    if (isCriticalStock || isExpired) {
      status = 'RED';
      const reasons: string[] = [];
      if (isCriticalStock) {
        reasons.push(`Baki (${chem.currentStock} ${chem.unit}) ≤ Had Minimum (${chem.minStockThreshold} ${chem.unit})`);
      }
      if (isExpired) {
        reasons.push(`Tarikh luput telah tamat pada ${chem.expiryDate} (lewat ${Math.abs(daysToExpiry)} hari)`);
      }
      details = reasons.join(' & ');
    } else if (isWarningStock || isWarningExpiry) {
      status = 'YELLOW';
      const reasons: string[] = [];
      if (isWarningStock) {
        reasons.push(`Baki (${chem.currentStock} ${chem.unit}) hampir had minimum (${chem.minStockThreshold} ${chem.unit})`);
      }
      if (isWarningExpiry) {
        reasons.push(`Tarikh luput dalam ${daysToExpiry} hari lagi (${chem.expiryDate})`);
      }
      details = reasons.join(' & ');
    }

    return {
      chemical: chem,
      status,
      stockStatus: isCriticalStock ? 'CRITICAL' : isWarningStock ? 'WARNING' : 'OK',
      expiryStatus: isExpired ? 'EXPIRED' : isWarningExpiry ? 'WARNING' : 'OK',
      daysToExpiry,
      details,
    };
  }

  // FR-003: Structured Reminder Generator for WhatsApp & Email
  public generateReminderText(
    type: 'EQUIPMENT' | 'CHEMICAL',
    itemSummary: EquipmentStatusSummary | ChemicalStatusSummary,
    senderName: string
  ): { title: string; text: string; whatsappUrl: string; mailtoUrl: string } {
    let title = '';
    let text = '';

    if (type === 'EQUIPMENT') {
      const eqSummary = itemSummary as EquipmentStatusSummary;
      const eq = eqSummary.equipment;
      const statusWord = eqSummary.overallStatus === 'RED' ? 'TAMAT TEMPOH (OVERDUE)' : 'PERINGATAN AMARAN AWAL';
      title = `[UKJK LabTrack] Peringatan Jadual Peralatan: ${eq.assetCode} - ${eq.name}`;

      const lines: string[] = [
        `*PERINGATAN JADUAL PERALATAN MAKMAL UKJK*`,
        `Status: [ ${statusWord} ]`,
        `----------------------------------------`,
        `Nama Peralatan: ${eq.name}`,
        `Kod Aset: ${eq.assetCode}`,
        `Model: ${eq.brandModel}`,
        `Lokasi: ${eq.location}`,
        `Tahun Perolehan: ${eq.acquisitionYear}`,
      ];

      if (eq.requiresCalibration && eqSummary.calibrationStatus) {
        lines.push(`Calibration Seterusnya: ${eq.nextCalibrationDate || 'Belum ditetapkan'} (${eqSummary.calibrationStatus.details})`);
      }
      if (eq.requiresVerification && eqSummary.verificationStatus) {
        lines.push(`Verification Seterusnya: ${eq.nextVerificationDate || 'Belum ditetapkan'} (${eqSummary.verificationStatus.details})`);
      }

      lines.push(`----------------------------------------`);
      lines.push(`Tindakan: Sila aturkan jadual kalibrasi / verifikasi peralatan bagi mengelakkan gangguan analisis.`);
      lines.push(`Dikeluarkan oleh: ${senderName} (Sistem UKJK LabTrack)`);
      lines.push(`Masa: ${new Date().toLocaleString('ms-MY')}`);

      text = lines.join('\n');
    } else {
      const chemSummary = itemSummary as ChemicalStatusSummary;
      const chem = chemSummary.chemical;
      const statusWord = chemSummary.status === 'RED' ? 'KRITIKAL / STOK RENDAH' : 'PERINGATAN AMARAN STOK';
      title = `[UKJK LabTrack] Peringatan Inventori Bahan Kimia: ${chem.name}`;

      const lines: string[] = [
        `*PERINGATAN INVENTORI BAHAN KIMIA MAKMAL UKJK*`,
        `Status: [ ${statusWord} ]`,
        `----------------------------------------`,
        `Nama Bahan Kimia: ${chem.name}`,
        `CAS / Kod: ${chem.casOrCode}`,
        `Gred / Formula: ${chem.formulaOrGrade}`,
        `Lokasi: ${chem.location}`,
        `Baki Stok Terkini: ${chem.currentStock} ${chem.unit}`,
        `Had Minimum (Reorder Level): ${chem.minStockThreshold} ${chem.unit}`,
        `Tarikh Luput: ${chem.expiryDate}`,
        `Catatan Status: ${chemSummary.details}`,
        `Tindakan: Sila buat pesanan stok baharu (Stock-In) atau lupuskan botol yang telah tamat tempoh.`,
        `Dikeluarkan oleh: ${senderName} (Sistem UKJK LabTrack)`,
        `Masa: ${new Date().toLocaleString('ms-MY')}`,
      ];

      text = lines.join('\n');
    }

    const encodedText = encodeURIComponent(text);
    const encodedSubject = encodeURIComponent(title);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    const mailtoUrl = `mailto:?subject=${encodedSubject}&body=${encodedText}`;

    return { title, text, whatsappUrl, mailtoUrl };
  }

  // Storage usage calculator for transparency
  public getStorageUsage(): { usedKb: number; percent: number } {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += ((localStorage[key]?.length || 0) + key.length) * 2;
      }
    }
    const usedKb = Number((total / 1024).toFixed(1));
    const percent = Math.min(100, Number(((usedKb / 5120) * 100).toFixed(1))); // ~5MB quota
    return { usedKb, percent };
  }
}

export const dataService = new DataService();
