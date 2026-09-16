import { Shield, Home, Key, Bell, ChevronRight } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge } from '../../components/ui/index';
import { useAuth } from '../../context/AuthContext';

const OWNER_PERMS = ['Smart Home Control', 'Visitor Management', 'Billing & Payments', 'Building Services', 'Automation Engine', 'Energy Monitoring'];
const OCCUPIER_PERMS = ['Smart Home Control', 'Visitor Management', 'Building Services', 'Automation Engine', 'Energy Monitoring'];
const TENANT_PERMS = ['Smart Home Control', 'Building Services', 'Energy Monitoring'];

export default function Profile() {
  const { user } = useAuth();
  const perms = user?.residentRole === 'owner' ? OWNER_PERMS : user?.residentRole === 'occupier' ? OCCUPIER_PERMS : TENANT_PERMS;

  const roleLabel = { owner: 'Owner', occupier: 'Occupier', tenant: 'Tenant' }[user?.residentRole || 'tenant'];
  const roleColor = { owner: 'purple', occupier: 'info', tenant: 'neutral' }[user?.residentRole || 'tenant'] as 'purple' | 'info' | 'neutral';

  return (
    <Layout title="Profile" subtitle="Your account and permissions">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Avatar card */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={roleColor}>{roleLabel}</Badge>
                {user?.unit && <Badge variant="neutral">Unit {user.unit}</Badge>}
              </div>
            </div>
          </div>
        </Card>

        {/* Residence info */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Home size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Residence</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Building', value: user?.building || 'The Grand Residences' },
              { label: 'Unit', value: user?.unit || '—' },
              { label: 'Role', value: roleLabel },
              { label: 'Floor', value: user?.unit ? user.unit.match(/\d+/)?.[0] || '—' : '—' },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-1.5 border-b border-gray-50 dark:border-dark-border last:border-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Permissions */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Permissions</h2>
          </div>
          <div className="space-y-2">
            {OWNER_PERMS.map(perm => {
              const granted = perms.includes(perm);
              return (
                <div key={perm} className="flex items-center justify-between py-1.5">
                  <span className={`text-sm ${granted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                    {perm}
                  </span>
                  <Badge variant={granted ? 'success' : 'neutral'}>
                    {granted ? '✓' : '—'}
                  </Badge>
                </div>
              );
            })}
          </div>
          {user?.residentRole !== 'owner' && (
            <p className="text-xs text-gray-400 mt-3">
              Some permissions are restricted for your role. Contact the unit owner to request additional access.
            </p>
          )}
        </Card>

        {/* Settings links */}
        <Card className="divide-y divide-gray-100 dark:divide-dark-border overflow-hidden">
          {[
            { icon: Bell, label: 'Notification Preferences' },
            { icon: Key, label: 'Change PIN' },
            { icon: Shield, label: 'Security Settings' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label} className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">
                <Icon size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 text-left">{item.label}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            );
          })}
        </Card>
      </div>
    </Layout>
  );
}
