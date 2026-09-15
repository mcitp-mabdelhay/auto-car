import { getSheetValues, updateSheetValues, appendSheetValues } from './googleApi';
import { MaintenanceRecord, Vehicle } from '../types';

// CSV structure:
// Row 0: عداد الكيلو الحالي,95500,,,
// Row 1: اسم الصيانة,العداد عند الصيانة,أدنى عداد للتغيير,أقصى عداد للتغيير,أخر تاريخ صيانة,التكلفة,رابط الإيصال

const HEADERS = [
  'اسم الصيانة', 
  'العداد عند الصيانة', 
  'أدنى عداد للتغيير', 
  'أقصى عداد للتغيير', 
  'أخر تاريخ صيانة',
  'التكلفة',
  'رابط الإيصال'
];

export async function loadVehicleData(spreadsheetId: string, sheetName: string = 'Sheet1') {
  const data = await getSheetValues(spreadsheetId, `${sheetName}!A1:G100`);
  const values = data.values;
  
  if (!values || values.length === 0) {
    throw new Error('Sheet is empty');
  }

  // Parse Vehicle current mileage and name
  // Expecting: "عداد الكيلو الحالي", "95500", "اسم السيارة", "My Vehicle"
  let currentMileage = 0;
  let name = 'سيارتي';
  if (values[0][0] && values[0][0].includes('عداد')) {
    currentMileage = parseInt(values[0][1], 10) || 0;
    if (values[0][2] === 'اسم السيارة') {
      name = values[0][3] || 'سيارتي';
    }
  }

  const vehicle: Vehicle = {
    id: 'v1',
    name,
    currentMileage
  };

  const records: MaintenanceRecord[] = [];

  let startIndex = 1;
  if (values.length > 1 && values[1][0] === HEADERS[0]) {
    startIndex = 2;
  }

  // Parse Records
  for (let i = startIndex; i < values.length; i++) {
    const row = values[i];
    if (!row || row.length === 0 || !row[0]) continue; // skip empty
    
    records.push({
      id: `row-${i + 1}`,
      name: row[0] || '',
      mileageAtMaintenance: parseInt(row[1], 10) || 0,
      minMileageForChange: parseInt(row[2], 10) || 0,
      maxMileageForChange: parseInt(row[3], 10) || parseInt(row[2], 10) || 0,
      lastMaintenanceDate: row[4] || '',
      cost: parseFloat(row[5]) || 0,
      receiptLink: row[6] || ''
    });
  }

  return { vehicle, records };
}

export async function updateVehicleMileage(spreadsheetId: string, sheetName: string, newMileage: number) {
  await updateSheetValues(spreadsheetId, `${sheetName}!B1`, [[newMileage.toString()]]);
}

export async function addMaintenanceRecord(
  spreadsheetId: string, 
  sheetName: string, 
  record: Omit<MaintenanceRecord, 'id'>, 
  rowIndex?: number // if updating an existing record, else append
) {
  const rowData = [
    record.name,
    record.mileageAtMaintenance ? record.mileageAtMaintenance.toString() : '',
    record.minMileageForChange ? record.minMileageForChange.toString() : '',
    record.maxMileageForChange ? record.maxMileageForChange.toString() : '',
    record.lastMaintenanceDate || '',
    record.cost ? record.cost.toString() : '',
    record.receiptLink || ''
  ];

  if (rowIndex) {
    // Update existing
    await updateSheetValues(spreadsheetId, `${sheetName}!A${rowIndex}:G${rowIndex}`, [rowData]);
  } else {
    // Append new
    await appendSheetValues(spreadsheetId, `${sheetName}!A:A`, [rowData]);
  }
}

export async function initializeSheet(spreadsheetId: string, sheetName: string = 'Sheet1') {
  // Sets up the headers
  const data = [
    ['عداد الكيلو الحالي', '0', '', '', '', '', ''],
    HEADERS
  ];
  await updateSheetValues(spreadsheetId, `${sheetName}!A1:G2`, data);
}

export async function updateCurrentMileage(spreadsheetId: string, sheetName: string, mileage: number) {
  const data = await getSheetValues(spreadsheetId, `${sheetName}!A1:B10`);
  const values = data.values;
  
  if (!values || values.length === 0) return;
  
  let rowIndex = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].includes('عداد')) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex !== -1) {
    await updateSheetValues(spreadsheetId, `${sheetName}!B${rowIndex}`, [[mileage.toString()]]);
  }
}

export async function updateVehicleName(spreadsheetId: string, sheetName: string, name: string) {
  const data = await getSheetValues(spreadsheetId, `${sheetName}!A1:B10`);
  const values = data.values;
  
  if (!values || values.length === 0) return;
  
  let rowIndex = -1;
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].includes('عداد')) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex !== -1) {
    await updateSheetValues(spreadsheetId, `${sheetName}!C${rowIndex}:D${rowIndex}`, [['اسم السيارة', name]]);
  }
}
