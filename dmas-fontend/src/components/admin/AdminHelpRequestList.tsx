import React, { useEffect, useState } from 'react';
import { sosService } from '../../api/sosService';
import type { UserDTO, HelpRequestDTO } from '../../types/helpRequest';

const AdminHelpRequestList = () => {
  const [requests, setRequests] = useState<HelpRequestDTO[]>([]);
  const [responders, setResponders] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [pendingReqs, availableRes] = await Promise.all([
        sosService.getPendingRequests(),
        sosService.getAvailableResponders()
      ]);
      setRequests(pendingReqs);
      setResponders(availableRes);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (reqId: number, responderId: number) => {
    if (!responderId) return;
    try {
      await sosService.assignResponder(reqId, responderId);
      // Remove from pending list once assigned
      setRequests(prev => prev.filter(r => r.id !== reqId));
      alert("Responder deployed successfully!");
    } catch (err) {
      alert("Deployment failed. Check console.");
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-slate-500 font-black">INITIALIZING SOS SATELLITE FEED...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <tr>
            <th className="p-4 pl-8">Citizen / Location</th>
            <th className="p-4">Message</th>
            <th className="p-4">Assign Responder</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.length === 0 ? (
            <tr><td colSpan={3} className="p-10 text-center text-slate-400 text-xs font-bold">No pending SOS requests. System Clear.</td></tr>
          ) : (
            requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 pl-8">
                  <p className="font-bold text-slate-900">{req.citizenName || 'Anonymous Citizen'}</p>
                  <p className="text-[10px] text-blue-600 font-bold">📍 {req.location}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm text-slate-600 italic">"{req.description}"</p>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <select 
                      className="bg-slate-100 border-none text-[10px] font-bold rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => (req.id && handleAssign(req.id, Number(e.target.value)))}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Responder</option>
                      {responders.map(res => (
                        <option key={res.id} value={res.id}>{res.name}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHelpRequestList;