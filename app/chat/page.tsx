"use client"

import { AppShell } from "@/components/app-shell"
import { ChatPanel } from "@/components/chat-panel"
import { useAppState } from "@/context/app-state"

export default function ChatPage() {
  const { projects, getProjectMessages, addMessage, user } = useAppState()
  const first = projects[0]
  const msgs = first ? getProjectMessages(first.id) : []
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-2xl font-semibold">Team Chat</h1>
        <ChatPanel
          messages={msgs}
          onSend={(text) => first && addMessage(first.id, text, user?.id ?? first.members[0]?.id)}
        />
      </div>
    </AppShell>
  )
}
