import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-20 p-8">
          <div className="max-w-7xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports</h1>
            <p className="text-gray-600 mb-8">
              Analyze your spending and income patterns
            </p>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Reports</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Report Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="expense">Expense Report</option>
                    <option value="income">Income Report</option>
                    <option value="summary">Summary Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Time Period
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Expense Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Summary</h2>
                <div className="text-center py-12 text-gray-500">
                  <p>Chart will appear here</p>
                  <p className="text-sm mt-2">Add transactions to see your expense breakdown</p>
                </div>
              </div>

              {/* Income Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Income Summary</h2>
                <div className="text-center py-12 text-gray-500">
                  <p>Chart will appear here</p>
                  <p className="text-sm mt-2">Add transactions to see your income breakdown</p>
                </div>
              </div>
            </div>

            {/* Detailed Report */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Category-wise Breakdown</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Category</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Type</th>
                      <th className="text-right py-3 px-4 text-gray-700 font-semibold">Amount</th>
                      <th className="text-right py-3 px-4 text-gray-700 font-semibold">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                        No data available. Add transactions to see the breakdown.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">₹0.00</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">₹0.00</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Net Savings</p>
                  <p className="text-2xl font-bold text-blue-600">₹0.00</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
