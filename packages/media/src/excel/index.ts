/**
 * Excel processing utilities using XLSX library
 */
import * as XLSX from 'xlsx';

/**
 * Excel sheet data
 */
export interface ExcelSheet {
  name: string;
  data: any[][];
  json?: any[];
}

/**
 * Excel workbook
 */
export interface ExcelWorkbook {
  sheets: ExcelSheet[];
  sheetNames: string[];
}

/**
 * Read Excel file
 */
export async function readExcelFile(file: File): Promise<ExcelWorkbook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheets: ExcelSheet[] = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          return {
            name: sheetName,
            data: sheetData,
            json: jsonData,
          };
        });

        resolve({
          sheets,
          sheetNames: workbook.SheetNames,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Create Excel file from data
 */
export function createExcelFile(
  data: any[][],
  sheetName: string = 'Sheet1'
): Blob {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/**
 * Create Excel file from JSON
 */
export function createExcelFromJSON(
  data: any[],
  sheetName: string = 'Sheet1'
): Blob {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/**
 * Export data to Excel file
 */
export function exportToExcel(
  data: any[],
  filename: string = 'export.xlsx',
  sheetName: string = 'Sheet1'
): void {
  const blob = createExcelFromJSON(data, sheetName);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert Excel to CSV
 */
export async function excelToCSV(file: File, sheetIndex: number = 0): Promise<string> {
  const workbook = await readExcelFile(file);
  const sheet = workbook.sheets[sheetIndex];

  if (!sheet) {
    throw new Error('Sheet not found');
  }

  return sheet.data.map((row) => row.join(',')).join('\n');
}

/**
 * Parse CSV string
 */
export function parseCSV(csv: string): any[][] {
  const lines = csv.split('\n');
  return lines.map((line) => line.split(','));
}

/**
 * Create CSV file
 */
export function createCSVFile(data: any[][]): Blob {
  const csv = data.map((row) => row.join(',')).join('\n');
  return new Blob([csv], { type: 'text/csv' });
}

/**
 * Export data to CSV
 */
export function exportToCSV(
  data: any[][],
  filename: string = 'export.csv'
): void {
  const blob = createCSVFile(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get Excel sheet names
 */
export async function getExcelSheetNames(file: File): Promise<string[]> {
  const workbook = await readExcelFile(file);
  return workbook.sheetNames;
}

/**
 * Read specific sheet by name
 */
export async function readExcelSheet(
  file: File,
  sheetName: string
): Promise<ExcelSheet | null> {
  const workbook = await readExcelFile(file);
  return workbook.sheets.find((sheet) => sheet.name === sheetName) || null;
}

/**
 * Create multi-sheet Excel file
 */
export function createMultiSheetExcel(
  sheets: Array<{ name: string; data: any[] }>
): Blob {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/**
 * Validate Excel file
 */
export interface ExcelValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateExcelFile(
  file: File,
  options?: {
    maxSize?: number;
    requiredSheets?: string[];
    maxRows?: number;
    requiredColumns?: string[];
  }
): Promise<ExcelValidation> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size
  if (options?.maxSize && file.size > options.maxSize) {
    errors.push(`File size exceeds ${options.maxSize / 1024 / 1024}MB`);
  }

  try {
    const workbook = await readExcelFile(file);

    // Check required sheets
    if (options?.requiredSheets) {
      const missingSheets = options.requiredSheets.filter(
        (name) => !workbook.sheetNames.includes(name)
      );
      if (missingSheets.length > 0) {
        errors.push(`Missing required sheets: ${missingSheets.join(', ')}`);
      }
    }

    // Check row count
    if (options?.maxRows) {
      workbook.sheets.forEach((sheet) => {
        if (sheet.data.length > options.maxRows!) {
          warnings.push(`Sheet "${sheet.name}" exceeds ${options.maxRows} rows`);
        }
      });
    }

    // Check required columns
    if (options?.requiredColumns && workbook.sheets.length > 0) {
      const firstSheet = workbook.sheets[0];
      const headers = firstSheet.data[0] || [];
      const missingColumns = options.requiredColumns.filter(
        (col) => !headers.includes(col)
      );
      if (missingColumns.length > 0) {
        errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      }
    }
  } catch (error) {
    errors.push('Failed to read Excel file');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
