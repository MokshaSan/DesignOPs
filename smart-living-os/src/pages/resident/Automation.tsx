import { useState } from 'react';
import { Zap, Plus, Check, Clock, Cpu, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../../components/ui/Layout';
import { Card, Button, Badge, Toggle, SectionHeader } from '../../components/ui/index';
import { MOCK_AUTOMATIONS } from '../../data/mockData';
import type { Automation } from '../../types';

export default function AutomationPage() {
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const toggle = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <Layout title="Automation" subtitle="Your smart home rules">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* AI suggestion */}
        <Card className="p-4 border-primary-200 dark:border-primary-800 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">AI Automation Suggestion</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                I noticed you turn on the AC and lights every weekday around 7:00 AM. Want me to create a <strong>Morning Routine</strong> automation?
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm">
                  <Cpu size={13} /> Create Automation
                </Button>
                <Button size="sm" variant="ghost">Dismiss</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Active automations */}
        <div>
          <SectionHeader title="Your Automations" />
          <div className="space-y-3">
            {automations.map((auto, i) => (
              <motion.div
                key={auto.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${auto.enabled ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-dark-border'}`}>
                        {auto.trigger.type === 'time' ? (
                          <Clock size={16} className={auto.enabled ? 'text-primary-600' : 'text-gray-400'} />
                        ) : (
                          <Zap size={16} className={auto.enabled ? 'text-primary-600' : 'text-gray-400'} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{auto.name}</h3>
                          {auto.aiSuggested && <Badge variant="purple">AI</Badge>}
                          {!auto.enabled && <Badge variant="neutral">Disabled</Badge>}
                          {auto.confidence && <Badge variant="info">{auto.confidence}% confidence</Badge>}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                          <p className="flex items-center gap-1">
                            <span className="text-gray-400">IF</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {auto.trigger.type === 'time' ? `Time is ${auto.trigger.time}` :
                               auto.trigger.type === 'arrival' ? 'Resident arrives home' :
                               auto.trigger.condition || 'Condition met'}
                            </span>
                            {auto.trigger.days && <span className="text-gray-400">({auto.trigger.days.join(', ')})</span>}
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="text-gray-400">THEN</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {auto.actions.map(a => a.deviceName).join(', ')}
                            </span>
                          </p>
                          {auto.lastRun && (
                            <p className="text-gray-400">Last ran: {new Date(auto.lastRun).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Toggle checked={auto.enabled} onChange={() => toggle(auto.id)} size="sm" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Create new */}
        <Button variant="secondary" className="w-full" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Create Automation
        </Button>

        {showCreate && (
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">New Automation</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Morning Routine"
                  className="w-full text-sm bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200"
                />
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-border space-y-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">TRIGGER</p>
                <select className="w-full text-sm bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2 outline-none dark:text-gray-200">
                  <option>Time based</option>
                  <option>When I arrive home</option>
                  <option>When I leave home</option>
                  <option>No occupancy detected</option>
                </select>
                <input type="time" defaultValue="07:00" className="w-full text-sm bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2 outline-none dark:text-gray-200" />
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-border space-y-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">THEN</p>
                <p className="text-xs text-gray-500">Select devices from your unit to control</p>
                <div className="space-y-1">
                  {['Living Room Light → ON', 'AC → 24°C', 'Curtains → Open'].map(a => (
                    <div key={a} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Check size={12} className="text-primary-600" /> {a}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setShowCreate(false)}>Save Automation</Button>
                <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
