import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Complaints from './pages/Complaints';
import ComplaintDetail from './pages/ComplaintDetail';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import Announcements from './pages/Announcements';
import Schemes from './pages/Schemes';
import Bills from './pages/Bills';
import AboutRewa from './pages/AboutRewa';
import Profile from './pages/Profile';
import Login from './pages/Login';
import OfficerDashboard from './pages/OfficerDashboard';

// Initialize React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
              <Route path="complaints/submit" element={<SubmitComplaint />} />
              <Route path="complaints/track" element={<TrackComplaint />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="bills" element={<Bills />} />
              <Route path="about" element={<AboutRewa />} />
              <Route path="profile" element={<Profile />} />
              <Route path="login" element={<Login />} />
              <Route path="officer" element={<OfficerDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
