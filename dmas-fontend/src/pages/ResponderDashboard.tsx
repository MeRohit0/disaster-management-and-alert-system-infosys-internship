import React, { useEffect, useState } from 'react';
import { sosService } from '../api/sosService';
import { useAuth } from '../context/AuthContext';
import { type HelpRequestDTO } from '../types/helpRequest';

const ResponderDashboard = () => {
  const [tasks, setTasks] = useState<HelpRequestDTO[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) loadTasks();
  }, [user]);

  const loadTasks = async () => {
    const data = await sosService.getTasksByResponder(user!.id);
    setTasks(data);
  };

  const handleUpdateStatus = async (requestId: number, newStatus: 'ASSIGNED' | 'RESOLVED') => {
    try {
      // We'll call your /acknowledge or a generic status update endpoint
      await sosService.updateRequestStatus(requestId, newStatus);
      alert(`Status updated to ${newStatus}`);
      loadTasks();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Field Response</h1>
          <p className="text-slate-500 font-bold uppercase text-xs">Unit: {user?.name} | Active Tasks: {tasks.length}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-[10px] font-black text-emerald-500 uppercase">Duty Active</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {tasks.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-600 font-bold">No tasks currently assigned to you.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">Emergency</span>
                  <h2 className="text-2xl font-bold mt-2">{task.citizenName}</h2>
                  <p className="text-slate-400 text-sm">📍 {task.location}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Status</p>
                    <p className="text-amber-400 font-bold">{task.status}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6 italic text-slate-300">
                "{task.description}"
              </div>

              <div className="flex gap-4">
                {task.status === 'ASSIGNED' && (
                  <button 
                    onClick={() => handleUpdateStatus(task.id!, 'RESOLVED')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest text-sm"
                  >
                    Mark as Resolved
                  </button>
                )}
                <a 
                  href={`https://www.google.com/maps?q=${task.latitude},${task.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all text-center uppercase tracking-widest text-sm"
                >
                  Open Navigation
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponderDashboard;