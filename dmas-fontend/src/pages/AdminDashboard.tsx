// import React, { useEffect, useState } from 'react';
// import api from '../api/axiosConfig';

// const AdminDashboard = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 // This call automatically includes the JWT thanks to our Axios Interceptor
//                 const response = await api.get('/admin/users');
//                 setUsers(response.data);
//             } catch (err) {
//                 console.error("Failed to fetch users", err);
//             }
//         };
//         fetchUsers();
//     }, []);

//     return (
//         <div className="p-8 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Management: All Users</h1>
//             <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                 <table className="w-full text-left border-collapse">
//                     <thead className="bg-blue-700 text-white">
//                         <tr>
//                             <th className="p-4">ID</th>
//                             <th className="p-4">Name</th>
//                             <th className="p-4">Email</th>
//                             <th className="p-4">Role</th>
//                             <th className="p-4">Location</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user: any) => (
//                             <tr key={user.id} className="border-b hover:bg-gray-50">
//                                 <td className="p-4">{user.id}</td>
//                                 <td className="p-4 font-medium">{user.name}</td>
//                                 <td className="p-4">{user.email}</td>
//                                 <td className="p-4">
//                                     <span className={`px-2 py-1 rounded text-xs ${user.role === 'ROLE_ADMIN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                                         {user.role}
//                                     </span>
//                                 </td>
//                                 <td className="p-4">{user.location}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import AdminHelpRequestList from "../components/admin/AdminHelpRequestList"; // Import Module 3 Component

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const loadAll = async () => {
    try {
      const res = await api.get("/disasters/all");
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to load alerts", err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleVerify = async (id: number, alertData: any) => {
    try {
      await api.put(`/disasters/${id}/verify`, {
        ...alertData,
        verified: true,
      });
      loadAll();
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/disasters/${selectedAlert.id}/verify`, {
        ...selectedAlert,
        verified: true,
      });
      setSelectedAlert(null);
      loadAll();
      alert("Alert published to all citizens!");
    } catch (err) {
      console.error("Publishing failed", err);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-end border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
            <p className="text-slate-500 font-medium">Disaster Management & Response Oversight</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">System Time</span>
            <span className="font-mono text-sm text-slate-700">{new Date().toLocaleTimeString()}</span>
          </div>
        </header>

        {/* --- MODULE 3: LIVE EMERGENCY SOS FEED --- */}
        <section className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Live SOS Requests (Citizen-to-Responder)</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <AdminHelpRequestList />
          </div>
        </section>

        {/* --- EXISTING MODULE: DISASTER ALERT VERIFICATION --- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
             <div className="h-3 w-3 rounded-full bg-blue-500"></div>
             <h2 className="text-xl font-bold text-slate-800">RSS Disaster Feed Verification</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4">Disaster Details</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{alert.headline}</p>
                      <p className="text-xs text-slate-500">{alert.areaDesc}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        alert.severity === 'Extreme' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      {alert.verified ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-[10px] font-bold">LIVE</span>
                      ) : (
                        <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-[10px] font-bold">PENDING</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!alert.verified && (
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          Approve & Broadcast
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* VERIFICATION MODAL */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
              <h2 className="text-2xl font-black mb-4">Verify & Refine Alert</h2>
              <form onSubmit={handlePublish} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Headline</label>
                  <input
                    className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={selectedAlert.headline}
                    onChange={(e) => setSelectedAlert({ ...selectedAlert, headline: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Type</label>
                    <select
                      className="w-full p-2 border rounded mt-1"
                      value={selectedAlert.type}
                      onChange={(e) => setSelectedAlert({ ...selectedAlert, type: e.target.value })}
                    >
                      <option value="Flood">Flood</option>
                      <option value="Cyclone">Cyclone</option>
                      <option value="Earthquake">Earthquake</option>
                      <option value="Heatwave">Heatwave</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Severity</label>
                    <select
                      className="w-full p-2 border rounded mt-1"
                      value={selectedAlert.severity}
                      onChange={(e) => setSelectedAlert({ ...selectedAlert, severity: e.target.value })}
                    >
                      <option value="Extreme">Extreme</option>
                      <option value="Severe">Severe</option>
                      <option value="Moderate">Moderate</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Custom Instructions</label>
                  <textarea
                    className="w-full p-2 border rounded mt-1 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Please evacuate to the nearest community center..."
                    value={selectedAlert.instruction || ""}
                    onChange={(e) => setSelectedAlert({ ...selectedAlert, instruction: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setSelectedAlert(null)} className="px-6 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700">Verify & Publish</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;