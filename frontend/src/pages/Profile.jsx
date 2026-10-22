import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
  User,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FolderOpen,
  Calendar,
  Layers
} from 'lucide-react';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, rejected: 0 });
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await authAPI.getProfile();
        if (res.success) {
          setProfileData(res.data.profile);
          setStats(res.data.stats);
          setMyComplaints(res.data.complaints);
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, authLoading, navigate]);

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

  if (authLoading || loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="border-b border-govBorder pb-5">
        <h1 className="text-2xl font-extrabold text-govTextPrimary">Citizen Profile Portal</h1>
        <p className="text-xs text-govTextSecondary mt-1">Manage personal contact card and track your registered non-anonymous civic reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Profile Information Box */}
        <div className="lg:col-span-4 bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-24 w-24 rounded-full border border-govBorder overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner">
              {profileData?.profilePhoto ? (
                <img src={profileData.profilePhoto} alt="Profile Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-slate-300" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-govTextPrimary">{profileData?.name}</h2>
              <span className="text-[10px] tracking-wider uppercase font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded border border-blue-100 mt-1 inline-block">
                {profileData?.role} account
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-govTextSecondary">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div>
                <span className="text-[10px] font-bold block">Mobile Number</span>
                <span className="font-semibold text-govTextPrimary">{profileData?.mobile}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <div>
                <span className="text-[10px] font-bold block">Email Address</span>
                <span className="font-semibold text-govTextPrimary">{profileData?.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <div>
                <span className="text-[10px] font-bold block">Residential Address</span>
                <span className="font-semibold text-govTextPrimary">{profileData?.address || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Statistics & Complaints Grid */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Complaints Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-govBorder p-4 rounded-lg shadow-gov text-center space-y-1">
              <div className="text-xl font-extrabold text-govTextPrimary">{stats.total}</div>
              <div className="text-[10px] font-bold text-govTextSecondary uppercase tracking-wider">Total Filed</div>
            </div>

            <div className="bg-white border border-govBorder p-4 rounded-lg shadow-gov text-center space-y-1">
              <div className="text-xl font-extrabold text-emerald-600">{stats.resolved}</div>
              <div className="text-[10px] font-bold text-govTextSecondary uppercase tracking-wider">Resolved</div>
            </div>

            <div className="bg-white border border-govBorder p-4 rounded-lg shadow-gov text-center space-y-1">
              <div className="text-xl font-extrabold text-amber-500">{stats.pending}</div>
              <div className="text-[10px] font-bold text-govTextSecondary uppercase tracking-wider">Pending</div>
            </div>

            <div className="bg-white border border-govBorder p-4 rounded-lg shadow-gov text-center space-y-1">
              <div className="text-xl font-extrabold text-red-600">{stats.rejected}</div>
              <div className="text-[10px] font-bold text-govTextSecondary uppercase tracking-wider">Rejected</div>
            </div>
          </div>

          {/* Citizen's Complaint List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
              <FolderOpen className="h-4 w-4 mr-1.5 text-primary" />
              <span>Registered Complaints ({myComplaints.length})</span>
            </h3>

            {myComplaints.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myComplaints.map((c) => (
                  <Link
                    key={c._id}
                    to={`/complaints/${c.complaintId}`}
                    className="bg-white border border-govBorder rounded-lg overflow-hidden shadow-gov hover:shadow-govMd hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-32 bg-slate-100 border-b border-govBorder">
                      <img src={c.images[0]} alt={c.category} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-sm ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold text-govTextSecondary">
                          <span className="font-mono">{c.complaintId}</span>
                          <span className="text-primary">{c.locality}</span>
                        </div>
                        <h4 className="text-sm font-bold text-govTextPrimary line-clamp-1">{c.category}</h4>
                        <p className="text-xs text-govTextSecondary line-clamp-2 leading-relaxed">{c.description}</p>
                      </div>

                      <div className="flex justify-between items-center text-[9px] text-govTextSecondary pt-2 border-t border-slate-100 font-medium">
                        <span className="flex items-center">
                          <Layers className="h-3 w-3 mr-0.5" />
                          Ward {c.ward}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-0.5" />
                          {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-govBorder rounded-lg shadow-gov space-y-3">
                <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-govTextPrimary">No registered complaints.</h4>
                <p className="text-xs text-govTextSecondary max-w-xs mx-auto">
                  Complaints filed under your name will appear here. Note that anonymous reports are excluded.
                </p>
                <div className="pt-2">
                  <Link
                    to="/complaints/submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors"
                  >
                    File New Complaint
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
