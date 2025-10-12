"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppState } from "@/context/app-state"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAppState()
  const router = useRouter()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate auth
    login(email || "user@example.com")
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{mode === "login" ? "Login" : "Register"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          {mode === "login" ? (
            <div className="text-sm text-muted-foreground">
              New here?{" "}
              <button className="text-primary underline" onClick={() => setMode("register")}>
                Switch to Register
              </button>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button className="text-primary underline" onClick={() => setMode("login")}>
                Switch to Login
              </button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
