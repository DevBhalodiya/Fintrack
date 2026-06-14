import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { getTransactions } from '../services/transactionService';

// Import Chart.js components
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS elements
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend
);

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [reportType, setReportType] = useState('expense'); // 'expense' | 'income' | 'summary'
  const [timePeriod, setTimePeriod] = useState('month'); // 'week' | 'month' | 'quarter' | 'year' | 'all'

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await getTransactions(user.uid);
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions for reports:', err);
        setError('Failed to load transaction data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);

  // Filter transactions based on selected Time Period
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    filtered = filtered.filter(t => {
      const tDate = new Date(t.date);
      // Difference in time
      const diffTime = today - tDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timePeriod === 'week') {
        return diffDays >= 0 && diffDays <= 7;
      } else if (timePeriod === 'month') {
        return diffDays >= 0 && diffDays <= 30;
      } else if (timePeriod === 'quarter') {
        return diffDays >= 0 && diffDays <= 90;
      } else if (timePeriod === 'year') {
        return diffDays >= 0 && diffDays <= 365;
      }
      return true; // 'all'
    });

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  // Filter based on Report Type (for breakdown table)
  const displayedTransactions = filteredTransactions.filter(t => {
    if (reportType === 'summary') return true;
    return t.type === reportType;
  });

  // Calculate Metrics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  // Calculate Category-wise Breakdown
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

  // Chart Configuration
  const backgroundColors = [
    '#6366f1', // Indigo
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#eab308', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#14b8a6', // Teal
    '#4f46e5'  // Blue
  ];

  // Doughnut chart data (Expense or Income breakdown)
  const doughnutLabels = categoryBreakdown.map(c => c.category);
  const doughnutValues = categoryBreakdown.map(c => c.amount);

  const doughnutChartData = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutValues,
        backgroundColor: backgroundColors.slice(0, doughnutLabels.length),
        borderColor: '#0f172a',
        borderWidth: 2,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          color: '#94a3b8',
          padding: 15,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        borderWidth: 1,
        titleColor: '#ffffff',
        titleFont: { family: 'Plus Jakarta Sans', weight: 'bold' },
        bodyColor: '#cbd5e1',
        bodyFont: { family: 'Plus Jakarta Sans' },
        padding: 10,
        boxPadding: 6,
      }
    },
    cutout: '70%',
  };

  // Bar chart data (Summary comparison)
  const barChartData = {
    labels: ['Total Income', 'Total Expenses'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [totalIncome, totalExpenses],
        backgroundColor: ['rgba(16, 185, 129, 0.75)', 'rgba(244, 63, 94, 0.75)'],
        borderColor: ['#10b981', '#f43f5e'],
        borderWidth: 1.5,
        borderRadius: 8,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        borderWidth: 1,
        titleColor: '#ffffff',
        titleFont: { family: 'Plus Jakarta Sans', weight: 'bold' },
        bodyColor: '#cbd5e1',
        bodyFont: { family: 'Plus Jakarta Sans' },
        padding: 10,
        boxPadding: 6,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 10 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-8 transition-all duration-300 relative overflow-hidden">
          {/* Subtle page background glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Reports</h1>
            <p className="text-slate-400 mt-1.5 text-sm mb-8">
              Analyze your patterns, balance, and categorization distributions over time.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-rose-955/20 border-l-4 border-rose-500 text-rose-300 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Filter Section */}
            <div className="glass-panel p-6 rounded-2xl mb-8">
              <h2 className="text-lg font-bold text-white tracking-tight mb-4">Filter Reports</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-350 font-semibold mb-2 text-xs uppercase tracking-widest">
                    Report Type
                  </label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-900/40 text-slate-100 text-sm cursor-pointer"
                  >
                    <option className="bg-slate-950 text-slate-200" value="expense">Expense Report</option>
                    <option className="bg-slate-950 text-slate-200" value="income">Income Report</option>
                    <option className="bg-slate-950 text-slate-200" value="summary">Summary Report (Income vs Expense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-350 font-semibold mb-2 text-xs uppercase tracking-widest">
                    Time Period
                  </label>
                  <select 
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-900/40 text-slate-100 text-sm cursor-pointer"
                  >
                    <option className="bg-slate-950 text-slate-200" value="week">This Week</option>
                    <option className="bg-slate-950 text-slate-200" value="month">This Month</option>
                    <option className="bg-slate-950 text-slate-200" value="quarter">This Quarter (90 Days)</option>
                    <option className="bg-slate-950 text-slate-200" value="year">This Year</option>
                    <option className="bg-slate-950 text-slate-200" value="all">All Time</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-4 text-slate-400 font-medium text-sm">Analyzing transaction data...</p>
              </div>
            ) : (
              <>
                {/* Reports Visuals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Expense / Income Breakdown Chart */}
                  {reportType !== 'summary' && (
                    <div className="glass-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
                      <h2 className="text-lg font-bold text-white tracking-tight mb-6 capitalize">{reportType} Breakdown</h2>
                      {categoryBreakdown.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-16 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/10">
                          <span className="text-3xl block mb-2">📊</span>
                          <p className="text-sm">No details found for this period.</p>
                          <p className="text-3xs text-slate-650 mt-1">Try switching filters or logging data.</p>
                        </div>
                      ) : (
                        <div className="flex-1 relative min-h-[220px]">
                          <Doughnut data={doughnutChartData} options={doughnutOptions} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary Comparison Chart */}
                  {reportType === 'summary' && (
                    <div className="glass-panel p-6 rounded-2xl flex flex-col min-h-[350px]">
                      <h2 className="text-lg font-bold text-white tracking-tight mb-6">Income vs Expense Summary</h2>
                      {filteredTransactions.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-16 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/10">
                          <span className="text-3xl block mb-2">📊</span>
                          <p className="text-sm">No details found for this period.</p>
                          <p className="text-3xs text-slate-650 mt-1">Try switching filters or logging data.</p>
                        </div>
                      ) : (
                        <div className="flex-1 relative min-h-[220px]">
                          <Bar data={barChartData} options={barOptions} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Detailed Category-wise Breakdown Table */}
                  <div className="glass-panel p-6 rounded-2xl flex flex-col">
                    <h2 className="text-lg font-bold text-white tracking-tight mb-6">Category Breakdown</h2>
                    
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="pb-3 px-2 font-semibold">Category</th>
                            <th className="pb-3 px-2 font-semibold">Type</th>
                            <th className="pb-3 px-2 font-semibold text-right">Amount</th>
                            <th className="pb-3 px-2 font-semibold text-right">Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryBreakdown.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-16 text-center text-slate-500">
                                <span className="text-3xl block mb-2">📋</span>
                                No breakdown details available.
                              </td>
                            </tr>
                          ) : (
                            categoryBreakdown.map((item, idx) => (
                              <tr key={idx} className="border-b border-slate-900/50 hover:bg-slate-900/25 transition duration-150">
                                <td className="py-4 px-2 text-sm text-slate-200 font-semibold">{item.category}</td>
                                <td className="py-4 px-2">
                                  <span className={`px-2.5 py-0.5 text-2xs font-bold rounded-lg uppercase tracking-wider border ${
                                    item.type === 'income' 
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  }`}>
                                    {item.type}
                                  </span>
                                </td>
                                <td className="py-4 px-2 text-sm font-bold text-right text-slate-100">
                                  ₹{Number(item.amount).toFixed(2)}
                                </td>
                                <td className="py-4 px-2 text-sm text-indigo-400 text-right font-bold">
                                  {Number(item.percentage).toFixed(1)}%
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Net Summary Cards */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h2 className="text-lg font-bold text-white tracking-tight mb-6">Financial Balance for this Period</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/15 text-center">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">Total Income</p>
                      <p className="text-2xl font-black text-emerald-400">₹{Number(totalIncome).toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-rose-500/5 rounded-xl p-5 border border-rose-500/15 text-center">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">Total Expenses</p>
                      <p className="text-2xl font-black text-rose-400">₹{Number(totalExpenses).toFixed(2)}</p>
                    </div>

                    <div className={`${netSavings >= 0 ? 'bg-indigo-500/5 border-indigo-500/15' : 'bg-amber-500/5 border-amber-500/15'} rounded-xl p-5 border text-center`}>
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">Net Savings</p>
                      <p className={`text-2xl font-black ${netSavings >= 0 ? 'text-indigo-400' : 'text-amber-500'}`}>
                        ₹{Number(netSavings).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
