import { create } from 'zustand';
import type { Notification, NotifType } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

interface NotifStore {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

export const useNotificationStore = create<NotifStore>((set, get) => ({
  notifications: [...MOCK_NOTIFICATIONS],
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,

  markRead: (id) => {
    set(state => {
      const updated = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
      return { notifications: updated, unreadCount: updated.filter(n => !n.read).length };
    });
  },

  markAllRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  addNotification: (notif) => {
    const newNotif: Notification = {
      ...notif,
      id: `n-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set(state => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
