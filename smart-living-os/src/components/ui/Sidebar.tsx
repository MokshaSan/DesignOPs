import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Zap, Sun, Lock, Users, Bell, User,
  Building2, Wrench, AlertTriangle, BarChart3, Settings,
  Bot, LogOut, ChevronLeft, ChevronRight, Home
} from 'lucide-react';
import { cn } from './index';
import { useAuth } from '../../context/AuthContext';
import { useNotificationStore } from '../../store/notificationStore';
import { useState } from 'react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: number;
}

const RESIDENT_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/resident/dashboard', icon: LayoutDashboard },
  { label: 'Scenes', to: '/resident/scenes', icon: Sun },
  { label: 'Automation', to: '/resident/automation', icon: Zap },
  { label: 'Energy', to: '/resident/energy', icon: Zap },
  { label: 'Access', to: '/resident/access', icon: Lock },
  { label: 'Visitors', to: '/resident/visitors', icon: Users },
  { label: 'Notifications', to: '/resident/notifications', icon: Bell },
  { label: 'Profile', to: '/resident/profile', icon: User },
];

const OPERATOR_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/operator/dashboard', icon: Building2 },
  { label: 'Devices', to: '/operator/devices', icon: Bot },
  { label: 'Alerts', to: '/operator/alerts', icon: AlertTriangle },
  { label: 'Maintenance', to: '/operator/maintenance', icon: Wrench },
  { label: 'Visitors', to: '/operator/visitors', icon: Users },
];

const DEVELOPER_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/developer/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', to: '/developer/analytics', icon: BarChart3 },
  { label: 'Properties', to: '/developer/properties', icon: Building2 },
  { label: 'Configuration', to: '/developer/configuration', icon: Settings },
];

function getNav(role: string): NavItem[] {
  if (role === 'resident') return RESIDENT_NAV;
  if (role === 'operator') return OPERATOR_NAV;
  if (role === 'developer') return DEVELOPER_NAV;
  return [];
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotificationStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;
  const nav = getNav(user.role);

  const roleColor = {
    resident: 'bg-primary-600',
    operator: 'bg-blue-600',
    developer: 'bg-indigo-600',
    visitor: 'bg-gray-600',
  }[user.role] || 'bg-gray-600';

  return (
    <aside className={cn(
      'h-screen flex flex-col bg-white dark:bg-dark-sidebar border-r border-gray-100 dark:border-dark-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-dark-border">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shrink-0">
          <Home size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">JK Smart Living</p>
            <p className="text-xs text-gray-400">John Keells Properties</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-card">
            <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold', roleColor)}>
              {user.avatar}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user.residentRole || user.role}
                {user.unit && ` · ${user.unit}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {nav.map(item => {
          const Icon = item.icon;
          const badge = item.label === 'Notifications' ? unreadCount : undefined;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card hover:text-gray-900 dark:hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {badge ? (
                    <span className="ml-auto bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {badge}
                    </span>
                  ) : null}
                </>
              )}
              {collapsed && badge ? (
                <span className="absolute right-1 top-1 h-2 w-2 bg-primary-600 rounded-full" />
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Log out' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && 'Log out'}
        </button>
      </div>
    </aside>
  );
}
