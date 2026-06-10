import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import StudioWorkspace from './studio/pages/StudioWorkspace';
import { AuthPage } from './pages/AuthPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';

// This is the new root App component that separates the marketing site from the AI Studio
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing / Landing Page Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        
        {/* Success Page */}
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        
        {/* The New AI Studio Workspace */}
        <Route path="/studio" element={<StudioWorkspace />} />
        
        {/* Catch all / Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
