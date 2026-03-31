"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "login" | "signup"
  onModeChange: (mode: "login" | "signup") => void
}

export function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isLogin = mode === "login"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"
      const body = isLogin
        ? { email, password }
        : { email, password, name_first: name.split(" ")[0], name_last: name.split(" ").slice(1).join(" ") || "" }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || "Authentication failed")
        setLoading(false)
        return
      }

      const data = await response.json()
      const token = data.token

      // Store token in localStorage
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(data.user))

      console.log("Login successful:", data.user)

      // Reset form and close modal
      onOpenChange(false)
      setEmail("")
      setPassword("")
      setName("")
      setError("")
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred"
      console.error("Login error:", errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Log in to save your favorite restaurants and write reviews."
              : "Join the community and start sharing your food experiences."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="auth-name" className="text-foreground">Name</Label>
              <Input
                id="auth-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-email" className="text-foreground">Email</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-password" className="text-foreground">Password</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Log in" : "Create account"}
          </Button>
        </form>

        <div className="mt-2 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              {"Don't have an account? "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => onModeChange("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              {"Already have an account? "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
                onClick={() => onModeChange("login")}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
