import React, { useEffect, useState } from 'react';
import { Building2, Calendar, TrendingDown, TrendingUp, Wallet, User, CreditCard, ChevronDown } from 'lucide-react';

interface AccountEntry {
  date: string;
  category: string;
  amount: number;
  whoGive?: string;
  paymentMode?: string;
}
export default function SiteAccountPage() {
  const [entries, setEntries] = useState([]);
  const [availableSites, setAvailableSites] = useState([]);
  const [month, setMonth] = useState(4); // April
  const [year, setYear] = useState(2025);
  const [siteName, setSiteName] = useState('');
  const [openingBalance, setOpeningBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    type: 'EXPENSE',
    category: '',
    description: '',
    amount: 0,
    whoGive: '',
    paymentMode: '',
    location: 'LUCKNOW'
  });
  

  // ✅ Fetch unique site names on mount
  useEffect(() => {
    if (!siteName) return;
    const fetchEntries = async () => {
      try {
        const res = await fetch(`http://localhost:3000/account/${siteName}`);
        const data = await res.json();
        setEntries(data || []);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setEntries([]);
      }
    };
    fetchEntries();
  }, [siteName]);
  
  // ✅ Fetch entries when siteName/month/year changes
  useEffect(() => {
    if (!siteName) return; // Don't run until siteName is set
    const fetchEntries = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/account?month=${month}&year=${year}&siteName=${siteName}`
        );
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setEntries([]); // Optionally set default entries
      }
    };
    fetchEntries();
  }, [month, year, siteName]);
  useEffect(() => {
    if (!siteName) return;
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/account/summary?month=${month}&year=${year}&siteName=${siteName}`
        );
        const data = await res.json();
        setOpeningBalance(data.totalIncome || 0);
      } catch (err) {
        console.error('Error fetching summary:', err);
        setOpeningBalance(0);
      }
    };
    fetchSummary();
  }, [month, year, siteName]);
  

  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount||"", 0);
  const remainingBalance = openingBalance - totalAmount;

  const getMonthName = (monthNum: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1];
  };

  const getPaymentModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'cash': return '💵';
      case 'bank transfer': return '🏦';
      case 'cheque': return '📄';
      case 'upi': return '📱';
      default: return '💳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-slate-200/60">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {siteName}
              </h1>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-slate-600 mb-6">
              <Calendar className="w-5 h-5" />
              <span className="text-xl font-medium">{getMonthName(month)} {year}</span>
            </div>

            {/* Site Selector */}
            <div className="inline-flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-sm font-semibold text-slate-700">Switch Site:</label>
              <div className="relative">
                <select
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {availableSites.map((site) => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
                    <div className="flex justify-end mb-4">
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
                + Add Entry
            </button>
            </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Particular</th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Who Give</th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {/* Opening Balance Row */}
                <tr className="bg-gradient-to-r from-emerald-50 to-green-50 border-b-2 border-emerald-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-bold text-emerald-800 text-lg">OPENING BALANCE</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-2xl font-bold text-emerald-700">
                      ₹{openingBalance.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4"></td>
                </tr>

                {/* Entry Rows */}
                {entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-all duration-150 border-b border-slate-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {new Date(entry.date).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(entry.date).toLocaleDateString('en-GB', { 
                              weekday: 'short' 
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{entry.category}</div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-lg font-bold text-slate-900">
                          ₹{entry.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{entry.whoGive || '-'}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                        <span className="text-sm">{getPaymentModeIcon(entry.paymentMode || '')}</span>
                        <span className="text-xs font-medium text-slate-700">{entry.paymentMode || '-'}</span>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Total Expenditure Row */}
                <tr className="bg-gradient-to-r from-slate-100 to-gray-100 border-y-2 border-slate-300">
                  <td className="px-6 py-4 text-right font-bold text-slate-800" colSpan={2}>
                    <div className="flex items-center justify-end gap-2">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      <span className="text-lg">TOTAL EXPENDITURE</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-2xl font-bold text-red-600">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4" colSpan={2}></td>
                </tr>

                {/* Closing Balance Row */}
                <tr className={`${remainingBalance >= 0 ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-gradient-to-r from-red-50 to-rose-50'} border-t-2 ${remainingBalance >= 0 ? 'border-blue-200' : 'border-red-200'}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`${remainingBalance >= 0 ? 'bg-blue-100' : 'bg-red-100'} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Wallet className={`w-6 h-6 ${remainingBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                      </div>
                      <span className={`font-bold text-xl ${remainingBalance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                        CLOSING BALANCE
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5"></td>
                  <td className="px-6 py-5 text-right">
                    <span className={`text-3xl font-bold ${remainingBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                      ₹{remainingBalance.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-5" colSpan={2}>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${remainingBalance >= 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {remainingBalance >= 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          Surplus
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4" />
                          Deficit
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Opening Balance</span>
            </div>
            <div className="text-2xl font-bold text-emerald-700">₹{openingBalance.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Total Expenditure</span>
            </div>
            <div className="text-2xl font-bold text-red-600">₹{totalAmount.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200/60">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${remainingBalance >= 0 ? 'bg-blue-100' : 'bg-red-100'} p-2 rounded-lg`}>
                <Wallet className={`w-5 h-5 ${remainingBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
              </div>
              <span className="text-sm font-medium text-slate-600">Closing Balance</span>
            </div>
            <div className={`text-2xl font-bold ${remainingBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              ₹{remainingBalance.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {remainingBalance >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Add Account Entry</h2>
      
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await fetch('http://localhost:3000/account', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...formData, siteName, month, year })
            });
            const result = await res.json();
            setEntries([...entries, result]); // Update entries
            setShowModal(false); // Close modal
            setFormData({
                date: '',
                type: 'EXPENSE',
                category: '',
                description: '',
                amount: 0,
                whoGive: '',
                paymentMode: '',
                location: 'LUCKNOW'
              });
              
          } catch (err) {
            console.error('Error submitting form:', err);
          }
        }}
        className="space-y-4"
      >
            <div>
            <label className="text-sm font-medium text-slate-700">Date</label>
            <input type="date" required className="w-full border p-2 rounded" value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>

            <div>
            <label className="text-sm font-medium text-slate-700">Category</label>
            <input type="text" required className="w-full border p-2 rounded" value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <input type="text" className="w-full border p-2 rounded" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div>
            <label className="text-sm font-medium text-slate-700">Amount (₹)</label>
            <input type="number" required className="w-full border p-2 rounded" value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} />
            </div>

            <div>
            <label className="text-sm font-medium text-slate-700">Who Give</label>
            <input type="text" className="w-full border p-2 rounded" value={formData.whoGive}
                onChange={(e) => setFormData({ ...formData, whoGive: e.target.value })} />
            </div>

            <div>
            <label className="text-sm font-medium text-slate-700">Payment Mode</label>
            <select className="w-full border p-2 rounded" value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}>
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="bank transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
            </select>
            </div>
            <div>
            <label className="text-sm font-medium text-slate-700">Location</label>
            <input type="text" className="w-full border p-2 rounded" value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div>
            <label className="text-sm font-medium text-slate-700">Type</label>
            <select className="w-full border p-2 rounded" value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
            </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded">
                Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">
                Save Entry
            </button>
            </div>
        </form>

        {/* Close X Button */}
        <button
            className="absolute top-3 right-4 text-slate-500 hover:text-slate-700 text-xl"
            onClick={() => setShowModal(false)}
        >
            ×
        </button>
        </div>
    </div>
    )}

    </div>
  );
}