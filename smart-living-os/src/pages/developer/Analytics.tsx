import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Layout } from '../../components/ui/Layout';
import { Card } from '../../components/ui/index';

const energyByBuilding = [
  { building: 'Grand Res.', before: 100, after: 86, savings: 14 },
  { building: 'Ocean Hts', before: 100, after: 82, savings: 18 },
  { building: 'Sky Tower', before: 100, after: 91, savings: 9 },
];

const maintenanceData = [
  { month: 'Apr', reactive: 45, predictive: 12 },
  { month: 'May', reactive: 38, predictive: 14 },
  { month: 'Jun', reactive: 29, predictive: 18 },
  { month: 'Jul', reactive: 22, predictive: 20 },
  { month: 'Aug', reactive: 18, predictive: 23 },
  { month: 'Sep', reactive: 12, predictive: 26 },
];

const radarData = [
  { feature: 'Access', value: 94 },
  { feature: 'Scenes', value: 78 },
  { feature: 'Energy', value: 71 },
  { feature: 'Automation', value: 64 },
  { feature: 'Visitor', value: 58 },
  { feature: 'Maintenance', value: 72 },
];

export default function DeveloperAnalytics() {
  return (
    <Layout title="Analytics" subtitle="Portfolio performance — simulated KPIs">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-400">
          All data shown is <strong>illustrative/simulated</strong> based on industry benchmarks. Not real-world results.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Energy savings */}
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Energy Reduction by Building</h2>
            <p className="text-xs text-gray-400 mb-4">Index: 100 = pre-platform baseline</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyByBuilding}>
                  <XAxis dataKey="building" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[70, 105]} />
                  <Tooltip contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: '0.75rem', fontSize: '0.7rem' }} />
                  <Bar dataKey="before" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Before" />
                  <Bar dataKey="after" fill="#7c3aed" radius={[4, 4, 0, 0]} name="After" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Maintenance shift */}
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Maintenance: Reactive vs Predictive</h2>
            <p className="text-xs text-gray-400 mb-4">Monthly request count — portfolio total</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: '0.75rem', fontSize: '0.7rem' }} />
                  <Bar dataKey="reactive" fill="#ef4444" radius={[4, 4, 0, 0]} name="Reactive" />
                  <Bar dataKey="predictive" fill="#22c55e" radius={[4, 4, 0, 0]} name="Predictive" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature radar */}
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Feature Adoption Radar</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <PolarAngleAxis dataKey="feature" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Summary stats */}
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Simulated Impact Summary</h2>
            <div className="space-y-4">
              {[
                { metric: 'Truck rolls avoided', value: '34 / month', color: 'text-green-600 dark:text-green-400' },
                { metric: 'Avg response time (maintenance)', value: '4.2 hrs → 1.1 hrs', color: 'text-blue-600 dark:text-blue-400' },
                { metric: 'Resident complaints (monthly)', value: '127 → 43', color: 'text-purple-600 dark:text-purple-400' },
                { metric: 'Carbon footprint saved', value: '14.2 tonnes CO₂/yr', color: 'text-green-600 dark:text-green-400' },
                { metric: 'Platform ROI (est.)', value: '3.4× in 24 months', color: 'text-indigo-600 dark:text-indigo-400' },
              ].map(item => (
                <div key={item.metric} className="flex justify-between items-start py-1.5 border-b border-gray-50 dark:border-dark-border last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.metric}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
