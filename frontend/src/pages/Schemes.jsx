import React, { useState, useEffect } from 'react';
import { schemeAPI } from '../services/api';
import { Search, BookOpen, UserCheck, CheckCircle2, ArrowUpRight, HelpCircle, FileText } from 'lucide-react';

const CATEGORIES = ['All', 'Students', 'Farmers', 'Women', 'Business', 'Employment', 'Housing', 'Education'];

const Schemes = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category !== 'All') params.category = category;

        const res = await schemeAPI.getAll(params);
        if (res.success) {
          setSchemes(res.data);
        }
      } catch (err) {
        console.error('Failed to load schemes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [search, category]);

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-6">
      {/* Header */}
      <div className="border-b border-govBorder pb-5">
        <h1 className="text-2xl font-extrabold text-govTextPrimary">Government Welfare &amp; Schemes</h1>
        <p className="text-xs text-govTextSecondary mt-1">Discover, check eligibility criteria, and apply online for active state/municipal schemes in Rewa</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-govBorder rounded-lg p-4 shadow-gov flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-grow w-full relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-govTextSecondary">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search schemes by name, benefits or eligibility..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex overflow-x-auto w-full sm:w-auto gap-2 pb-1.5 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all shrink-0 border ${
                category === cat
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-slate-50 border-govBorder text-govTextSecondary hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white border border-govBorder h-64 rounded-lg" />
          ))}
        </div>
      ) : schemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme._id}
              className="bg-white border border-govBorder rounded-lg p-5 shadow-gov flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              {/* Card Meta & Title */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 text-[10px] font-bold text-primary bg-primary-light border border-blue-100 rounded">
                    {scheme.category}
                  </span>
                  {scheme.deadline && (
                    <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-medium">
                      Deadline: {new Date(scheme.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-govTextPrimary">{scheme.name}</h3>
                <p className="text-xs text-govTextSecondary leading-relaxed">{scheme.description}</p>
              </div>

              {/* Details sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs text-govTextSecondary">
                <div className="space-y-1">
                  <span className="font-bold text-govTextPrimary flex items-center">
                    <UserCheck className="h-3.5 w-3.5 text-primary mr-1" />
                    Eligibility Criteria
                  </span>
                  <p className="leading-normal">{scheme.eligibility}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-govTextPrimary flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                    Key Benefits
                  </span>
                  <p className="leading-normal text-slate-700">{scheme.benefits}</p>
                </div>
              </div>

              {/* Documents Pill List */}
              {scheme.requiredDocuments.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
                    <FileText className="h-3 w-3 mr-1 text-slate-400" />
                    Required Documents
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {scheme.requiredDocuments.map((doc, idx) => (
                      <span key={idx} className="bg-slate-100 text-govTextSecondary px-2 py-0.5 rounded text-[10px] border border-slate-200">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-1 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-gov transition-colors"
                >
                  <span>Apply Online</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-govBorder rounded-lg shadow-gov space-y-4">
          <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-govTextPrimary">No schemes found.</h2>
          <p className="text-xs text-govTextSecondary max-w-sm mx-auto">
            Try adjusting your keyword query or filter category to discover other citizen welfare programs.
          </p>
        </div>
      )}
    </div>
  );
};

export default Schemes;
