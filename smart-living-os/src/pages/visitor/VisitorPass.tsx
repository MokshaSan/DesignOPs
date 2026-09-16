import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, Shield, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_VISITORS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/index';

function useCountdown(targetTime: string) {
  const calcRemaining = () => {
    const [h, m] = targetTime.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    return Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  };
  const [secs, setSecs] = useState(calcRemaining);
  useEffect(() => {
    const id = setInterval(() => setSecs(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [targetTime]);
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  return `${mins}m ${s}s`;
}

export default function VisitorPass() {
  const { id } = useParams<{ id: string }>();
  const { toggleTheme, isDark } = useTheme();
  const visitor = MOCK_VISITORS.find(v => v.id === id) || MOCK_VISITORS[0];
  const countdown = useCountdown(visitor.timeTo);
  const [scanned, setScanned] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">JK Smart Living</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visitor Access</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">John Keells Properties</p>
        </div>

        {/* Pass card */}
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-dark-border">
          {/* Gradient top */}
          <div className="bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-5 text-white">
            <p className="text-xl font-bold">{visitor.visitorName}</p>
            <p className="text-sm opacity-80 capitalize">{visitor.visitorType}</p>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Unit */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Unit</span>
              <span className="font-semibold text-gray-900 dark:text-white">{visitor.unitId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Date</span>
              <span className="font-semibold text-gray-900 dark:text-white">{visitor.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Valid</span>
              <span className="font-semibold text-gray-900 dark:text-white">{visitor.timeFrom} – {visitor.timeTo}</span>
            </div>

            {/* QR code */}
            <div className="flex justify-center py-2">
              <div
                className={`h-44 w-44 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${scanned ? 'bg-green-500' : 'bg-gray-900 dark:bg-white'}`}
                onClick={() => setScanned(true)}
              >
                {scanned ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2 text-white">
                    <CheckCircle size={40} />
                    <p className="text-sm font-bold">Access Granted</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-7 gap-0.5 p-3">
                    {Array.from({ length: 49 }, (_, i) => {
                      const isCorner = [0, 1, 5, 6, 7, 13, 35, 41, 42, 43, 47, 48].includes(i);
                      const isRandom = Math.random() > 0.5;
                      return (
                        <div key={i} className={`h-4 w-4 rounded-sm ${isCorner || isRandom ? 'bg-white dark:bg-gray-900' : 'bg-gray-900 dark:bg-white'}`} />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {!scanned && (
              <p className="text-xs text-center text-gray-400 dark:text-gray-500">Tap QR code to simulate scan</p>
            )}

            {/* Status */}
            <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium ${scanned ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'}`}>
              {scanned ? (
                <><CheckCircle size={16} /> Access Granted — Welcome!</>
              ) : (
                <><Shield size={16} /> Valid access pass</>
              )}
            </div>

            {/* Countdown */}
            {!scanned && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={13} />
                <span>Expires in: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{countdown}</span></span>
              </div>
            )}

            <p className="text-xs text-center text-gray-400 font-mono">{visitor.qrCode}</p>
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          This pass auto-expires at {visitor.timeTo}. Single use only.
        </p>

        <button
          onClick={toggleTheme}
          className="mt-4 w-full text-xs text-center text-gray-400 hover:text-primary-600 transition-colors"
        >
          Toggle {isDark ? 'light' : 'dark'} mode
        </button>
      </motion.div>
    </div>
  );
}
