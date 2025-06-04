import React from 'react';
import { Building, Users, Clock, CreditCard } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-blue-50">
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-xl font-semibold text-gray-900">{value}</h3>
          {change && (
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1.5">from last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickStats: React.FC = () => {
  const stats = [
    {
      title: 'Active Sites',
      value: 12,
      icon: <Building className="h-6 w-6 text-blue-600" />,
      change: {
        value: 8,
        isPositive: true,
      },
    },
    {
      title: 'Team Members',
      value: 48,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      change: {
        value: 2,
        isPositive: true,
      },
    },
    {
      title: 'Delays',
      value: 3,
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      change: {
        value: 5,
        isPositive: false,
      },
    },
    {
      title: 'Monthly Expenses',
      value: '$1.2M',
      icon: <CreditCard className="h-6 w-6 text-blue-600" />,
      change: {
        value: 12,
        isPositive: true,
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
        />
      ))}
    </div>
  );
};

export default QuickStats;