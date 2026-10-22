import React, { useState } from 'react';
import { billAPI } from '../services/api';
import { Search, CreditCard, CheckCircle2, AlertTriangle, Calendar, Layers, ShieldCheck, History, Landmark, X } from 'lucide-react';

const BILL_CATEGORIES = [
  { name: 'Water Bill', description: 'Monthly water tax & consumption dues', icon: 'droplet' },
  { name: 'Property Tax', description: 'Annual land & property tax assessments', icon: 'home' },
  { name: 'Garbage Collection', description: 'Waste disposal & sanitation maintenance fees', icon: 'trash-2' },
  { name: 'Municipal Charges', description: 'General utility charges & municipal fees', icon: 'landmark' },
];

const Bills = () => {
  const [selectedBillType, setSelectedBillType] = useState('Water Bill');
  const [consumerNumber, setConsumerNumber] = useState('');
  
  // Search state
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Payment modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setBill(null);
    setError(null);

    if (!consumerNumber.trim()) {
      setError('Please enter a Consumer Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await billAPI.get(selectedBillType, consumerNumber.trim().toUpperCase());
      if (res.success) {
        setBill(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to locate consumer record.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!bill) return;

    setPaymentLoading(true);
    setPaymentSuccess(false);

    try {
      const res = await billAPI.pay(bill._id, paymentMethod);
      if (res.success) {
        setBill(res.data); // Update localized state with paid bill
        setPaymentSuccess(true);
        setTimeout(() => {
          setShowPayModal(false);
          setPaymentSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Payment execution failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-6">
      
      {/* Header */}
      <div className="border-b border-govBorder pb-5">
        <h1 className="text-2xl font-extrabold text-govTextPrimary">Municipal Utility Bills Payment</h1>
        <p className="text-xs text-govTextSecondary mt-1">Search, verify dues, and process quick payments for utilities and property tax online</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Bill Selector & Search */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <h2 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider">Select Bill Category</h2>
            
            <div className="space-y-2">
              {BILL_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedBillType(cat.name);
                    setBill(null);
                    setError(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all flex items-start space-x-3 ${
                    selectedBillType === cat.name
                      ? 'border-primary bg-primary-light shadow-sm'
                      : 'border-govBorder hover:border-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-md ${
                    selectedBillType === cat.name ? 'bg-primary text-white' : 'bg-slate-100 text-govTextSecondary'
                  }`}>
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-govTextPrimary">{cat.name}</div>
                    <div className="text-[10px] text-govTextSecondary leading-relaxed mt-0.5">{cat.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-white border border-govBorder rounded-lg p-5 shadow-gov space-y-4">
            <h2 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider">Search Consumer</h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="consumerNumber" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
                  Consumer Number / Property ID
                </label>
                <input
                  id="consumerNumber"
                  type="text"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  placeholder="e.g. RWW1000001"
                  className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm font-mono uppercase focus:bg-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                <span>{loading ? 'Searching...' : 'Search Active Dues'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Bill Details & Payment History */}
        <div className="lg:col-span-8">
          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start space-x-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <span className="text-xs font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {bill ? (
            <div className="space-y-6">
              {/* Bill Specification Card */}
              <div className="bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary bg-primary-light px-2 py-0.5 rounded border border-blue-100">
                      {bill.billType}
                    </span>
                    <h2 className="text-lg font-extrabold text-govTextPrimary mt-2">Consumer Account</h2>
                    <p className="text-xs font-mono text-govTextSecondary mt-0.5">ID: {bill.consumerNumber}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      bill.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                  <div>
                    <span className="block text-xs text-govTextSecondary">Account Holder</span>
                    <span className="font-bold text-govTextPrimary mt-0.5 block">{bill.ownerName}</span>
                  </div>
                  
                  <div>
                    <span className="block text-xs text-govTextSecondary">Due Date</span>
                    <span className="font-bold text-govTextPrimary mt-0.5 block flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                      {new Date(bill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs text-govTextSecondary">Amount Due</span>
                    <span className="text-lg font-black text-govTextPrimary mt-0.5 block">
                      ₹{bill.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                {bill.status === 'Unpaid' && (
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setShowPayModal(true)}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-gov transition-colors flex items-center space-x-1.5"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Proceed to Payment</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Payment History Log */}
              <div className="bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-4">
                <h3 className="text-sm font-bold text-govTextSecondary uppercase tracking-wider flex items-center">
                  <History className="h-4 w-4 mr-1.5 text-primary" />
                  <span>Previous Payment Transactions</span>
                </h3>

                {bill.paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {bill.paymentHistory.map((history) => (
                      <div key={history._id} className="bg-slate-50 border border-govBorder rounded-md p-3 flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <div className="font-semibold text-govTextPrimary flex items-center">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                            <span>Transaction ID: {history.transactionId}</span>
                          </div>
                          <div className="text-[10px] text-govTextSecondary">
                            Paid on: {new Date(history.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} ({history.paymentMethod})
                          </div>
                        </div>
                        <div className="font-extrabold text-govTextPrimary text-sm">
                          ₹{history.amountPaid.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-govTextSecondary italic">No historical transactions logged for this consumer account.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-govBorder rounded-lg shadow-gov space-y-4">
              <CreditCard className="h-12 w-12 text-slate-300 mx-auto" />
              <h2 className="text-lg font-bold text-govTextPrimary">Verify Account Details</h2>
              <p className="text-xs text-govTextSecondary max-w-xs mx-auto">
                Please select your bill category on the left, type in your consumer account ID, and search to view active dues.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mock Payment Gateway Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-govBorder rounded-lg p-6 shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowPayModal(false)}
              className="absolute top-4 right-4 text-govTextSecondary hover:text-govTextPrimary"
            >
              <X className="h-5 w-5" />
            </button>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-govTextPrimary">Payment Completed!</h3>
                <p className="text-xs text-govTextSecondary max-w-xs mx-auto">
                  Municipal funds successfully transferred. Your receipt is updated in transaction history below.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-govTextPrimary">Mock Payment Gateway</h3>
                  <p className="text-xs text-govTextSecondary">Securing transaction to Rewa Municipal Corporation account.</p>
                </div>

                {/* Dues summary */}
                <div className="bg-slate-50 border border-govBorder rounded-md p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-govTextPrimary">{bill.ownerName}</div>
                    <div className="text-[10px] text-govTextSecondary">{bill.billType} ({bill.consumerNumber})</div>
                  </div>
                  <div className="font-black text-govTextPrimary text-base">₹{bill.amount.toFixed(2)}</div>
                </div>

                {/* Method selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-govTextSecondary uppercase">Payment Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-md border border-govBorder bg-slate-50 py-2 px-3 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="UPI / QR Code Scan">UPI / QR Code Scan</option>
                    <option value="Credit / Debit Card Card">Credit / Debit Card</option>
                    <option value="Net Banking MPONLINE">Net Banking / MPONLINE</option>
                  </select>
                </div>

                {/* CTAs */}
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowPayModal(false)}
                    className="flex-1 py-2 text-xs font-semibold border border-govBorder rounded-md hover:bg-slate-50 text-govTextPrimary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={paymentLoading}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-gov transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>{paymentLoading ? 'Authorizing...' : 'Authorize Pay'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
