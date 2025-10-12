"use client"

import type React from "react"
import { createContext, useContext, useMemo, useState } from "react"
import type { Message, Notification, Project, Status, Task } from "@/lib/types"
import { messagesByProject, notifications as seedNotifications, projects as seedProjects } from "@/lib/mock-data"

type User = { id: string; email: string } | null

type AppState = {
  user: User
  login: (email: string) => void
  logout: () => void
  projects: Project[]
  addProject: (p: Pick<Project, "name" | "description">) => string
  addTask: (projectId: string, t: Pick<Task, "title" | "description" | "status">) => string
  moveTask: (projectId: string, taskId: string, newStatus: Status) => void
  getProjectMessages: (projectId: string) => Message[]
  addMessage: (projectId: string, text: string, authorId: string) => void
  notifications: Notification[]
  addNotification: (n: Notification) => void
}

const AppStateCtx = createContext<AppState | undefined>(undefined)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [projects, setProjects] = useState<Project[]>(seedProjects)
  const [messages, setMessages] = useState<Record<string, Message[]>>(messagesByProject)
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications)

  const login = (email: string) => setUser({ id: "u1", email })
  const logout = () => setUser(null)

  const addProject = (p: Pick<Project, "name" | "description">) => {
    const id = `p${Math.random().toString(36).slice(2, 8)}`
    setProjects((prev) => [
      ...prev,
      { id, name: p.name, description: p.description, members: projects[0]?.members ?? [], tasks: [] },
    ])
    setMessages((prev) => ({ ...prev, [id]: [] }))
    setNotifications((prev) => [
      {
        id: `n${Date.now()}`,
        text: `Project "${p.name}" created`,
        timestamp: new Date().toISOString(),
        kind: "success",
      },
      ...prev,
    ])
    return id
  }

  const addTask = (projectId: string, t: Pick<Task, "title" | "description" | "status">) => {
    const id = `t${Math.random().toString(36).slice(2, 8)}`
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: [...p.tasks, { id, title: t.title, description: t.description, status: t.status }] }
          : p,
      ),
    )
    setNotifications((prev) => [
      { id: `n${Date.now()}`, text: `Task "${t.title}" added`, timestamp: new Date().toISOString(), kind: "info" },
      ...prev,
    ])
    return id
  }

  const moveTask = (projectId: string, taskId: string, newStatus: Status) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)) }
          : p,
      ),
    )
  }

  const getProjectMessages = (projectId: string) => messages[projectId] ?? []

  const addMessage = (projectId: string, text: string, authorId: string) => {
    const author = projects.flatMap((p) => p.members).find((m) => m.id === authorId) ?? projects[0]?.members[0]
    if (!author) return
    const msg: Message = { id: `c${Date.now()}`, author, text, timestamp: new Date().toISOString() }
    setMessages((prev) => ({ ...prev, [projectId]: [...(prev[projectId] ?? []), msg] }))
  }

  const addNotification = (n: Notification) => setNotifications((prev) => [n, ...prev])

  const value = useMemo<AppState>(
    () => ({
      user,
      login,
      logout,
      projects,
      addProject,
      addTask,
      moveTask,
      getProjectMessages,
      addMessage,
      notifications,
      addNotification,
    }),
    [user, projects, notifications, messages],
  )

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateCtx)
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider")
  return ctx
}
