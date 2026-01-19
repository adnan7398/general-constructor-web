import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Mail, Phone, User, Calendar, Trash2, Check, Eye } from 'lucide-react';
import { getQuotes, updateQuoteStatus, deleteQuote, Quote } from '../../api/quotes';

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
        const err = e as { response?: { status?: number; data?: { error?: string } }; message?: string };
        if (err?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
          return;
        }
        setError(
          err?.response?.data?.error ||
            (err?.response?.status === 404 ? 'Quotes API not found. Ensure the backend is deployed with /quotes.' : 'Failed to load quotes. Check your connection and that the backend is running.')
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-blue-600" />
          Quotes / Contact Requests
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      {quotes.length === 0 && !error ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No quotes yet. Submissions from the contact form will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div
              key={q._id}
              className={`bg-white rounded-lg shadow border-l-4 overflow-hidden ${
                q.status === 'new' ? 'border-l-blue-500' : q.status === 'contacted' ? 'border-l-green-500' : 'border-l-gray-400'
              }`}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {q.status}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(q.createdAt)}
                      </span>
                    </div>
                    <p className="flex items-center gap-2 text-gray-900 font-medium">
                      <User className="h-4 w-4 text-gray-500" />
                      {q.name}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href={`mailto:${q.email}`} className="hover:text-blue-600">{q.email}</a>
                    </p>
                    {q.phone && (
                      <p className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        {q.phone}
                      </p>
                    )}
                    {q.service && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Service: </span>
                        {SERVICE_LABELS[q.service] || q.service}
                      </p>
                    )}
                    <p className="text-gray-700 mt-2 whitespace-pre-wrap">{q.message}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                    {q.status !== 'read' && (
                      <button
                        onClick={() => handleStatus(q._id, 'read')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title="Mark as read"
                      >
                        <Eye className="h-4 w-4" />
                        Read
                      </button>
                    )}
                    {q.status !== 'contacted' && (
                      <button
                        onClick={() => handleStatus(q._id, 'contacted')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg"
                        title="Mark as contacted"
                      >
                        <Check className="h-4 w-4" />
                        Contacted
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg"
                      title="Delete"
                    >
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
