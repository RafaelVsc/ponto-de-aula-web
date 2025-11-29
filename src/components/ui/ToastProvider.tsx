import { createContext, useContext, useState, useCallback } from 'react';

export type ToastMessage = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type ToastContextValue = {
  toast: (message: ToastMessage) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((msg: ToastMessage) => {
    setMessages(prev => [...prev, msg]);

    // Remove toast após 5 segundos
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m !== msg));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Renderiza toasts fixos no canto superior direito */}
      <div className="fixed right-6 top-6 z-50 space-y-2 pointer-events-none">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`
              pointer-events-auto rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm
              animate-in slide-in-from-top-2 duration-300
              ${
                msg.variant === 'destructive'
                  ? 'border-destructive/50 bg-destructive/10 text-destructive'
                  : 'border-border bg-card/95 text-foreground'
              }
            `}
          >
            <p className="font-semibold">{msg.title}</p>
            {msg.description && (
              <p className="text-sm text-muted-foreground mt-1">{msg.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};
