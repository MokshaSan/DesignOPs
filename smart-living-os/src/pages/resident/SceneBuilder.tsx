import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Check, Loader2, Edit2, Plus, Minus, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/ui/Layout';
import { Card, Button, Badge, Slider } from '../../components/ui/index';
import { generateSceneFromPrompt } from '../../services/ai';
import { useAuth } from '../../context/AuthContext';
import { useDeviceStore } from '../../store/deviceStore';
import type { AISceneResult, SceneAction } from '../../types';

const PROMPTS = [
  'Make it cozy for a movie night',
  'I\'m working from home, need focus',
  'Romantic dinner setup',
  'Party mode — music and bright lights',
  'Wind down before sleep',
  'Morning workout energy',
];

export default function SceneBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { devices } = useDeviceStore();
  const myDevices = devices.filter(d => d.unitId === user?.unit);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISceneResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [editedActions, setEditedActions] = useState<SceneAction[]>([]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await generateSceneFromPrompt(prompt, myDevices, user?.name || 'Resident');
      setResult(res);
      setEditedActions(res.actions);
    } finally {
      setLoading(false);
    }
  };

  const updateAction = (idx: number, field: string, value: unknown) => {
    setEditedActions(prev => prev.map((a, i) =>
      i === idx ? { ...a, action: { ...a.action, [field]: value } } : a
    ));
  };

  const saveScene = () => {
    setSaved(true);
    setTimeout(() => navigate('/resident/scenes'), 1500);
  };

  return (
    <Layout title="AI Scene Builder" subtitle="Describe what you want and AI will configure your home">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate('/resident/scenes')}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Scenes
        </button>

        {/* Prompt input */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
              <Wand2 size={16} className="text-white" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">What atmosphere do you want?</p>
          </div>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Make my home ready for movie night — dim lights, comfortable temperature, curtains closed..."
            className="w-full h-24 resize-none rounded-xl bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            onClick={generate}
            loading={loading}
            disabled={!prompt.trim()}
            className="w-full"
          >
            <Sparkles size={16} /> Generate Scene
          </Button>
        </Card>

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="p-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">AI is creating your scene...</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Analysing your devices and preferences</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Scene header */}
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{result.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{result.name}</h2>
                      <Badge variant="purple">AI Generated</Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Confidence: {Math.round(result.confidence * 100)}%
                    </p>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wide mb-1">AI Reasoning</p>
                  <p className="text-sm text-primary-800 dark:text-primary-200">{result.reasoning}</p>
                </div>

                {/* Editable actions */}
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Device Configuration <span className="text-xs font-normal text-gray-500">(edit below)</span>
                </p>
                <div className="space-y-3">
                  {editedActions.map((action, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-border">
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-dark-card flex items-center justify-center text-base shadow-sm">
                        {action.deviceType === 'light' ? '💡' : action.deviceType === 'ac' ? '❄️' : action.deviceType === 'curtain' ? '🪟' : action.deviceType === 'lock' ? '🔒' : '🏠'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{action.deviceName}</p>
                        <p className="text-xs text-gray-400">{action.room}</p>
                      </div>
                      {/* Per-device controls */}
                      {action.deviceType === 'light' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{action.action.on ? 'ON' : 'OFF'}</span>
                          {action.action.on && (
                            <span className="text-xs text-gray-500">{action.action.brightness}%</span>
                          )}
                        </div>
                      )}
                      {action.deviceType === 'ac' && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateAction(i, 'temperature', Math.max(16, (Number(action.action.temperature) || 24) - 1))} className="h-6 w-6 rounded-full bg-white dark:bg-dark-card text-sm shadow hover:bg-gray-100">−</button>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{action.action.temperature}°C</span>
                          <button onClick={() => updateAction(i, 'temperature', Math.min(30, (Number(action.action.temperature) || 24) + 1))} className="h-6 w-6 rounded-full bg-white dark:bg-dark-card text-sm shadow hover:bg-gray-100">+</button>
                        </div>
                      )}
                      {action.deviceType === 'curtain' && (
                        <span className="text-sm capitalize text-gray-600 dark:text-gray-300">{String(action.action.position)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Save actions */}
              {saved ? (
                <Card className="p-4 text-center bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                    <Check size={18} /> Scene saved successfully!
                  </div>
                </Card>
              ) : (
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={saveScene}>
                    <Check size={16} /> Save Scene
                  </Button>
                  <Button variant="secondary" onClick={generate}>
                    <Sparkles size={16} /> Regenerate
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
