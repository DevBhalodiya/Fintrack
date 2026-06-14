import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { getTransactions } from '../services/transactionService';

// Import Chart.js components
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS elements
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await getTransactions(user.uid);
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load transaction data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate Metrics
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const numTransactions = transactions.length;

  // Prepare Chart Data
  const categoryTotals = {};
  expenseTransactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const categoryNames = Object.keys(categoryTotals);
  const categoryValues = Object.values(categoryTotals);

  const backgroundColors = [
    '#6366f1', // Indigo
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#eab308', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
  ];

  const chartData = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: backgroundColors.slice(0, categoryNames.length),
        borderColor: '#0f172a', // slate-900 border
        borderWidth: 2.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          color: '#94a3b8', // slate-400
          padding: 15,
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
            weight: '600'
          },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        borderWidth: 1,
        titleColor: '#ffffff',
        titleFont: { family: 'Plus Jakarta Sans', weight: 'bold' },
        bodyColor: '#94a3b8',
        bodyFont: { family: 'Plus Jakarta Sans' },
        padding: 10,
        boxPadding: 6,
      }
    },
    cutout: '70%',
  };

  // Get 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-8 transition-all duration-300 relative overflow-hidden">
          {/* Subtle page background glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">Dashboard</h1>
                <p className="text-slate-400 mt-1.5 text-sm">
                  Welcome back, <span className="font-semibold text-indigo-400">{user?.name || 'User'}</span>. Here's your financial summary.
                </p>
              </div>
              <Link
                to="/transactions"
                className="bg-indigo-650/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5 inline-flex items-center justify-center"
              >
                + Add Transaction
              </Link>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-955/20 border-l-4 border-rose-500 text-rose-300 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Loading Indicator */}
            {loading ? (
              <div className="flex flex-col justify-center items-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-4 text-slate-400 font-medium text-sm">Fetching your financial profile...</p>
              </div>
            ) : (
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Income */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-l-4 border-l-emerald-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Income</p>
                        <p className="text-2xl font-black text-emerald-400 mt-2">₹{totalIncome.toFixed(2)}</p>
                      </div>
                      <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center text-lg text-emerald-400 border border-emerald-500/20">
                        📈
                      </div>
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-l-4 border-l-rose-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Expenses</p>
                        <p className="text-2xl font-black text-rose-400 mt-2">₹{totalExpenses.toFixed(2)}</p>
                      </div>
                      <div className="w-11 h-11 bg-rose-500/10 rounded-xl flex items-center justify-center text-lg text-rose-400 border border-rose-500/20">
                        📉
                      </div>
                    </div>
                  </div>

                  {/* Net Balance */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-l-4 border-l-indigo-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Net Balance</p>
                        <p className={`text-2xl font-black mt-2 ${netBalance >= 0 ? 'text-indigo-400' : 'text-amber-500'}`}>
                          ₹{netBalance.toFixed(2)}
                        </p>
                      </div>
                      <div className="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-lg text-indigo-400 border border-indigo-500/20">
                        💰
                      </div>
                    </div>
                  </div>

                  {/* Transaction Count */}
                  <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-l-4 border-l-violet-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Transactions</p>
                        <p className="text-2xl font-black text-violet-400 mt-2">{numTransactions}</p>
                      </div>
                      <div className="w-11 h-11 bg-violet-500/10 rounded-xl flex items-center justify-center text-lg text-violet-400 border border-violet-500/20">
                        💳
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Main Visuals */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Transactions List */}
                  <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white tracking-tight">Recent Transactions</h2>
                        <Link to="/transactions" className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-colors hover:underline">
                          View All
                        </Link>
                      </div>

                      {recentTransactions.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/10">
                          <span className="text-3xl block mb-2">💸</span>
                          No transaction records yet. Start adding details!
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <th className="pb-3 px-3 font-semibold">Date</th>
                                <th className="pb-3 px-3 font-semibold">Category</th>
                                <th className="pb-3 px-3 font-semibold">Description</th>
                                <th className="pb-3 px-3 font-semibold text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentTransactions.map((t) => (
                                <tr key={t.id} className="border-b border-slate-900/50 hover:bg-slate-900/25 transition duration-150">
                                  <td className="py-4 px-3 text-sm text-slate-350 font-medium">{t.date}</td>
                                  <td className="py-4 px-3">
                                    <span className="px-2.5 py-1 text-2xs font-bold bg-slate-900 border border-slate-800 text-slate-300 rounded-lg">
                                      {t.category}
                                    </span>
                                  </td>
                                  <td className="py-4 px-3 text-sm text-slate-400 truncate max-w-xs">{t.description || '—'}</td>
                                  <td className={`py-4 px-3 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expense Breakdown Pie Chart */}
                  <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                    <h2 className="text-lg font-bold text-white tracking-tight mb-6">Expense Breakdown</h2>
                    {categoryNames.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-16 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/10">
                        <span className="text-3xl block mb-2">📊</span>
                        <p className="text-sm">No expenses logged yet.</p>
                        <p className="text-3xs text-slate-650 mt-1">Add items to view category splits.</p>
                      </div>
                    ) : (
                      <div className="flex-1 relative flex items-center justify-center min-h-[220px]">
                        <Doughnut data={chartData} options={chartOptions} />
                      </div>
                    )}
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

export default Dashboard;
