export type UserRole = 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export type OperationalStatus = 'ACTIVE' | 'MAINTENANCE' | 'BROKEN';

export interface Equipment {
  id: string;
  assetCode: string; // Unique
  name: string;
  brandModel: string;
  serialNumber?: string;
  location: string;
  acquisitionYear: number; // e.g. 2026
  operationalStatus: OperationalStatus;
  requiresCalibration: boolean;
  calibrationFreqMonths: number;
  lastCalibrationDate: string | null;
  nextCalibrationDate: string | null;
  requiresVerification: boolean;
  verificationFreqMonths: number;
  lastVerificationDate: string | null;
  nextVerificationDate: string | null;
  createdBy: string;
  updatedAt: string;
}

export type LogType = 'CALIBRATION' | 'VERIFICATION';
export type VerificationResult = 'PASS' | 'FAIL';

export interface EquipmentLog {
  id: string;
  equipmentId: string;
  type: LogType;
  performedDate: string;
  nextDueDate: string;
  providerOrResult: string; // Supplier name for calibration, or 'PASS' | 'FAIL' for verification
  certificateNumber?: string | null;
  certificateUrl?: string | null;
  certificateFileBase64?: string | null;
  certificateFileName?: string | null;
  notes?: string | null;
  recordedByUserId: string;
  recordedByName: string;
  createdAt: string;
}

export type ChemicalUnit = 'ml' | 'L' | 'g' | 'mg' | 'botol';

export interface Chemical {
  id: string;
  casOrCode: string; // Unique
  name: string;
  formulaOrGrade: string;
  location: string;
  unit: ChemicalUnit;
  currentStock: number;
  minStockThreshold: number;
  expiryDate: string;
  updatedAt: string;
}

export interface StandardSampleBatch {
  id: string;
  sampleName: string;
  batchCode: string;
  preparedDate: string;
  notes?: string | null;
  preparedByUserId: string;
  preparedByName: string;
  createdAt: string;
  items: Array<{
    chemicalId: string;
    chemicalName: string;
    quantity: number;
    unit: string;
  }>;
  // Official LGM Standard Sample Distribution & Production fields
  quarter?: '1st' | '2nd' | '3rd' | '4th' | string;
  unitOrCompany?: string;
  requestDate?: string;
  certificateNumber?: string;
  referenceNumber?: string;
  quantityPcs?: number;
  deliveryDate?: string;
  productionPeriod?: string;
  timeToComplete?: string;
  poPeriod?: string;
  timeFromPo?: string;
  registryStatus?: string;
}

export type TransactionType = 'STOCK_IN' | 'STOCK_OUT';

export interface ChemicalTransaction {
  id: string;
  chemicalId: string;
  chemicalName: string;
  transactionType: TransactionType;
  quantity: number;
  unit: string;
  balanceAfter: number;
  lotNumber?: string | null;
  standardSampleBatchId?: string | null;
  referenceNote: string;
  recordedByUserId: string;
  recordedByName: string;
  createdAt: string;
}

export interface SystemSettings {
  warningThresholdDays: number; // Default: 30
}

export type StatusColor = 'GREEN' | 'YELLOW' | 'RED';

export interface StatusEvaluation {
  status: StatusColor;
  label: string;
  daysRemaining: number | null;
  details: string;
}

export interface EquipmentStatusSummary {
  equipment: Equipment;
  overallStatus: StatusColor;
  calibrationStatus?: StatusEvaluation;
  verificationStatus?: StatusEvaluation;
}

export interface ChemicalStatusSummary {
  chemical: Chemical;
  status: StatusColor;
  stockStatus: 'OK' | 'WARNING' | 'CRITICAL';
  expiryStatus: 'OK' | 'WARNING' | 'EXPIRED';
  daysToExpiry: number;
  details: string;
}

export interface ConsumableItem {
  id: string;
  code: string;
  name: string;
  category: 'GAS' | 'PACKAGING' | 'LABEL' | 'RAW_MATERIAL' | 'STATIONERY';
  unit: string;
  currentStock: number;
  totalUsed2026: number;
  minThreshold: number;
  location: string;
  notes?: string;
  updatedAt: string;
}

export interface ConsumableUsageRecord {
  id: string;
  quarter: 'Q1' | '2nd' | '3rd' | '4th' | string;
  productionDate: string;
  unitOrCompany: string;
  itemProduced: string;
  quantityProduced: number;
  gasTank: number;
  aluBagPcs: number;
  stickerSet: number;
  brownBox: number;
  rubberTsrKg: number;
  a4CoverPcs: number;
  recordedByUserId?: string;
  recordedByName?: string;
  referenceNote?: string;
  createdAt: string;
}

export interface ConsumableUsageInput {
  productionDate: string;
  quarter: string;
  unitOrCompany: string;
  itemProduced: string;
  quantityProduced: number;
  gasTank: number;
  aluBagPcs: number;
  stickerSet: number;
  brownBox: number;
  rubberTsrKg: number;
  a4CoverPcs: number;
  referenceNote?: string;
}
