"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Project } from "@/lib/types"

function computeProgress(p: Project) {
  if (p.tasks.length === 0) return 0
  const done = p.tasks.filter((t) => t.status === "done").length
  return Math.round((done / p.tasks.length) * 100)
}

export function ProjectCard({ project }: { project: Project }) {
  const progress = computeProgress(project)
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="transition hover:border-primary">
        <CardHeader>
          <CardTitle className="text-pretty">{project.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <p className="text-sm text-muted-foreground text-pretty">{project.description}</p>
          <Progress value={progress} aria-label={`Progress ${progress}%`} />
          <div className="text-xs text-muted-foreground">{progress}% complete</div>
        </CardContent>
      </Card>
    </Link>
  )
}
