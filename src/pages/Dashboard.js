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
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];

  const chartData = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: backgroundColors.slice(0, categoryNames.length),
        borderColor: '#ffffff',
        borderWidth: 2,
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
          boxWidth: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Get 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, <span className="font-semibold text-blue-600">{user?.name || 'User'}</span>! Here is your finance summary.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                {error}
              </div>
            )}

            {/* Loading Indicator */}
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500 font-medium">Fetching your records...</p>
              </div>
            ) : (
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Income */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6 transition transform hover:-translate-y-1 hover:shadow-md duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Income</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">₹{totalIncome.toFixed(2)}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl">
                        📈
                      </div>
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6 transition transform hover:-translate-y-1 hover:shadow-md duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Expenses</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">₹{totalExpenses.toFixed(2)}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-2xl">
                        📉
                      </div>
                    </div>
                  </div>

                  {/* Net Balance */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6 transition transform hover:-translate-y-1 hover:shadow-md duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Net Balance</p>
                        <p className={`text-3xl font-bold mt-1 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                          ₹{netBalance.toFixed(2)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                        💰
                      </div>
                    </div>
                  </div>

                  {/* Transaction Count */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6 transition transform hover:-translate-y-1 hover:shadow-md duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Transactions</p>
                        <p className="text-3xl font-bold text-purple-600 mt-1">{numTransactions}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl">
                        💳
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Main Visuals */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Transactions List */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                        <Link to="/transactions" className="text-blue-600 font-semibold text-sm hover:underline">
                          View All
                        </Link>
                      </div>

                      {recentTransactions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <span className="text-4xl block mb-2">💸</span>
                          No transactions yet. Start adding transactions to see them here.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase">
                                <th className="pb-3 font-semibold">Date</th>
                                <th className="pb-3 font-semibold">Category</th>
                                <th className="pb-3 font-semibold">Description</th>
                                <th className="pb-3 font-semibold text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentTransactions.map((t) => (
                                <tr key={t.id} className="border-b border-gray-55 hover:bg-gray-50 transition duration-150">
                                  <td className="py-4 text-sm text-gray-600 font-medium">{t.date}</td>
                                  <td className="py-4">
                                    <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                                      {t.category}
                                    </span>
                                  </td>
                                  <td className="py-4 text-sm text-gray-500 truncate max-w-xs">{t.description || '—'}</td>
                                  <td className={`py-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 font-display">Expense Breakdown</h2>
                    {categoryNames.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-12">
                        <span className="text-4xl block mb-2">📊</span>
                        <p>No expense data available.</p>
                        <p className="text-xs text-gray-400 mt-1">Add expense transactions to view the chart.</p>
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
