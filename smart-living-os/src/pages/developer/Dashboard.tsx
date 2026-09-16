import { Building2, TrendingDown, Users, Activity, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge, MetricCard } from '../../components/ui/index';
import { MOCK_PROPERTY, MOCK_BUILDINGS } from '../../data/mockData';

const adoptionData = [
  { feature: 'Smart Access', pct: 94 },
  { feature: 'Scenes', pct: 78 },
  { feature: 'Energy Insights', pct: 71 },
  { feature: 'Automation', pct: 64 },
  { feature: 'Visitor Mgmt', pct: 58 },
];

const energyTrendData = [
  { month: 'Apr', building1: 3800, building2: 4200 },
  { month: 'May', building1: 3600, building2: 3900 },
  { month: 'Jun', building1: 3400, building2: 3600 },
  { month: 'Jul', building1: 3100, building2: 3200 },
  { month: 'Aug', building1: 2900, building2: 3100 },
  { month: 'Sep', building1: 2700, building2: 2900 },
];

export default function DeveloperDashboard() {
  const prop = MOCK_PROPERTY;

  return (
    <Layout title="Portfolio Overview" subtitle="John Keells Properties — Smart Living">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Notice banner */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-400">
          📊 All metrics below are <strong>illustrative simulated KPIs</strong> based on industry benchmarks. Not real-world data.
        </div>

        {/* Portfolio stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Units" value={prop.totalUnits.toLocaleString()} icon="🏢" color="purple" />
          <MetricCard label="Resident Engagement" value={`${prop.residentEngagement}%`} icon="👥" color="green" />
          <MetricCard label="Energy Reduction" value={`↓ ${prop.energyReduction}%`} sub="vs. pre-platform baseline" icon="⚡" color="blue" />
          <MetricCard label="Device Uptime" value={`${prop.deviceUptime}%`} icon="📡" color="orange" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Energy trend */}
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Energy Trend (kWh/day)</h2>
            <p className="text-xs text-gray-400 mb-4">6-month portfolio average — simulated</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: '0.75rem', fontSize: '0.7rem' }} />
                  <Line type="monotone" dataKey="building1" stroke="#7c3aed" strokeWidth={2} dot={false} name="Grand Residences" />
                  <Line type="monotone" dataKey="building2" stroke="#4f46e5" strokeWidth={2} dot={false} name="Ocean Heights" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Feature adoption */}
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Feature Adoption</h2>
            <p className="text-xs text-gray-400 mb-4">% of active residents using each feature</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adoptionData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} domain={[0, 100]} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: '0.75rem', fontSize: '0.7rem' }} />
                  <Bar dataKey="pct" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Buildings */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_BUILDINGS.map(b => (
              <Card key={b.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{b.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{b.address}</p>
                  </div>
                  <Badge variant={b.deviceUptime >= 95 ? 'success' : 'warning'}>{b.deviceUptime}% uptime</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Units', value: b.totalUnits },
                    { label: 'Online', value: b.onlineDevices },
                    { label: 'Energy', value: `${(b.energyToday / 1000).toFixed(1)} MWh` },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-2 rounded-xl bg-gray-50 dark:bg-dark-border">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Operational impact */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Operational Impact — Simulated</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Maintenance', before: 'Reactive', after: 'Predictive', delta: '↓ 21% cost', icon: '🔧' },
              { label: 'Energy', before: 'No insight', after: 'AI-optimised', delta: '↓ 14% usage', icon: '⚡' },
              { label: 'Resident NPS', before: '41', after: '74', delta: '↑ 33 points', icon: '⭐' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl bg-gray-50 dark:bg-dark-border">
                <span className="text-2xl block mb-2">{item.icon}</span>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-gray-400 line-through">{item.before}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.after}</span>
                </div>
                <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-1">{item.delta}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
