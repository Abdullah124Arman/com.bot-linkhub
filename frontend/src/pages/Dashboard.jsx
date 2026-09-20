import { useEffect, useState } from 'react';
import { Link2, MousePointerClick, TrendingUp, Zap } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}20`, color }}>
        <Icon size={22} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value ?? '—'}</h3>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [clicksData, setClicksData] = useState([]);
  const [devicesData, setDevicesData] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/analytics/overview'),
      api.get('/api/analytics/clicks-over-time?days=30'),
      api.get('/api/analytics/devices'),
      api.get('/api/analytics/referrers'),
    ]).then(([ov, clicks, devices, refs]) => {
      setOverview(ov.data);
      setClicksData(clicks.data);
      setDevicesData(devices.data.map(d => ({ name: d.device_type, value: d.count })));
      setReferrers(refs.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><div className="page-loading"><div className="spinner" /></div></>;

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Your link performance at a glance</p>
        </div>

        <div className="stats-grid">
          <StatCard icon={Link2} label="Total Links" value={overview?.total_links} color="#6366f1" />
          <StatCard icon={MousePointerClick} label="Total Clicks" value={overview?.total_clicks} color="#22c55e" />
          <StatCard icon={TrendingUp} label="Top Link" value={overview?.top_link_code ? `/${overview.top_link_code}` : 'N/A'} color="#f59e0b" />
          <StatCard icon={Zap} label="Top Link Clicks" value={overview?.top_link_clicks} color="#8b5cf6" />
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Clicks Over Time (30 days)</h3>
            {clicksData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={clicksData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                  <Line type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="no-data">No click data yet. Share your links!</p>}
          </div>

          <div className="chart-card">
            <h3>Device Distribution</h3>
            {devicesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie 
                    data={devicesData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={60} 
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value, name, percent }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.2;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="#94a3b8" fontSize={11} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {devicesData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="no-data">No device data yet</p>}
          </div>

          <div className="chart-card">
            <h3>Top Referrers</h3>
            {referrers.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={referrers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis dataKey="referrer" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={100} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                  <Bar dataKey="count" fill="#22c55e" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="no-data">No referrer data yet</p>}
          </div>
        </div>
      </main>
    </>
  );
}
