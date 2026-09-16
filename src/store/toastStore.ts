import { create } from "zustand";
import { playNotifySound } from "@/lib/sounds";

export type ToastTone = "success" | "warning" | "danger" | "info";

export interface ToastItem {
  id: string;
  title: string;
  body: string;
  tone: ToastTone;
}

interface ToastState {
  toasts: ToastItem[];
  pushToast: (t: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: (t) => {
    const id = `toast-${Math.random().toString(36).slice(2, 9)}`;
    set((s) => ({ toasts: [...s.toasts.slice(-4), { ...t, id }] }));
    playNotifySound(t.tone);
    window.setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
    }, 5000);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));
