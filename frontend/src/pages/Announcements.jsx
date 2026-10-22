import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../services/api';
import { Search, Calendar, Bell, Sparkles, Filter, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Water Supply',
  'Road Closure',
  'Traffic',
  'Emergency',
  'Government Notice',
  'Public Notice',
  'Development',
  'Festival',
  'Event'
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await announcementAPI.getAll();
        if (res.success) {
          // Sort pinned announcements first, then by date descending
          const sorted = res.data.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.publishedDate) - new Date(a.publishedDate);
          });
          setAnnouncements(sorted);
          setFilteredAnnouncements(sorted);
        }
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    let result = [...announcements];

    // Filter by category
    if (category !== 'All') {
      result = result.filter(ann => ann.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by search query
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      result = result.filter(
        ann =>
          ann.title.toLowerCase().includes(query) ||
          ann.description.toLowerCase().includes(query)
      );
    }

    setFilteredAnnouncements(result);
  }, [search, category, announcements]);

  const getCategoryStyles = (cat) => {
    const styles = {
      'Water Supply': 'bg-blue-50 text-blue-700 border-blue-100',
      'Road Closure': 'bg-slate-100 text-slate-700 border-slate-200',
      'Traffic': 'bg-orange-50 text-orange-700 border-orange-100',
      'Emergency': 'bg-red-50 text-red-700 border-red-200 animate-pulse',
      'Government Notice': 'bg-indigo-50 text-indigo-700 border-indigo-100',
      'Public Notice': 'bg-purple-50 text-purple-700 border-purple-100',
      'Development': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Festival': 'bg-pink-50 text-pink-700 border-pink-100',
      'Event': 'bg-amber-50 text-amber-700 border-amber-100',
    };
    return styles[cat] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  return (
    <div className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-6">
      {/* Header */}
      <div className="border-b border-govBorder pb-5">
        <h1 className="text-2xl font-extrabold text-govTextPrimary flex items-center space-x-2.5">
          <Bell className="h-6 w-6 text-primary" />
          <span>Official Notice Board &amp; Announcements</span>
        </h1>
        <p className="text-xs text-govTextSecondary mt-1">
          Stay updated with official bulletins, road closures, events, and municipal alerts from the Rewa Municipal Corporation.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-govBorder rounded-xl p-4 shadow-gov flex flex-col space-y-4">
        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-govTextSecondary">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search by keywords (e.g. water, closure, traffic)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Categories (horizontal scrollable list) */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-govTextSecondary flex items-center shrink-0">
            <Filter className="h-3.5 w-3.5 mr-1" />
            Filter:
          </span>
          <div className="flex overflow-x-auto gap-2 pb-1.5 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 border ${
                  category === cat
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-slate-50 border-govBorder text-govTextSecondary hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white border border-govBorder rounded-xl p-6 h-40 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-200 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann._id}
              className={`bg-white border rounded-xl p-6 shadow-gov hover:border-slate-300 transition-all duration-200 border-govBorder relative flex flex-col space-y-4 ${
                ann.pinned ? 'border-amber-300 bg-amber-50/10' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded border ${getCategoryStyles(ann.category)}`}>
                    {ann.category}
                  </span>
                  {ann.pinned && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 uppercase tracking-wide">
                      <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                      Priority Notice
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1.5 text-xs text-govTextSecondary font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {new Date(ann.publishedDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-2">
                <h3 className={`text-base font-extrabold text-govTextPrimary tracking-tight ${ann.pinned ? 'text-slate-900' : ''}`}>
                  {ann.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {ann.description}
                </p>
              </div>

              {/* Optional banner image if available */}
              {ann.banner && (
                <div className="relative rounded-lg overflow-hidden h-40 max-w-xl w-full bg-slate-50 border border-slate-100">
                  <img
                    src={ann.banner}
                    alt={ann.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-govBorder rounded-xl shadow-gov space-y-4">
          <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-govTextPrimary">No announcements found</h2>
          <p className="text-xs text-govTextSecondary max-w-sm mx-auto">
            Try adjusting your search terms or selecting another filter category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Announcements;
