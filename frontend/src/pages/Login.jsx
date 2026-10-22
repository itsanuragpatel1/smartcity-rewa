import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, AlertCircle, LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login inputs
  const [identifier, setIdentifier] = useState(''); // Mobile or Email
  const [password, setPassword] = useState('');

  // Register inputs
  const [name, setName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError('Please provide email/mobile and password.');
      return;
    }

    setLoading(true);
    try {
      const userData = await login(identifier.trim(), password);
      
      // Redirect based on role
      if (userData.role === 'officer') {
        navigate('/officer');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!name.trim() || !regMobile.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Dynamic profile photo based on name seed
      const nameSeed = name.trim().toLowerCase().replace(/\s+/g, '');
      const profilePhoto = `https://api.dicebear.com/7.x/adventurer/svg?seed=${nameSeed}`;

      await register({
        name: name.trim(),
        mobile: regMobile.trim(),
        email: regEmail.trim(),
        address: regAddress.trim(),
        password: regPassword,
        profilePhoto,
      });

      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white border border-govBorder rounded-lg p-6 shadow-gov space-y-6">
        
        {/* Logo Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 bg-primary-light text-primary items-center justify-center rounded-lg border border-blue-200">
            <Landmark className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-extrabold text-govTextPrimary">Rewa Connect Gateway</h1>
          <p className="text-xs text-govTextSecondary">
            Official citizen registration and administrative login portal
          </p>
        </div>

        {/* Auth Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md flex items-start space-x-2.5">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
            <span className="text-xs font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* Tabs selector */}
        <div className="grid grid-cols-2 border border-govBorder rounded-md p-1 bg-slate-50 text-xs">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setError(null);
            }}
            className={`py-1.5 font-bold rounded-md transition-all ${
              isLoginTab ? 'bg-white shadow text-primary' : 'text-govTextSecondary hover:text-govTextPrimary'
            }`}
          >
            Citizen Sign In
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setError(null);
            }}
            className={`py-1.5 font-bold rounded-md transition-all ${
              !isLoginTab ? 'bg-white shadow text-primary' : 'text-govTextSecondary hover:text-govTextPrimary'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Forms implementation */}
        {isLoginTab ? (
          /* Login form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
                Email Address or Mobile
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. rajesh@gmail.com or 9876543210"
                className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="loginPass" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
                Password
              </label>
              <input
                id="loginPass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          /* Register form */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="regName" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="regName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Patel"
                className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="regMobile" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  id="regMobile"
                  type="text"
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="regEmail" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="regEmail"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rajesh@gmail.com"
                  className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="regAddr" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
                Residential Address
              </label>
              <input
                id="regAddr"
                type="text"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="e.g. Shilpi Plaza Road, Amahiya, Rewa"
                className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="regPass" className="block text-xs font-semibold text-govTextSecondary mb-1.5 uppercase">
                Create Password <span className="text-red-500">*</span>
              </label>
              <input
                id="regPass"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-md border border-govBorder bg-slate-50/50 py-2 px-3 text-sm focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            </button>
          </form>
        )}
        
      </div>
    </div>
  );
};

export default Login;
