'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let addToastFn: ((msg: string, type: ToastType) => void) | null = null;
let toastId = 0;

export function toast(message: string, type: ToastType = 'success') {
  if (addToastFn) addToastFn(message, type);
}

const icons: Record<ToastType, string> = { success: 'success', error: 'error', warning: 'warning' };
const colors: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    addToastFn = (message: string, type: ToastType) => {
      const id = ++toastId;
      setToasts(prev => [...prev.slice(-4), { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    return () => { addToastFn = null; };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map(t => (
        <div key={t.id} className={`${colors[t.type]} text-white px-4 py-3 rounded-lg shadow-lg
          flex items-center gap-2 text-sm animate-[slideIn_0.3s_ease-out]`}>
          <Icon name={icons[t.type]} size={16} />
          {t.message}
        </div>
      ))}
    </div>
  );
}
