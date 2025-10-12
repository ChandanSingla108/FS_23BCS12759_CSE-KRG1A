"use client"

import { notFound, useParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { useAppState } from "@/context/app-state"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { KanbanBoard } from "@/components/kanban-board"
import { ChatPanel } from "@/components/chat-panel"

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const { projects, moveTask, getProjectMessages, addMessage, user } = useAppState()
  const project = projects.find((p) => p.id === params.id)
  if (!project) return notFound()

  const messages = getProjectMessages(project.id)

  return (
    <AppShell>
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <section className="grid gap-4">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-balance text-2xl font-semibold">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.members.map((m) => (
                  <Badge key={m.id} variant="secondary">
                    {m.name}
                  </Badge>
                ))}
              </div>
            </div>
            <CreateTaskDialog projectId={project.id} />
          </header>
          <KanbanBoard tasks={project.tasks} onMove={(taskId, newStatus) => moveTask(project.id, taskId, newStatus)} />
        </section>
        <ChatPanel
          className="md:pl-2"
          messages={messages}
          onSend={(text) => addMessage(project.id, text, user?.id ?? project.members[0]?.id)}
        />
      </div>
    </AppShell>
  )
}
