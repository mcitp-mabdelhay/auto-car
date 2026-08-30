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
