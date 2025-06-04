import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const BudgetUtilization: React.FC = () => {
  const budgetData = [
    { id: 1, project: 'Office Tower', allocated: 2500000, spent: 1625000, status: 'on-track' },
    { id: 2, project: 'Shopping Mall', allocated: 3750000, spent: 1650000, status: 'under-budget' },
    { id: 3, project: 'Residential Complex', allocated: 1800000, spent: 1260000, status: 'over-budget' },
    { id: 4, project: 'Central Park', allocated: 950000, spent: 380000, status: 'on-track' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
      case 'under-budget':
        return 'text-green-600 bg-green-50';
      case 'over-budget':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getProgressClass = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-100">
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Budget Utilization</h3>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetData.map((item) => {
                  const percentage = Math.round((item.spent / item.allocated) * 100);
                  
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.project}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatCurrency(item.allocated)}</div>
                        <div className="text-xs text-gray-400">
                          Spent: {formatCurrency(item.spent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 flex-grow">
                            <div
                              className={`h-2.5 rounded-full ${getProgressClass(item.spent, item.allocated)}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetUtilization;