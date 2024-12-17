'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  title?: string;
  description?: string;
  duration?: number;
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void;
}>({
  toast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([]);

  const toast = React.useCallback(
    ({ title, description, duration = 3000 }: ToastProps) => {
      const id = Math.random().toString();
      setToasts([{ id, title, description }]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "bg-background border border-foreground/10 rounded-lg p-4 shadow-lg",
              "animate-in slide-in-from-right-full"
            )}
          >
            {toast.title && (
              <div className="font-semibold">{toast.title}</div>
            )}
            {toast.description && <div>{toast.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 