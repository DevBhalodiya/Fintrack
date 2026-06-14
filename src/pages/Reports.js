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
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#14B8A6', // Teal
    '#6366F1'  // Indigo
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
        borderColor: '#ffffff',
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
          boxWidth: 12,
          padding: 15,
        }
      }
    }
  };

  // Bar chart data (Summary comparison)
  const barChartData = {
    labels: ['Total Income', 'Total Expenses'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [totalIncome, totalExpenses],
        backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)'],
        borderColor: ['#10B981', '#EF4444'],
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports</h1>
            <p className="text-gray-600 mb-8">
              Analyze your spending and income trends over time.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                {error}
              </div>
            )}

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Reports</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Report Type
                  </label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="expense">Expense Report</option>
                    <option value="income">Income Report</option>
                    <option value="summary">Summary Report (Income vs Expense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Time Period
                  </label>
                  <select 
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter (90 Days)</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500 font-medium">Analyzing transaction data...</p>
              </div>
            ) : (
              <>
                {/* Reports Visuals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Expense / Income Breakdown Chart */}
                  {reportType !== 'summary' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[350px]">
                      <h2 className="text-xl font-bold text-gray-800 mb-6 capitalize">{reportType} Breakdown</h2>
                      {categoryBreakdown.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                          <span className="text-4xl block mb-2">📊</span>
                          <p>No data found for this period.</p>
                          <p className="text-xs text-gray-400 mt-1">Try changing filters or adding transactions.</p>
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[350px]">
                      <h2 className="text-xl font-bold text-gray-800 mb-6">Income vs Expense Summary</h2>
                      {filteredTransactions.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                          <span className="text-4xl block mb-2">📊</span>
                          <p>No data found for this period.</p>
                          <p className="text-xs text-gray-400 mt-1">Try changing filters or adding transactions.</p>
                        </div>
                      ) : (
                        <div className="flex-1 relative min-h-[220px]">
                          <Bar data={barChartData} options={barOptions} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Detailed Category-wise Breakdown Table */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Category Breakdown</h2>
                    
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase">
                            <th className="pb-3 px-2 font-semibold">Category</th>
                            <th className="pb-3 px-2 font-semibold">Type</th>
                            <th className="pb-3 px-2 font-semibold text-right">Amount</th>
                            <th className="pb-3 px-2 font-semibold text-right">Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryBreakdown.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-12 text-center text-gray-500">
                                <span className="text-2xl block mb-1">📋</span>
                                No details available. Add transactions first.
                              </td>
                            </tr>
                          ) : (
                            categoryBreakdown.map((item, idx) => (
                              <tr key={idx} className="border-b border-gray-55 hover:bg-gray-50 transition duration-150">
                                <td className="py-4 px-2 text-sm text-gray-700 font-semibold">{item.category}</td>
                                <td className="py-4 px-2">
                                  <span className={`px-2 py-0.5 text-2xs font-bold rounded uppercase tracking-wider ${
                                    item.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                  }`}>
                                    {item.type}
                                  </span>
                                </td>
                                <td className="py-4 px-2 text-sm font-semibold text-right text-gray-800">
                                  ₹{Number(item.amount).toFixed(2)}
                                </td>
                                <td className="py-4 px-2 text-sm text-gray-500 text-right font-medium">
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Financial Balance for this Period</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50/50 rounded-lg p-5 border border-green-100/30 text-center">
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Income</p>
                      <p className="text-3xl font-extrabold text-green-650">₹{Number(totalIncome).toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-red-50/50 rounded-lg p-5 border border-red-100/30 text-center">
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Expenses</p>
                      <p className="text-3xl font-extrabold text-red-650">₹{Number(totalExpenses).toFixed(2)}</p>
                    </div>

                    <div className={`${netSavings >= 0 ? 'bg-blue-50/50 border-blue-100/30' : 'bg-orange-50/50 border-orange-100/30'} rounded-lg p-5 border text-center`}>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Net Savings</p>
                      <p className={`text-3xl font-extrabold ${netSavings >= 0 ? 'text-blue-650' : 'text-orange-655'}`}>
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
