import { Clock, Shield, Users } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Badge, MetricCard } from '../../components/ui/index';
import { MOCK_VISITORS } from '../../data/mockData';

const riskColor = { LOW: 'success', MEDIUM: 'warning', HIGH: 'danger' } as const;

export default function OperatorVisitors() {
  return (
    <Layout title="Visitor Management" subtitle="Building-wide visitor tracking">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Active Visitors" value={27} icon="👥" color="blue" />
          <MetricCard label="Pending Approvals" value={3} icon="⏳" color="orange" />
          <MetricCard label="Today Total" value={42} icon="📋" color="purple" />
        </div>

        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-dark-border">
            <h2 className="font-semibold text-gray-900 dark:text-white">All Visitors — Today</h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-dark-border">
            {[...MOCK_VISITORS, {
              id: 'v4', visitorName: 'Lanka Constructions', visitorType: 'contractor', hostUserId: 'u3',
              unitId: 'B1 Lobby', date: new Date().toISOString().split('T')[0],
              timeFrom: '08:00', timeTo: '17:00', status: 'active',
              riskScore: 'LOW', riskReason: 'Registered contractor. Background cleared.',
              createdAt: new Date().toISOString(), qrCode: 'JK-PASS-V4',
            } as typeof MOCK_VISITORS[0]].map(visitor => (
              <div key={visitor.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {visitor.visitorName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{visitor.visitorName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{visitor.visitorType}</span>
                    <span>·</span>
                    <span>Unit {visitor.unitId}</span>
                    <span>·</span>
                    <Clock size={11} />
                    <span>{visitor.timeFrom}–{visitor.timeTo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={riskColor[visitor.riskScore]}>{visitor.riskScore}</Badge>
                  <Badge variant={visitor.status === 'approved' || visitor.status === 'active' ? 'success' : visitor.status === 'pending' ? 'warning' : 'neutral'} className="capitalize">
                    {visitor.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
