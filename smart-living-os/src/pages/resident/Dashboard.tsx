import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer, Wind, Lightbulb, Lock, Zap, ChevronRight, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/ui/Layout';
import { Card, Button, Toggle, SectionHeader, Badge } from '../../components/ui/index';
import { useAuth } from '../../context/AuthContext';
import { useDeviceStore } from '../../store/deviceStore';
import { useNotificationStore } from '../../store/notificationStore';
import { executeScene } from '../../services/deviceSimulator';
import { MOCK_SCENES, MOCK_ACTIVITY } from '../../data/mockData';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function ResidentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { devices, updateDevice } = useDeviceStore();
  const { addNotification } = useNotificationStore();
  const [showAISuggestion, setShowAISuggestion] = useState(true);
  const [sceneExecuted, setSceneExecuted] = useState(false);
  const [activity, setActivity] = useState(MOCK_ACTIVITY);

  const myDevices = devices.filter(d => d.unitId === user?.unit);
  const light = myDevices.find(d => d.type === 'light' && d.room === 'Living Room');
  const ac = myDevices.find(d => d.type === 'ac');
  const lock = myDevices.find(d => d.type === 'lock');
  const energy = myDevices.find(d => d.type === 'energy');
  const curtain = myDevices.find(d => d.type === 'curtain');
  const lightsOn = myDevices.filter(d => d.type === 'light' && d.value.on).length;
  const eveningScene = MOCK_SCENES.find(s => s.id === 's5')!;

  const acceptAISuggestion = () => {
    executeScene(eveningScene.actions.map(a => ({ deviceId: a.deviceId, action: a.action })));
    setShowAISuggestion(false);
    setSceneExecuted(true);
    addNotification({
      type: 'ai',
      title: 'Automation Executed',
      message: 'Evening Arrival scene has been activated by AI.',
      userId: user!.id,
    });
    const newEntry = { id: `act-${Date.now()}`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), message: 'Evening Arrival scene activated', icon: '✨' };
    setActivity(prev => [newEntry, ...prev.slice(0, 5)]);
  };

  return (
    <Layout
      title={`${getGreeting()}, ${user?.name?.split(' ')[0]}`}
      subtitle={`${user?.unit} · The Grand Residences`}
    >
      <div className="max-w-5xl mx-auto space-y-6">

        {/* AI Suggestion Banner */}
        <AnimatePresence>
          {showAISuggestion && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="p-4 border-primary-200 dark:border-primary-800 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">AI noticed a pattern</p>
                      <Badge variant="purple">Confidence 94%</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You usually arrive home between 6:00–6:30 PM. Ready to activate your <strong>Evening Arrival</strong> scene?
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={acceptAISuggestion}>
                        <Play size={13} /> Activate Scene
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowAISuggestion(false)}>
                        Not now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {sceneExecuted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-400">Evening Arrival activated</p>
                  <p className="text-xs text-green-600 dark:text-green-500">Door unlocked · Lights on 80% · AC 24°C · Curtains open</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🌡', label: 'Temperature', value: `${ac?.value.temperature?.toFixed(1) ?? '--'}°C`, sub: 'Living Room' },
            { icon: '💡', label: 'Lights', value: `${lightsOn} ON`, sub: `of ${myDevices.filter(d => d.type === 'light').length} lights` },
            { icon: '❄️', label: 'AC', value: ac?.value.on ? `${Math.round(ac.value.temperature ?? 24)}°C` : 'OFF', sub: ac?.value.on ? 'Running' : 'Standby' },
            { icon: '⚡', label: 'Energy', value: `${energy?.value.kwh?.toFixed(1) ?? '0.0'} kWh`, sub: 'Today' },
          ].map(stat => (
            <Card key={stat.label} className="p-4">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.sub}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Controls */}
          <div className="lg:col-span-2 space-y-4">
            <SectionHeader title="Quick Controls" action={() => navigate('/resident/access')} actionLabel="Manage Access" />
            <div className="grid grid-cols-2 gap-3">
              {/* Light */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={18} className="text-yellow-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Lights</p>
                  </div>
                  <Toggle
                    checked={light?.value.on ?? false}
                    onChange={v => light && updateDevice(light.id, { on: v, brightness: v ? 80 : 0 })}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Living Room · {light?.value.brightness ?? 0}%</p>
              </Card>

              {/* AC */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wind size={18} className="text-blue-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">AC</p>
                  </div>
                  <Toggle
                    checked={ac?.value.on ?? false}
                    onChange={v => ac && updateDevice(ac.id, { on: v })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => ac && updateDevice(ac.id, { temperature: Math.max(16, (ac.value.temperature ?? 24) - 1) })} className="h-6 w-6 rounded-full bg-gray-100 dark:bg-dark-border text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600">−</button>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex-1 text-center">{Math.round(ac?.value.temperature ?? 24)}°C</p>
                  <button onClick={() => ac && updateDevice(ac.id, { temperature: Math.min(30, (ac.value.temperature ?? 24) + 1) })} className="h-6 w-6 rounded-full bg-gray-100 dark:bg-dark-border text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600">+</button>
                </div>
              </Card>

              {/* Door */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock size={18} className={lock?.value.locked ? 'text-green-500' : 'text-red-500'} />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Front Door</p>
                  </div>
                  <Toggle
                    checked={!(lock?.value.locked ?? true)}
                    onChange={v => lock && updateDevice(lock.id, { locked: !v })}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{lock?.value.locked ? '🔒 Locked' : '🔓 Unlocked'}</p>
              </Card>

              {/* Curtains */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🪟</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Curtains</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['open', 'partial', 'closed'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => curtain && updateDevice(curtain.id, { position: pos })}
                      className={`flex-1 text-xs py-1 rounded-lg border transition-colors ${curtain?.value.position === pos ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:border-primary-300'}`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Active Scene */}
            <div>
              <SectionHeader title="Active Scene" action={() => navigate('/resident/scenes')} actionLabel="All Scenes" />
              {MOCK_SCENES.filter(s => s.isActive || sceneExecuted).slice(0, 1).map(scene => (
                <Card key={scene.id} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{sceneExecuted ? '✨' : scene.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{sceneExecuted ? 'Evening Arrival' : scene.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">Active</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {(sceneExecuted ? eveningScene : scene).actions.slice(0, 4).map(action => (
                      <div key={action.deviceId} className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{action.deviceName}</span>
                        <span className="font-medium">
                          {action.action.on === false ? 'OFF' :
                           action.action.temperature ? `${action.action.temperature}°C` :
                           action.action.position ? action.action.position :
                           action.action.locked ? 'LOCKED' :
                           action.action.locked === false ? 'OPEN' : 'ON'}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div>
              <SectionHeader title="Recent Activity" />
              <Card className="divide-y divide-gray-100 dark:divide-dark-border overflow-hidden">
                {activity.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-base">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{item.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
