import React from 'react';

// Updated interface to match your backend's nested objects
interface Report {
  id: number;
  currentStatus: string;
  updateNote: string;
  timestamp: string;
  responder?: {
    name: string;
  };
}

const TimelineComponent = ({ reports }: { reports: Report[] }) => {
  // Helper to determine color based on status
  const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-500 border-red-500/20 dot-red';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dot-emerald';
      case 'EN_ROUTE':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20 dot-blue';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20 dot-slate';
    }
  };

  return (
    <div className="p-6 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl sticky top-8">
      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Operation Audit Trail
      </h3>
      
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-10">
        {reports.length === 0 ? (
          <div className="pl-8 py-4">
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No field updates logged yet.</p>
          </div>
        ) : (
          // Sorting reports by timestamp (newest at top)
          [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((report) => (
            <div key={report.id} className="relative pl-8 group">
              {/* Timeline Dot with Dynamic Color */}
              <div className={`absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 transition-all duration-300 shadow-lg
                ${report.currentStatus === 'CRITICAL' ? 'border-red-500 shadow-red-500/20' : 'border-emerald-500 shadow-emerald-500/20'}`}>
              </div>
              
              <div className="flex flex-col group-hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${getStatusStyles(report.currentStatus)}`}>
                    {report.currentStatus}
                  </span>
                  <span className="text-slate-500 text-[10px] font-bold font-mono">
                    {new Date(report.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-slate-300 text-sm font-medium leading-relaxed">
                  {report.updateNote}
                </p>
                
                {/* Fixed the nested data path for responder name */}
                {report.responder?.name && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">
                      {report.responder.name.charAt(0)}
                    </div>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">
                      Agent: {report.responder.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimelineComponent;