import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

interface DisasterAlert {
  id: number;
  headline: string;
  description: string;
  severity: string;
  type: string;
  areaDesc: string;
  instruction: string;
}

const CitizenAllDashboard = () => {
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
      case 'extreme': return 'bg-red-100 border-red-500 text-red-900';
      case 'severe': return 'bg-orange-100 border-orange-500 text-orange-900';
      default: return 'bg-blue-100 border-blue-500 text-blue-900';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Live Alert Feed</h1>
          <p className="text-slate-500">Real-time updates from NDMA Sachet</p>
        </header>

        <div className="grid gap-6">
          {alerts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400">No active alerts for your region at this time.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${getSeverityStyle(alert.severity)}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70">{alert.type}</span>
                    <h2 className="text-xl font-bold mt-1">{alert.headline}</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/50 text-xs font-black uppercase">
                    {alert.severity}
                  </span>
                </div>
                
                <p className="text-slate-700 mb-4">{alert.description}</p>
                
                {alert.instruction && (
                  <div className="bg-white/40 p-4 rounded-lg border border-current/10 mb-4">
                    <p className="text-sm font-bold flex items-center gap-2">
                      <span>📢</span> Instructions:
                    </p>
                    <p className="text-sm italic">{alert.instruction}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs font-medium opacity-60">
                  <span>📍</span> {alert.areaDesc}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenAllDashboard;