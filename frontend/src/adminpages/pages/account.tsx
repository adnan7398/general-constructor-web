import React, { useEffect, useState } from 'react';
import { Building2, Calendar, TrendingDown, TrendingUp, Wallet, User, CreditCard } from 'lucide-react';

interface AccountEntry {
  date: string;
  category: string;
  amount: number;
  whoGive?: string;
  paymentMode?: string;
}

export default function SiteAccountPage() {
  const [entries, setEntries] = useState<AccountEntry[]>([]);
  const [month, setMonth] = useState(4); // April
  const [year, setYear] = useState(2025);
  const [siteName, setSiteName] = useState('ARJUNPUR');
  const [openingBalance, setOpeningBalance] = useState(67015);

  useEffect(() => {
    // Mock data for demonstration
    const mockEntries: AccountEntry[] = [
      { date: '2025-04-05', category: 'Materials Purchase', amount: 15000, whoGive: 'Supplier A', paymentMode: 'Bank Transfer' },
      { date: '2025-04-08', category: 'Labor Payment', amount: 8500, whoGive: 'Contractor B', paymentMode: 'Cash' },
      { date: '2025-04-12', category: 'Equipment Rental', amount: 12000, whoGive: 'Rental Co.', paymentMode: 'Cheque' },
      { date: '2025-04-15', category: 'Transportation', amount: 3200, whoGive: 'Transport Ltd', paymentMode: 'UPI' },
      { date: '2025-04-18', category: 'Miscellaneous', amount: 2800, whoGive: 'Various', paymentMode: 'Cash' },
    ];
    setEntries(mockEntries);
  }, [month, year, siteName]);

  const totalAmount = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const remainingBalance = openingBalance - totalAmount;

  const getMonthName = (monthNum: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum - 1];
  };

  const getPaymentModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'cash': return '💵';
      case 'bank transfer': return '🏦';
      case 'cheque': return '📄';
      case 'upi': return '📱';
      default: return '💳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{siteName}</h1>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-lg font-medium">{getMonthName(month)} {year}</span>
                </div>
              </div>
            </div>
            
            {/* Balance Cards */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">Opening Balance</span>
                </div>
                <div className="text-2xl font-bold">₹{openingBalance.toLocaleString('en-IN')}</div>
              </div>
              
              <div className={`${remainingBalance >= 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-red-500 to-rose-500'} text-white p-4 rounded-xl shadow-lg`}>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">Remaining</span>
                </div>
                <div className="text-2xl font-bold">₹{remainingBalance.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Particular</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Payment Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {new Date(entry.date).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'short' 
                            })}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(entry.date).toLocaleDateString('en-GB', { 
                              weekday: 'short' 
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{entry.category}</div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-lg font-semibold text-red-600">
                          ₹{entry.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{entry.whoGive || 'N/A'}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                        <span className="text-sm">{getPaymentModeIcon(entry.paymentMode || '')}</span>
                        <span className="text-xs font-medium text-slate-700">{entry.paymentMode || 'N/A'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary Footer */}
          <div className="bg-gradient-to-r from-slate-100 to-blue-50 border-t border-slate-200">
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-600 mb-1">Total Entries</div>
                    <div className="text-2xl font-bold text-slate-800">{entries.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-600 mb-1">Total Expenditure</div>
                    <div className="text-2xl font-bold text-red-600">₹{totalAmount.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
                  <div className="text-sm font-medium text-slate-600 mb-1">Current Balance</div>
                  <div className={`text-3xl font-bold ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{remainingBalance.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {remainingBalance >= 0 ? 'Surplus' : 'Deficit'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}