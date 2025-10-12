"use client"

import { AppShell } from "@/components/app-shell"

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Preferences and account settings will go here.</p>
      </section>
    </AppShell>
  )
}
