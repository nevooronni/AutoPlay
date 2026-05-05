"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(51, 65, 85, 0.5)",
          color: "#e2e8f0",
          backdropFilter: "blur(12px)",
        },
      }}
      richColors
    />
  );
}
