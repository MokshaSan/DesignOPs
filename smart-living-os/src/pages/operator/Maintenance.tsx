import { useState } from 'react';
import { Wrench, Bot, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge, Button } from '../../components/ui/index';
import { MOCK_MAINTENANCE } from '../../data/mockData';
import type { MaintenanceRequest } from '../../types';

const priorityColor = { critical: 'danger', high: 'warning', medium: 'neutral', low: 'info' } as const;

export default function OperatorMaintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE);

  const resolve = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  return (
    <Layout title="Maintenance" subtitle="Predictive and reactive maintenance">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* AI predicted summary */}
        <Card className="p-4 border-primary-200 dark:border-primary-800 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shrink-0">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">AI Predictive Maintenance</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {requests.filter(r => r.aiPredicted && r.status === 'open').length} devices predicted to require maintenance within 7 days.
                Proactive action could prevent {Math.round(requests.filter(r => r.aiPredicted).length * 2.5)} reactive truck rolls.
              </p>
            </div>
          </div>
        </Card>

        {/* Open requests */}
        <div className="space-y-3">
          {requests.map(req => (
            <Card key={req.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${req.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/20' : req.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'}`}>
                  <Wrench size={16} className={req.priority === 'critical' ? 'text-red-600' : req.priority === 'high' ? 'text-orange-600' : 'text-yellow-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{req.deviceName}</h3>
                      <p className="text-xs text-gray-500">Unit {req.unitId} · {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant={priorityColor[req.priority]} className="capitalize">{req.priority}</Badge>
                      <Badge variant={req.status === 'resolved' ? 'success' : req.status === 'in_progress' ? 'info' : 'neutral'} className="capitalize">
                        {req.status.replace('_', ' ')}
                      </Badge>
                      {req.aiPredicted && <Badge variant="purple">AI</Badge>}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{req.description}</p>

                  {req.failureRisk !== undefined && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Failure Risk</span>
                          <span className={`font-semibold ${req.failureRisk >= 80 ? 'text-red-500' : req.failureRisk >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>{req.failureRisk}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${req.failureRisk >= 80 ? 'bg-red-500' : req.failureRisk >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${req.failureRisk}%` }}
                          />
                        </div>
                      </div>
                      {req.estimatedFailureDays !== undefined && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Est. days</p>
                          <p className={`text-sm font-bold ${req.estimatedFailureDays <= 3 ? 'text-red-500' : 'text-yellow-500'}`}>{req.estimatedFailureDays}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {req.status !== 'resolved' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary" onClick={() => resolve(req.id)}>
                        <CheckCircle size={13} /> Mark Resolved
                      </Button>
                      <Button size="sm" variant="secondary">
                        Assign Technician
                      </Button>
                    </div>
                  )}
                  {req.status === 'resolved' && (
                    <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle size={14} /> Resolved
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="secondary" className="w-full">
          <Plus size={16} /> Create Manual Request
        </Button>
      </div>
    </Layout>
  );
}
