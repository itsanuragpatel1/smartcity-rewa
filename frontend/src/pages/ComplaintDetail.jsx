import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import LocationViewMap from '../components/LocationViewMap';
import {
  Calendar,
  Layers,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  Building,
  Image as ImageIcon,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  UserCheck,
  ThumbsUp,
  Wrench,
  CheckCircle2,
  XCircle,
  RotateCw
} from 'lucide-react';

const getTimelineConfig = (status) => {
  const configs = {
    'Pending': {
      color: 'border-amber-500 text-amber-600 bg-amber-50',
      borderL: 'border-l-amber-500',
      remarksBorder: 'border-l-amber-400 bg-amber-50/20',
      badge: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: AlertCircle
    },
    'Assigned': {
      color: 'border-blue-500 text-blue-600 bg-blue-50',
      borderL: 'border-l-blue-500',
      remarksBorder: 'border-l-blue-400 bg-blue-50/20',
      badge: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: UserCheck
    },
    'Accepted': {
      color: 'border-indigo-500 text-indigo-600 bg-indigo-50',
      borderL: 'border-l-indigo-500',
      remarksBorder: 'border-l-indigo-400 bg-indigo-50/20',
      badge: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      icon: ThumbsUp
    },
    'In Progress': {
      color: 'border-purple-500 text-purple-600 bg-purple-50',
      borderL: 'border-l-purple-500',
      remarksBorder: 'border-l-purple-400 bg-purple-50/20',
      badge: 'bg-purple-50 border-purple-200 text-purple-700',
      icon: Wrench
    },
    'Resolved': {
      color: 'border-emerald-500 text-emerald-600 bg-emerald-50',
      borderL: 'border-l-emerald-500',
      remarksBorder: 'border-l-emerald-400 bg-emerald-50/20',
      badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: CheckCircle2
    },
    'Verified': {
      color: 'border-green-500 text-green-600 bg-green-50',
      borderL: 'border-l-green-500',
      remarksBorder: 'border-l-green-400 bg-green-50/20',
      badge: 'bg-green-50 border-green-200 text-green-700',
      icon: ShieldCheck
    },
    'Reopened': {
      color: 'border-orange-500 text-orange-600 bg-orange-50',
      borderL: 'border-l-orange-500',
      remarksBorder: 'border-l-orange-400 bg-orange-50/20',
      badge: 'bg-orange-50 border-orange-200 text-orange-700',
      icon: RotateCw
    },
    'Rejected': {
      color: 'border-red-500 text-red-600 bg-red-50',
      borderL: 'border-l-red-500',
      remarksBorder: 'border-l-red-400 bg-red-50/20',
      badge: 'bg-red-50 border-red-200 text-red-700',
      icon: XCircle
    }
  };
  return configs[status] || {
    color: 'border-slate-500 text-slate-600 bg-slate-50',
    borderL: 'border-l-slate-500',
    remarksBorder: 'border-l-slate-300 bg-slate-50/20',
    badge: 'bg-slate-50 border-slate-200 text-slate-700',
    icon: Clock
  };
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await complaintAPI.getById(id);
        if (res.success) {
          setComplaint(res.data);
          setActiveImage(res.data.images[0]);
        }
      } catch (err) {
        console.error('Failed to load complaint details:', err);
        setError(err.response?.data?.message || 'Complaint details not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

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
      <span className={`px-3 py-1 text-sm font-bold rounded-full border shadow-sm ${classes[status] || 'bg-slate-50 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-3xl w-full mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-lg">
          {error || 'The requested complaint details could not be loaded.'}
        </div>
        <Link to="/complaints" className="inline-flex items-center text-primary font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          <span>Back to Complaints Feed</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back & Breadcrumb */}
      <div>
        <Link to="/complaints" className="inline-flex items-center text-sm text-govTextSecondary hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          <span>Back to Complaint Feed</span>
        </Link>
      </div>

      {/* Main Grid: Info Cards and Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Images and Map Location */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Card with Gallery */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <h2 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider">Complaint Media &amp; Files</h2>
            
            {/* Active Image */}
            <div className="relative aspect-video w-full bg-slate-50 border border-govBorder rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={activeImage}
                alt="Active Complaint Asset"
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white">
                Before Photo
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {complaint.images.length > 1 && (
              <div className="flex space-x-2.5 overflow-x-auto pb-1.5">
                {complaint.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-24 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-primary shadow-sm scale-95' : 'border-govBorder hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Citizen Problem Description Card */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-3">
            <h2 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider">Citizen Problem Description</h2>
            <p className="text-sm text-govTextPrimary bg-slate-50 p-3.5 border border-govBorder rounded-md leading-relaxed whitespace-pre-wrap font-normal">
              {complaint.description}
            </p>
          </div>

          {/* Leaflet Map Card */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <h2 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
              <MapPin className="h-4 w-4 mr-1.5 text-primary" />
              <span>Geological Location Pin</span>
            </h2>
            <LocationViewMap
              location={complaint.location}
              locality={complaint.locality}
              ward={complaint.ward}
            />
            <div className="flex justify-between items-center text-xs text-govTextSecondary bg-slate-50 p-2.5 rounded-md border border-govBorder">
              <div>Locality: <span className="font-semibold text-govTextPrimary">{complaint.locality}</span></div>
              <div>Ward: <span className="font-semibold text-govTextPrimary">Ward #{complaint.ward}</span></div>
              <div className="hidden sm:block">Coordinates: <span className="font-mono text-govTextPrimary">{complaint.location.lat}, {complaint.location.lng}</span></div>
            </div>
          </div>
        </div>

        {/* Right Side: Metadata and Timeline */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Metadata Specifications Card */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-govTextSecondary uppercase">{complaint.complaintId}</span>
                <h1 className="text-xl font-extrabold text-govTextPrimary mt-0.5">{complaint.category}</h1>
              </div>
              <div>
                {getStatusBadge(complaint.status)}
              </div>
            </div>

            {/* Spec Details */}
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3 text-govTextSecondary">
                <Building className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-govTextSecondary">Assigned Department</div>
                  <div className="font-semibold text-govTextPrimary">{complaint.department}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-govTextSecondary">
                <User className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-govTextSecondary">Filed By</div>
                  <div className="font-semibold text-govTextPrimary">
                    {complaint.isAnonymous ? 'Anonymous Citizen' : complaint.reporter?.name || 'Registered Citizen'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-govTextSecondary">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <div className="text-xs text-govTextSecondary">Submission Date</div>
                  <div className="font-semibold text-govTextPrimary">
                    {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Timeline Card */}
          <div className="bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-6">
            <h2 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>Official Lifecycle Timeline</span>
            </h2>

            {/* Steps Container */}
            <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-6 text-sm">
              {complaint.timeline.map((step, idx) => {
                const config = getTimelineConfig(step.status);
                const StatusIcon = config.icon;
                
                return (
                  <div key={step._id || idx} className="relative">
                    {/* Timeline Dot Indicator - centered on the vertical line */}
                    <span className={`absolute -left-[37px] top-1.5 h-8 w-8 rounded-full border-2 bg-white flex items-center justify-center z-10 shadow-sm ${config.color}`}>
                      <StatusIcon className="h-4 w-4" />
                    </span>

                    {/* Log Card */}
                    <div className={`bg-white border border-govBorder border-l-4 ${config.borderL} rounded-lg p-4 shadow-sm space-y-3 transition-all hover:shadow-md`}>
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] tracking-wide uppercase border font-extrabold ${config.badge}`}>
                          {step.status}
                        </span>
                        <span className="text-govTextSecondary font-medium">
                          {new Date(step.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {step.officer && (
                        <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-700 bg-blue-50/40 px-2.5 py-1 rounded border border-blue-100/50 w-fit">
                          <User className="h-3 w-3 text-primary" />
                          <span>Officer: {step.officer.name}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-medium">{step.officer.department}</span>
                        </div>
                      )}

                      <p className={`text-xs text-govTextSecondary leading-relaxed bg-slate-50/60 p-3 rounded-lg border-l-2 italic ${config.remarksBorder}`}>
                        "{step.remarks || 'No remarks provided.'}"
                      </p>

                      {/* Timeline completion photos / after photos */}
                      {step.images && step.images.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
                            <ImageIcon className="h-3 w-3 mr-1 text-slate-400" />
                            <span>Resolution Media</span>
                          </div>
                          <div className="flex space-x-2">
                            {step.images.map((imgUrl, imgIdx) => (
                              <div
                                key={imgIdx}
                                onClick={() => setActiveImage(imgUrl)}
                                className="h-14 w-24 rounded-md border border-govBorder overflow-hidden bg-slate-50 cursor-pointer hover:border-primary hover:scale-102 transition-all shadow-sm"
                              >
                                <img src={imgUrl} alt="Resolution Details" className="h-full w-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
