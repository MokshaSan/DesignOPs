import { useState } from 'react';
import { Lock, Unlock, DoorOpen, Shield, Key, Plus } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Button, Badge, Toggle } from '../../components/ui/index';
import { useDeviceStore } from '../../store/deviceStore';
import { useAuth } from '../../context/AuthContext';

export default function Access() {
  const { user } = useAuth();
  const { devices, updateDevice } = useDeviceStore();
  const locks = devices.filter(d => d.unitId === user?.unit && d.type === 'lock');

  return (
    <Layout title="Access" subtitle="Control entry points to your home">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Access points */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Points</h2>
          <div className="space-y-3">
            {locks.map(lock => (
              <Card key={lock.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${lock.value.locked ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                      {lock.value.locked
                        ? <Lock size={18} className="text-green-600" />
                        : <Unlock size={18} className="text-red-500" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{lock.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{lock.room}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={lock.value.locked ? 'success' : 'danger'}>
                      {lock.value.locked ? 'Locked' : 'Unlocked'}
                    </Badge>
                    <Toggle
                      checked={!lock.value.locked}
                      onChange={v => updateDevice(lock.id, { locked: !v })}
                    />
                  </div>
                </div>
              </Card>
            ))}

            {/* Static access points */}
            {[
              { name: 'Apartment Door', room: 'Main Entrance', locked: true },
              { name: 'Parking Bay', room: 'Basement B1', locked: false, note: 'Available' },
            ].map(point => (
              <Card key={point.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${point.locked ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                      <DoorOpen size={18} className={point.locked ? 'text-green-600' : 'text-blue-500'} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{point.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{point.room}</p>
                    </div>
                  </div>
                  <Badge variant={point.locked ? 'success' : 'info'}>{point.note || (point.locked ? 'Locked' : 'Open')}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Access codes */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key size={18} className="text-primary-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Access Codes</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Main PIN', value: '••••', scope: 'All doors', active: true },
              { name: 'Cleaner PIN', value: '••••', scope: 'Main door only', active: true },
              { name: 'Delivery Code', value: '••••', scope: 'Front door · Expires today', active: false },
            ].map(code => (
              <div key={code.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-border">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{code.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{code.scope}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{code.value}</span>
                  <Badge variant={code.active ? 'success' : 'neutral'}>{code.active ? 'Active' : 'Expired'}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="mt-3">
            <Plus size={14} /> New Code
          </Button>
        </Card>

        {/* Permissions */}
        {user?.residentRole === 'owner' && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-primary-600" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Permissions</h2>
            </div>
            <div className="space-y-2">
              {[
                { perm: 'Smart Home Control', granted: true },
                { perm: 'Visitor Management', granted: true },
                { perm: 'Billing & Services', granted: true },
                { perm: 'Automation Engine', granted: true },
                { perm: 'Energy Monitoring', granted: true },
              ].map(p => (
                <div key={p.perm} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{p.perm}</span>
                  <Badge variant={p.granted ? 'success' : 'neutral'}>
                    {p.granted ? '✓ Granted' : 'Restricted'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
