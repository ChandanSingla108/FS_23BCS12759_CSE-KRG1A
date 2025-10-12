"use client"

import { AppShell } from "@/components/app-shell"
import { ProjectCard } from "@/components/project-card"
import { useAppState } from "@/context/app-state"

export default function DashboardPage() {
  const { projects } = useAppState()
  return (
    <AppShell>
      <section aria-labelledby="projects-title" className="grid gap-4">
        <h1 id="projects-title" className="text-balance text-2xl font-semibold">
          Projects
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p,index) => (
            <ProjectCard key={index} project={p} />
          ))}
        </div>
      </section>
    </AppShell>
  )
}
