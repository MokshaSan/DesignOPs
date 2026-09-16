import { AlertTriangle, CheckCircle, Clock, Bot } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge, Button } from '../../components/ui/index';
import { MOCK_MAINTENANCE, MOCK_DEVICES } from '../../data/mockData';

const alerts = [
  { id: 'al1', severity: 'critical', icon: '🔴', title: 'Smoke sensor offline', location: 'Tower A / 14F', device: 'SMOKE-14F', time: '09:15', aiConfidence: 95, aiNote: 'Device completely offline for 1+ hour. Immediate physical inspection required. No backup sensor in range.' },
  { id: 'al2', severity: 'warning', icon: '🟠', title: 'Temperature anomaly', location: 'Unit 12A', device: 'TEMP-12A', time: '09:42', aiConfidence: 78, aiNote: 'Single sensor spike detected. Nearby sensors show no matching event. Likely sensor malfunction rather than actual temperature event. Recommend verification before escalation.' },
  { id: 'al3', severity: 'maintenance', icon: '🟡', title: 'AC filter due', location: '8 units', device: 'Multiple', time: '—', aiConfidence: 92, aiNote: 'Predictive model estimates filter efficiency at 64%. Proactive replacement reduces AC energy draw by approximately 12%.' },
  { id: 'al4', severity: 'info', icon: '🔵', title: 'Energy spike in Tower B', location: 'Floors 10–15', device: 'ENERGY', time: '08:30', aiConfidence: 85, aiNote: 'Temporary peak consistent with morning occupancy patterns. No anomaly detected. Will normalise by 10:00 AM.' },
];

export default function OperatorAlerts() {
  return (
    <Layout title="Alerts" subtitle="Building safety and operational alerts">
      <div className="max-w-3xl mx-auto space-y-4">
        {alerts.map(alert => (
          <Card key={alert.id} className={`p-5 ${alert.severity === 'critical' ? 'border-red-200 dark:border-red-800' : alert.severity === 'warning' ? 'border-yellow-200 dark:border-yellow-800' : ''}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">{alert.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{alert.location} · {alert.device}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : alert.severity === 'maintenance' ? 'neutral' : 'info'} className="capitalize">
                      {alert.severity}
                    </Badge>
                    {alert.time !== '—' && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} /> {alert.time}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI analysis */}
                <div className="mt-3 bg-gray-50 dark:bg-dark-border rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bot size={13} className="text-primary-600" />
                    <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">AI Analysis · {alert.aiConfidence}% confidence</p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{alert.aiNote}</p>
                </div>

                <div className="flex gap-2 mt-3">
                  {alert.severity === 'critical' && (
                    <Button size="sm" variant="danger">
                      <AlertTriangle size={13} /> Escalate
                    </Button>
                  )}
                  <Button size="sm" variant="secondary">
                    <CheckCircle size={13} /> Acknowledge
                  </Button>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
