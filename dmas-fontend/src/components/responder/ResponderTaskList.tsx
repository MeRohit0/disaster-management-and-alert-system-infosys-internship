import React, { useEffect, useState } from 'react';
import { type HelpRequestDTO } from '../../types/helpRequest';
import { sosService } from '../../api/sosService';
import api from '../../api/axiosConfig'; // Use your configured axios instance

const ResponderTaskList: React.FC<{ responderId: number }> = ({ responderId }) => {
    const [myTasks, setMyTasks] = useState<HelpRequestDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only fetch if we actually have a valid ID
        if (responderId) {
            loadMyTasks();
        }
    }, [responderId]);

    const loadMyTasks = async () => {
        setLoading(true);
        try {
            // Using backticks and your 'api' instance ensures the JWT is attached
            const response = await api.get(`/help/responder/${responderId}`);
            setMyTasks(response.data);
        } catch (error) {
            console.error("Failed to load tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async (requestId: number) => {
        try {
            // Ensure this endpoint matches your @PutMapping("/{requestId}/acknowledge")
            await api.put(`/help/${requestId}/acknowledge`); 
            alert("Mission Acknowledged. Stay safe!");
            loadMyTasks();
        } catch (error) {
            alert("Update failed. Make sure you have RESPONDER permissions.");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading your missions...</div>;

    return (
        <div className="space-y-4">
            {myTasks.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-xl text-center">
                    <p className="text-slate-500 italic text-sm">No active assignments. Stand by for alerts.</p>
                </div>
            ) : (
                myTasks.map(task => (
                    <div key={task.id} className="bg-slate-900 border border-slate-800 border-l-4 border-l-blue-500 p-5 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                    task.status === 'ASSIGNED' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                    {task.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-100">{task.citizenName}</h3>
                            <p className="text-slate-400 text-sm">
                                <span className="font-bold text-slate-500">📍 Location:</span> {task.location}
                            </p>
                            <p className="text-sm text-slate-500 italic bg-slate-950/50 p-2 rounded mt-2">
                                "{task.description}"
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            {task.status === 'ASSIGNED' && (
                                <button
                                    onClick={() => handleAcknowledge(task.id!)}
                                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/20 text-sm"
                                >
                                    Acknowledge & Start
                                </button>
                            )}
                            <button 
                                className="text-blue-400 text-xs font-bold hover:underline mt-2"
                                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`)}
                            >
                                🗺️ Open GPS Navigation
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ResponderTaskList;