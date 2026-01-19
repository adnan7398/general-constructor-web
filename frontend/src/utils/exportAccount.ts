import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const fmtINR = (n: number) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
const fmtDate = (d: string | Date) => {
  if (!d) return '-';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? '-' : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ---- Budget / Site Ledger (account.tsx) ----

export interface BudgetEntry {
  date?: string;
  particular?: string;
  category?: string;
  typeofExpense?: string;
  amount?: number;
  Quantity?: number;
  paymentMode?: string;
  type?: string;
}

export function exportBudgetToExcel(
  entries: BudgetEntry[],
  siteName: string,
  income: number,
  expense: number,
  closingBalance: number
) {
  const wb = XLSX.utils.book_new();

  const summary = [
    ['Site', siteName || 'All'],
    ['Total Income', income],
    ['Total Expense', expense],
    ['Closing Balance', closingBalance],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), 'Summary');

  const headers = ['Date', 'Particular', 'Category', 'Type of Expense', 'Amount', 'Quantity', 'Payment Mode', 'Type'];
  const rows = entries.map((e) => [
    fmtDate(e.date),
    e.particular ?? '-',
    e.category ?? '-',
    e.typeofExpense ?? '-',
    e.amount ?? 0,
    e.Quantity ?? '-',
    e.paymentMode ?? '-',
    e.type ?? '-',
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers, ...rows]), 'Ledger');

  XLSX.writeFile(wb, `Budget_${(siteName || 'Ledger').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportBudgetToPDF(
  entries: BudgetEntry[],
  siteName: string,
  income: number,
  expense: number,
  closingBalance: number
) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const title = `Site Ledger${siteName ? ` - ${siteName}` : ''}`;
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 22);

  const summaryBody = [
    ['Total Income', fmtINR(income)],
    ['Total Expense', fmtINR(expense)],
    ['Closing Balance', fmtINR(closingBalance)],
  ];
  autoTable(doc, {
    startY: 28,
    head: [['Summary', '']],
    body: summaryBody,
    theme: 'plain',
    margin: { left: 14 },
  });

  const entriesHead = [['Date', 'Particular', 'Category', 'Type of Exp', 'Amount', 'Qty', 'Payment', 'Type']];
  const entriesBody = entries.map((e) => [
    fmtDate(e.date),
    String(e.particular || '-').slice(0, 30),
    String(e.category || '-').slice(0, 12),
    String(e.typeofExpense || '-'),
    fmtINR(e.amount ?? 0),
    String(e.Quantity ?? '-'),
    String(e.paymentMode || '-').slice(0, 10),
    String(e.type || '-'),
  ]);
  const prevY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0;
  autoTable(doc, {
    startY: prevY + 10,
    head: entriesHead,
    body: entriesBody,
    theme: 'striped',
    margin: { left: 14 },
    styles: { fontSize: 8 },
  });

  doc.save(`Budget_${(siteName || 'Ledger').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ---- Total Account (totalacount.tsx) ----

export interface SiteAccountExport {
  _id: string;
  siteName: string;
  entries: {
    _id?: string;
    date?: string | Date;
    type?: string;
    typeofExpense?: string;
    category?: string;
    particular?: string;
    amount?: number;
    Quantity?: number;
    paymentMode?: string;
  }[];
}

export interface SiteSummaryExport {
  siteId: string;
  siteName: string;
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  totalEntries: number;
}

export function exportTotalAccountToExcel(
  siteAccounts: SiteAccountExport[],
  siteSummaries: SiteSummaryExport[],
  grandTotals: { totalIncome: number; totalExpense: number; netBalance: number }
) {
  const wb = XLSX.utils.book_new();

  const grand = [
    ['Total Income', grandTotals.totalIncome],
    ['Total Expense', grandTotals.totalExpense],
    ['Net Balance', grandTotals.netBalance],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(grand), 'Grand Summary');

  const summaryHeaders = ['Site', 'Opening', 'Income', 'Expenses', 'Balance', 'Entries'];
  const summaryRows = siteSummaries.map((s) => [
    s.siteName,
    s.openingBalance,
    s.totalIncome,
    s.totalExpense,
    s.closingBalance,
    s.totalEntries,
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryRows]), 'Sites Summary');

  for (const site of siteAccounts) {
    const name = site.siteName.replace(/[/\\?*\[\]]/g, '_').slice(0, 31);
    const headers = ['Date', 'Type', 'Category', 'Particular', 'Quantity', 'Amount', 'Payment'];
    const rows = (site.entries || []).map((e) => [
      fmtDate(e.date),
      e.type ?? '-',
      e.typeofExpense ?? '-',
      e.particular ?? '-',
      e.Quantity ?? '-',
      e.amount ?? 0,
      e.paymentMode ?? '-',
    ]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers, ...rows]), name || 'Sheet');
  }

  XLSX.writeFile(wb, `Total_Account_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportTotalAccountToPDF(
  siteAccounts: SiteAccountExport[],
  siteSummaries: SiteSummaryExport[],
  grandTotals: { totalIncome: number; totalExpense: number; netBalance: number }
) {
  const doc = new jsPDF({ orientation: 'portrait' });
  let y = 15;

  doc.setFontSize(14);
  doc.text('Total Account - Site Finances', 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, y);
  y += 10;

  autoTable(doc, {
    startY: y,
    head: [['', 'Amount']],
    body: [
      ['Total Income', fmtINR(grandTotals.totalIncome)],
      ['Total Expense', fmtINR(grandTotals.totalExpense)],
      ['Net Balance', fmtINR(grandTotals.netBalance)],
    ],
    theme: 'plain',
    margin: { left: 14 },
  });
  y = ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0) + 10;

  const sumHead = [['Site', 'Opening', 'Income', 'Expenses', 'Balance', 'Entries']];
  const sumBody = siteSummaries.map((s) => [
    s.siteName.slice(0, 20),
    fmtINR(s.openingBalance),
    fmtINR(s.totalIncome),
    fmtINR(s.totalExpense),
    fmtINR(s.closingBalance),
    String(s.totalEntries),
  ]);
  autoTable(doc, {
    startY: y,
    head: sumHead,
    body: sumBody,
    theme: 'striped',
    margin: { left: 14 },
    styles: { fontSize: 9 },
  });
  y = ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0) + 12;

  for (const site of siteAccounts) {
    if (y > 250) {
      doc.addPage();
      y = 15;
    }
    doc.setFontSize(11);
    doc.text(`Site: ${site.siteName}`, 14, y);
    y += 6;

    const eHead = [['Date', 'Type', 'Category', 'Particular', 'Amount', 'Payment']];
    const eBody = (site.entries || []).map((e) => [
      fmtDate(e.date),
      String(e.type || '-'),
      String(e.typeofExpense || '-').slice(0, 10),
      String(e.particular || '-').slice(0, 22),
      fmtINR(e.amount ?? 0),
      String(e.paymentMode || '-').slice(0, 8),
    ]);
    autoTable(doc, {
      startY: y,
      head: eHead,
      body: eBody,
      theme: 'plain',
      margin: { left: 14 },
      styles: { fontSize: 8 },
    });
    y = ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0) + 10;
  }

  doc.save(`Total_Account_${new Date().toISOString().slice(0, 10)}.pdf`);
}
