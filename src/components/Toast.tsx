"use client";

import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const styles: Record<ToastType, string> = {
  success:
    "bg-chart-3 text-white border-chart-3/80 shadow-lg",
  error:
    "bg-destructive text-destructive-foreground border-destructive/80 shadow-lg",
  info:
    "bg-primary text-primary-foreground border-ring shadow-lg",
};

const icons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export default function Toast({
  message,
  type = "info",
  visible,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-full fade-in duration-300"
      role="alert"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 rounded-xl border px-5 py-4 shadow-lg backdrop-blur-sm ${styles[type]}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
          {icons[type]}
        </span>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 shrink-0 rounded-lg p-1.5 transition hover:bg-white/20"
          aria-label="Dismiss"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
