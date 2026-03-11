import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import SOSButton from '../components/citizen/SOSButton'; // Import your new Module 3 component

interface DisasterAlert {
  id: number;
  headline: string;
  description: string;
  severity: string;
  type: string;
  areaDesc: string;
  instruction: string;
}

const CitizenDashboard = () => {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/disasters/live');
        setAlerts(response.data);
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      }
    };
    fetchAlerts();
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'extreme': return 'bg-red-50 border-red-500 text-red-900';
      case 'severe': return 'bg-orange-50 border-orange-500 text-orange-900';
      default: return 'bg-blue-50 border-blue-500 text-blue-900';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Citizen Dashboard</h1>
            <p className="text-slate-500 font-medium">Monitoring: {user?.location || 'Your Region'}</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live System Active
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT/CENTER: LIVE ALERTS FEED (Existing Logic) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Live Alert Feed</h2>
            
            {alerts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-400">No active alerts for your region at this time.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`p-6 rounded-xl border-l-4 shadow-sm bg-white transition-transform hover:scale-[1.01] ${getSeverityStyle(alert.severity)}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{alert.type}</span>
                      <h2 className="text-xl font-bold mt-1 text-slate-900">{alert.headline}</h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/60 text-[10px] font-black uppercase border border-current/10">
                      {alert.severity}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 mb-4 leading-relaxed">{alert.description}</p>
                  
                  {alert.instruction && (
                    <div className="bg-white/50 p-4 rounded-lg border border-current/10 mb-4">
                      <p className="text-xs font-bold flex items-center gap-2 mb-1 uppercase tracking-wider">
                        📢 Instructions:
                      </p>
                      <p className="text-sm italic text-slate-800">{alert.instruction}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide opacity-50">
                    <span>📍</span> {alert.areaDesc}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT SIDE: MODULE 3 SOS SECTION */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Emergency Actions</h2>
            
            {/* SOS Component Box */}
            <div className="sticky top-6">
              {user ? (
                <SOSButton userId={user.id} userLocation={user.location} />
              ) : (
                <div className="p-6 bg-slate-200 rounded-xl text-center text-slate-500 animate-pulse">
                  Loading User Context...
                </div>
              )}

              {/* Quick Info Below SOS */}
              <div className="mt-6 p-5 bg-slate-900 rounded-xl shadow-xl text-white">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Critical Contact Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">National Help</span>
                    <span className="font-bold">112</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Disaster Management</span>
                    <span className="font-bold">108</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 leading-tight italic">
                    By clicking SOS, your precise coordinates are broadcast to authorized responders in {user?.location || 'your area'}.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;