export type Language = 'ar' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface Vehicle {
  id: string;
  name: string;
  currentMileage: number;
}

export interface MaintenanceRecord {
  id: string;
  name: string; // اسم الصيانة
  mileageAtMaintenance: number; // العداد عند الصيانة
  minMileageForChange: number; // أدنى عداد للتغيير
  maxMileageForChange: number; // أقصى عداد للتغيير
  lastMaintenanceDate: string; // أخر تاريخ صيانة
  cost?: number; // التكلفة
  receiptLink?: string; // إيصال
}

export interface DashboardData {
  vehicle: Vehicle;
  records: MaintenanceRecord[];
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  modifiedTime?: string;
}

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
}
