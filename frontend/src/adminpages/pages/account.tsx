import React, { useEffect, useState } from 'react';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Building2, TrendingUp, TrendingDown, Plus, X, Receipt, FileSpreadsheet, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportBudgetToExcel, exportBudgetToPDF } from '../../utils/exportAccount';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

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
    // Ideally use a redirect hook or component here to avoid render-time side effects
    // console.log('No token found, redirecting to sign in');
    // window.location.href = '/signin';
  }

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setAvailableSites(data);
        if (!siteName && data.length > 0) setSiteName(data[0]);
      } catch (err) {
        console.error('Error fetching sites:', err);
      }
    };
    if (token) fetchSites();
  }, [token]);

  useEffect(() => {
    if (!siteName || !token) return;
    const fetchEntries = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/${siteName}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error('Error fetching entries:', err);
      }
    };
    fetchEntries();
  }, [siteName, token]);

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

        const response = await fetch(`${API_BASE_URL}/${siteName}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
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
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
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
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Ledger</h1>
          <p className="text-sm text-gray-500">Track income and expenses for {siteName || 'your sites'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">Select a Site</option>
              {availableSites.map((site) => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
            <Button size="sm" variant="outline" onClick={() => setShowAddSite(!showAddSite)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {showAddSite && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="New Site Name"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                className="h-9 w-40"
              />
              <Button size="sm" onClick={addSite}>Add</Button>
            </div>
          )}
          <Button size="sm" variant="secondary" onClick={handleClick} leftIcon={<Building2 className="w-4 h-4" />}>
            Total Account
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-600">Total Income</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{income.toLocaleString('en-IN')}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-medium text-gray-600">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{expense.toLocaleString('en-IN')}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-600">Closing Balance</span>
          </div>
          <div className={`text-2xl font-bold ${closingBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{Math.abs(closingBalance).toLocaleString('en-IN')}
          </div>
          <div className="text-sm mt-1 text-gray-500">
            {closingBalance >= 0 ? 'Surplus' : 'Deficit'}
          </div>
        </Card>
      </div>

      {/* Entries Table */}
      <Card noPadding>
        <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Ledger Entries</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => exportBudgetToExcel(filteredEntries, siteName, income, expense, closingBalance)} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Excel
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportBudgetToPDF(filteredEntries, siteName, income, expense, closingBalance)} leftIcon={<FileDown className="w-4 h-4" />}>
              PDF
            </Button>
            <Button size="sm" onClick={() => { setShowModal(true); setIsEditing(false); setEditingEntryId(''); setNewEntry({}); }} leftIcon={<Plus className="w-4 h-4" />}>
              Add Entry
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Input
            placeholder="Particular..."
            value={filters.particular}
            onChange={e => setFilters({ ...filters, particular: e.target.value })}
            className="h-9"
          />
          <Input
            placeholder="Category..."
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}
            className="h-9"
          />
          <Input
            type="number"
            placeholder="Min Amount"
            onChange={e => setFilters({ ...filters, minAmount: Number(e.target.value) || 0 })}
            className="h-9"
          />
          <Input
            type="number"
            placeholder="Max Amount"
            onChange={e => setFilters({ ...filters, maxAmount: Number(e.target.value) || Infinity })}
            className="h-9"
          />
          <select
            value={filters.type}
            onChange={e => setFilters({ ...filters, type: e.target.value })}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <Button size="sm" variant="ghost" onClick={resetFilters}>Clear</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Particular</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium text-center">Exp. Type</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium">Qty</th>
                <th className="px-6 py-3 font-medium">Mode</th>
                <th className="px-6 py-3 font-medium text-center">Type</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                    {entry.date ? new Date(entry.date).toLocaleDateString('en-IN') : '-'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{entry.particular || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{entry.category || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    {entry.typeofExpense && (
                      <Badge variant={entry.typeofExpense === 'LABOUR' ? 'brand' : 'neutral'} size="sm">
                        {entry.typeofExpense}
                      </Badge>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${entry.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                    ₹{entry.amount ? entry.amount.toLocaleString('en-IN') : 0}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{entry.Quantity || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{entry.paymentMode || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={entry.type === 'INCOME' ? 'success' : 'error'} size="sm">
                      {entry.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => { setNewEntry(entry); setIsEditing(true); setEditingEntryId(entry._id || ''); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry(entry._id?.toString() || "")}
                      className="text-red-600 hover:text-red-800 font-medium text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Receipt className="w-8 h-8 text-gray-400" />
                      <p>No entries found for this site.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{isEditing ? 'Edit Entry' : 'New Ledger Entry'}</h3>
                <p className="text-sm text-gray-500">Enter details below</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {/* Spreadsheet-like Grid */}
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-12 md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                  <Input
                    type="date"
                    value={newEntry.date || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                </div>
                <div className="col-span-12 md:col-span-3 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Particular</label>
                  <Input
                    placeholder="Description"
                    value={newEntry.particular || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, particular: e.target.value })}
                  />
                </div>
                <div className="col-span-6 md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Amount (₹)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newEntry.amount || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-6 md:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Qty</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newEntry.Quantity || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, Quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-6 md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                  <select
                    value={newEntry.type || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select...</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div className="col-span-6 md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Exp. Type</label>
                  <select
                    value={newEntry.typeofExpense || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, typeofExpense: e.target.value as 'LABOUR' | 'MATERIAL' })}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select...</option>
                    <option value="LABOUR">Labour</option>
                    <option value="MATERIAL">Material</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                  <Input
                    placeholder="Category (e.g., Cement, Wages)"
                    value={newEntry.category || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  />
                </div>
                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Payment Mode</label>
                  <select
                    value={newEntry.paymentMode || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, paymentMode: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select Mode...</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleAddEntry} leftIcon={<Plus className="w-4 h-4" />}>
                {isEditing ? 'Update Entry' : 'Add Entry'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
