import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Mail, Phone, User, Calendar, Trash2, Check, Eye } from 'lucide-react';
import { getQuotes, updateQuoteStatus, deleteQuote, Quote } from '../../api/quotes';
import PageHeader from '../component/PageHeader';

const SERVICE_LABELS: Record<string, string> = {
  residential: 'Residential Construction',
  commercial: 'Commercial Construction',
  infrastructure: 'Infrastructure Development',
  interior: 'Interior Finishing',
  renovation: 'Renovation & Remodeling',
  maintenance: 'Maintenance & Repair',
  '': '—',
};

export default function QuotesPage() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    const fetch = async () => {
      try {
        const data = await getQuotes();
        setQuotes(data);
        setError('');
      } catch (e: unknown) {
        const err = e as {
          response?: { status?: number; data?: { error?: string } };
          message?: string;
        };
        if (err?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
          return;
        }
        setError(
          err?.response?.data?.error ||
            (err?.response?.status === 404
              ? 'Quotes API not found. Ensure the backend is deployed with /quotes.'
              : 'Failed to load quotes. Check your connection and that the backend is running.')
        );
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [navigate]);

  const handleStatus = async (id: string, status: 'new' | 'read' | 'contacted') => {
    try {
      const updated = await updateQuoteStatus(id, status);
      setQuotes((prev) => prev.map((q) => (q._id === id ? updated : q)));
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this quote?')) return;
    try {
      await deleteQuote(id);
      setQuotes((prev) => prev.filter((q) => q._id !== id));
    } catch (e) {
      console.error('Failed to delete:', e);
    }
  };

  const formatDate = (s: string) => {
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s;
    }
  };

  const statusStyle = (s: string) => {
    if (s === 'new') return 'bg-primary-500/30 text-primary-300';
    if (s === 'contacted') return 'bg-emerald-500/30 text-emerald-300';
    return 'bg-slate-600 text-slate-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px]">
      <PageHeader
        title="Quotes & Contact Requests"
        subtitle="Requests from the website contact form."
      />

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-red-900/50 bg-red-900/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      {quotes.length === 0 && !error ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">No quotes yet.</p>
          <p className="text-sm text-slate-500 mt-1">Submissions from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div
              key={q._id}
              className={`bg-slate-800 rounded-xl border overflow-hidden ${
                q.status === 'new' ? 'border-l-4 border-l-primary-500 border-slate-700' : q.status === 'contacted' ? 'border-l-4 border-l-emerald-500 border-slate-700' : 'border-slate-700'
              }`}
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium ${statusStyle(q.status)}`}>
                        {q.status}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(q.createdAt)}
                      </span>
                    </div>
                    <p className="flex items-center gap-2 text-slate-100 font-medium">
                      <User className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      {q.name}
                    </p>
                    <p className="flex items-center gap-2 text-slate-400 text-sm">
                      <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <a href={`mailto:${q.email}`} className="hover:text-primary-400 truncate">{q.email}</a>
                    </p>
                    {q.phone && (
                      <p className="flex items-center gap-2 text-slate-400 text-sm">
                        <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        {q.phone}
                      </p>
                    )}
                    {q.service && (
                      <p className="text-sm text-slate-400">
                        <span className="font-medium text-slate-300">Service: </span>
                        {SERVICE_LABELS[q.service] || q.service}
                      </p>
                    )}
                    <p className="text-slate-300 text-sm mt-2 whitespace-pre-wrap">{q.message}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                    {q.status !== 'read' && (
                      <button onClick={() => handleStatus(q._id, 'read')} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600" title="Mark as read">
                        <Eye className="h-4 w-4" />
                        Read
                      </button>
                    )}
                    {q.status !== 'contacted' && (
                      <button onClick={() => handleStatus(q._id, 'contacted')} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-emerald-300 bg-emerald-900/40 hover:bg-emerald-900/60" title="Mark as contacted">
                        <Check className="h-4 w-4" />
                        Contacted
                      </button>
                    )}
                    <button onClick={() => handleDelete(q._id)} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-red-300 bg-red-900/40 hover:bg-red-900/60" title="Delete">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
