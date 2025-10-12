"use client"

import type React from "react"

import { useMemo } from "react"
import type { Status, Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Column = { key: Status; title: string }

const columns: Column[] = [
  { key: "todo", title: "To Do" },
  { key: "inprogress", title: "In Progress" },
  { key: "done", title: "Done" },
]

export function KanbanBoard({
  tasks,
  onMove,
}: {
  tasks: Task[]
  onMove: (taskId: string, newStatus: Status) => void
}) {
  const grouped = useMemo(() => {
    const by: Record<Status, Task[]> = { todo: [], inprogress: [], done: [] }
    for (const t of tasks) by[t.status].push(t)
    return by
  }, [tasks])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((col) => (
        <KanbanColumn key={col.key} title={col.title} status={col.key} tasks={grouped[col.key]} onMove={onMove} />
      ))}
    </div>
  )
}

function KanbanColumn({
  title,
  status,
  tasks,
  onMove,
}: {
  title: string
  status: Status
  tasks: Task[]
  onMove: (taskId: string, newStatus: Status) => void
}) {
  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/task-id")
    if (id) onMove(id, status)
  }

  return (
    <Card
      className={cn("min-h-64 border-dashed")}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      role="region"
      aria-label={`${title} column`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Badge variant="secondary">{tasks.length}</Badge>
      </CardHeader>
      <CardContent className="grid gap-3">
        {tasks.map((t) => (
          <KanbanCard key={t.id} task={t} />
        ))}
        {tasks.length === 0 && <div className="text-sm text-muted-foreground">Drag tasks here</div>}
      </CardContent>
    </Card>
  )
}

function KanbanCard({ task }: { task: Task }) {
  const onDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.dataTransfer.setData("text/task-id", task.id)
    e.dataTransfer.effectAllowed = "move"
  }
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="rounded-md border bg-card p-3 shadow-sm transition hover:bg-accent"
      role="button"
      aria-label={`Task ${task.title}`}
    >
      <div className="font-medium">{task.title}</div>
      {task.description && <div className="mt-1 text-sm text-muted-foreground">{task.description}</div>}
    </div>
  )
}
