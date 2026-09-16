import { Building2, Users, Cpu } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge } from '../../components/ui/index';
import { MOCK_BUILDINGS } from '../../data/mockData';

export default function DeveloperProperties() {
  return (
    <Layout title="Properties" subtitle="Your portfolio">
      <div className="max-w-4xl mx-auto space-y-6">
        {MOCK_BUILDINGS.map(b => (
          <Card key={b.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                  <Building2 size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{b.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{b.address}</p>
                </div>
              </div>
              <Badge variant={b.deviceUptime >= 95 ? 'success' : 'warning'}>{b.deviceUptime}% uptime</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Units', value: b.totalUnits },
                { label: 'Online Devices', value: b.onlineDevices },
                { label: 'Active Visitors', value: b.activeVisitors },
                { label: 'Energy Today', value: `${(b.energyToday / 1000).toFixed(1)} MWh` },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-dark-border">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full"
                  style={{ width: `${b.deviceUptime}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 shrink-0">{b.deviceUptime}% device uptime</span>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
