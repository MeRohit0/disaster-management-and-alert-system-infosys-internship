// import React, { useEffect, useState } from 'react';
// import { sosService } from '../api/sosService';
// import { useAuth } from '../context/AuthContext';
// import { type HelpRequestDTO } from '../types/helpRequest';
// import ManualReportForm from '../components/ManualReportForm'; // Ensure path is correct
// import SuccessModal from '../components/SuccessModal';

// const ResponderDashboard = () => {
//   const [tasks, setTasks] = useState<HelpRequestDTO[]>([]);
//   const [view, setView] = useState<'LIVE' | 'REPORT'>('LIVE');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user?.id) loadTasks();
//   }, [user]);

//   const loadTasks = async () => {
//     try {
//       const data = await sosService.getTasksByResponder(user!.id);
//       setTasks(data);
//     } catch (error) {
//       console.error("Error loading tasks", error);
//     }
//   };

//   const handleUpdateStatus = async (requestId: number, newStatus: 'ASSIGNED' | 'RESOLVED') => {
//     try {
//       await sosService.updateRequestStatus(requestId, newStatus);
//       setIsModalOpen(true); // Trigger our professional modal
//       loadTasks();
//     } catch (error) {
//       alert("Failed to update status");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
//       <header className="mb-10 flex justify-between items-center max-w-4xl mx-auto">
//         <div>
//           <h1 className="text-3xl font-black uppercase tracking-tighter italic">
//             Field <span className="text-emerald-500">Ops</span>
//           </h1>
//           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
//             Unit: {user?.name} | {view === 'LIVE' ? `Active: ${tasks.length}` : 'Manual Entry Mode'}
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button 
//             onClick={() => setView(view === 'LIVE' ? 'REPORT' : 'LIVE')}
//             className={`px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
//               view === 'REPORT' 
//               ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
//               : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
//             }`}
//           >
//             {view === 'LIVE' ? 'Log Past Report' : 'Back to Live Feed'}
//           </button>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto">
//         {view === 'REPORT' ? (
//           <ManualReportForm responderId={user?.id || 1} />
//         ) : (
//           <div className="space-y-6">
//             {tasks.length === 0 ? (
//               <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-900/20">
//                 <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No active field assignments</p>
//               </div>
//             ) : (
//               tasks.map(task => (
//                 <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl hover:border-slate-700 transition-colors">
//                   <div className="flex justify-between items-start mb-6">
//                     <div>
//                       <div className="flex gap-2 items-center mb-2">
//                         <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-0.5 rounded border border-red-500/20 uppercase">
//                           {task.type || 'Emergency'}
//                         </span>
//                         <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
//                           REQ-{task.id}
//                         </span>
//                       </div>
//                       <h2 className="text-2xl font-black tracking-tight">{task.citizenName}</h2>
//                       <p className="text-slate-400 text-sm font-medium mt-1">📍 {task.location}</p>
//                     </div>
//                     <div className="text-right">
//                         <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Current State</p>
//                         <p className="text-amber-400 font-black text-lg italic uppercase">{task.status}</p>
//                     </div>
//                   </div>

//                   <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/50 mb-8 text-slate-300 text-sm leading-relaxed border-l-4 border-l-emerald-500">
//                     "{task.description}"
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     {task.status !== 'RESOLVED' ? (
//                       <button 
//                         onClick={() => handleUpdateStatus(task.id!, 'RESOLVED')}
//                         className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest text-xs"
//                       >
//                         Finalize & Resolve
//                       </button>
//                     ) : (
//                       <div className="bg-slate-800/50 text-slate-500 font-black py-4 rounded-2xl text-center uppercase tracking-widest text-xs border border-slate-700">
//                         Task Completed
//                       </div>
//                     )}
//                     <a 
//                       href={`https://www.google.com/maps?q=${task.latitude},${task.longitude}`}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all text-center uppercase tracking-widest text-xs flex items-center justify-center gap-2"
//                     >
//                       <span>Navigate</span>
//                     </a>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       <SuccessModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         message="The incident status has been updated and logged in the central disaster management registry."
//       />
//     </div>
//   );
// };

// export default ResponderDashboard;

import React, { useEffect, useState } from 'react';
import { sosService } from '../api/sosService';

const ResponderDashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [updateNote, setUpdateNote] = useState("");
  const [status, setStatus] = useState("EN_ROUTE");

  // Fix: Parse localStorage ID and handle null/string cases
  const storedId = localStorage.getItem('userId');
  const responderId = storedId ? parseInt(storedId) : 0; 

  useEffect(() => {
    if (responderId > 0) {
      loadTasks();
    }
  }, [responderId]);

  const loadTasks = async () => {
    try {
      const data = await sosService.getResponderTasks(responderId);
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  };

  // Fix: Helper to open modal with the current task's status
  const openUpdateModal = (task: any) => {
    setSelectedTask(task);
    setStatus(task.status || "EN_ROUTE");
    setUpdateNote("");
  };

  const handleStatusUpdate = async (taskId: number) => {
    if (!taskId || responderId === 0) return;

    try {
      // 1. Update the main status
      await sosService.updateStatus(taskId, status);
      
      // 2. Submit the detailed timeline report
      await sosService.submitReport({
        helpRequestId: taskId,
        responderId: responderId,
        currentStatus: status,
        updateNote: updateNote || `Field update: Status set to ${status}`
      });

      setSelectedTask(null);
      loadTasks(); // Refresh the list
      alert("Update synchronized with Command Center!");
    } catch (err) {
      console.error("Update failed", err);
      alert("Sync failed. Check connection.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 font-sans">
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">
          Field <span className="text-blue-600">Responder</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Live Connection Active</p>
        </div>
      </header>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
            <p className="text-slate-400 font-bold text-sm">No active tasks assigned.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase border ${
                  task.status === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {task.status || 'ASSIGNED'}
                </span>
                <p className="text-[10px] font-mono text-slate-400">#REQ-{task.id}</p>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{task.citizenName || "Unknown Citizen"}</h3>
              <p className="text-blue-600 text-xs font-bold mb-4 flex items-center gap-1">
                <span className="text-sm">📍</span> {task.location}
              </p>
              
              <div className="bg-slate-50 p-4 rounded-2xl mb-5">
                <p className="text-slate-600 text-xs italic leading-relaxed">"{task.description}"</p>
              </div>

              <button 
                onClick={() => openUpdateModal(task)}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-lg shadow-slate-200"
              >
                Update Progress
              </button>
            </div>
          ))
        )}
      </div>

      {/* UPDATE MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center sm:justify-center">
          <div className="bg-white w-full sm:max-w-md sm:rounded-[3rem] rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase italic tracking-tight">Post Update</h2>
              <button onClick={() => setSelectedTask(null)} className="h-8 w-8 bg-slate-100 rounded-full text-slate-400 flex items-center justify-center font-bold">✕</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Current Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['EN_ROUTE', 'AT_LOCATION', 'CRITICAL', 'COMPLETED'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`py-4 rounded-2xl text-[9px] font-black uppercase border-2 transition-all ${
                        status === s ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Update Note</label>
                <textarea 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none h-32 resize-none"
                  placeholder="Describe the current situation..."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                />
              </div>

              <button 
                onClick={() => handleStatusUpdate(selectedTask.id)}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 uppercase text-[11px] tracking-widest active:scale-95 transition-all"
              >
                Confirm & Sync with Command
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponderDashboard;