import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import {
  FolderOpen,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  Camera,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const OfficerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'officer') {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Tab State: 'pending' | 'active' | 'resolved' | 'rejected'
  const [activeTab, setActiveTab] = useState('pending');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected complaint details modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [completionFiles, setCompletionFiles] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const fetchComplaints = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Build filter parameters based on tab
      const params = {
        department: user.department,
        limit: 100, // retrieve all for officer dashboard
      };

      if (activeTab === 'pending') {
        params.status = 'Pending';
      } else if (activeTab === 'active') {
        // Find assigned, accepted, in progress, reopened
        // Since backend does singular status checks, we can fetch all and filter client-side,
        // or make multiple requests. Client-side filtering is extremely simple and fast here!
        params.status = 'All'; 
      } else if (activeTab === 'resolved') {
        params.status = 'All';
      } else if (activeTab === 'rejected') {
        params.status = 'Rejected';
      }

      const res = await complaintAPI.getAll(params);
      if (res.success) {
        let filtered = res.data;
        if (activeTab === 'active') {
          filtered = res.data.filter(c => ['Assigned', 'Accepted', 'In Progress', 'Reopened'].includes(c.status));
        } else if (activeTab === 'resolved') {
          filtered = res.data.filter(c => ['Resolved', 'Verified'].includes(c.status));
        }
        setComplaints(filtered);
      }
    } catch (err) {
      console.error('Failed to load officer complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeTab, user]);

  const handleAction = async (newStatus) => {
    if (!selectedComplaint) return;
    setActionError(null);

    // Resolution files verification
    if (newStatus === 'Resolved' && completionFiles.length === 0) {
      setActionError('At least one resolution proof photo must be uploaded.');
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('remarks', remarks || `Status updated to ${newStatus} by Officer ${user.name}`);

      completionFiles.forEach(file => {
        formData.append('images', file);
      });

      const res = await complaintAPI.updateStatus(selectedComplaint._id, formData);
      if (res.success) {
        setSelectedComplaint(null);
        setRemarks('');
        setCompletionFiles([]);
        fetchComplaints(); // Refresh list
      }
    } catch (err) {
      console.error(err);
      setActionError(err.response?.data?.message || 'Failed to update complaint state.');
    } finally {
      setActionLoading(false);
    }
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

  if (authLoading) return null;

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Officer Header Info */}
      <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-wider uppercase font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            Municipal Officer Portal
          </span>
          <h1 className="text-xl font-extrabold text-govTextPrimary mt-1.5">{user?.name}</h1>
          <p className="text-xs text-govTextSecondary mt-0.5">
            Department: <span className="font-semibold text-govTextPrimary">{user?.department}</span>
          </p>
        </div>
        <div className="text-xs text-right hidden sm:block">
          <span className="text-govTextSecondary block">Official Email ID</span>
          <span className="font-semibold text-govTextPrimary font-mono">{user?.email}</span>
        </div>
      </div>

      {/* Tabs list */}
      <div className="grid grid-cols-4 border border-govBorder rounded-md p-1 bg-slate-50 text-xs text-center font-bold">
        <button
          onClick={() => {
            setActiveTab('pending');
            setSelectedComplaint(null);
          }}
          className={`py-2 rounded transition-all ${
            activeTab === 'pending' ? 'bg-white shadow text-primary' : 'text-govTextSecondary hover:text-govTextPrimary'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => {
            setActiveTab('active');
            setSelectedComplaint(null);
          }}
          className={`py-2 rounded transition-all ${
            activeTab === 'active' ? 'bg-white shadow text-primary' : 'text-govTextSecondary hover:text-govTextPrimary'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => {
            setActiveTab('resolved');
            setSelectedComplaint(null);
          }}
          className={`py-2 rounded transition-all ${
            activeTab === 'resolved' ? 'bg-white shadow text-primary' : 'text-govTextSecondary hover:text-govTextPrimary'
          }`}
        >
          Resolved
        </button>
        <button
          onClick={() => {
            setActiveTab('rejected');
            setSelectedComplaint(null);
          }}
          className={`py-2 rounded transition-all ${
            activeTab === 'rejected' ? 'bg-white shadow text-primary' : 'text-govTextSecondary hover:text-govTextPrimary'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Layout Split: Cards List and active details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Complaints list */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
            <FolderOpen className="h-4 w-4 mr-1.5 text-primary" />
            <span>Assigned Cases ({complaints.length})</span>
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white border border-govBorder h-28 rounded-lg" />
              ))}
            </div>
          ) : complaints.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {complaints.map((c) => (
                <button
                  key={c._id}
                  onClick={() => {
                    setSelectedComplaint(c);
                    setRemarks('');
                    setCompletionFiles([]);
                    setActionError(null);
                  }}
                  className={`w-full text-left p-4 bg-white border rounded-lg shadow-gov hover:shadow transition-all flex justify-between items-start space-x-3 ${
                    selectedComplaint?._id === c._id ? 'border-primary ring-1 ring-primary-light' : 'border-govBorder'
                  }`}
                >
                  <div className="space-y-2 flex-grow min-w-0">
                    <div className="flex justify-between items-center text-[10px] font-bold text-govTextSecondary">
                      <span className="font-mono">{c.complaintId}</span>
                      <span className="text-primary">{c.locality}</span>
                    </div>
                    <h3 className="text-sm font-bold text-govTextPrimary truncate">{c.category}</h3>
                    <p className="text-xs text-govTextSecondary truncate">{c.description}</p>
                    
                    <div className="flex justify-between items-center text-[10px] text-govTextSecondary pt-1 border-t border-slate-50 font-medium">
                      <span>Ward: {c.ward}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 shrink-0 self-center" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-govBorder rounded-lg shadow-gov space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-govTextPrimary">All Clean!</h3>
              <p className="text-xs text-govTextSecondary max-w-xs mx-auto">
                No active complaints listed under this tab for your department.
              </p>
            </div>
          )}
        </div>

        {/* Right column: Action Board */}
        <div className="lg:col-span-7">
          {selectedComplaint ? (
            <div className="bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-6">
              
              {/* Top details heading */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-govTextSecondary uppercase">{selectedComplaint.complaintId}</span>
                  <h2 className="text-lg font-extrabold text-govTextPrimary mt-0.5">{selectedComplaint.category}</h2>
                  <div className="text-xs text-govTextSecondary mt-1 flex items-center space-x-3">
                    <span className="flex items-center"><MapPin className="h-3 w-3 mr-0.5 text-primary shrink-0" />{selectedComplaint.locality}</span>
                    <span>Ward #{selectedComplaint.ward}</span>
                  </div>
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border shadow-sm ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
              </div>

              {/* Citizen Description */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-govTextSecondary uppercase tracking-wider block">Citizen Grievance Description</span>
                <p className="text-sm text-govTextPrimary bg-slate-50 p-3 rounded-md border border-govBorder leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Uploaded Images View */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-govTextSecondary uppercase tracking-wider block">Incident Photos</span>
                <div className="flex flex-wrap gap-2">
                  {selectedComplaint.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-16 w-24 rounded border border-govBorder overflow-hidden bg-slate-50 cursor-zoom-in hover:opacity-95"
                    >
                      <img src={img} alt="Incident" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Officer Action Workflow Board */}
              <div className="border-t border-slate-100 pt-5 space-y-5">
                <h3 className="text-sm font-extrabold text-govTextPrimary">Case Action Console</h3>

                {actionError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md flex items-start space-x-2.5">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
                    <span className="text-xs font-semibold leading-relaxed">{actionError}</span>
                  </div>
                )}

                {/* Workflow buttons based on status */}
                <div className="flex flex-wrap gap-3">
                  {selectedComplaint.status === 'Pending' && (
                    <button
                      onClick={() => handleAction('Accepted')}
                      disabled={actionLoading}
                      className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow transition-colors"
                    >
                      Accept Case &amp; Schedule Inspection
                    </button>
                  )}

                  {selectedComplaint.status === 'Accepted' && (
                    <button
                      onClick={() => handleAction('In Progress')}
                      disabled={actionLoading}
                      className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow transition-colors"
                    >
                      Mark as "In Progress" (Initiate Site Labor)
                    </button>
                  )}

                  {selectedComplaint.status === 'In Progress' && (
                    <div className="w-full space-y-4 bg-slate-50 border border-govBorder p-4 rounded-lg">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-govTextSecondary uppercase">
                          Upload Resolution Proof Photos <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-1 px-3 py-1.5 border border-govBorder rounded-md text-xs font-semibold bg-white cursor-pointer hover:bg-slate-50">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Select Files</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => setCompletionFiles(Array.from(e.target.files))}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-govTextSecondary">
                            {completionFiles.length > 0 ? `${completionFiles.length} file(s) chosen` : 'No file chosen'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-govTextSecondary uppercase">Resolution Notes &amp; Remarks</label>
                        <textarea
                          rows="2"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Provide details about materials used or repairs executed..."
                          className="w-full rounded border border-govBorder p-2 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>

                      <button
                        onClick={() => handleAction('Resolved')}
                        disabled={actionLoading}
                        className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow transition-colors"
                      >
                        {actionLoading ? 'Saving...' : 'Submit Resolution Proof'}
                      </button>
                    </div>
                  )}

                  {selectedComplaint.status === 'Reopened' && (
                    <button
                      onClick={() => handleAction('In Progress')}
                      disabled={actionLoading}
                      className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow transition-colors"
                    >
                      Acknowledge &amp; Return to "In Progress"
                    </button>
                  )}

                  {/* Reject action available for pending, assigned, accepted */}
                  {['Pending', 'Assigned', 'Accepted', 'Reopened'].includes(selectedComplaint.status) && (
                    <div className="w-full space-y-3 pt-2 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-govTextSecondary uppercase">Rejection Justification</label>
                        <textarea
                          rows="2"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Provide reasons (e.g. duplicate case, outside municipality property)..."
                          className="w-full rounded border border-govBorder p-2 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>

                      <button
                        onClick={() => handleAction('Rejected')}
                        disabled={actionLoading}
                        className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow transition-colors flex items-center space-x-1.5"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject Complaint</span>
                      </button>
                    </div>
                  )}

                  {/* If Resolved / Rejected, show historical timeline remarks */}
                  {['Resolved', 'Verified', 'Rejected'].includes(selectedComplaint.status) && (
                    <p className="text-xs font-medium text-govTextSecondary italic bg-slate-50 p-2.5 rounded border border-govBorder w-full">
                      This complaint has reached a terminal status. Historical timeline logs are un-editable.
                    </p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-govBorder rounded-lg shadow-gov space-y-4">
              <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto" />
              <h2 className="text-lg font-bold text-govTextPrimary">Select Case to View Action Board</h2>
              <p className="text-xs text-govTextSecondary max-w-xs mx-auto">
                Choose one of the assigned complaints on the left to verify coordinates, view images, post updates, and log completion records.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OfficerDashboard;
