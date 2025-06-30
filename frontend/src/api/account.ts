export interface Entry {
    _id: string;
    date: Date;
    type: 'INCOME' | 'EXPENSE';
    typeofExpense: 'LABOUR' | 'MAINTENAINCE';
    category: string;
    particular?: string;
    amount: number;
    Quantity: string;
    paymentMode?: string;
  }
  
  export interface SiteAccount {
    _id: string;
    siteName: string;
    entries: Entry[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface SiteSummary {
    siteName: string;
    openingBalance: number;
    totalIncome: number;
    totalExpense: number;
    closingBalance: number;
    totalEntries: number;
    lastUpdated: Date;
  }