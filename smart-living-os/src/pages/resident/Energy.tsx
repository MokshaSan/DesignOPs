import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Loader2, TrendingDown, Zap } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Button, Badge, MetricCard } from '../../components/ui/index';
import { getEnergyInsight } from '../../services/ai';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ENERGY_HOURLY, MOCK_ENERGY_WEEKLY, MOCK_ENERGY_BREAKDOWN } from '../../data/mockData';

export default function Energy() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'today' | 'week'>('today');
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const todayKwh = MOCK_ENERGY_HOURLY.reduce((s, r) => s + r.kwh, 0).toFixed(1);
  const weeklyKwh = MOCK_ENERGY_WEEKLY.reduce((s, r) => s + r.kwh, 0).toFixed(1);
  const estimated = (Number(weeklyKwh) / 7 * 30).toFixed(0);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const text = await getEnergyInsight(
        Number(todayKwh), Number(weeklyKwh),
        MOCK_ENERGY_BREAKDOWN,
        user?.name || 'Resident'
      );
      setInsight(text);
    } finally {
      setLoadingInsight(false);
    }
  };

  useEffect(() => { fetchInsight(); }, []);

  const chartData = tab === 'today' ? MOCK_ENERGY_HOURLY : MOCK_ENERGY_WEEKLY;

  return (
    <Layout title="Energy" subtitle="Your home energy usage">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Metric strip */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Today" value={`${todayKwh} kWh`} icon="⚡" color="purple" />
          <MetricCard label="This Week" value={`${weeklyKwh} kWh`} icon="📅" color="blue" />
          <MetricCard label="Est. Monthly" value={`${estimated} kWh`} sub="Based on current trend" icon="📊" color="green" />
        </div>

        {/* AI Insight */}
        <Card className="p-5 border-primary-200 dark:border-primary-800 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">AI Energy Insight</p>
                <Badge variant="purple">Live</Badge>
              </div>
              {loadingInsight ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 size={14} className="animate-spin" /> Analysing your usage patterns...
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="secondary" onClick={fetchInsight}>
                  <TrendingDown size={13} /> Refresh Insight
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Consumption</h2>
            <div className="flex bg-gray-100 dark:bg-dark-border rounded-lg p-0.5">
              {(['today', 'week'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {t === 'today' ? 'Today' : 'This Week'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
                <Tooltip
                  contentStyle={{ background: 'var(--tooltip-bg)', border: 'none', borderRadius: '0.75rem', fontSize: '0.75rem' }}
                  formatter={(v: number) => [`${v.toFixed(2)} kWh`, 'Usage']}
                />
                <Area type="monotone" dataKey="kwh" stroke="#7c3aed" strokeWidth={2} fill="url(#energyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Usage Breakdown</h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={MOCK_ENERGY_BREAKDOWN} dataKey="kwh" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                    {MOCK_ENERGY_BREAKDOWN.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v.toFixed(2)} kWh`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">By Device</h2>
            <div className="space-y-3">
              {MOCK_ENERGY_BREAKDOWN.map(item => (
                <div key={item.device}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{item.device}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.kwh} kWh</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.percentage}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
