import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

interface Alert {
  id: number;
  headline: string;
  type: string;
  severity: string;
  areaDesc: string;
}

const ResponderDashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [myStatus, setMyStatus] = useState("Available");

  useEffect(() => {
    api.get('/disasters/live').then(res => setAlerts(res.data));
  }, []);

  const handleDeploy = (headline: string) => {
    setMyStatus(`Deploying to: ${headline}`);
    alert(`Status updated: You are now responding to ${headline}`);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Status Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 flex justify-between items-center shadow-xl">
          <div>
            <h1 className="text-2xl font-black">Responder Command</h1>
            <p className="text-slate-400 text-sm">Unit ID: RES-7742 | Location: Sonipat</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase block text-slate-500 mb-1">Current Status</span>
            <span className={`px-4 py-1 rounded-full font-bold text-sm ${myStatus === 'Available' ? 'bg-green-500' : 'bg-orange-500'}`}>
              {myStatus}
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 text-slate-800">Active Incidents Needing Response</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  {alert.severity}
                </span>
                <span className="text-slate-400 text-xs font-medium">📍 {alert.areaDesc}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{alert.headline}</h3>
              <button 
                onClick={() => handleDeploy(alert.headline)}
                className="w-full mt-4 bg-slate-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors"
              >
                Accept Deployment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponderDashboard;