import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
import { sosService } from "../api/sosService";
import AdminHelpRequestList from "../components/admin/AdminHelpRequestList";
import TimelineComponent from "../components/admin/TimelineComponent";
import MapComponent from "../components/admin/MapComponent";

const AdminDashboard = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    "SOS_FEED" | "RESCUE_LOGS" | "RSS_VERIFY"
  >("SOS_FEED");

  // Module 1 & 2 State (RSS Alerts)
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Module 3 State (Help Requests for Map)
  const [helpRequests, setHelpRequests] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null,
  );

  // Module 4 State (Rescue Reports & Timeline)
  const [reports, setReports] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    loadRSSAlerts();
    loadRescueReports();
    loadHelpRequests();
  }, []);

  // --- API CALLS ---
  const loadRSSAlerts = async () => {
    try {
      const res = await api.get("/disasters/all");
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to load alerts", err);
    }
  };

  const loadHelpRequests = async () => {
    try {
      const res = await sosService.getAllHelpRequests();
      setHelpRequests(res);
    } catch (err) {
      console.error("Map data failed", err);
    }
  };

  const loadRescueReports = async () => {
    try {
      const response = await api.get("/reports/all");
      setReports(response.data);
    } catch (err) {
      console.error("Failed to load reports", err);
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
      loadRSSAlerts();
      alert("Alert published to all citizens!");
    } catch (err) {
      console.error("Publishing failed", err);
    }
  };

  const fetchTimeline = async (id: number) => {
    setSelectedRequestId(id);
    const data = await sosService.getTimeline(id);
    setTimeline(data);
  };

  // Transform SOS data into Map Pins
  const mapPins = useMemo(() => {
    return helpRequests.map((req) => ({
      id: req.id,
      lat: req.latitude || 28.4595,
      lng: req.longitude || 77.0266,
      label: `${req.citizenName}: ${req.description}`,
      severity: req.status,
    }));
  }, [helpRequests]);

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* SHARED HEADER */}
        <header className="flex justify-between items-end border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
              Admin <span className="text-blue-600">Command</span> Center
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">
              Disaster Management & Response Oversight
            </p>
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-200">
            {["SOS_FEED", "RESCUE_LOGS", "RSS_VERIFY"].map((tabId) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId as any)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                  activeTab === tabId
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tabId.replace("_", " ")}
              </button>
            ))}
          </div>
        </header>

        {/* --- VIEW 1: LIVE SOS & MAP --- */}
        {activeTab === "SOS_FEED" && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT: THE MAP (2 Columns) */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 h-2 w-2 rounded-full"></span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Live Geospatial Intelligence
                  </h3>
                </div>
                <MapComponent
                  locations={mapPins}
                  selectedLocation={selectedCoords}
                />
              </div>

              {/* RIGHT: INTERACTIVE LIST (1 Column) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Incident Queue
                  </h3>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {helpRequests.length} Total
                  </span>
                </div>

                <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm h-[480px] overflow-y-auto p-3 space-y-3 scrollbar-hide">
                  {helpRequests.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                      No active requests
                    </div>
                  ) : (
                    helpRequests.map((req) => {
                      // Color coding logic
                      const isCritical =
                        req.status === "CRITICAL" || req.status === "HIGH";
                      const statusColor = isCritical
                        ? "border-l-red-500 bg-red-50/30"
                        : "border-l-blue-500 bg-blue-50/30";
                      const badgeColor = isCritical
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700";

                      return (
                        <div
                          key={req.id}
                          onClick={() =>
                            setSelectedCoords([req.latitude, req.longitude])
                          }
                          className={`p-4 rounded-xl border border-slate-100 border-l-4 ${statusColor} 
                       hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all duration-200 group`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-black text-slate-800 tracking-tight">
                              {req.citizenName}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${badgeColor}`}
                            >
                              {req.status}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 leading-snug line-clamp-2 mb-2">
                            {req.description}
                          </p>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/50">
                            <span className="text-[10px] font-medium text-slate-400">
                              📍 Tap to View Location
                            </span>
                            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* FULL WIDTH LIST (Optional detail view) */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <AdminHelpRequestList />
            </div>
          </section>
        )}

        {/* --- VIEW 2: RESCUE LOGS --- */}
        {activeTab === "RESCUE_LOGS" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Field Responder Operations
                </h2>
                <button
                  onClick={loadRescueReports}
                  className="text-blue-600 text-[10px] font-black uppercase hover:underline"
                >
                  Refresh
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="p-4 pl-8">Incident</th>
                    <th className="p-4">Responder</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.map((report: any) => (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 pl-8">
                        <p className="font-bold text-sm">
                          #{report.id} - {report.updateNote}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          📍 {report.responder?.location || "Coords Provided"}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">
                          {report.responder?.name || "Pending"}
                        </p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                            report.currentStatus === "CRITICAL"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}
                        >
                          {report.currentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => fetchTimeline(report.id)}
                          className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold"
                        >
                          View Timeline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              {selectedRequestId ? (
                <TimelineComponent reports={timeline} />
              ) : (
                <div className="h-full border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-8 text-slate-400 text-xs font-bold uppercase text-center">
                  Select a log to view audit trail
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW 3: RSS VERIFY --- */}
        {activeTab === "RSS_VERIFY" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                RSS Disaster Feed Verification
              </h2>
              <input
                type="text"
                placeholder="Filter alerts..."
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                  {alerts
                    .filter((a) =>
                      a.headline
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                    )
                    .map((alert) => (
                      <tr
                        key={alert.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4">
                          <p className="text-sm font-bold">{alert.headline}</p>
                          <p className="text-[10px] text-slate-400 italic">
                            {alert.areaDesc}
                          </p>
                        </td>
                        <td className="p-4 text-[10px] uppercase font-black">
                          {alert.severity}
                        </td>
                        <td className="p-4">
                          {alert.verified ? (
                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold border border-green-100">
                              LIVE
                            </span>
                          ) : (
                            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {!alert.verified && (
                            <button
                              onClick={() => setSelectedAlert(alert)}
                              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* --- RSS MODAL --- */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95">
              <h2 className="text-2xl font-black mb-6">
                Broadcast Official Alert
              </h2>
              <form onSubmit={handlePublish} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                    Headline
                  </label>
                  <input
                    className="w-full p-3 border border-slate-200 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedAlert.headline}
                    onChange={(e) =>
                      setSelectedAlert({
                        ...selectedAlert,
                        headline: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                      Type
                    </label>
                    <select
                      className="w-full p-3 border border-slate-200 rounded-xl mt-1 outline-none"
                      value={selectedAlert.type}
                      onChange={(e) =>
                        setSelectedAlert({
                          ...selectedAlert,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="Flood">Flood</option>
                      <option value="Cyclone">Cyclone</option>
                      <option value="Earthquake">Earthquake</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                      Severity
                    </label>
                    <select
                      className="w-full p-3 border border-slate-200 rounded-xl mt-1 outline-none"
                      value={selectedAlert.severity}
                      onChange={(e) =>
                        setSelectedAlert({
                          ...selectedAlert,
                          severity: e.target.value,
                        })
                      }
                    >
                      <option value="Extreme">Extreme</option>
                      <option value="Severe">Severe</option>
                      <option value="Moderate">Moderate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                    Custom Instructions
                  </label>
                  <textarea
                    className="w-full p-3 border border-slate-200 rounded-xl h-32 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Please evacuate to Indra Gandhi University center..."
                    value={selectedAlert.instruction || ""}
                    onChange={(e) =>
                      setSelectedAlert({
                        ...selectedAlert,
                        instruction: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedAlert(null)}
                    className="px-6 py-2 font-bold text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                  >
                    Verify & Publish
                  </button>
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
