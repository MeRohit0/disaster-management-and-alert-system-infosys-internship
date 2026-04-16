import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';

interface ManualReportFormProps {
  responderId: number; 
}

const ManualReportForm = ({ responderId }: ManualReportFormProps) => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    requestId: '',
    summary: '',
    severity: 'MEDIUM',
    actualEndTime: ''
  });

  // Get the token from localStorage
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    fetch(`http://localhost:8080/api/help/responder/${responderId}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Added JWT to GET request
      }
    }) 
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, [responderId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reportPayload = {
      helpRequest: { id: formData.requestId },
      responder: { id: responderId }, // CRITICAL: Link the responder
      updateNote: formData.summary,
      currentStatus: formData.severity,
      // Use manual time if provided, else use current time
      timestamp: formData.actualEndTime ? new Date(formData.actualEndTime).toISOString() : new Date().toISOString() 
    };

    try {
      const response = await fetch('http://localhost:8080/api/reports/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Added JWT to POST request
        },
        body: JSON.stringify(reportPayload)
      });

      if (response.ok) {
        setIsModalOpen(true); // Open Modal instead of Alert
        setFormData({ requestId: '', summary: '', severity: 'MEDIUM', actualEndTime: '' }); // Reset form
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "Failed to save report"));
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl mt-10">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Manual Incident Log</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Record past actions for the audit trail</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Task */}
          <div>
            <label className="block text-slate-500 text-[10px] font-black uppercase mb-2">Select Emergency Task</label>
            <select 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-slate-300 text-sm focus:border-emerald-500 transition-colors"
              value={formData.requestId}
              onChange={(e) => setFormData({...formData, requestId: e.target.value})}
              required
            >
              <option value="">-- Choose a Task --</option>
              {tasks.map((task: any) => (
                <option key={task.id} value={task.id}>
                  #{task.id} - {task.type} at {task.location}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 text-[10px] font-black uppercase mb-2">Severity Level</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-slate-300 text-sm"
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div>
               <label className="block text-slate-500 text-[10px] font-black uppercase mb-2">Resolution Time (Optional)</label>
               <input 
                type="datetime-local" 
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-slate-300 text-sm"
                value={formData.actualEndTime}
                onChange={(e) => setFormData({...formData, actualEndTime: e.target.value})}
               />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 text-[10px] font-black uppercase mb-2">Detailed Summary</label>
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-slate-300 text-sm h-40 focus:border-emerald-500 transition-colors"
              placeholder="Describe what happened..."
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/20"
          >
            Archive Official Report
          </button>
        </form>
      </div>

      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        message="The incident report has been secured and linked to the permanent disaster record."
      />
    </>
  );
};

export default ManualReportForm;