import type { Member, Message, Notification, Project, Task } from "./types"

export const members: Member[] = [
  { id: "m1", name: "Alex Johnson" },
  { id: "m2", name: "Sam Lee" },
  { id: "m3", name: "Jordan Kim" },
]

const tasksA: Task[] = [
  { id: "t1", title: "Design project brief", status: "todo", assigneeId: "m1" },
  { id: "t2", title: "Set up repo & CI", status: "inprogress", assigneeId: "m2" },
  { id: "t3", title: "Create wireframes", status: "done", assigneeId: "m3" },
]

const tasksB: Task[] = [
  { id: "t4", title: "User research plan", status: "todo", assigneeId: "m2" },
  { id: "t5", title: "API contract draft", status: "inprogress", assigneeId: "m1" },
  { id: "t6", title: "Brand palette", status: "done", assigneeId: "m3" },
]

export const projects: Project[] = [
  {
    id: "p1",
    name: "Nova CRM",
    description: "Modern CRM with team collaboration.",
    members,
    tasks: tasksA,
  },
  {
    id: "p2",
    name: "Pulse Analytics",
    description: "Lightweight analytics dashboard.",
    members,
    tasks: tasksB,
  },
]

export const messagesByProject: Record<string, Message[]> = {
  p1: [
    {
      id: "c1",
      author: members[0],
      text: "Kickoff at 10am. Please review the brief.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "c2",
      author: members[1],
      text: "CI is half way set up, need secrets.",
      timestamp: new Date().toISOString(),
    },
  ],
  p2: [
    {
      id: "c3",
      author: members[2],
      text: "Uploaded initial color tokens.",
      timestamp: new Date().toISOString(),
    },
  ],
}

export const notifications: Notification[] = [
  { id: "n1", text: 'Task "Create wireframes" marked Done', timestamp: new Date().toISOString(), kind: "success" },
  { id: "n2", text: "New message in Nova CRM", timestamp: new Date().toISOString(), kind: "info" },
]
