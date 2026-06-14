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
    date: new Date().toISOString().split('T')[0],
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-8 transition-all duration-300 relative overflow-hidden">
          {/* Page Background Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Transactions</h1>
            <p className="text-slate-400 mt-1.5 text-sm mb-8">
              Log and manage your financial records securely in real-time.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-rose-955/20 border-l-4 border-rose-500 text-rose-350 rounded-xl text-sm backdrop-blur-sm animate-fade-in">
                {error}
              </div>
            )}

            {/* Add Transaction Form */}
            <div className="glass-panel p-6 rounded-2xl mb-8">
              <h2 className="text-lg font-bold text-white tracking-tight mb-6">Add New Transaction</h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
                {/* Type */}
                <div>
                  <label className="block text-slate-350 font-semibold mb-2 text-xs uppercase tracking-widest">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-900/40 text-slate-100 text-sm cursor-pointer"
                  >
                    <option className="bg-slate-950 text-slate-200" value="income">Income</option>
                    <option className="bg-slate-950 text-slate-200" value="expense">Expense</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-slate-350 font-semibold mb-2 text-xs uppercase tracking-widest">
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
                    className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-900/40 text-slate-100 text-sm placeholder-slate-650"
                    placeholder="0.00"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-slate-350 font-semibold mb-2 text-xs uppercase tracking-widest">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-900/40 text-slate-100 text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-slate-355 font-semibold mb-2 text-xs uppercase tracking-widest">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-900/40 text-slate-100 text-sm cursor-pointer"
                  >
                    <option className="bg-slate-950 text-slate-200" value="Food">Food</option>
                    <option className="bg-slate-950 text-slate-200" value="Transport">Transport</option>
                    <option className="bg-slate-950 text-slate-200" value="Entertainment">Entertainment</option>
                    <option className="bg-slate-950 text-slate-200" value="Utilities">Utilities</option>
                    <option className="bg-slate-950 text-slate-200" value="Healthcare">Healthcare</option>
                    <option className="bg-slate-950 text-slate-200" value="Shopping">Shopping</option>
                    <option className="bg-slate-950 text-slate-200" value="Education">Education</option>
                    <option className="bg-slate-950 text-slate-200" value="Salary">Salary</option>
                    <option className="bg-slate-950 text-slate-200" value="Investment">Investment</option>
                    <option className="bg-slate-950 text-slate-200" value="Other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-slate-350 font-semibold mb-2 text-xs uppercase tracking-widest">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-900/40 text-slate-100 text-sm placeholder-slate-650"
                    placeholder="Details (optional)"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-5 mt-3">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-550 hover:to-violet-550 text-white font-semibold py-2.5 rounded-xl transition duration-300 cursor-pointer shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 ${submitLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {submitLoading ? 'Adding Records...' : '+ Add Transaction'}
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions List */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white tracking-tight mb-6">Transactions History</h2>
              
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-4 text-slate-400 text-sm">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/10">
                  <p className="text-3xl mb-2">💳</p>
                  <p className="text-sm">No transaction records found. Add one above to get started!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider">
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
                        <tr key={t.id} className="border-b border-slate-900/50 hover:bg-slate-900/25 transition duration-150">
                          <td className="py-4 px-4 text-sm text-slate-350 font-medium">{t.date}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 text-2xs font-bold rounded-lg uppercase tracking-wider border ${
                              t.type === 'income' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 text-2xs font-bold bg-slate-900 border border-slate-800 text-slate-300 rounded-lg">
                              {t.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-400 max-w-xs truncate">{t.description || '—'}</td>
                          <td className={`py-4 px-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="text-slate-500 hover:text-rose-450 font-medium text-base focus:outline-none transition duration-150 p-1.5 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 cursor-pointer"
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
