"use client";

import * as React from "react";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
  dismissToast: (id: number) => void;
  toasts: ToastProps[];
}

export const useToast = (): ToastContextType => {
  // Simple implementation to avoid dependency on the actual toast component
  const toast = (props: ToastProps) => {
    console.log("Toast:", props);
  };

  const dismissToast = (id: number) => {
    console.log("Dismiss toast:", id);
  };

  return {
    toast,
    dismissToast,
    toasts: [],
  };
};