"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/context/app-state"
import { Button } from "@/components/ui/button"

export default function IndexPage() {
  const { user } = useAppState()
  const router = useRouter()

  useEffect(() => {
    router.replace(user ? "/dashboard" : "/login")
  }, [user, router])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="text-lg">Loading...</div>
      <Button onClick={() => router.push("/login")}>Go to Login</Button>
    </div>
  )
}
