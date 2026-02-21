"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X as XIcon } from "lucide-react";

export interface ToastData {
  id: string;
  title: string;
  subtitle: string;
}

let toastListeners: Array<(toast: ToastData) => void> = [];

export function showToast(title: string, subtitle: string) {
  const toast: ToastData = { id: Date.now().toString(), title, subtitle };
  toastListeners.forEach((fn) => fn(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: ToastData) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3500);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== addToast);
    };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-fade-up flex items-center gap-3 rounded-lg bg-foreground px-4 py-3 text-background shadow-lg min-w-[260px] max-w-[340px]"
        >
          <Check className="w-4 h-4 shrink-0 text-green-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{toast.title}</p>
            <p className="text-xs opacity-60 mt-0.5">{toast.subtitle}</p>
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="shrink-0 opacity-40 hover:opacity-80 transition-opacity"
            aria-label="Zapri"
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
