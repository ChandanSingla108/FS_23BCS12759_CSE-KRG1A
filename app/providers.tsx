"use client"

import type React from "react"

import { AppStateProvider } from "@/context/app-state"

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>
}
