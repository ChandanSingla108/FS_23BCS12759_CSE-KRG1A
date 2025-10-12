export type Status = "todo" | "inprogress" | "done"

export type Member = {
  id: string
  name: string
  avatarUrl?: string
}

export type Task = {
  id: string
  title: string
  description?: string
  status: Status
  assigneeId?: string
}

export type Project = {
  id: string
  name: string
  description: string
  members: Member[]
  tasks: Task[]
}

export type Message = {
  id: string
  author: Member
  text: string
  timestamp: string
}

export type Notification = {
  id: string
  text: string
  timestamp: string
  kind?: "info" | "success" | "warning"
}
