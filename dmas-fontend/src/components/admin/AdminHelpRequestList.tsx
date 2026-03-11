import React, { useEffect, useState } from "react";
import { type HelpRequestDTO, type UserDTO } from "../../types/helpRequest";
import { sosService } from "../../api/sosService";

const AdminHelpRequestList: React.FC = () => {
  const [requests, setRequests] = useState<HelpRequestDTO[]>([]);
  const [suggestions, setSuggestions] = useState<{ [key: number]: UserDTO[] }>(
    {},
  );
  const [dispatchTarget, setDispatchTarget] = useState<number | null>(null); // To track which card is being assigned
  const [loading, setLoading] = useState(true);

  const [isAssigning, setIsAssigning] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await sosService.getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSuggestions = async (requestId: number) => {
    try {
      setDispatchTarget(requestId);
      // Fetch available responders (calls your new @GetMapping("/responders") or similar)
      const responders = await sosService.getAvailableResponders();
      setSuggestions((prev) => ({ ...prev, [requestId]: responders }));
    } catch (error) {
      alert("Could not load responders");
    }
  };

  const handleAssign = async (requestId: number, responderId: number) => {
    setIsAssigning(responderId); // Track which specific button was clicked
    try {
      await sosService.assignResponder(requestId, responderId);

      // Optional: Add a small toast or notification
      console.log(`Request ${requestId} assigned to responder ${responderId}`);

      setDispatchTarget(null);
      loadRequests(); // Refresh the UI
    } catch (error) {
      alert(
        "Assignment failed. Please check if the responder is still available.",
      );
    } finally {
      setIsAssigning(null);
    }
  };

  // Helper for icons and colors based on emergency type
  const getEmergencyConfig = (type: string) => {
    switch (type?.toUpperCase()) {
      case "MEDICAL":
        return {
          icon: "🚑",
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          label: "Medical",
        };
      case "FIRE":
        return {
          icon: "🔥",
          color: "text-orange-500",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
          label: "Fire",
        };
      case "ACCIDENT":
        return {
          icon: "🚗",
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          label: "Accident",
        };
      case "CRIME":
        return {
          icon: "🛡️",
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          label: "Security",
        };
      default:
        return {
          icon: "🚨",
          color: "text-indigo-500",
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/20",
          label: "General",
        };
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-white">Loading Emergencies...</div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-900 min-h-screen">
      {requests.map((req) => {
        const config = getEmergencyConfig(req.type || "");
        const isDispatching = dispatchTarget === req.id;
        const currentSuggestions = suggestions[req.id!] || [];

        return (
          <div
            key={req.id}
            className={`relative overflow-hidden bg-slate-800 border ${isDispatching ? "border-indigo-500" : "border-slate-700"} rounded-xl shadow-2xl transition-all hover:scale-[1.02]`}
          >
            {/* Top Status Bar */}
            <div
              className={`h-1.5 w-full ${
                req.status === "PENDING"
                  ? `${config.color.replace("text", "bg")} animate-pulse`
                  : "bg-emerald-500"
              }`}
            />

            <div className="p-5">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl p-2 rounded-lg ${config.bg}`}>
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">
                      {req.citizenName}
                    </h3>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}
                    >
                      {config.label} Emergency
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  #SOS-{req.id}
                </span>
              </div>

              {/* Conditional Content: List of Responders OR Emergency Details */}
              {isDispatching ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-500 uppercase">
                      Available Units
                    </h4>
                    <button
                      onClick={() => setDispatchTarget(null)}
                      className="text-[10px] text-red-400 font-bold hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                    {currentSuggestions.length > 0 ? (
                      currentSuggestions.map((res) => (
                        <div
                          key={res.id}
                          className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-700"
                        >
                          <div>
                            <p className="text-xs font-bold text-white">
                              {res.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {res.location}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAssign(req.id!, res.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded uppercase"
                          >
                            Assign
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-500 text-center py-4">
                        Finding available responders...
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-300 gap-2">
                    <span className="text-sm">📍 {req.location}</span>
                  </div>
                  <p className="text-slate-400 text-sm italic bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    "{req.description || "No description provided."}"
                  </p>
                </div>
              )}

              {/* Main Action Button - Hidden when dispatching */}
              {!isDispatching && (
                <button
                  onClick={() => handleShowSuggestions(req.id!)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Dispatch Responder</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminHelpRequestList;
