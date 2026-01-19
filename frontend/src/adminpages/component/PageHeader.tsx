import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
      {subtitle && <div className="mt-1 text-sm text-slate-400">{subtitle}</div>}
    </div>
    {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
  </div>
);

export default PageHeader;
