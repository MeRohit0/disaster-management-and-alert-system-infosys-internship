import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// The structure of data we expect from your Spring Boot API
interface AnalyticsData {
  totalRequests: number;
  avgResponseTime: string;
  successRate: string;
  activeAlerts: number;
  monthlyStats: { month: string; count: number }[];
  categoryStats: { name: string; value: number }[];
}

const AnalyticsView = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is where we will call: axios.get('/api/analytics/summary')
    // For now, we use a small delay to simulate a real API call
    const timer = setTimeout(() => {
      setData({
        totalRequests: 1284,
        avgResponseTime: "14m",
        successRate: "92%",
        activeAlerts: 12,
        monthlyStats: [
          { month: 'Jan', count: 45 }, { month: 'Feb', count: 52 },
          { month: 'Mar', count: 38 }, { month: 'Apr', count: 65 },
          { month: 'May', count: 48 }, { month: 'Jun', count: 70 },
        ],
        categoryStats: [
          { name: 'Flood', value: 400 },
          { name: 'Fire', value: 300 },
          { name: 'Medical', value: 300 },
          { name: 'Other', value: 200 },
        ]
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="animate-in fade-in duration-700">
      {/* 1. KPI TOP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total SOS" value={data?.totalRequests} color="text-slate-900" />
        <StatCard label="Avg Response" value={data?.avgResponseTime} color="text-blue-600" />
        <StatCard label="Success Rate" value={data?.successRate} color="text-emerald-600" />
        <StatCard label="Active Alerts" value={data?.activeAlerts} color="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. TREND CHART */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-8 tracking-widest">Incident Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} 
                    activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. DISTRIBUTION CHART */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-8 tracking-widest">Type Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.categoryStats} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                  {data?.categoryStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean KPI Cards
const StatCard = ({ label, value, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">{label}</p>
    <p className={`text-4xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
);

// Custom Tooltip for better UX
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-800">
        <p className="text-white text-xs font-bold">{`${payload[0].value} Emergencies`}</p>
      </div>
    );
  }
  return null;
};

export default AnalyticsView;