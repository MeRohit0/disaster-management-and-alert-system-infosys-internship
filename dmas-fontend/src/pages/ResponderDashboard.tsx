import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const ResponderDashboard = () => {
    const [responderData, setResponderData] = useState<any>(null);

    useEffect(() => {
        const fetchResponderData = async () => {
            try {
                const response = await api.get('/responder/dashboard');
                setResponderData(response.data);
            } catch (err) {
                console.error("Access denied or server error", err);
            }
        };
        fetchResponderData();
    }, []);

    if (!responderData) return <div className="p-10">Loading Tactical View...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <header className="border-b border-slate-700 pb-6 mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-blue-400">RESPONDER COMMAND</h1>
                        <p className="text-slate-400">Active Duty: <span className="text-white font-bold">{responderData.name}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase text-slate-500 font-bold">Assigned Sector</p>
                        <p className="text-xl font-mono">{responderData.location}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status Card */}
                    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-emerald-500">
                        <h3 className="text-slate-400 text-sm font-bold uppercase">System Status</h3>
                        <p className="text-2xl font-bold mt-2 text-emerald-400">READY</p>
                    </div>

                    {/* Placeholder for Alerts - Milestone 2 */}
                    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-blue-500">
                        <h3 className="text-slate-400 text-sm font-bold uppercase">Pending Alerts</h3>
                        <p className="text-2xl font-bold mt-2">0</p>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-orange-500">
                        <h3 className="text-slate-400 text-sm font-bold uppercase">Emergency Contact</h3>
                        <p className="text-lg mt-2">{responderData.phoneNumber}</p>
                    </div>
                </div>

                {/* Tactical Map/Incident Placeholder */}
                <div className="mt-8 bg-slate-800 h-64 rounded-lg flex items-center justify-center border border-slate-700 border-dashed">
                    <p className="text-slate-500 italic">Incident monitoring map will be integrated in Milestone 2...</p>
                </div>
            </div>
        </div>
    );
};

export default ResponderDashboard;