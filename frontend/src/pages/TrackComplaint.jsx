import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!complaintId.trim()) {
      setError('Please enter a valid Complaint ID.');
      return;
    }

    const trimmedId = complaintId.trim().toUpperCase();
    
    // Simple regex validation for RW-YYYY-XXXXXX format
    const formatRegex = /^RW-\d{4}-\d{6}$/;
    if (!formatRegex.test(trimmedId)) {
      setError('Invalid format. Complaint ID should look like "RW-2026-000145".');
      return;
    }

    navigate(`/complaints/${trimmedId}`);
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-extrabold text-govTextPrimary">Track Anonymous Complaint</h1>
          <p className="text-xs text-govTextSecondary">
            Enter the unique Complaint ID generated during your anonymous submission to monitor resolution timeline logs.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span className="text-xs font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="complaintId" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
              Complaint Tracking ID
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-govTextSecondary">
                <Search className="h-4 w-4" />
              </span>
              <input
                id="complaintId"
                type="text"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                placeholder="RW-2026-000145"
                className="pl-9 w-full rounded-md border border-govBorder bg-slate-50/50 py-2.5 px-3 text-sm font-mono uppercase focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors"
          >
            Track Resolution Status
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackComplaint;
