import * as XLSX from 'xlsx';

export function parseEvidenceFile(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null }) as Record<string, any>[];

  if (!rows.length) {
    throw new Error('Uploaded file has no readable rows');
  }

  const summary = buildSummary(rows);

  return { rows, summary };
}

function buildSummary(rows: Record<string, any>[]): string {
  const columns = Object.keys(rows[0]);
  const preview = rows.slice(0, 5);

  return [
    `Total rows: ${rows.length}`,
    `Columns: ${columns.join(', ')}`,
    `Sample data: ${JSON.stringify(preview)}`,
  ].join('\n');
}