import React, { useEffect, useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Plus, X, Calendar, Receipt, User, CreditCard } from 'lucide-react';
import {useNavigate } from 'react-router-dom';
interface AccountEntry {
  _id?: string;
  siteName?: string;
  date: string;
  particular: string;
  amount: number;
  Quantity?: number;
  paymentMode?: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
  typeofExpense?: 'LABOUR' | 'MATERIAL';
}

export default function SiteAccountPage() {
  const [filters, setFilters] = useState({
    particular: '',
    minAmount: 0,
    maxAmount: Infinity,
    type: '',
    minQuantity: 0,
  });
    const navigator = useNavigate();
  const [entries, setEntries] = useState<AccountEntry[]>([]);
  const [availableSites, setAvailableSites] = useState<string[]>([]);
  const [siteName, setSiteName] = useState('');
  const [showAddSite, setShowAddSite] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<AccountEntry>>({});
  const token = localStorage.getItem('token');
  const API_BASE_URL = 'https://general-constructor-web-2.onrender.com/account';
  if (!token) {
    alert('Please sign in to access this page.');
    console.log('No token found, redirecting to sign in');
    window.location.href = '/signin';
  }

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sites`,{
          headers: {  'Authorization': `Bearer ${token}` }
        });
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
        const res = await fetch(`${API_BASE_URL}/${siteName}`,{
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error('Error fetching entries:', err);
      }
    };
    fetchEntries();
  }, [siteName]);
  const filteredEntries = entries.filter(entry => {
    return (
      (!filters.particular || entry.particular?.toLowerCase().includes(filters.particular.toLowerCase())) &&
      (entry.amount >= filters.minAmount) &&
      (entry.amount <= filters.maxAmount) &&
      (!filters.type || entry.type === filters.type) &&
      (entry.Quantity === undefined || entry.Quantity >= filters.minQuantity)
    );
  });
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'minAmount' || name === 'maxAmount' || name === 'minQuantity' ? Number(value) : value
    }));
  };
  const resetFilters = () => {
    setFilters({
      particular: '',
      minAmount: 0,
      maxAmount: Infinity,
      type: '',
      minQuantity: 0,
    });
  };  

  const addSite = async () => {
    if (!newSite.trim()) return;
    try {
      await fetch(`${API_BASE_URL}/newsite`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
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
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSiteName(e.target.value);
  };
  

  const handleNewEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'Quantity' ? Number(value) : value
    }));
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${siteName}/${entryId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Entry deleted successfully');
        setEntries(prev => prev.filter(entry => entry._id !== entryId));
      } else {
        console.error('Failed to delete entry');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleClick = () => {
    navigator('/totalaccount');
  }
  const handleAddEntry = async () => {
    try {
      await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, entries: [newEntry] })
      });
      setEntries(prev => [...prev, newEntry as AccountEntry]);
      setNewEntry({});
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add entry:', err);
    }
  };

  
  const income = filteredEntries
  .filter((e) => e.type === 'INCOME')
  .reduce((sum, e) => sum + (e.amount || 0), 0);

const expense = filteredEntries
  .filter((e) => e.type === 'EXPENSE')
  .reduce((sum, e) => sum + (e.amount || 0), 0);

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
              <button
                  onClick={handleClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition"
                >
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">Total Account</span>
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
          <div className="bg-white/90 p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center">
                <input
                  type="text"
                  placeholder="Filter by particular"
                  value={filters.particular}
                  onChange={e => setFilters({ ...filters, particular: e.target.value })}
                  className="border px-3 py-2 rounded-lg text-sm w-48"
                />
                <input
                  type="number"
                  placeholder="Min Amount"
                  onChange={e => setFilters({ ...filters, minAmount: Number(e.target.value) || 0 })}
                  className="border px-3 py-2 rounded-lg text-sm w-32"
                />
                <input
                  type="number"
                  placeholder="Max Amount"
                  onChange={e => setFilters({ ...filters, maxAmount: Number(e.target.value) || Infinity })}
                  className="border px-3 py-2 rounded-lg text-sm w-32"
                />
                <input
                  type="number"
                  placeholder="Min Quantity"
                  onChange={e => setFilters({ ...filters, minQuantity: Number(e.target.value) || 0 })}
                  className="border px-3 py-2 rounded-lg text-sm w-32"
                />
                <select
                  onChange={e => setFilters({ ...filters, type: e.target.value as 'INCOME' | 'EXPENSE' | '' })}
                  className="border px-3 py-2 rounded-lg text-sm w-36"
                >
                  <option value="">All Types</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
                <button
                  onClick={() => setFilters({ particular: '', minAmount: 0, maxAmount: Infinity, type: '', minQuantity: 0 })}
                  className="text-sm text-blue-600 underline"
                >
                  Clear Filters
                </button>
              </div>

            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Particular</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm">Type of Expense</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Quantity</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Payment Mode</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm">Type</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm">Actions</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-150">
                    <td className="py-4 px-6 text-slate-700">
                      {entry.date ? new Date(entry.date).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium">{entry.particular || '-'}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.typeofExpense === 'LABOUR' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-slate-700'
                      }`}>
                        {entry.typeofExpense || '-'}
                      </span>
                    </td>
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
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => {
                          setNewEntry(entry);
                          setShowModal(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => deleteEntry(entry._id?.toString()||"")} // assuming _id exists
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                      >
                        Delete  
  </button>
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
                  value={newEntry.date || ''}
                  placeholder="Select date"
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
                  value={newEntry.particular || ''}
                  type="text"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200" 
                  onChange={(e) => setNewEntry({ ...newEntry, particular: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹)</label>
                <input 
                  placeholder="0.00" 
                  type="number" 
                  value={newEntry.amount || ''}
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
                  value={newEntry.Quantity || ''}
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Expenses Type</label>
                <select 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200" 
                  onChange={(e) => setNewEntry({ ...newEntry, typeofExpense: e.target.value as 'LABOUR' | 'MATERIAL' })}
                >
                  <option value="">Select Type</option>
                  <option value="LABOUR"> Labour</option>
                  <option value="MATERIAL"> MATERIAL</option>
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
