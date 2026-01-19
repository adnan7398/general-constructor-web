import React, { useEffect, useState } from 'react';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Building2, TrendingUp, TrendingDown, Plus, X, Calendar, Receipt, User, CreditCard, FileSpreadsheet, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportBudgetToExcel, exportBudgetToPDF } from '../../utils/exportAccount';
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
  category: string;
}

export default function SiteAccountPage() {
  const { settings: appearanceSettings } = useAppearance();
  const [filters, setFilters] = useState({
    particular: '',
    category: '',
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string>('');
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
      (!filters.category || entry.category?.toLowerCase().includes(filters.category.toLowerCase())) &&
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
      category: '',
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
    if (!entryId) {
      alert('Invalid entry ID');
      return;
    }

    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete entry');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to delete entry');
    }
  };
  
  const handleClick = () => {
    navigator('/totalaccount');
  }
  const handleAddEntry = async () => {
    try {
      // Validate required fields
      if (!newEntry.date || !newEntry.type || !newEntry.typeofExpense || !newEntry.category || !newEntry.amount || newEntry.Quantity === undefined) {
        alert('Please fill in all required fields: Date, Type, Type of Expense, Category, Amount, and Quantity');
        return;
      }

      if (isEditing) {
        // Update existing entry
        console.log('Sending edit data:', { entryId: editingEntryId, newEntry });
        
        // Ensure all required fields are present
        const entryToSend = {
          date: newEntry.date,
          type: newEntry.type,
          typeofExpense: newEntry.typeofExpense,
          category: newEntry.category,
          particular: newEntry.particular || '',
          amount: newEntry.amount,
          Quantity: newEntry.Quantity,
          paymentMode: newEntry.paymentMode || ''
        };
        
        console.log('Processed entry data:', entryToSend);
        
        const response = await fetch(`${API_BASE_URL}/${siteName}`, {
          method: 'PUT',
          headers: {'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            entryId: editingEntryId, 
            newEntry: entryToSend 
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update entry');
        }

        // Update local state
        setEntries(prev => prev.map(entry => 
          entry._id === editingEntryId ? { ...entry, ...newEntry } : entry
        ));
        
        setIsEditing(false);
        setEditingEntryId('');
      } else {
        // Add new entry
        const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, entries: [newEntry] })
      });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add entry');
        }

        const result = await response.json();
      setEntries(prev => [...prev, newEntry as AccountEntry]);
      }

      setNewEntry({});
      setShowModal(false);
    } catch (err: any) {
      console.error('Failed to add/update entry:', err);
      alert(err.message || 'Failed to add/update entry');
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
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-100">Site Ledger Overview</h1>
                <p className="text-slate-400 mt-1">{currentMonthYear}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
              <div className="flex items-center gap-3 flex-1">
                <label className="text-sm font-semibold text-slate-300 whitespace-nowrap">
                  Current Site:
                </label>
                <select
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="flex-1 border border-slate-600 rounded-xl px-4 py-3 text-sm bg-slate-700/50 text-slate-200 focus:border-primary-500 focus:outline-none"
                >
                  <option value="">Select a Site</option>
                  {availableSites.map((site) => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setShowAddSite(!showAddSite)}
                className="text-sm font-medium text-primary-400 hover:text-primary-300 bg-primary-500/20 hover:bg-primary-500/30 px-4 py-2 rounded-xl whitespace-nowrap border border-slate-600"
              >
                + Add New Site
              </button>
              <button
                  onClick={handleClick}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 text-slate-200"
                >
                  <Building2 className="h-5 w-5 text-primary-400" />
                  <span className="text-sm font-medium">Total Account</span>
              </button>
            </div>
            
            {showAddSite && (
              <div className="flex gap-3 w-full max-w-md">
                <input
                  type="text"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  className="flex-1 border border-slate-600 rounded-xl px-4 py-2 text-sm bg-slate-700/50 text-slate-200 placeholder-slate-500 focus:border-primary-500 focus:outline-none"
                  placeholder="Enter site name"
                />
                <button onClick={addSite} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl text-sm font-medium">
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-semibold text-slate-300">Opening Balance</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">₹{income.toLocaleString('en-IN')}</div>
            <div className="text-sm text-slate-500 mt-1">Total Income</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-semibold text-slate-300">Total Expenditure</span>
            </div>
            <div className="text-3xl font-bold text-red-400">₹{expense.toLocaleString('en-IN')}</div>
            <div className="text-sm text-slate-500 mt-1">Total Expenses</div>
          </div>
          <div className={`bg-slate-800 border border-slate-700 p-6 rounded-xl`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${closingBalance >= 0 ? 'bg-blue-500/20' : 'bg-amber-500/20'}`}>
                <Building2 className={`w-5 h-5 ${closingBalance >= 0 ? 'text-blue-400' : 'text-amber-400'}`} />
              </div>
              <span className="font-semibold text-slate-300">Closing Balance</span>
            </div>
            <div className={`text-3xl font-bold ${closingBalance >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
              ₹{Math.abs(closingBalance).toLocaleString('en-IN')}
            </div>
            <div className="text-sm mt-1">
              {closingBalance >= 0 ? <span className="text-emerald-400 font-medium">Surplus</span> : <span className="text-amber-400 font-medium">Deficit</span>}
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Ledger Entries</h2>
              <p className="text-slate-400 text-sm mt-1">Track all income and expenses</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => exportBudgetToExcel(filteredEntries, siteName, income, expense, closingBalance)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-800 bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 text-sm font-medium">
                <FileSpreadsheet className="w-4 h-4" /> Download Excel
              </button>
              <button onClick={() => exportBudgetToPDF(filteredEntries, siteName, income, expense, closingBalance)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-800 bg-red-900/30 text-red-300 hover:bg-red-900/50 text-sm font-medium">
                <FileDown className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => { setShowModal(true); setIsEditing(false); setEditingEntryId(''); setNewEntry({}); }} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium">
                <Plus className="w-5 h-5" /> Add Entry
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
          <div className="bg-slate-700/30 p-4 flex flex-wrap gap-4 items-center border-b border-slate-700">
                <input type="text" placeholder="Filter by particular" value={filters.particular} onChange={e => setFilters({ ...filters, particular: e.target.value })} className="border border-slate-600 bg-slate-700/50 text-slate-200 placeholder-slate-500 px-3 py-2 rounded-lg text-sm w-48 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                <input type="text" placeholder="Filter by category" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className="border border-slate-600 bg-slate-700/50 text-slate-200 placeholder-slate-500 px-3 py-2 rounded-lg text-sm w-48 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                <input type="number" placeholder="Min Amount" onChange={e => setFilters({ ...filters, minAmount: Number(e.target.value) || 0 })} className="border border-slate-600 bg-slate-700/50 text-slate-200 placeholder-slate-500 px-3 py-2 rounded-lg text-sm w-32 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                <input type="number" placeholder="Max Amount" onChange={e => setFilters({ ...filters, maxAmount: Number(e.target.value) || Infinity })} className="border border-slate-600 bg-slate-700/50 text-slate-200 placeholder-slate-500 px-3 py-2 rounded-lg text-sm w-32 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                <input type="number" placeholder="Min Quantity" onChange={e => setFilters({ ...filters, minQuantity: Number(e.target.value) || 0 })} className="border border-slate-600 bg-slate-700/50 text-slate-200 placeholder-slate-500 px-3 py-2 rounded-lg text-sm w-32 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                <select onChange={e => setFilters({ ...filters, type: e.target.value as 'INCOME' | 'EXPENSE' | '' })} className="border border-slate-600 bg-slate-700/50 text-slate-200 px-3 py-2 rounded-lg text-sm w-36 focus:outline-none focus:ring-1 focus:ring-primary-500">
                  <option value="">All Types</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
                <button onClick={() => setFilters({ particular: '', category: '', minAmount: 0, maxAmount: Infinity, type: '', minQuantity: 0 })} className="text-sm text-primary-400 hover:text-primary-300">
                  Clear Filters
                </button>
              </div>

            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-400 text-sm">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-400 text-sm">Particular</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-400 text-sm">Category</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-400 text-sm">Type of Expense</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-400 text-sm">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-400 text-sm">Quantity</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-400 text-sm">Payment Mode</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-400 text-sm">Type</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-400 text-sm">Actions</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-400 text-sm">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="py-4 px-6 text-slate-300">
                      {entry.date ? new Date(entry.date).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-medium">{entry.particular || '-'}</td>
                    <td className="py-4 px-6 text-slate-300">{entry.category || '-'}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.typeofExpense === 'LABOUR' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-600 text-slate-300'}`}>
                        {entry.typeofExpense || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-bold ${entry.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                        ₹{entry.amount ? entry.amount.toLocaleString('en-IN') : 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">{entry.Quantity || '-'}</td>
                    <td className="py-4 px-6 text-slate-300">{entry.paymentMode || '-'}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => { setNewEntry(entry); setIsEditing(true); setEditingEntryId(entry._id || ''); setShowModal(true); }} className="text-primary-400 hover:text-primary-300 font-medium text-sm">
                        Edit
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => deleteEntry(entry._id?.toString()||"")} className="text-red-400 hover:text-red-300 font-medium text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <Receipt className="w-12 h-12 text-slate-600" />
                        <p className="text-lg font-medium text-slate-400">No entries available</p>
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

      {/* Excel-style Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{isEditing ? 'Edit Entry' : 'New Ledger Entry'}</h3>
                  <p className="text-slate-500 text-xs">Fill in the row below like a spreadsheet</p>
                </div>
              </div>
              <button onClick={() => { setShowModal(false); setIsEditing(false); setEditingEntryId(''); setNewEntry({}); }} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spreadsheet-style form */}
            <div className="flex-1 overflow-auto">
              <div className="min-w-[700px]">
                {/* Column Headers - like Excel */}
                <div className="grid grid-cols-12 bg-slate-700/80 border-b border-slate-600 sticky top-0">
                  <div className="col-span-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide border-r border-slate-600">Date</div>
                  <div className="col-span-3 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide border-r border-slate-600">Particular</div>
                  <div className="col-span-1 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide border-r border-slate-600 text-right">Qty</div>
                  <div className="col-span-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide border-r border-slate-600 text-right">Amount (₹)</div>
                  <div className="col-span-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide border-r border-slate-600">Type</div>
                  <div className="col-span-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Expense Type</div>
                </div>

                {/* Input Row - like a spreadsheet row */}
                <div className="grid grid-cols-12 border-b border-slate-600 bg-slate-800">
                  <div className="col-span-2 border-r border-slate-600">
                    <input
                      type="date"
                      value={newEntry.date || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                      className="w-full h-full px-3 py-3 bg-transparent text-slate-200 text-sm focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 border-0"
                    />
                  </div>
                  <div className="col-span-3 border-r border-slate-600">
                    <input
                      type="text"
                      placeholder="Description..."
                      value={newEntry.particular || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, particular: e.target.value })}
                      className="w-full h-full px-3 py-3 bg-transparent text-slate-200 text-sm placeholder-slate-500 focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 border-0"
                    />
                  </div>
                  <div className="col-span-1 border-r border-slate-600">
                    <input
                      type="number"
                      placeholder="0"
                      value={newEntry.Quantity || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, Quantity: Number(e.target.value) })}
                      className="w-full h-full px-3 py-3 bg-transparent text-slate-200 text-sm text-right placeholder-slate-500 focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 border-0"
                    />
                  </div>
                  <div className="col-span-2 border-r border-slate-600">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newEntry.amount || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                      className="w-full h-full px-3 py-3 bg-transparent text-slate-200 text-sm text-right placeholder-slate-500 focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 border-0 font-medium"
                    />
                  </div>
                  <div className="col-span-2 border-r border-slate-600">
                    <select
                      value={newEntry.type || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                      className={`w-full h-full px-3 py-3 bg-transparent text-sm focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 border-0 ${newEntry.type === 'INCOME' ? 'text-emerald-400' : newEntry.type === 'EXPENSE' ? 'text-red-400' : 'text-slate-400'}`}
                    >
                      <option value="" className="bg-slate-800 text-slate-400">Select...</option>
                      <option value="INCOME" className="bg-slate-800 text-emerald-400">INCOME</option>
                      <option value="EXPENSE" className="bg-slate-800 text-red-400">EXPENSE</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={newEntry.typeofExpense || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, typeofExpense: e.target.value as 'LABOUR' | 'MATERIAL' })}
                      className="w-full h-full px-3 py-3 bg-transparent text-slate-200 text-sm focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 border-0"
                    >
                      <option value="" className="bg-slate-800 text-slate-400">Select...</option>
                      <option value="LABOUR" className="bg-slate-800">LABOUR</option>
                      <option value="MATERIAL" className="bg-slate-800">MATERIAL</option>
                    </select>
                  </div>
                </div>

                {/* Second row for additional fields */}
                <div className="grid grid-cols-12 bg-slate-800/50 border-b border-slate-600">
                  <div className="col-span-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-r border-slate-600 flex items-center">Category</div>
                  <div className="col-span-4 border-r border-slate-600">
                    <input
                      type="text"
                      placeholder="e.g. Cement, Steel, Wages..."
                      value={newEntry.category || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                      className="w-full h-full px-3 py-3 bg-transparent text-slate-200 text-sm placeholder-slate-500 focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 border-0"
                    />
                  </div>
                  <div className="col-span-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-r border-slate-600 flex items-center">Payment</div>
                  <div className="col-span-4">
                    <select
                      value={newEntry.paymentMode || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, paymentMode: e.target.value })}
                      className="w-full h-full px-3 py-3 bg-transparent text-slate-200 text-sm focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 border-0"
                    >
                      <option value="" className="bg-slate-800 text-slate-400">Select mode...</option>
                      <option value="Cash" className="bg-slate-800">Cash</option>
                      <option value="UPI" className="bg-slate-800">UPI</option>
                      <option value="Bank Transfer" className="bg-slate-800">Bank Transfer</option>
                      <option value="Cheque" className="bg-slate-800">Cheque</option>
                      <option value="Credit" className="bg-slate-800">Credit</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview & Actions */}
            <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/80">
              {/* Quick preview */}
              {(newEntry.particular || newEntry.amount) && (
                <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-xs text-slate-500 mb-1">Preview:</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">{newEntry.date || 'No date'}</span>
                    <span className="text-slate-200 font-medium flex-1">{newEntry.particular || 'No description'}</span>
                    <span className={`font-bold ${newEntry.type === 'INCOME' ? 'text-emerald-400' : newEntry.type === 'EXPENSE' ? 'text-red-400' : 'text-slate-400'}`}>
                      {newEntry.type === 'EXPENSE' ? '-' : ''}₹{(newEntry.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  Tip: Press Tab to move between cells
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setShowModal(false); setIsEditing(false); setEditingEntryId(''); setNewEntry({}); }} className="px-5 py-2.5 text-slate-300 hover:bg-slate-700 rounded-lg font-medium text-sm">
                    Cancel
                  </button>
                  <button onClick={handleAddEntry} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {isEditing ? 'Update Entry' : 'Add to Ledger'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
