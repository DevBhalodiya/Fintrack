import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads a beautifully formatted PDF report of the user's transactions.
 * 
 * @param {Object} options
 * @param {Array} options.transactions - Array of transactions to print
 * @param {string} options.reportType - 'income' | 'expense' | 'summary'
 * @param {string} options.timePeriod - 'week' | 'month' | 'quarter' | 'year' | 'all'
 * @param {number} options.totalIncome - Sum of income transactions
 * @param {number} options.totalExpenses - Sum of expense transactions
 * @param {number} options.netSavings - netSavings (totalIncome - totalExpenses)
 * @param {string} options.userEmail - Email of the active user
 */
export const downloadPDFReport = ({
  transactions,
  reportType,
  timePeriod,
  totalIncome,
  totalExpenses,
  netSavings,
  userEmail
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Map Filter Options to Readable Titles
  const reportTitles = {
    income: 'Income Report',
    expense: 'Expense Report',
    summary: 'Income & Expense Summary Report'
  };

  const periodTitles = {
    week: 'This Week',
    month: 'This Month',
    quarter: 'This Quarter (90 Days)',
    year: 'This Year',
    all: 'All Time'
  };

  const reportTypeTitle = reportTitles[reportType] || 'Financial Report';
  const timePeriodStr = periodTitles[timePeriod] || 'All Time';

  // --- 1. BRAND HEADER ---
  // FinTrack logo/name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229); // Indigo (#4f46e5)
  doc.text('FinTrack', 15, 22);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Personal Finance Tracker', 15, 27);

  // Right-aligned report metadata
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105); // Slate-600
  const todayStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Generated On: ${todayStr}`, 195, 18, { align: 'right' });
  doc.text(`Account: ${userEmail || 'N/A'}`, 195, 23, { align: 'right' });
  doc.text(`Period: ${timePeriodStr}`, 195, 28, { align: 'right' });

  // Divider line
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.5);
  doc.line(15, 33, 195, 33);

  // --- 2. REPORT TITLE ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(reportTypeTitle, 15, 42);

  // --- 3. SUMMARY DASHBOARD CARDS ---
  // Dimensions for 3 boxes: width 56mm each, 6mm gap, y=47, height=20mm
  const cardY = 47;
  const cardH = 20;
  const cardW = 56;
  const cardGap = 6;

  // Render Income Card
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(15, cardY, cardW, cardH, 2, 2, 'FD');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('TOTAL INCOME', 20, cardY + 6);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Emerald-500
  doc.text(`INR ${totalIncome.toFixed(2)}`, 20, cardY + 14);

  // Render Expenses Card
  const expX = 15 + cardW + cardGap;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(expX, cardY, cardW, cardH, 2, 2, 'FD');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL EXPENSES', expX + 5, cardY + 6);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(244, 63, 94); // Rose-500
  doc.text(`INR ${totalExpenses.toFixed(2)}`, expX + 5, cardY + 14);

  // Render Net Savings Card
  const savX = expX + cardW + cardGap;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(savX, cardY, cardW, cardH, 2, 2, 'FD');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('NET SAVINGS', savX + 5, cardY + 6);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  if (netSavings >= 0) {
    doc.setTextColor(79, 70, 229); // Indigo-600
  } else {
    doc.setTextColor(244, 63, 94); // Rose-500 (Loss)
  }
  doc.text(`INR ${netSavings.toFixed(2)}`, savX + 5, cardY + 14);

  // Filter transactions to print based on selected reportType
  const displayedTransactions = transactions.filter(t => {
    if (reportType === 'summary') return true;
    return t.type === reportType;
  });

  // --- 4. CATEGORY BREAKDOWN TABLE ---
  // Prepare category metrics
  const categoryMap = {};
  displayedTransactions.forEach(t => {
    const key = `${t.category}-${t.type}`;
    if (!categoryMap[key]) {
      categoryMap[key] = {
        category: t.category,
        type: t.type,
        amount: 0
      };
    }
    categoryMap[key].amount += t.amount;
  });

  const totalAmountForType = displayedTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = Object.values(categoryMap).map(c => ({
    ...c,
    percentage: totalAmountForType > 0 ? (c.amount / totalAmountForType) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);

  let currentY = 74;

  if (categoryBreakdown.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text('Category Breakdown', 15, currentY);

    autoTable(doc, {
      startY: currentY + 3,
      head: [['Category', 'Type', 'Total Amount', 'Percentage Share']],
      body: categoryBreakdown.map(item => [
        item.category,
        item.type.toUpperCase(),
        `INR ${Number(item.amount).toFixed(2)}`,
        `${Number(item.percentage).toFixed(1)}%`
      ]),
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' }, // Indigo header
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // --- 5. DETAILED LEDGER TABLE ---
  if (currentY > 240) {
    doc.addPage();
    currentY = 22; // Start fresh on new page
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('Detailed Transactions Ledger', 15, currentY);

  if (displayedTransactions.length === 0) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('No transactions logged for this period.', 15, currentY + 8);
  } else {
    autoTable(doc, {
      startY: currentY + 3,
      head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
      body: displayedTransactions.map(t => [
        t.date,
        t.type.toUpperCase(),
        t.category,
        t.description || '—',
        `${t.type === 'income' ? '+' : '-'}INR ${Number(t.amount).toFixed(2)}`
      ]),
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' }, // Slate-900 header
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        4: { halign: 'right' }
      },
      didParseCell: (data) => {
        // Change Amount text color dynamically based on transaction type
        if (data.column.index === 4 && data.cell.section === 'body') {
          const typeVal = data.row.raw[1]; // Get uppercase Type from index 1
          if (typeVal === 'INCOME') {
            data.cell.styles.textColor = [16, 185, 129]; // Emerald Green
          } else {
            data.cell.styles.textColor = [244, 63, 94]; // Rose Red
          }
        }
      },
      margin: { left: 15, right: 15 }
    });
  }

  // --- 6. PAGE NUMBERING & FOOTERS ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Draw footer line
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.5);
    doc.line(15, 282, 195, 282);

    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text('FinTrack — Track, Analyze, and Save Smartly', 15, 287);
    doc.text(`Page ${i} of ${totalPages}`, 195, 287, { align: 'right' });
  }

  // Save the PDF locally
  const formattedDate = new Date().toISOString().split('T')[0];
  const filename = `fintrack-${reportType}-report-${timePeriod}-${formattedDate}.pdf`;
  doc.save(filename);
};
