import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Landmark, User as UserIcon, ShieldAlert, LogOut, CheckSquare } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-primary border-primary border-b-2 font-semibold'
      : 'text-govTextSecondary hover:text-primary transition-colors duration-150';
  };

  const isMobileActive = (path) => {
    return location.pathname === path
      ? 'bg-primary-light text-primary font-semibold'
      : 'text-govTextSecondary hover:bg-slate-50 hover:text-primary transition-colors';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Complaints', path: '/complaints' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Schemes', path: '/schemes' },
    { name: 'Bills', path: '/bills' },
    { name: 'About Rewa', path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-govBg">
      {/* Header */}
      <header className="sticky top-0 bg-govCard border-b border-govBorder z-50 shadow-gov">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-lg select-none">
              <Landmark className="h-6 w-6" />
              <span className="tracking-tight text-govTextPrimary flex flex-col leading-none">
                <span>REWA CONNECT</span>
                <span className="text-[10px] text-govTextSecondary font-normal">Smart City Rewa 2030</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6 h-full items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-1 h-full pt-1 text-sm ${isActive(link.path)}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth/Officer Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  {user.role === 'officer' && (
                    <Link
                      to="/officer"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Officer Portal</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-govTextSecondary hover:text-primary transition-colors text-sm py-1.5 px-3 border border-govBorder rounded-md"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="font-medium text-govTextPrimary">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-govTextSecondary hover:text-red-500 rounded-md border border-govBorder hover:border-red-200 transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors"
                >
                  Login / Register
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {user && user.role === 'officer' && (
                <Link
                  to="/officer"
                  className="mr-3 flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200"
                >
                  <ShieldAlert className="h-3 w-3" />
                  <span>Officer</span>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-govTextSecondary hover:text-govTextPrimary focus:outline-none p-1.5 border border-govBorder rounded-md"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-govCard border-t border-govBorder px-2 pt-2 pb-4 space-y-1 shadow-md">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base ${isMobileActive(link.path)}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-govBorder pt-3 mt-3 px-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 py-1">
                    <UserIcon className="h-5 w-5 text-govTextSecondary" />
                    <div>
                      <div className="font-semibold text-sm text-govTextPrimary">{user.name}</div>
                      <div className="text-xs text-govTextSecondary capitalize">{user.role}</div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block w-full text-center px-4 py-2 border border-govBorder text-sm font-medium rounded-md hover:bg-slate-50 text-govTextPrimary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-md shadow-gov transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-govTextPrimary text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-lg">
                <Landmark className="h-6 w-6 text-primary" />
                <span>REWA CONNECT</span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm">
                A single unified digital platform for citizens of Rewa to report issues, access schemes, read announcements, and pay municipal utility bills.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/complaints" className="hover:text-white transition-colors">Submit a Complaint</Link></li>
                <li><Link to="/announcements" className="hover:text-white transition-colors">Official Announcements</Link></li>
                <li><Link to="/schemes" className="hover:text-white transition-colors">Government Schemes</Link></li>
                <li><Link to="/bills" className="hover:text-white transition-colors">Utility Bills Payment</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Emergency Helplines</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><span className="text-white font-medium">Police Support:</span> 100 / 112</li>
                <li><span className="text-white font-medium">Ambulance:</span> 108</li>
                <li><span className="text-white font-medium">Women Helpline:</span> 1090</li>
                <li><span className="text-white font-medium">Municipal Control Room:</span> 07662-254013</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Rewa Municipal Corporation. Built for Smart City Rewa 2030.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="hover:text-white cursor-default">Transparency Portal</span>
              <span>•</span>
              <span className="hover:text-white cursor-default">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-white cursor-default">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
