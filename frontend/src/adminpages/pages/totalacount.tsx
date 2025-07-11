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
  RefreshCw
} from 'lucide-react';
import { SiteAccount, Entry, SiteSummary } from '../../api/account';
import { useNavigate } from 'react-router-dom';

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
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
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const filteredEntries = (entries: Entry[]) => {
    if (filterType === 'ALL') return entries;
    return entries.filter(entry => entry.type === filterType);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Site Account Management</h1>
                <p className="text-gray-600">Comprehensive view of all site finances and transactions</p>
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
                onClick={handleClick}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition"
                >
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">My Account</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Sites */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sites</p>
                <p className="text-2xl font-bold text-gray-900">{siteAccounts.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(grandTotals.totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Total Expense */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(grandTotals.totalExpense)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Net Balance</p>
                <p className={`text-2xl font-bold ${getBalanceColor(grandTotals.netBalance)}`}>
                  {formatCurrency(grandTotals.netBalance)}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white border p-4 mb-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Filter:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'ALL' | 'INCOME' | 'EXPENSE')}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expenses</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">Last updated: {formatDate(new Date())}</span>
          </div>
        </div>

        {/* Sites Table */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Site</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Opening</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Income</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Expenses</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Balance</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">Entries</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {siteSummaries.map((site) => (
                <React.Fragment key={site.siteId}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium">{site.siteName}</div>
                          <div className="text-xs text-gray-500">Updated {formatDate(site.lastUpdated)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">{formatCurrency(site.openingBalance)}</td>
                    <td className="px-6 py-4 text-right text-green-600">{formatCurrency(site.totalIncome)}</td>
                    <td className="px-6 py-4 text-right text-red-600">{formatCurrency(site.totalExpense)}</td>
                    <td className={`px-6 py-4 text-right font-semibold ${getBalanceColor(site.closingBalance)}`}>
                      {formatCurrency(site.closingBalance)}
                    </td>
                    <td className="px-6 py-4 text-center">{site.totalEntries}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleSiteExpansion(site.siteId)}
                        className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {expandedSites.has(site.siteId) ? (
                          <><EyeOff className="h-4 w-4 inline mr-1" />Hide</>
                        ) : (
                          <><Eye className="h-4 w-4 inline mr-1" />View</>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded entries */}
                  {expandedSites.has(site.siteId) && (
                    <tr>
                      <td colSpan={7} className="bg-gray-50 px-6 py-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th className="py-2 text-left text-gray-600">Date</th>
                                <th className="py-2 text-left text-gray-600">Type</th>
                                <th className="py-2 text-left text-gray-600">Category</th>
                                <th className="py-2 text-left text-gray-600">Particular</th>
                                <th className="py-2 text-right text-gray-600">Quantity</th>
                                <th className="py-2 text-right text-gray-600">Amount</th>
                                <th className="py-2 text-left text-gray-600">Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredEntries(siteAccounts.find(s => s._id === site.siteId)?.entries || [])
                                .map(entry => (
                                  <tr key={entry._id} className="border-t">
                                    <td className="py-2">{formatDate(entry.date)}</td>
                                    <td className="py-2">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        entry.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {entry.type}
                                      </span>
                                    </td>
                                    <td className="py-2">{entry.typeofExpense|| '-'}</td>
                                    <td className="py-2">{entry.particular || '-'}</td>
                                    <td className="py-2 text-right">{entry.Quantity}</td>
                                    <td className="py-2 text-right">{formatCurrency(entry.amount)}</td>
                                    <td className="py-2">{entry.paymentMode || '-'}</td>
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
