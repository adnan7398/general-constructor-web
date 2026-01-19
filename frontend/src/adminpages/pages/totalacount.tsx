import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff,
  FileSpreadsheet,
  Building2,
  Filter,
  RefreshCw,
  FileDown,
} from 'lucide-react';
import { SiteAccount, Entry, SiteSummary } from '../../api/account';
import { useNavigate } from 'react-router-dom';
import { exportTotalAccountToExcel, exportTotalAccountToPDF } from '../../utils/exportAccount';

const Account: React.FC = () => {
    const navigate = useNavigate();
  const [siteAccounts, setSiteAccounts] = useState<SiteAccount[]>([]);
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const API_BASE_URL = 'https://general-constructor-web-2.onrender.com/account';
  const header = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/site`,{
          headers: header,
        });
        if (!res.ok) throw new Error('Failed to fetch data');

        const data = await res.json();
        setSiteAccounts(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleClick = () => {
    navigate('/budgets');
  };
  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/site`,{
        headers: header,
      });
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setSiteAccounts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const siteSummaries: SiteSummary[] = useMemo(() => {
    return siteAccounts.map(site => {
      const totalIncome = site.entries
        .filter(entry => entry.type === 'INCOME')
        .reduce((sum, entry) => sum + entry.amount, 0);
      
      const totalExpense = site.entries
        .filter(entry => entry.type === 'EXPENSE')
        .reduce((sum, entry) => sum + entry.amount, 0);

      return {
        siteName: site.siteName,
        siteId: site._id,
        openingBalance: 0,
        totalIncome,
        totalExpense,
        closingBalance: totalIncome - totalExpense,
        totalEntries: site.entries.length,
        lastUpdated: site.updatedAt
      };
    });
  }, [siteAccounts]);

  const grandTotals = useMemo(() => {
    return siteSummaries.reduce((totals, site) => ({
      totalIncome: totals.totalIncome + site.totalIncome,
      totalExpense: totals.totalExpense + site.totalExpense,
      netBalance: totals.netBalance + site.closingBalance
    }), { totalIncome: 0, totalExpense: 0, netBalance: 0 });
  }, [siteSummaries]);

  const toggleSiteExpansion = (siteId: string) => {
    const newExpanded = new Set(expandedSites);
    if (newExpanded.has(siteId)) {
      newExpanded.delete(siteId);
    } else {
      newExpanded.add(siteId);
    }
    setExpandedSites(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: any) => {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(parsed);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-emerald-400';
    if (balance < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  const filteredEntries = (entries: Entry[]) => {
    if (filterType === 'ALL') return entries;
    return entries.filter(entry => entry.type === filterType);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-500/20 rounded-lg">
                <FileSpreadsheet className="h-8 w-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Site Account Management</h1>
                <p className="text-slate-400">Comprehensive view of all site finances and transactions</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={refreshData} disabled={loading} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button onClick={() => exportTotalAccountToExcel(siteAccounts, siteSummaries, grandTotals)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-800 bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 text-sm font-medium">
                <FileSpreadsheet className="h-4 w-4" /> Download Excel
              </button>
              <button onClick={() => exportTotalAccountToPDF(siteAccounts, siteSummaries, grandTotals)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-800 bg-red-900/30 text-red-300 hover:bg-red-900/50 text-sm font-medium">
                <FileDown className="h-4 w-4" /> Download PDF
              </button>
              <button onClick={handleClick} className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 text-slate-200">
                <Building2 className="h-5 w-5 text-primary-400" />
                <span className="text-sm font-medium">My Account</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Sites</p>
                <p className="text-2xl font-bold text-slate-100">{siteAccounts.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary-400" />
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(grandTotals.totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-400">{formatCurrency(grandTotals.totalExpense)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Net Balance</p>
                <p className={`text-2xl font-bold ${getBalanceColor(grandTotals.netBalance)}`}>{formatCurrency(grandTotals.netBalance)}</p>
              </div>
              <Calculator className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-slate-800 border border-slate-700 p-4 mb-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-300">Filter:</span>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as 'ALL' | 'INCOME' | 'EXPENSE')} className="border border-slate-600 bg-slate-700/50 text-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                <option value="ALL">All</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expenses</option>
              </select>
            </div>
            <span className="text-sm text-slate-500">Last updated: {formatDate(new Date())}</span>
          </div>
        </div>

        {/* Sites Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Site</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400">Opening</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400">Income</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400">Expenses</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400">Balance</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400">Entries</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {siteSummaries.map((site) => (
                <React.Fragment key={site.siteId}>
                  <tr className="hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-slate-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-slate-100">{site.siteName}</div>
                          <div className="text-xs text-slate-500">Updated {formatDate(site.lastUpdated)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300">{formatCurrency(site.openingBalance)}</td>
                    <td className="px-6 py-4 text-right text-emerald-400">{formatCurrency(site.totalIncome)}</td>
                    <td className="px-6 py-4 text-right text-red-400">{formatCurrency(site.totalExpense)}</td>
                    <td className={`px-6 py-4 text-right font-semibold ${getBalanceColor(site.closingBalance)}`}>{formatCurrency(site.closingBalance)}</td>
                    <td className="px-6 py-4 text-center text-slate-300">{site.totalEntries}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleSiteExpansion(site.siteId)} className="px-3 py-1.5 border border-slate-600 rounded-lg text-sm text-slate-300 hover:bg-slate-700">
                        {expandedSites.has(site.siteId) ? <><EyeOff className="h-4 w-4 inline mr-1" />Hide</> : <><Eye className="h-4 w-4 inline mr-1" />View</>}
                      </button>
                    </td>
                  </tr>
                  {expandedSites.has(site.siteId) && (
                    <tr>
                      <td colSpan={7} className="bg-slate-700/20 px-6 py-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th className="py-2 text-left text-slate-500">Date</th>
                                <th className="py-2 text-left text-slate-500">Type</th>
                                <th className="py-2 text-left text-slate-500">Category</th>
                                <th className="py-2 text-left text-slate-500">Particular</th>
                                <th className="py-2 text-right text-slate-500">Quantity</th>
                                <th className="py-2 text-right text-slate-500">Amount</th>
                                <th className="py-2 text-left text-slate-500">Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredEntries(siteAccounts.find(s => s._id === site.siteId)?.entries || []).map(entry => (
                                <tr key={entry._id} className="border-t border-slate-600">
                                  <td className="py-2 text-slate-300">{formatDate(entry.date)}</td>
                                  <td className="py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>{entry.type}</span>
                                  </td>
                                  <td className="py-2 text-slate-300">{entry.typeofExpense|| '-'}</td>
                                  <td className="py-2 text-slate-300">{entry.particular || '-'}</td>
                                  <td className="py-2 text-right text-slate-300">{entry.Quantity}</td>
                                  <td className="py-2 text-right text-slate-300">{formatCurrency(entry.amount)}</td>
                                  <td className="py-2 text-slate-300">{entry.paymentMode || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Account;
