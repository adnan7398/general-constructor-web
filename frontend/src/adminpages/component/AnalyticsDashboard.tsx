import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, Users, Building, Target } from 'lucide-react';
import { getAllProjects } from '../../api/projects';
import { getAllResources } from '../../api/resources';
import { getAllTeamMembers } from '../../api/teammember';

interface AnalyticsData {
  totalBudget: number;
  spentBudget: number;
  completionRate: number;
  averageProjectDuration: number;
  teamUtilization: number;
  resourceEfficiency: number;
  monthlyTrend: {
    month: string;
    budget: number;
    completion: number;
  }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBudget: 0,
    spentBudget: 0,
    completionRate: 0,
    averageProjectDuration: 0,
    teamUtilization: 0,
    resourceEfficiency: 0,
    monthlyTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [projects, resources, teamMembers] = await Promise.all([
          getAllProjects().catch(() => []),
          getAllResources().catch(() => []),
          getAllTeamMembers().catch(() => [])
        ]);

        // Calculate analytics
        const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);
        const spentBudget = totalBudget * 0.65; // Mock 65% spent
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const completionRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;
        
        // Mock calculations for demonstration
        const averageProjectDuration = 180; // days
        const teamUtilization = 85; // percentage
        const resourceEfficiency = 78; // percentage

        // Mock monthly trend data
        const monthlyTrend = [
          { month: 'Jan', budget: 1200000, completion: 15 },
          { month: 'Feb', budget: 1350000, completion: 28 },
          { month: 'Mar', budget: 1500000, completion: 42 },
          { month: 'Apr', budget: 1650000, completion: 58 },
          { month: 'May', budget: 1800000, completion: 72 },
          { month: 'Jun', budget: 1950000, completion: 85 }
        ];

        setAnalytics({
          totalBudget,
          spentBudget,
          completionRate,
          averageProjectDuration,
          teamUtilization,
          resourceEfficiency,
          monthlyTrend
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-orange-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Construction Analytics</h3>
        </div>
      </div>
      
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Budget</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(analytics.totalBudget)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-900">{analytics.completionRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">+8.2%</span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Team Utilization</p>
                <p className="text-2xl font-bold text-purple-900">{analytics.teamUtilization}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">+5.1%</span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Resource Efficiency</p>
                <p className="text-2xl font-bold text-orange-900">{analytics.resourceEfficiency}%</p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm text-red-600 font-medium">-2.3%</span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalBudget)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Spent</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(analytics.spentBudget)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalBudget - analytics.spentBudget)}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(analytics.spentBudget / analytics.totalBudget) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {((analytics.spentBudget / analytics.totalBudget) * 100).toFixed(1)}% of budget utilized
            </p>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Monthly Progress Trend</h4>
          <div className="space-y-4">
            {analytics.monthlyTrend.map((month, index) => (
              <div key={month.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Budget: {formatCurrency(month.budget)}</span>
                    <span className="text-sm text-gray-600">Completion: {month.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${month.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
