import { useState } from 'react';
import { Building2, AlertTriangle, Wrench, Users, Zap, Activity, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge, StatusDot, MetricCard } from '../../components/ui/index';
import { useNavigate } from 'react-router-dom';
import { MOCK_BUILDINGS, MOCK_MAINTENANCE, MOCK_DEVICES } from '../../data/mockData';
import { MOCK_ENERGY_HOURLY } from '../../data/mockData';

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const building = MOCK_BUILDINGS[0];
  const criticalAlerts = MOCK_MAINTENANCE.filter(m => m.priority === 'critical');
  const warningDevices = MOCK_DEVICES.filter(d => d.status === 'warning' || d.status === 'error');

  return (
    <Layout title="Building Operations" subtitle={building.name}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Critical alert banner */}
        {criticalAlerts.map(alert => (
          <Card key={alert.id} className="p-4 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 dark:text-red-400">Critical Alert: {alert.deviceName}</p>
                <p className="text-xs text-red-600 dark:text-red-500">{alert.description}</p>
              </div>
              <button onClick={() => navigate('/operator/maintenance')} className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline shrink-0">
                Review →
              </button>
            </div>
          </Card>
        ))}

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Units" value={building.totalUnits} icon="🏢" color="purple" />
          <MetricCard label="Online Devices" value={building.onlineDevices} sub={`${building.warningDevices} warnings · ${building.offlineDevices} offline`} icon="📡" color="green" />
          <MetricCard label="Active Visitors" value={building.activeVisitors} icon="👥" color="blue" />
          <MetricCard label="Energy Today" value={`${(building.energyToday / 1000).toFixed(1)} MWh`} icon="⚡" color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Energy chart */}
          <div className="lg:col-span-2">
            <Card className="p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Building Energy — Today</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_ENERGY_HOURLY.map(r => ({ ...r, kwh: r.kwh * 384 / 4.2 }))}>
                    <defs>
                      <linearGradient id="opEnergyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: '0.75rem', fontSize: '0.7rem' }} formatter={(v: number) => [`${v.toFixed(0)} kWh`]} />
                    <Area type="monotone" dataKey="kwh" stroke="#4f46e5" strokeWidth={2} fill="url(#opEnergyGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Device health */}
          <div>
            <Card className="p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Device Health</h2>
                <button onClick={() => navigate('/operator/devices')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</button>
              </div>

              {/* Donut placeholder */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative h-24 w-24">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" className="dark:stroke-gray-700" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`${building.deviceUptime} 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{building.deviceUptime}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Online', count: building.onlineDevices, color: 'bg-green-500' },
                  { label: 'Warning', count: building.warningDevices, color: 'bg-yellow-500' },
                  { label: 'Offline', count: building.offlineDevices, color: 'bg-red-500' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Warnings + Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Device Warnings</h2>
              <button onClick={() => navigate('/operator/devices')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">All devices</button>
            </div>
            <div className="space-y-3">
              {warningDevices.map(device => (
                <div key={device.id} className="flex items-center gap-3">
                  <StatusDot status={device.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{device.name}</p>
                    <p className="text-xs text-gray-500">Unit {device.unitId} · Health {device.health}%</p>
                  </div>
                  <Badge variant={device.status === 'error' ? 'danger' : 'warning'} className="capitalize">{device.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Open Maintenance</h2>
              <button onClick={() => navigate('/operator/maintenance')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">All requests</button>
            </div>
            <div className="space-y-3">
              {MOCK_MAINTENANCE.slice(0, 4).map(req => (
                <div key={req.id} className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${req.priority === 'critical' ? 'bg-red-500' : req.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{req.deviceName}</p>
                    <p className="text-xs text-gray-500">Unit {req.unitId}</p>
                  </div>
                  <Badge variant={req.priority === 'critical' ? 'danger' : req.priority === 'high' ? 'warning' : 'neutral'} className="capitalize">{req.priority}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
