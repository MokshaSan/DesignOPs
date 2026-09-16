import { Settings, Shield, Check, X } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge, Toggle } from '../../components/ui/index';
import { useState } from 'react';

const SYSTEMS = [
  { id: 'locks', name: 'Smart Locks', enabled: true, icon: '🔒' },
  { id: 'lighting', name: 'Smart Lighting', enabled: true, icon: '💡' },
  { id: 'ac', name: 'HVAC / AC Control', enabled: true, icon: '❄️' },
  { id: 'curtains', name: 'Motorised Curtains', enabled: true, icon: '🪟' },
  { id: 'energy', name: 'Energy Monitoring', enabled: true, icon: '⚡' },
  { id: 'visitor', name: 'Visitor Access', enabled: true, icon: '👥' },
  { id: 'maintenance', name: 'Predictive Maintenance', enabled: true, icon: '🔧' },
  { id: 'ai', name: 'AI Automation', enabled: true, icon: '🤖' },
];

const ROLES = [
  { role: 'Owner', perms: ['Smart Home', 'Access', 'Billing', 'Services', 'Automation', 'All Settings'] },
  { role: 'Occupier', perms: ['Smart Home', 'Access', 'Services', 'Automation'] },
  { role: 'Tenant', perms: ['Smart Home', 'Services'] },
  { role: 'Visitor', perms: ['Temporary Door Access'] },
];

export default function DeveloperConfiguration() {
  const [systems, setSystems] = useState(SYSTEMS);

  const toggleSystem = (id: string) => {
    setSystems(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <Layout title="Configuration" subtitle="Property feature toggles and role setup">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* System toggles */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Platform Systems</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {systems.map(sys => (
              <div key={sys.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-border">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sys.icon}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{sys.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={sys.enabled ? 'success' : 'neutral'}>{sys.enabled ? 'Active' : 'Disabled'}</Badge>
                  <Toggle checked={sys.enabled} onChange={() => toggleSystem(sys.id)} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Role matrix */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Resident Role Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Permission</th>
                  {ROLES.map(r => (
                    <th key={r.role} className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{r.role}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {['Smart Home', 'Access', 'Billing', 'Services', 'Automation', 'All Settings', 'Temporary Door Access'].map(perm => (
                  <tr key={perm}>
                    <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{perm}</td>
                    {ROLES.map(r => (
                      <td key={r.role} className="text-center py-2.5 px-3">
                        {r.perms.includes(perm)
                          ? <Check size={15} className="mx-auto text-green-500" />
                          : <X size={15} className="mx-auto text-gray-300 dark:text-gray-600" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
