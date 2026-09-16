import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Edit2, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../../components/ui/Layout';
import { Card, Button, Badge } from '../../components/ui/index';
import { executeScene } from '../../services/deviceSimulator';
import { MOCK_SCENES } from '../../data/mockData';
import type { Scene } from '../../types';

export default function Scenes() {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<Scene[]>(MOCK_SCENES);
  const [activeScene, setActiveScene] = useState<string | null>('s4');
  const [executing, setExecuting] = useState<string | null>(null);

  const runScene = async (scene: Scene) => {
    setExecuting(scene.id);
    await new Promise(r => setTimeout(r, 800)); // brief animation
    executeScene(scene.actions.map(a => ({ deviceId: a.deviceId, action: a.action })));
    setActiveScene(scene.id);
    setExecuting(null);
  };

  return (
    <Layout title="Scenes" subtitle="Control your home with one tap">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Create CTA */}
        <Card className="p-5 border-dashed border-2 border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Create with AI</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Describe what you want — AI builds the scene</p>
              </div>
            </div>
            <Button onClick={() => navigate('/resident/scenes/create')}>
              <Plus size={16} /> New Scene
            </Button>
          </div>
        </Card>

        {/* Scene grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Scenes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenes.map((scene, i) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`p-4 ${activeScene === scene.id ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-dark-bg' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{scene.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{scene.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {activeScene === scene.id && <Badge variant="success">Active</Badge>}
                          {scene.aiGenerated && <Badge variant="purple">AI</Badge>}
                        </div>
                      </div>
                    </div>
                    {activeScene === scene.id && (
                      <CheckCircle size={18} className="text-primary-600 dark:text-primary-400 shrink-0" />
                    )}
                  </div>

                  <div className="space-y-1 mb-4">
                    {scene.actions.slice(0, 3).map(action => (
                      <div key={action.deviceId} className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{action.deviceName}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {action.action.on === false ? 'OFF' :
                           action.action.temperature ? `${action.action.temperature}°C` :
                           action.action.position ? action.action.position.charAt(0).toUpperCase() + action.action.position.slice(1) :
                           action.action.locked ? 'LOCKED' :
                           action.action.locked === false ? 'UNLOCKED' : 'ON'}
                        </span>
                      </div>
                    ))}
                    {scene.actions.length > 3 && (
                      <p className="text-xs text-gray-400">+{scene.actions.length - 3} more</p>
                    )}
                  </div>

                  {scene.aiReasoning && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-xs text-primary-700 dark:text-primary-300">
                      🧠 {scene.aiReasoning}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant={activeScene === scene.id ? 'secondary' : 'primary'}
                      size="sm"
                      className="flex-1"
                      loading={executing === scene.id}
                      onClick={() => runScene(scene)}
                    >
                      <Play size={13} />
                      {activeScene === scene.id ? 'Re-activate' : 'Activate'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/resident/scenes/create')}>
                      <Edit2 size={13} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
