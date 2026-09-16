import { useState } from 'react';
import { QrCode, Shield, Clock, Check, X, Plus, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/ui/Layout';
import { Card, Button, Badge } from '../../components/ui/index';
import { useAuth } from '../../context/AuthContext';
import { useNotificationStore } from '../../store/notificationStore';
import { MOCK_VISITORS } from '../../data/mockData';
import type { VisitorRequest } from '../../types';

const riskColor = { LOW: 'success', MEDIUM: 'warning', HIGH: 'danger' } as const;

export default function Visitors() {
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();
  const [visitors, setVisitors] = useState<VisitorRequest[]>(MOCK_VISITORS);
  const [showPass, setShowPass] = useState<VisitorRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'guest', date: new Date().toISOString().split('T')[0], from: '10:00', to: '11:00' });

  const approve = (id: string) => {
    setVisitors(vs => vs.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    const v = visitors.find(v => v.id === id)!;
    setShowPass({ ...v, status: 'approved' });
    addNotification({ type: 'visitor', title: 'Access Granted', message: `Access granted for ${v.visitorName}. QR code generated.`, userId: user!.id });
  };

  const reject = (id: string) => {
    setVisitors(vs => vs.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
  };

  const createRequest = () => {
    const newV: VisitorRequest = {
      id: `v-${Date.now()}`, visitorName: form.name, visitorType: form.type as VisitorRequest['visitorType'],
      hostUserId: user!.id, unitId: user!.unit!, date: form.date,
      timeFrom: form.from, timeTo: form.to, status: 'pending',
      riskScore: 'LOW', riskReason: 'New visitor request pending approval.',
      createdAt: new Date().toISOString(), qrCode: `JK-PASS-${Date.now()}`,
    };
    setVisitors(vs => [newV, ...vs]);
    setShowForm(false);
  };

  return (
    <Layout title="Visitors" subtitle="Manage access for guests and deliveries">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Add visitor */}
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)}>
            <UserPlus size={16} /> Add Visitor
          </Button>
        </div>

        {/* Form modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
                <Card className="w-full max-w-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Grant Access</h3>
                  <div className="space-y-3">
                    <input placeholder="Visitor name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full text-sm bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200" />
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full text-sm bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200">
                      <option value="guest">Guest</option>
                      <option value="delivery">Delivery</option>
                      <option value="contractor">Contractor</option>
                    </select>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full text-sm bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="time" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} className="text-sm bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200" />
                      <input type="time" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} className="text-sm bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1" onClick={createRequest} disabled={!form.name}>Generate Pass</Button>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visitor list */}
        <div className="space-y-4">
          {visitors.filter(v => v.hostUserId === user?.id || user?.role === 'operator').map(visitor => (
            <Card key={visitor.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{visitor.visitorName}</h3>
                    <Badge variant="neutral" className="capitalize">{visitor.visitorType}</Badge>
                    <Badge variant={riskColor[visitor.riskScore]}>{visitor.riskScore} RISK</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock size={13} />
                    <span>{visitor.date} · {visitor.timeFrom}–{visitor.timeTo}</span>
                  </div>
                </div>
                <Badge
                  variant={visitor.status === 'approved' || visitor.status === 'active' ? 'success' : visitor.status === 'rejected' || visitor.status === 'expired' ? 'danger' : 'warning'}
                  className="capitalize"
                >
                  {visitor.status}
                </Badge>
              </div>

              {/* Risk assessment */}
              <div className="flex items-start gap-2 bg-gray-50 dark:bg-dark-border rounded-xl p-3 mb-3">
                <Shield size={15} className="text-gray-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 dark:text-gray-400">{visitor.riskReason}</p>
              </div>

              {/* Actions */}
              {visitor.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => approve(visitor.id)}>
                    <Check size={14} /> Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => reject(visitor.id)}>
                    <X size={14} /> Reject
                  </Button>
                </div>
              )}
              {(visitor.status === 'approved' || visitor.status === 'active') && (
                <Button size="sm" variant="secondary" onClick={() => setShowPass(visitor)}>
                  <QrCode size={14} /> View Pass
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* QR Pass Modal */}
        <AnimatePresence>
          {showPass && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowPass(null)}
            >
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                <Card className="w-72 p-6 text-center">
                  <div className="mb-4">
                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">JK Smart Living</p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Visitor Access</h3>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{showPass.visitorName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-1">{showPass.visitorType}</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit {showPass.unitId}</p>

                  {/* QR placeholder */}
                  <div className="my-5 mx-auto h-36 w-36 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-0.5 p-2">
                      {Array.from({ length: 25 }, (_, i) => (
                        <div key={i} className={`h-5 w-5 rounded-sm ${Math.random() > 0.4 ? 'bg-white dark:bg-gray-900' : 'bg-gray-900 dark:bg-white'}`} />
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 mb-4">
                    <p className="font-mono text-xs text-gray-400">{showPass.qrCode}</p>
                    <p>{showPass.timeFrom} – {showPass.timeTo}</p>
                    <p className="text-green-600 dark:text-green-400 font-medium">✓ Valid access</p>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => setShowPass(null)}>Close</Button>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
