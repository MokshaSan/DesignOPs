import { useState } from 'react';
import { Search, AlertTriangle, Cpu, Battery, Activity } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge, StatusDot } from '../../components/ui/index';
import { useDeviceStore } from '../../store/deviceStore';
import { getMaintenancePrediction } from '../../services/ai';
import type { Device } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function OperatorDevices() {
  const { devices } = useDeviceStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Device | null>(null);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [filter, setFilter] = useState<'all' | 'warning' | 'offline'>('all');

  const filtered = devices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.unitId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'warning' && (d.status === 'warning' || d.status === 'error')) || (filter === 'offline' && d.status === 'offline');
    return matchSearch && matchFilter;
  });

  const selectDevice = async (device: Device) => {
    setSelected(device);
    setAiPrediction(null);
    if (device.health < 80) {
      setLoadingPrediction(true);
      const pred = await getMaintenancePrediction(device.name, device.health, device.battery, device.anomalyCount ?? 0, 30);
      setAiPrediction(pred);
      setLoadingPrediction(false);
    }
  };

  return (
    <Layout title="Device Fleet" subtitle="Building-wide device management">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search + filter */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search devices..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200"
                />
              </div>
              <div className="flex bg-gray-100 dark:bg-dark-border rounded-xl p-0.5">
                {(['all', 'warning', 'offline'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-dark-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Device</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Unit</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                    {filtered.map(device => (
                      <tr
                        key={device.id}
                        onClick={() => selectDevice(device)}
                        className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors ${selected?.id === device.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">
                              {device.type === 'light' ? '💡' : device.type === 'ac' ? '❄️' : device.type === 'lock' ? '🔒' : device.type === 'sensor' ? '🌡' : device.type === 'smoke' ? '🚨' : device.type === 'curtain' ? '🪟' : '📡'}
                            </span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{device.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{device.unitId}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <StatusDot status={device.status} />
                            <span className="capitalize text-gray-600 dark:text-gray-400">{device.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${device.health >= 80 ? 'bg-green-500' : device.health >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${device.health}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{device.health}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Device detail */}
          <div>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <Card className="p-5 space-y-4">
                    <div className="text-center">
                      <span className="text-4xl block mb-2">
                        {selected.type === 'light' ? '💡' : selected.type === 'ac' ? '❄️' : selected.type === 'sensor' ? '🌡' : selected.type === 'smoke' ? '🚨' : '📡'}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white">{selected.name}</h3>
                      <div className="flex justify-center mt-1">
                        <Badge variant={selected.status === 'online' ? 'success' : selected.status === 'warning' ? 'warning' : 'danger'} className="capitalize">
                          {selected.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: 'Unit', value: selected.unitId },
                        { label: 'Floor', value: selected.floor },
                        { label: 'Room', value: selected.room },
                        { label: 'Health', value: `${selected.health}%` },
                        { label: 'Last Heartbeat', value: new Date(selected.lastHeartbeat).toLocaleTimeString() },
                        ...(selected.battery !== undefined ? [{ label: 'Battery', value: `${selected.battery}%` }] : []),
                        ...(selected.anomalyCount !== undefined ? [{ label: 'Anomalies (7d)', value: selected.anomalyCount }] : []),
                        ...(selected.predictedFailureDays !== undefined ? [{ label: 'Predicted Failure', value: `${selected.predictedFailureDays} days` }] : []),
                      ].map(item => (
                        <div key={item.label} className="flex justify-between py-1 text-sm border-b border-gray-50 dark:border-dark-border last:border-0">
                          <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{String(item.value)}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI prediction */}
                    {selected.health < 80 && (
                      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Activity size={14} className="text-primary-600" />
                          <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">AI Prediction</p>
                        </div>
                        {loadingPrediction ? (
                          <p className="text-xs text-gray-500 animate-pulse">Analysing device telemetry...</p>
                        ) : (
                          <p className="text-xs text-primary-800 dark:text-primary-200">{aiPrediction}</p>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ) : (
                <Card className="p-8 text-center">
                  <Cpu size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select a device to view details</p>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
