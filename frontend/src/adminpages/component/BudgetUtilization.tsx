import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetSite {
  project: string;
  allocated: number;
  spent: number;
  status: 'under-budget' | 'over-budget' | 'on-track';
}

const BudgetUtilization: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetSite[]>([]);

  const fetchBudgetData = async () => {
    try {
      const res = await fetch('https://general-constructor-web-2.onrender.com/account/site', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const sites = await res.json();

      const formatted: BudgetSite[] = sites.map((site: any) => {
        const income = site.entries
          .filter((entry: any) => entry.type === 'INCOME')
          .reduce((sum: number, e: any) => sum + e.amount, 0);
        const expense = site.entries
          .filter((entry: any) => entry.type === 'EXPENSE')
          .reduce((sum: number, e: any) => sum + e.amount, 0);

        const utilizationPercent = income === 0 ? 0 : (expense / income) * 100;

        let status: BudgetSite['status'] = 'on-track';
        if (utilizationPercent > 100) status = 'over-budget';
        else if (utilizationPercent < 70) status = 'under-budget';

        return {
          project: site.siteName,
          allocated: income,
          spent: expense,
          status,
        };
      });

      setBudgetData(formatted);
    } catch (err) {
      console.error('Error fetching budget data:', err);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under-budget':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'over-budget':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'under-budget': return 'text-emerald-400 bg-emerald-500/20';
      case 'over-budget': return 'text-red-400 bg-red-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getProgressClass = (spent: number, allocated: number) => {
    const percentage = allocated === 0 ? 0 : (spent / allocated) * 100;
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 70) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-700">
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-primary-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-slate-100">Budget Utilization</h3>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {budgetData.map((item, idx) => {
                  const percentage = item.allocated === 0 ? 0 : Math.round((item.spent / item.allocated) * 100);
                  return (
                    <tr key={idx} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-sm font-medium text-slate-100">{item.project}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <div>{formatCurrency(item.allocated)}</div>
                        <div className="text-xs text-slate-500">Spent: {formatCurrency(item.spent)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <div className="flex items-center">
                          <div className="w-full bg-slate-600 rounded-full h-2.5 mr-2 flex-grow">
                            <div className={`h-2.5 rounded-full ${getProgressClass(item.spent, item.allocated)}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                          </div>
                          <span className="text-xs font-medium text-slate-300">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {budgetData.length === 0 && <p className="text-center text-sm text-slate-500 py-4">No budget data available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetUtilization;
