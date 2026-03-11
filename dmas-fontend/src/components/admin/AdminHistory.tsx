import React, { useEffect, useState } from 'react';
import { sosService } from '../../api/sosService';
import { type HelpRequestDTO } from '../../types/helpRequest';

const AdminHistory: React.FC = () => {
  const [history, setHistory] = useState<HelpRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // You'll need to add getResolvedHistory to your sosService.ts
        const data = await sosService.getResolvedHistory();
        setHistory(data);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Resolution Archive</h2>
          <p className="text-slate-500 text-sm font-bold uppercase">Total Emergencies Resolved: {history.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase">ID</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Citizen</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Type</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Location</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Responder</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-right">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4 text-xs font-mono text-slate-500">#{item.id}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-200">{item.citizenName}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-800 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded uppercase border border-slate-700">
                      {item.type || 'General'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{item.location}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                        {item.responderName?.charAt(0)}
                      </div>
                      <p className="text-sm text-slate-300 font-medium">{item.responderName}</p>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-xs font-bold text-emerald-500">✓ RESOLVED</p>
                    <p className="text-[10px] text-slate-600">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {history.length === 0 && !loading && (
            <div className="p-20 text-center text-slate-600 font-bold uppercase text-xs tracking-widest">
              No resolved records found in the archive.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHistory;