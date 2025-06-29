import React, { useEffect, useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Plus, X, Calendar, Receipt, User, CreditCard } from 'lucide-react';

interface AccountEntry {
  date: string;
  category: string;
  amount: number;
  Quantity?: number;
  paymentMode?: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
}

export default function SiteAccountPage() {
  const [entries, setEntries] = useState<AccountEntry[]>([]);
  const [availableSites, setAvailableSites] = useState<string[]>([]);
  const [siteName, setSiteName] = useState('');
  const [showAddSite, setShowAddSite] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<AccountEntry>>({});

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch('http://localhost:3000/account/sites');
        const data = await res.json();
        setAvailableSites(data);
        if (!siteName && data.length > 0) setSiteName(data[0]);
      } catch (err) {
        console.error('Error fetching sites:', err);
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    if (!siteName) return;
    const fetchEntries = async () => {
      try {
        const res = await fetch(`http://localhost:3000/account/${siteName}`);
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error('Error fetching entries:', err);
      }
    };
    fetchEntries();
  }, [siteName]);

  const addSite = async () => {
    if (!newSite.trim()) return;
    try {
      await fetch('http://localhost:3000/account/newsite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName: newSite, entries: [] })
      });
      setAvailableSites(prev => [...prev, newSite]);
      setSiteName(newSite);
      setNewSite('');
      setShowAddSite(false);
    } catch (err) {
      console.error('Failed to add site:', err);
    }
  };

  const handleAddEntry = async () => {
    try {
      await fetch('http://localhost:3000/account/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, entries: [newEntry] })
      });
      setEntries(prev => [...prev, newEntry as AccountEntry]);
      setNewEntry({});
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add entry:', err);
    }
  };

  

  const income = entries.filter((e) => e.type === 'INCOME').reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter((e) => e.type === 'EXPENSE').reduce((sum, e) => sum + e.amount, 0);
  const closingBalance = income - expense;
  const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Site Ledger Overview
                </h1>
                <p className="text-slate-600 mt-1">{currentMonthYear}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
              <div className="flex items-center gap-3 flex-1">
                <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Current Site:
                </label>
                <select
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:outline-none transition-all duration-200 hover:border-slate-300"
                >
                  <option value="">Select a Site</option>
                  {availableSites.map((site) => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setShowAddSite(!showAddSite)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap border border-blue-200"
              >
                + Add New Site
              </button>
            </div>
            
            {showAddSite && (
              <div className="flex gap-3 w-full max-w-md animate-fade-in">
                <input
                  type="text"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="Enter site name"
                />
                <button 
                  onClick={addSite} 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-emerald-800">Opening Balance</span>
            </div>
            <div className="text-3xl font-bold text-emerald-700">₹{income.toLocaleString('en-IN')}</div>
            <div className="text-sm text-emerald-600 mt-1">Total Income</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-rose-100 border border-red-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500 rounded-xl">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-red-800">Total Expenditure</span>
            </div>
            <div className="text-3xl font-bold text-red-700">₹{expense.toLocaleString('en-IN')}</div>
            <div className="text-sm text-red-600 mt-1">Total Expenses</div>
          </div>
          
          <div className={`bg-gradient-to-br ${closingBalance >= 0 ? 'from-blue-50 to-indigo-100 border-blue-200' : 'from-orange-50 to-red-100 border-orange-200'} border p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${closingBalance >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-xl`}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className={`font-semibold ${closingBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                Closing Balance
              </span>
            </div>
            <div className={`text-3xl font-bold ${closingBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              ₹{Math.abs(closingBalance).toLocaleString('en-IN')}
            </div>
            <div className="text-sm mt-1">
              {closingBalance >= 0 ? 
                <span className="text-blue-600 font-medium">💰 Surplus</span> : 
                <span className="text-orange-600 font-medium">⚠️ Deficit</span>
              }
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Ledger Entries</h2>
              <p className="text-slate-600 text-sm mt-1">Track all income and expenses</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" /> 
              Add Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Particular</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Quantity</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Payment Mode</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm">Type</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-150">
                    <td className="py-4 px-6 text-slate-700">
                      {entry.date ? new Date(entry.date).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium">{entry.category || '-'}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-bold ${entry.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                        ₹{entry.amount ? entry.amount.toLocaleString('en-IN') : 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{entry.Quantity || '-'}</td>
                    <td className="py-4 px-6 text-slate-700">{entry.paymentMode || '-'}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.type === 'INCOME' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <Receipt className="w-12 h-12 text-slate-300" />
                        <p className="text-lg font-medium">No entries available</p>
                        <p className="text-sm">Start by adding your first ledger entry</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Add New Entry</h3>
                <p className="text-slate-600 text-sm mt-1">Enter the transaction details</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input 
                  type="date" 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200" 
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Particular
                </label>
                <input 
                  placeholder="Enter description" 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200" 
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹)</label>
                <input 
                  placeholder="0.00" 
                  type="number" 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200" 
                  onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Qauntity
                </label>
                <input 
                  placeholder="Quantity"
                  type="number" 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200" 
                  onChange={(e) => setNewEntry({ ...newEntry, Quantity: Number(e.target.value )})} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Mode
                </label>
                <input 
                  placeholder="Cash, UPI, Bank Transfer, etc." 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200" 
                  onChange={(e) => setNewEntry({ ...newEntry, paymentMode: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Transaction Type</label>
                <select 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200" 
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                >
                  <option value="">Select Type</option>
                  <option value="INCOME">💰 Income</option>
                  <option value="EXPENSE">💸 Expense</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEntry} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
