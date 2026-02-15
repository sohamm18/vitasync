import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';
import { AppProvider } from './context/AppContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="w-full h-full min-h-screen bg-gray-50">
          <Routes>
            {/* Route for Login */}
            <Route path="/" element={<LoginScreen />} />
            
            {/* Route for Dashboard */}
            <Route path="/dashboard/*" element={<Dashboard />} />
            
            {/* Redirect unknown routes to Login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AppProvider>
  );
}