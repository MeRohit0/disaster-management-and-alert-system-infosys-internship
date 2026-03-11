import React, { useState } from 'react';
import { sosService } from '../../api/sosService';
import type { HelpRequestDTO }  from "../../types/helpRequest";

interface SOSButtonProps {
  userId: number;
  userLocation: string;
}

const SOSButton: React.FC<SOSButtonProps> = ({ userId, userLocation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'MEDICAL',
    description: '',
  });

  const handleSOSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get precise GPS coordinates
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const payload:HelpRequestDTO = {
          citizenId: userId,
          location: userLocation,
          type: formData.type,
          description: formData.description,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          status: 'PENDING'
        };

        await sosService.sendSOS(payload);
        alert("🚨 SOS Sent! Responders have been notified.");
        setIsModalOpen(false);
        setFormData({ type: 'MEDICAL', description: '' });
      }, (err) => {
        alert("Location access denied. Please enable GPS for SOS.");
      });
    } catch (error) {
      alert("Failed to connect to emergency services.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* THE MAIN SOS TRIGGER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative w-40 h-40 bg-red-600 rounded-full border-8 border-red-100 shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <span className="text-3xl font-black text-white group-hover:animate-pulse">SOS</span>
          </button>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Emergency Alert</h3>
          <p className="text-xs text-slate-500 font-medium">Click to report a life-threatening situation</p>
        </div>
      </div>

      {/* EMERGENCY FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in zoom-in duration-200 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Emergency Info</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSOSSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Emergency Category</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="MEDICAL">🚑 Medical Help</option>
                  <option value="FIRE">🔥 Fire Emergency</option>
                  <option value="ACCIDENT">🚗 Road Accident</option>
                  <option value="CRIME">🛡️ Security / Crime</option>
                  <option value="FLOOD">🌊 Natural Disaster</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Details (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Someone is trapped, heavy smoke..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-200 transition-all text-sm uppercase tracking-wider"
                >
                  {loading ? "BROADCASTING..." : "CONFIRM SOS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;