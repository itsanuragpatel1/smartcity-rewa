import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { Search, Filter, SlidersHorizontal, MapPin, Calendar, Layers, ShieldAlert, Plus, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Roads & Potholes',
  'Street Light',
  'Garbage',
  'Water Supply',
  'Drainage',
  'Electricity',
  'Park',
  'Illegal Construction',
  'Public Property',
  'Other',
];

const STATUSES = [
  'All',
  'Pending',
  'Assigned',
  'Accepted',
  'In Progress',
  'Resolved',
  'Verified',
  'Reopened',
  'Rejected',
];

const WARDS = ['All', '8', '12', '14', '15', '18', '20', '24', '32', '35', '41'];

const Complaints = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state initialized from URL query params for state persistence/routing link shareability
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [ward, setWard] = useState(searchParams.get('ward') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 6,
          sort,
        };

        if (search) params.search = search;
        if (status !== 'All') params.status = status;
        if (category !== 'All') params.category = category;
        if (ward !== 'All') params.ward = ward;

        const res = await complaintAPI.getAll(params);
        if (res.success) {
          setComplaints(res.data);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [search, status, category, ward, sort, page]);

  // Sync params to URL query
  const updateUrlParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === 'All' || val === '' || val === 1) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    updateUrlParams({ search: val, page: 1 });
  };

  const handleFilterChange = (setter, key, val) => {
    setter(val);
    setPage(1);
    updateUrlParams({ [key]: val, page: 1 });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
      'Accepted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'In Progress': 'bg-purple-50 text-purple-700 border-purple-200',
      'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Verified': 'bg-green-50 text-green-700 border-green-200',
      'Reopened': 'bg-orange-50 text-orange-700 border-orange-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-slate-50 text-slate-700';
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-govBorder pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-govTextPrimary">Public Civic Complaint Feed</h1>
          <p className="text-xs text-govTextSecondary mt-1">Browse, search and track active civic complaints across Rewa City</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Link
            to="/complaints/track"
            className="flex-1 sm:flex-none text-center px-4 py-2 text-sm font-semibold border border-govBorder rounded-md text-govTextPrimary bg-white hover:bg-slate-50 transition-colors"
          >
            Track by ID
          </Link>
          <Link
            to="/complaints/submit"
            className="flex-1 sm:flex-none text-center px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors flex items-center justify-center space-x-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>File Complaint</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-govBorder rounded-lg p-4 shadow-gov space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Keyword Search */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-govTextSecondary">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by Complaint ID, locality, keywords..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Sorting */}
          <div className="w-full md:w-48 flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-govTextSecondary shrink-0" />
            <select
              value={sort}
              onChange={(e) => handleFilterChange(setSort, 'sort', e.target.value)}
              className="w-full rounded-md border border-govBorder bg-slate-50 py-2 px-3 text-sm focus:outline-none focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Categories, Statuses, Wards Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-govTextSecondary mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => handleFilterChange(setCategory, 'category', e.target.value)}
              className="w-full rounded-md border border-govBorder bg-slate-50 py-2 px-3 text-sm focus:outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-govTextSecondary mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => handleFilterChange(setStatus, 'status', e.target.value)}
              className="w-full rounded-md border border-govBorder bg-slate-50 py-2 px-3 text-sm focus:outline-none focus:border-primary"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-govTextSecondary mb-1.5">Ward Number</label>
            <select
              value={ward}
              onChange={(e) => handleFilterChange(setWard, 'ward', e.target.value)}
              className="w-full rounded-md border border-govBorder bg-slate-50 py-2 px-3 text-sm focus:outline-none focus:border-primary"
            >
              {WARDS.map((w) => (
                <option key={w} value={w}>
                  {w === 'All' ? 'All Wards' : `Ward ${w}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Feed Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-white border border-govBorder h-72 rounded-lg" />
          ))}
        </div>
      ) : complaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((c) => (
            <Link
              key={c._id}
              to={`/complaints/${c.complaintId}`}
              className="bg-white border border-govBorder rounded-lg overflow-hidden shadow-gov hover:shadow-govMd hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              {/* Thumbnail Area */}
              <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-govBorder">
                <img
                  src={c.images[0]}
                  alt={c.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full border shadow-sm ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                {c.isAnonymous && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-medium">
                    Anonymous
                  </div>
                )}
              </div>

              {/* Text Information Area */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-govTextSecondary">
                    <span className="text-slate-500 font-mono">{c.complaintId}</span>
                    <span className="flex items-center text-primary">
                      <MapPin className="h-3 w-3 mr-0.5 shrink-0" />
                      {c.locality}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-govTextPrimary group-hover:text-primary transition-colors line-clamp-1">
                    {c.category}
                  </h3>
                  <p className="text-xs text-govTextSecondary line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-govTextSecondary pt-3 border-t border-slate-100 font-medium">
                  <span className="flex items-center">
                    <Layers className="h-3.5 w-3.5 text-slate-400 mr-1" />
                    Ward {c.ward}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 mr-1" />
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-govBorder rounded-lg shadow-gov space-y-4">
          <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-govTextPrimary">No matching complaints found.</h2>
          <p className="text-xs text-govTextSecondary max-w-sm mx-auto">
            Try adjusting your keyword query, category filter, or ward selection to expand search results.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <button
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
                updateUrlParams({ page: page - 1 });
              }
            }}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs font-semibold border border-govBorder rounded-md text-govTextPrimary hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            Previous
          </button>
          
          <span className="text-xs font-medium text-govTextSecondary">
            Page {page} of {pagination.pages}
          </span>

          <button
            onClick={() => {
              if (page < pagination.pages) {
                setPage(page + 1);
                updateUrlParams({ page: page + 1 });
              }
            }}
            disabled={page === pagination.pages}
            className="px-3 py-1.5 text-xs font-semibold border border-govBorder rounded-md text-govTextPrimary hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Complaints;
