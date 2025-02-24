"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa"
import Link from "next/link"
import ComfyNodes from "@/components/comfy-nodes"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement authentication logic
    console.log("Authenticating with:", email, password)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] pt-14 overflow-hidden">
      <ComfyNodes />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <AnimatedBorder />
        <Card className="w-full max-w-md p-8 space-y-8 bg-background/30 backdrop-blur-lg border-none shadow-lg">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent font-mono">
              {isLogin ? "Sign In" : "Sign Up"}
            </h1>
          </motion.div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 backdrop-blur-sm border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 backdrop-blur-sm border-primary/20"
              />
            </div>
            {isLogin && (
              <Link href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full bg-primary/80 hover:bg-primary transition-colors">
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </motion.div>
          </form>
          <div className="flex justify-center space-x-4">
            {["google", "github", "discord"].map((provider) => (
              <motion.div key={provider} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm border-primary/20">
                  {provider === "google" && <FaGoogle className="w-4 h-4" />}
                  {provider === "github" && <FaGithub className="w-4 h-4" />}
                  {provider === "discord" && <FaDiscord className="w-4 h-4" />}
                </Button>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <motion.button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

const AnimatedBorder = () => {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="w-full h-full"
        style={{
          background: `conic-gradient(from ${rotation}deg at 50% 50%, 
            rgba(0, 194, 255, 0.2) 0deg, 
            rgba(138, 43, 226, 0.2) 90deg, 
            rgba(0, 194, 255, 0.2) 180deg, 
            rgba(138, 43, 226, 0.2) 270deg, 
            rgba(0, 194, 255, 0.2) 360deg)`,
        }}
      />
    </div>
  )
}

