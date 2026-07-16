import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-sans">
      {status === 'verifying' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin mx-auto" />
          <h2 className="text-3xl font-heading italic text-white">Verifying Transaction</h2>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-5xl font-heading italic text-white">Payment Verified</h2>
          <p className="text-white/40 max-w-sm mx-auto">Your account has been upgraded. You now have full access to the Lucid.dev Studio.</p>
          <button 
            onClick={() => navigate('/studio')} 
            className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            Launch Studio
          </button>
        </motion.div>
      )}
    </div>
  );
};
