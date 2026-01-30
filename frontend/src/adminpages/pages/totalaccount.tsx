import React, { useState, useEffect, useMemo } from 'react';
import {
    Calculator,
    TrendingUp,
    TrendingDown,
    FileSpreadsheet,
    Building2,
    Filter,
    RefreshCw,
    FileDown,
} from 'lucide-react';
import { SiteAccount, Entry, SiteSummary } from '../../api/account';
import { useNavigate } from 'react-router-dom';
import { exportTotalAccountToExcel, exportTotalAccountToPDF } from '../../utils/exportAccount';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

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

                const res = await fetch(`${API_BASE_URL}/site`, {
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

        if (token) fetchData();
    }, [token]);

    const handleClick = () => {
        navigate('/budgets');
    };

    const refreshData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/site`, {
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
        if (balance > 0) return 'text-emerald-600';
        if (balance < 0) return 'text-red-600';
        return 'text-gray-500';
    };

    const filteredEntries = (entries: Entry[]) => {
        if (filterType === 'ALL') return entries;
        return entries.filter(entry => entry.type === filterType);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={refreshData} variant="primary">Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Total Accounts</h1>
                    <p className="text-sm text-gray-500">Overview of all site finances</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" onClick={refreshData} loading={loading} leftIcon={<RefreshCw className="w-4 h-4" />}>
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={() => exportTotalAccountToExcel(siteAccounts, siteSummaries, grandTotals)} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
                        Excel
                    </Button>
                    <Button variant="outline" onClick={() => exportTotalAccountToPDF(siteAccounts, siteSummaries, grandTotals)} leftIcon={<FileDown className="w-4 h-4" />}>
                        PDF
                    </Button>
                    <Button variant="primary" onClick={handleClick} leftIcon={<Building2 className="w-4 h-4" />}>
                        Site Accounts
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Total Sites</span>
                        <Building2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{siteAccounts.length}</div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Total Income</span>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{formatCurrency(grandTotals.totalIncome)}</div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Total Expenses</span>
                        <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(grandTotals.totalExpense)}</div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Net Balance</span>
                        <Calculator className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className={`text-2xl font-bold ${getBalanceColor(grandTotals.netBalance)}`}>
                        {formatCurrency(grandTotals.netBalance)}
                    </div>
                </Card>
            </div>

            {/* Sites Table */}
            <Card noPadding>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Site Summaries</h2>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Filter Entries:</span>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as 'ALL' | 'INCOME' | 'EXPENSE')}
                            className="h-8 rounded-md border border-gray-200 bg-white pixel-antialiased text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                            <option value="ALL">All</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Site Name</th>
                                <th className="px-6 py-3 font-medium text-right">Income</th>
                                <th className="px-6 py-3 font-medium text-right">Expense</th>
                                <th className="px-6 py-3 font-medium text-right">Balance</th>
                                <th className="px-6 py-3 font-medium text-center">Entries</th>
                                <th className="px-6 py-3 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {siteSummaries.map((site) => (
                                <React.Fragment key={site.siteId}>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-gray-100 rounded-md">
                                                    <Building2 className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <div>
                                                    <div>{site.siteName}</div>
                                                    <div className="text-xs text-gray-400 font-normal">Updated {formatDate(site.lastUpdated)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-emerald-600 font-medium">{formatCurrency(site.totalIncome)}</td>
                                        <td className="px-6 py-4 text-right text-red-600 font-medium">{formatCurrency(site.totalExpense)}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${getBalanceColor(site.closingBalance)}`}>{formatCurrency(site.closingBalance)}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{site.totalEntries}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Button size="sm" variant="ghost" onClick={() => toggleSiteExpansion(site.siteId)}>
                                                {expandedSites.has(site.siteId) ? 'Hide' : 'View'}
                                            </Button>
                                        </td>
                                    </tr>

                                    {expandedSites.has(site.siteId) && (
                                        <tr>
                                            <td colSpan={6} className="bg-gray-50/50 p-4 shadow-inner">
                                                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                                                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                                        Recent Entries ({filterType})
                                                    </div>
                                                    <table className="w-full text-sm">
                                                        <tbody className="divide-y divide-gray-100">
                                                            {filteredEntries(siteAccounts.find(s => s._id === site.siteId)?.entries || []).map(entry => (
                                                                <tr key={entry._id} className="hover:bg-gray-50">
                                                                    <td className="px-4 py-2 text-gray-600">{formatDate(entry.date)}</td>
                                                                    <td className="px-4 py-2">
                                                                        <Badge variant={entry.type === 'INCOME' ? 'success' : 'error'} size="sm">
                                                                            {entry.type}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="px-4 py-2 text-gray-600">{entry.category}</td>
                                                                    <td className="px-4 py-2 text-gray-900 font-medium">{entry.particular}</td>
                                                                    <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(entry.amount)}</td>
                                                                </tr>
                                                            ))}
                                                            {filteredEntries(siteAccounts.find(s => s._id === site.siteId)?.entries || []).length === 0 && (
                                                                <tr>
                                                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No entries found matching filter.</td>
                                                                </tr>
                                                            )}
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
            </Card>
        </div>
    );
};

export default Account;
