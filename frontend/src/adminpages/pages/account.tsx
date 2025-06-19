import React, { useEffect, useState } from 'react';
import {
  Building2, TrendingDown, TrendingUp, Plus,
} from 'lucide-react';

interface AccountEntry {
  date: string;
  category: string;
  amount: number;
  whoGive?: string;
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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-slate-800">{currentMonthYear}</h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 mr-2">Switch Site:</label>
            <select
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select a Site</option>
              {availableSites.map((site) => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddSite(!showAddSite)}
              className="text-sm text-blue-600 underline"
            >
              + Add Site
            </button>
          </div>
          {showAddSite && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                className="border px-2 py-1 text-sm rounded"
                placeholder="Enter site name"
              />
              <button onClick={addSite} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-100 text-green-800 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Opening Balance</span>
            </div>
            <div className="text-xl font-bold mt-2">₹{income}</div>
          </div>
          <div className="bg-red-100 text-red-800 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              <span className="font-semibold">Total Expenditure</span>
            </div>
            <div className="text-xl font-bold mt-2">₹{expense}</div>
          </div>
          <div className="bg-blue-100 text-blue-800 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Closing Balance</span>
            </div>
            <div className="text-xl font-bold mt-2">₹{closingBalance}</div>
            <div className="text-xs mt-1">
              {closingBalance >= 0 ? <span className="text-blue-600">Surplus</span> : <span className="text-red-600">Deficit</span>}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Entries</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Entry
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Particular</th>
                <th className="text-right py-2 px-2">Amount</th>
                <th className="text-left py-2 px-2">Who Give</th>
                <th className="text-left py-2 px-2">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{entry.date ? new Date(entry.date).toLocaleDateString() : '-'}</td>
                  <td className="py-2 px-2">{entry.category || '-'}</td>
                  <td className="py-2 px-2 text-right">₹{entry.amount ? entry.amount.toLocaleString('en-IN') : 0}</td>
                  <td className="py-2 px-2">{entry.whoGive || '-'}</td>
                  <td className="py-2 px-2">{entry.paymentMode || '-'}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">No entries available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Entry</h3>
            <div className="space-y-2">
              <input type="date" className="w-full border px-3 py-2 rounded" onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} />
              <input placeholder="Particular" className="w-full border px-3 py-2 rounded" onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })} />
              <input placeholder="Amount" type="number" className="w-full border px-3 py-2 rounded" onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })} />
              <input placeholder="Who Give" className="w-full border px-3 py-2 rounded" onChange={(e) => setNewEntry({ ...newEntry, whoGive: e.target.value })} />
              <input placeholder="Payment Mode" className="w-full border px-3 py-2 rounded" onChange={(e) => setNewEntry({ ...newEntry, paymentMode: e.target.value })} />
              <select className="w-full border px-3 py-2 rounded" onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as 'INCOME' | 'EXPENSE' })}>
                <option value="">Select Type</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="text-gray-600 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddEntry} className="bg-blue-600 text-white px-4 py-2 rounded">Add Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}