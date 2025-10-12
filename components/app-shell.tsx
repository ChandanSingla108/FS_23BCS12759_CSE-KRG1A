"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, LayoutGrid, MessageSquare, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationsMenu } from "./notifications-menu"
import { CreateProjectDialog } from "./create-project-dialog"
import { useAppState } from "@/context/app-state"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard", label: "Projects", icon: LayoutGrid }, // same page for now
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAppState()
  const router = useRouter()

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 border-r bg-sidebar p-4 md:block">
        <div className="mb-6 text-lg font-semibold text-pretty">CollabFlow</div>
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent", active && "bg-sidebar-accent")}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="size-4" />
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="flex-1">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2 md:hidden">
            <div className="text-base font-semibold">CollabFlow</div>
          </div>
          <div className="flex items-center gap-2">
            <CreateProjectDialog />
            <NotificationsMenu />
            <div className="flex items-center gap-2 rounded-md border bg-card px-2 py-1">
              <Avatar className="size-6">
                <AvatarFallback>{user?.email?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm md:inline">{user?.email ?? "Guest"}</span>
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout()
                    router.push("/login")
                  }}
                  className="gap-1"
                >
                  <LogOut className="size-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </header>
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}
