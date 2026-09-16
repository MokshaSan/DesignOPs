import { Bell, Zap, Wrench, Bot, Shield, Info, CheckCheck } from 'lucide-react';
import { Layout } from '../../components/ui/Layout';
import { Card, Button, Badge } from '../../components/ui/index';
import { useNotificationStore } from '../../store/notificationStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../components/ui/index';
import type { NotifType } from '../../types';

function NotifIcon({ type }: { type: NotifType }) {
  const cls = 'h-9 w-9 rounded-xl flex items-center justify-center shrink-0';
  switch (type) {
    case 'visitor': return <div className={cn(cls, 'bg-blue-100 dark:bg-blue-900/20')}><Bell size={16} className="text-blue-600" /></div>;
    case 'energy': return <div className={cn(cls, 'bg-yellow-100 dark:bg-yellow-900/20')}><Zap size={16} className="text-yellow-600" /></div>;
    case 'maintenance': return <div className={cn(cls, 'bg-orange-100 dark:bg-orange-900/20')}><Wrench size={16} className="text-orange-600" /></div>;
    case 'ai': return <div className={cn(cls, 'bg-primary-100 dark:bg-primary-900/20')}><Bot size={16} className="text-primary-600" /></div>;
    case 'security': return <div className={cn(cls, 'bg-green-100 dark:bg-green-900/20')}><Shield size={16} className="text-green-600" /></div>;
    default: return <div className={cn(cls, 'bg-gray-100 dark:bg-gray-800')}><Info size={16} className="text-gray-500" /></div>;
  }
}

export default function Notifications() {
  const { notifications, markRead, markAllRead } = useNotificationStore();
  const navigate = useNavigate();

  return (
    <Layout title="Notifications" subtitle="Stay informed about your home">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{notifications.filter(n => !n.read).length} unread</p>
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck size={14} /> Mark all read
          </Button>
        </div>

        <div className="space-y-2">
          {notifications.map(notif => (
            <Card
              key={notif.id}
              className={cn(
                'p-4 cursor-pointer transition-all',
                !notif.read && 'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/10'
              )}
              onClick={() => markRead(notif.id)}
            >
              <div className="flex items-start gap-3">
                <NotifIcon type={notif.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white')}>
                      {notif.title}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(notif.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{notif.message}</p>
                  {notif.actionLabel && notif.actionRoute && (
                    <button
                      onClick={e => { e.stopPropagation(); navigate(notif.actionRoute!); }}
                      className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-2 hover:underline"
                    >
                      {notif.actionLabel} →
                    </button>
                  )}
                </div>
                {!notif.read && (
                  <div className="h-2 w-2 rounded-full bg-primary-600 mt-2 shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
