import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import LocationPicker from '../components/LocationPicker';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Upload,
  Camera,
  Info,
  Layers,
  FileText,
  MapPin,
  EyeOff,
  CornerDownRight
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Auto Detect',
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

const SubmitComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Auto Detect');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState(null); // { lat, lng }
  const [imageFiles, setImageFiles] = useState([]); // Array of File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Array of ObjectURLs

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  // Handle multi-image file select
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      const isImg = file.type.startsWith('image/');
      if (!isImg) alert(`File ${file.name} is not an image.`);
      return isImg;
    });

    if (validFiles.length === 0) return;

    const updatedFiles = [...imageFiles, ...validFiles];
    setImageFiles(updatedFiles);

    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  // Delete preview file
  const removeImage = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    setImageFiles(updatedFiles);

    const updatedPreviews = [...imagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (imageFiles.length === 0) {
      setError('At least one photo of the incident is required as evidence.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a detailed description of the problem.');
      return;
    }

    if (!location) {
      setError('Please pin the location of the incident on the map.');
      return;
    }

    if (!user && !isAnonymous) {
      setError('Citizen authentication required to register a named complaint. Please login or select "Submit Anonymously" below.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('category', category);
      formData.append('isAnonymous', isAnonymous);
      formData.append('location', JSON.stringify(location));

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await complaintAPI.submit(formData);
      if (res.success) {
        setSuccess(true);
        setSubmittedId(res.data.complaintId);
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
      } else {
        setError(res.message || 'Complaint submission failed.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Server error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl w-full mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 shadow-govMd space-y-5">
          <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-govTextPrimary">Complaint Registered Successfully!</h2>
          <p className="text-xs text-govTextSecondary leading-relaxed">
            Your civic complaint has been successfully mapped to the municipal ward database. The responsible department will inspect and assign an officer.
          </p>

          <div className="bg-white border border-govBorder rounded-lg p-4 max-w-xs mx-auto shadow-inner">
            <div className="text-[10px] text-govTextSecondary uppercase font-bold tracking-wider">Tracking Reference ID</div>
            <div className="text-xl font-mono font-black text-primary select-all mt-1">{submittedId}</div>
          </div>

          <p className="text-xs text-govTextSecondary italic leading-relaxed">
            {isAnonymous
              ? 'Important: Since this was submitted anonymously, it will not appear in your citizen profile dashboard. Copy or note down the ID above to track resolution logs on the "Track Complaint" page.'
              : 'This case will appear in your citizen profile under "My Complaints".'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => navigate(`/complaints/${submittedId}`)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors"
          >
            View Live Timeline
          </button>
          <button
            onClick={() => navigate('/complaints')}
            className="px-5 py-2.5 text-xs font-semibold text-govTextPrimary bg-white border border-govBorder hover:bg-slate-50 rounded-md transition-colors"
          >
            Back to Public Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & Transparency Notice */}
      <div className="border-b border-govBorder pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-govTextPrimary">File a Civic Complaint</h1>
          <p className="text-xs text-govTextSecondary mt-0.5">
            Your location selection automatically maps your ward, category, and responsible department.
          </p>
        </div>
        
        {/* Transparency Banner info */}
        <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-lg max-w-md flex items-start space-x-2.5 text-[11px] text-slate-600">
          <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-govTextPrimary">Transparency Policy:</span> All complaints are public to ensure accountability. You can hide your personal profile details using the anonymous toggle.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start space-x-2.5">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <span className="text-xs font-semibold leading-relaxed">{error}</span>
        </div>
      )}

      {/* Main Grid Submission Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Steps (Evidence & Description) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Evidence Files */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <span className="h-5 w-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-bold">1</span>
              <h2 className="text-sm font-bold text-govTextPrimary">Upload Incident Photos <span className="text-red-500">*</span></h2>
            </div>
            
            {/* Snap zone */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-govBorder hover:border-blue-400 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <div className="flex space-x-2">
                    <Upload className="h-5 w-5 text-govTextSecondary" />
                    <Camera className="h-5 w-5 text-govTextSecondary" />
                  </div>
                  <p className="text-xs font-semibold text-govTextSecondary mt-2">
                    Click to browse files or snap photos on mobile
                  </p>
                  <p className="text-[10px] text-govTextSecondary mt-1">PNG, JPG or WEBP up to 5MB</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview Thumbnails */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-1.5">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md border border-govBorder overflow-hidden bg-slate-100 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Problem Details */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <span className="h-5 w-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-bold">2</span>
              <h2 className="text-sm font-bold text-govTextPrimary">Describe the Problem <span className="text-red-500">*</span></h2>
            </div>

            <div className="space-y-1.5">
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue clearly. Example: 'There is a large pothole near Sirmour Chowk causing accidents' or 'Garbage has not been collected for four days.'"
                className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-all leading-relaxed"
              />
              <span className="block text-[10px] text-govTextSecondary italic">
                * Please include street name or landmark details in the description if available.
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Map Picker Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <span className="h-5 w-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-bold">3</span>
              <h2 className="text-sm font-bold text-govTextPrimary font-sans">Pin Location on Map</h2>
            </div>
            
            <LocationPicker value={location} onChange={setLocation} />
          </div>

          {/* Card 4: Submission Settings */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <span className="h-5 w-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-bold">4</span>
              <h2 className="text-sm font-bold text-govTextPrimary">Routing &amp; Security Settings</h2>
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-bold text-govTextSecondary uppercase">
                Category Selection
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-all"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p className="text-[10px] text-govTextSecondary leading-normal">
                Selecting <span className="font-semibold text-primary">Auto Detect</span> analyzes keywords in your description automatically to route the issue to the correct department (e.g. Garbage &rarr; Sanitation).
              </p>
            </div>

            {/* Anonymous Toggle */}
            <div className="border-t border-slate-100 pt-4">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-govBorder text-primary focus:ring-primary"
                />
                <div>
                  <span className="block text-xs font-bold text-govTextPrimary flex items-center">
                    <EyeOff className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    <span>Submit Anonymously</span>
                  </span>
                  <span className="block text-[10px] text-govTextSecondary leading-relaxed mt-0.5">
                    Hides your reporter name and profile image from the public feed. The complaint will remain public but will be omitted from your user profile.
                  </span>
                </div>
              </label>
            </div>

            {/* Citizen Auth Warning */}
            {!user && !isAnonymous && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md flex items-start space-x-2 text-[11px] leading-relaxed">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  You are not logged in. You must check the <span className="font-bold">"Submit Anonymously"</span> option above to register this complaint.
                </span>
              </div>
            )}

            {/* File Submission Action button */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover active:scale-98 rounded-md shadow-gov transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Routing and Resolving...' : 'Submit Grievance to Municipal Corp'}</span>
              <CornerDownRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default SubmitComplaint;
