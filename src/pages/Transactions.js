import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { addTransaction, getTransactions, deleteTransaction } from '../services/transactionService';

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0], // Defaults to today's date
  });

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await getTransactions(user.uid);
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setSubmitLoading(true);
    setError('');

    try {
      const newTx = await addTransaction(user.uid, formData);
      
      // Update local state by prepending and sorting client side
      setTransactions(prev => {
        const updated = [newTx, ...prev];
        return updated.sort((a, b) => b.date.localeCompare(a.date));
      });

      // Reset form
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to save transaction.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Transactions</h1>
            <p className="text-gray-600 mb-8">
              Add, search, and manage your financial records.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                {error}
              </div>
            )}

            {/* Add Transaction Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Transaction</h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Type */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    required
                    className="w-full px-4 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-255 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Education">Education</option>
                    <option value="Salary">Salary</option>
                    <option value="Investment">Investment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-250 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter details"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-5 mt-2">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className={`w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 ${submitLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {submitLoading ? 'Adding...' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-3 text-gray-500 text-sm">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-3xl mb-2">💳</p>
                  <p>No transactions yet. Add one above to get started!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase">
                        <th className="pb-3 px-4 font-semibold">Date</th>
                        <th className="pb-3 px-4 font-semibold">Type</th>
                        <th className="pb-3 px-4 font-semibold">Category</th>
                        <th className="pb-3 px-4 font-semibold">Description</th>
                        <th className="pb-3 px-4 font-semibold text-right">Amount</th>
                        <th className="pb-3 px-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b border-gray-55 hover:bg-gray-50 transition duration-150">
                          <td className="py-4 px-4 text-sm text-gray-600 font-medium">{t.date}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                              t.type === 'income' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-750 rounded-full">
                              {t.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500 max-w-xs truncate">{t.description || '—'}</td>
                          <td className={`py-4 px-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-lg focus:outline-none transition duration-150 p-1"
                              title="Delete Transaction"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transactions;
