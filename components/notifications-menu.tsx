"use client"

import { Bell } from "lucide-react"
import { useAppState } from "@/context/app-state"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationsMenu() {
  const { notifications } = useAppState()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative" aria-label="Open notifications">
          <Bell className="size-5" />
          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.slice(0, 6).map((n) => (
          <DropdownMenuItem key={n.id} className="flex flex-col items-start py-3">
            <span className="text-sm">{n.text}</span>
            <span className="text-xs text-muted-foreground">{new Date(n.timestamp).toLocaleString()}</span>
          </DropdownMenuItem>
        ))}
        {notifications.length === 0 && (
          <DropdownMenuItem className="text-muted-foreground">No notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
