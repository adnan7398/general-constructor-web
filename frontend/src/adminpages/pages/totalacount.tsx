import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  Building2,
  Filter,
  RefreshCw
} from 'lucide-react';
import { SiteAccount, Entry, SiteSummary } from '../../api/account';
const mockSiteAccounts: SiteAccount[] = [
  {
    _id: '1',
    siteName: 'Downtown Mall Project',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    entries: [
      {
        _id: 'e1',
        date: new Date('2024-01-05'),
        type: 'INCOME',
        typeofExpense: 'LABOUR',
        category: 'Construction',
        particular: 'Initial payment',
        amount: 50000,
        Quantity: '1',
        paymentMode: 'Bank Transfer'
      },
      {
        _id: 'e2',
        date: new Date('2024-01-10'),
        type: 'EXPENSE',
        typeofExpense: 'LABOUR',
        category: 'Labor',
        particular: 'Worker wages',
        amount: 15000,
        Quantity: '30',
        paymentMode: 'Cash'
      },
      {
        _id: 'e3',
        date: new Date('2024-01-12'),
        type: 'EXPENSE',
        typeofExpense: 'MAINTENAINCE',
        category: 'Equipment',
        particular: 'Crane rental',
        amount: 8000,
        Quantity: '5',
        paymentMode: 'Cheque'
      }
    ]
  },
  {
    _id: '2',
    siteName: 'Residential Complex A',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-18'),
    entries: [
      {
        _id: 'e4',
        date: new Date('2024-01-08'),
        type: 'INCOME',
        typeofExpense: 'LABOUR',
        category: 'Construction',
        particular: 'Milestone payment',
        amount: 75000,
        Quantity: '1',
        paymentMode: 'Bank Transfer'
      },
      {
        _id: 'e5',
        date: new Date('2024-01-15'),
        type: 'EXPENSE',
        typeofExpense: 'LABOUR',
        category: 'Materials',
        particular: 'Cement and steel',
        amount: 25000,
        Quantity: '100',
        paymentMode: 'Bank Transfer'
      }
    ]
  },
  {
    _id: '3',
    siteName: 'Highway Bridge',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    entries: [
      {
        _id: 'e6',
        date: new Date('2024-01-07'),
        type: 'EXPENSE',
        typeofExpense: 'MAINTENAINCE',
        category: 'Equipment',
        particular: 'Heavy machinery maintenance',
        amount: 12000,
        Quantity: '3',
        paymentMode: 'Cash'
      },
      {
        _id: 'e7',
        date: new Date('2024-01-18'),
        type: 'INCOME',
        typeofExpense: 'LABOUR',
        category: 'Construction',
        particular: 'Progress payment',
        amount: 90000,
        Quantity: '1',
        paymentMode: 'Bank Transfer'
      }
    ]
  }
];

const Account: React.FC = () => {
  const [siteAccounts, setSiteAccounts] = useState<SiteAccount[]>(mockSiteAccounts);
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [loading, setLoading] = useState(false);

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
        openingBalance: 0, // Assuming 0 opening balance for new sites
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

  const toggleSiteExpansion = (siteName: string) => {
    const newExpanded = new Set(expandedSites);
    if (newExpanded.has(siteName)) {
      newExpanded.delete(siteName);
    } else {
      newExpanded.add(siteName);
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
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

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sites</p>
                <p className="text-2xl font-bold text-gray-900">{siteAccounts.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(grandTotals.totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(grandTotals.totalExpense)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'ALL' | 'INCOME' | 'EXPENSE')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Transactions</option>
                <option value="INCOME">Income Only</option>
                <option value="EXPENSE">Expenses Only</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(new Date())}
            </div>
          </div>
        </div>

        {/* Sites Overview Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sites Overview</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Balance</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Income</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expenses</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Closing Balance</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Entries</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {siteSummaries.map((site) => (
                  <React.Fragment key={site.siteName}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{site.siteName}</div>
                            <div className="text-sm text-gray-500">Updated {formatDate(site.lastUpdated)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(site.openingBalance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                        {formatCurrency(site.totalIncome)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">
                        {formatCurrency(site.totalExpense)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-semibold ${getBalanceColor(site.closingBalance)}`}>
                        {formatCurrency(site.closingBalance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {site.totalEntries}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => toggleSiteExpansion(site.siteName)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          {expandedSites.has(site.siteName) ? (
                            <><EyeOff className="h-4 w-4 mr-1" />Hide</>
                          ) : (
                            <><Eye className="h-4 w-4 mr-1" />View</>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Entries */}
                    {expandedSites.has(site.siteName) && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-900">Transaction Details - {site.siteName}</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 text-gray-600">Date</th>
                                    <th className="text-left py-2 text-gray-600">Type</th>
                                    <th className="text-left py-2 text-gray-600">Category</th>
                                    <th className="text-left py-2 text-gray-600">Particular</th>
                                    <th className="text-right py-2 text-gray-600">Quantity</th>
                                    <th className="text-right py-2 text-gray-600">Amount</th>
                                    <th className="text-left py-2 text-gray-600">Payment Mode</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredEntries(siteAccounts.find(s => s.siteName === site.siteName)?.entries || [])
                                    .map((entry) => (
                                      <tr key={entry._id} className="border-b border-gray-100">
                                        <td className="py-2">{formatDate(entry.date)}</td>
                                        <td className="py-2">
                                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            entry.type === 'INCOME' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {entry.type}
                                          </span>
                                        </td>
                                        <td className="py-2">{entry.category}</td>
                                        <td className="py-2">{entry.particular || '-'}</td>
                                        <td className="py-2 text-right">{entry.Quantity}</td>
                                        <td className={`py-2 text-right font-medium ${
                                          entry.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {formatCurrency(entry.amount)}
                                        </td>
                                        <td className="py-2">{entry.paymentMode || '-'}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
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

        {/* Summary Footer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(grandTotals.totalIncome)}</div>
              <div className="text-sm text-gray-600 font-medium">Total Income</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(grandTotals.totalExpense)}</div>
              <div className="text-sm text-gray-600 font-medium">Total Expenses</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getBalanceColor(grandTotals.netBalance)}`}>
                {formatCurrency(grandTotals.netBalance)}
              </div>
              <div className="text-sm text-gray-600 font-medium">Net Balance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;