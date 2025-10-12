"use client"

import { useState } from "react"
import type { Message } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, MessageSquare } from "lucide-react"

export function ChatPanel({
  messages,
  onSend,
  className,
}: {
  messages: Message[]
  onSend: (text: string) => void
  className?: string
}) {
  const [open, setOpen] = useState(true)
  const [text, setText] = useState("")

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText("")
  }

  return (
    <aside className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          <h3 className="text-sm font-semibold">Project Chat</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} aria-pressed={open}>
          {open ? "Hide" : "Show"}
        </Button>
      </div>
      {open && (
        <div className="mt-3 flex h-[420px] flex-col rounded-md border">
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m) => (
              <div key={m.id} className="flex flex-col">
                <div className="text-xs text-muted-foreground">
                  {m.author.name} · {new Date(m.timestamp).toLocaleTimeString()}
                </div>
                <div className="max-w-[85%] rounded-md bg-secondary px-3 py-2 text-sm">{m.text}</div>
              </div>
            ))}
            {messages.length === 0 && <div className="text-sm text-muted-foreground">No messages yet</div>}
          </div>
          <div className="border-t p-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend} aria-label="Send message">
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
