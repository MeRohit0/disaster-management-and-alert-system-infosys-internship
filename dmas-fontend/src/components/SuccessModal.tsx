import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal = ({ isOpen, onClose, message }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
        </div>
        
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
          Report Archived
        </h3>
        <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
          {message}
        </p>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;