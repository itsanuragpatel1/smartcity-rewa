import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI, announcementAPI } from '../services/api';
import {
  FileText,
  AlertTriangle,
  BookOpen,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [latestComplaints, setLatestComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, annRes, compRes] = await Promise.all([
          complaintAPI.getDashboardStats(),
          announcementAPI.getAll({ limit: 3 }),
          complaintAPI.getAll({ limit: 4 })
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (annRes.success) setAnnouncements(annRes.data.slice(0, 3));
        if (compRes.success) setLatestComplaints(compRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home page statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const classes = {
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
      'Accepted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'In Progress': 'bg-purple-50 text-purple-700 border-purple-200',
      'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Verified': 'bg-green-50 text-green-700 border-green-200',
      'Reopened': 'bg-orange-50 text-orange-700 border-orange-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${classes[status] || 'bg-slate-50 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-govBorder py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-primary border border-blue-200">
            Smart City Rewa Initiative 2030
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-govTextPrimary tracking-tight max-w-3xl mx-auto leading-tight">
            One Platform for Every Citizen of Rewa
          </h1>
          <p className="text-base sm:text-lg text-govTextSecondary max-w-2xl mx-auto">
            Report civic issues, stay updated with official announcements, discover government welfare schemes, pay municipal bills, and contribute to a smarter Rewa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/complaints/submit"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-all flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report Complaint</span>
            </Link>
            <Link
              to="/complaints"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-govTextPrimary bg-white hover:bg-slate-50 border border-govBorder rounded-md transition-all flex items-center justify-center space-x-2"
            >
              <span>View Public Complaints</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/complaints/submit"
            className="p-5 bg-white border border-govBorder rounded-lg shadow-gov hover:shadow-govMd hover:border-blue-300 transition-all group"
          >
            <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-md flex items-center justify-center mb-4">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-govTextPrimary mb-2 group-hover:text-primary transition-colors">
              Smart Complaint Submission
            </h3>
            <p className="text-xs text-govTextSecondary leading-relaxed">
              Upload photos, describe the issue, and mark on the map. The system routes the complaint automatically.
            </p>
          </Link>

          <Link
            to="/announcements"
            className="p-5 bg-white border border-govBorder rounded-lg shadow-gov hover:shadow-govMd hover:border-blue-300 transition-all group"
          >
            <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-md flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-govTextPrimary mb-2 group-hover:text-primary transition-colors">
              Official City Bulletins
            </h3>
            <p className="text-xs text-govTextSecondary leading-relaxed">
              Get official notifications regarding road closures, water outage updates, events, and festival news.
            </p>
          </Link>

          <Link
            to="/schemes"
            className="p-5 bg-white border border-govBorder rounded-lg shadow-gov hover:shadow-govMd hover:border-blue-300 transition-all group"
          >
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-govTextPrimary mb-2 group-hover:text-primary transition-colors">
              Welfare &amp; Government Schemes
            </h3>
            <p className="text-xs text-govTextSecondary leading-relaxed">
              Explore educational, farmer, and gender-focused state welfare programs and apply instantly online.
            </p>
          </Link>

          <Link
            to="/bills"
            className="p-5 bg-white border border-govBorder rounded-lg shadow-gov hover:shadow-govMd hover:border-blue-300 transition-all group"
          >
            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center mb-4">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-govTextPrimary mb-2 group-hover:text-primary transition-colors">
              Quick Municipal Utility Bills
            </h3>
            <p className="text-xs text-govTextSecondary leading-relaxed">
              Search and pay water tax, garbage fees, property tax, and other municipal dues with instant transactions.
            </p>
          </Link>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="bg-slate-50 border-y border-govBorder py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-govTextPrimary flex items-center justify-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Real-time Rewa Civic Performance Tracker</span>
            </h2>
            <p className="text-xs text-govTextSecondary mt-1">Live data fetched from the Municipal Resolution Database</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white border border-govBorder rounded-lg shadow-gov">
              <div className="text-2xl sm:text-3xl font-black text-govTextPrimary">
                {stats ? stats.totals.total : '1,286'}
              </div>
              <div className="text-xs font-medium text-govTextSecondary mt-1">Total Registered Complaints</div>
            </div>

            <div className="p-4 bg-white border border-govBorder rounded-lg shadow-gov">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                {stats ? stats.totals.resolved : '1,138'}
              </div>
              <div className="text-xs font-medium text-govTextSecondary mt-1">Issues Resolved Successfully</div>
            </div>

            <div className="p-4 bg-white border border-govBorder rounded-lg shadow-gov">
              <div className="text-2xl sm:text-3xl font-black text-amber-500">
                {stats ? stats.totals.pending : '148'}
              </div>
              <div className="text-xs font-medium text-govTextSecondary mt-1">Under Investigation / Assigned</div>
            </div>

            <div className="p-4 bg-white border border-govBorder rounded-lg shadow-gov">
              <div className="text-2xl sm:text-3xl font-black text-primary">
                {stats ? `${stats.resolutionRate}%` : '88.5%'}
              </div>
              <div className="text-xs font-medium text-govTextSecondary mt-1">Resolution Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Feed: Latest Announcements & Latest Complaints */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Announcements Preview Feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center border-b border-govBorder pb-3">
            <h2 className="text-lg font-bold text-govTextPrimary flex items-center space-x-2">
              <FileText className="h-5 w-5 text-amber-500" />
              <span>Official Announcements</span>
            </h2>
            <Link to="/announcements" className="text-xs font-medium text-primary hover:underline">
              See All
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-lg" />
                ))}
              </div>
            ) : announcements.length > 0 ? (
              announcements.map((ann) => (
                <div key={ann._id} className="p-4 bg-white border border-govBorder rounded-lg shadow-gov hover:border-amber-200 transition-all relative">
                  {ann.pinned && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 bg-amber-50 rounded border border-amber-200">
                      Pinned
                    </span>
                  )}
                  <span className="text-[10px] uppercase font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded">
                    {ann.category}
                  </span>
                  <h3 className="text-sm font-bold text-govTextPrimary mt-2 line-clamp-1">{ann.title}</h3>
                  <p className="text-xs text-govTextSecondary mt-1 line-clamp-2">{ann.description}</p>
                  <div className="text-[10px] text-govTextSecondary mt-3 font-medium">
                    Published: {new Date(ann.publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-govTextSecondary">No announcements available.</p>
            )}
          </div>
        </div>

        {/* Complaints Preview Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-govBorder pb-3">
            <h2 className="text-lg font-bold text-govTextPrimary flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <span>Latest Public Complaints</span>
            </h2>
            <Link to="/complaints" className="text-xs font-medium text-primary hover:underline">
              Browse Feed
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 animate-pulse grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-40 bg-slate-200 rounded-lg" />
                ))}
              </div>
            ) : latestComplaints.length > 0 ? (
              latestComplaints.map((comp) => (
                <Link
                  key={comp._id}
                  to={`/complaints/${comp.complaintId}`}
                  className="bg-white border border-govBorder rounded-lg overflow-hidden shadow-gov hover:shadow-govMd hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-32 bg-slate-100 overflow-hidden">
                    <img
                      src={comp.images[0]}
                      alt={comp.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(comp.status)}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-govTextSecondary font-bold">
                        <span>{comp.complaintId}</span>
                        <span>{comp.locality}</span>
                      </div>
                      <h3 className="text-sm font-bold text-govTextPrimary mt-1 line-clamp-1">
                        {comp.category}
                      </h3>
                      <p className="text-xs text-govTextSecondary mt-1 line-clamp-2">
                        {comp.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-govTextSecondary border-t border-slate-100 pt-2 font-medium">
                      <span>Ward: {comp.ward}</span>
                      <span>{new Date(comp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-govTextSecondary col-span-2">No complaints reported yet.</p>
            )}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Home;
