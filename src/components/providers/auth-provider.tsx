"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";

// This component is now a wrapper around the zustand store to maintain compatibility
// with existing components that use useAuth()
// Ideally, components should migrate to useAuthStore() directly

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize store or handle hydration if needed
  // Zustand persist middleware handles basic hydration
  
  return <>{children}</>;
}

export function useAuth() {
  const { user, token, login, logout, isLoading } = useAuthStore();
  return { user, token, login, logout, isLoading };
}
