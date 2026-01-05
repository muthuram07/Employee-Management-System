import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Correct way to import the plugin
import * as XLSX from 'xlsx';

export const exportToPDF = (reportId) => {
  const doc = new jsPDF();

  // Get the table element
  const table = document.getElementById(reportId);
  if (!table) {
    console.error(`Table with ID '${reportId}' not found.`);
    return;
  }

  // Convert HTML table to autoTable format
  autoTable(doc, { html: `#${reportId}` });

  doc.save(`${reportId}.pdf`);
};

export const exportToExcel = (reportId) => {
  const table = document.getElementById(reportId);
  const workbook = XLSX.utils.table_to_book(table);
  XLSX.writeFile(workbook, `${reportId}.xlsx`);
};
