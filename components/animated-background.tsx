"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "next-themes"

interface Neuron {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number
  connections: number[]
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [neurons, setNeurons] = useState<Neuron[]>([])
  const { theme, systemTheme } = useTheme()
  const mouseRef = useRef({ x: -1000, y: -1000, dx: 0, dy: 0 })
  const animationFrameId = useRef<number>()
  const lastMouseTime = useRef(Date.now())
  const rippleQueue = useRef<{x: number, y: number, radius: number}[]>([])

  const createNeurons = useCallback((width: number, height: number): Neuron[] => {
    const neuronCount = 150
    return Array.from({ length: neuronCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 2 + 1,
      baseSize: 0,
      connections: []
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setNeurons(createNeurons(canvas.width, canvas.height))
    }

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const timeDiff = now - lastMouseTime.current
      mouseRef.current.dx = (e.clientX - mouseRef.current.x) * (timeDiff / 16)
      mouseRef.current.dy = (e.clientY - mouseRef.current.y) * (timeDiff / 16)
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      lastMouseTime.current = now

      // Add ripples periodically
      if (Math.random() < 0.4) {
        rippleQueue.current.push({
          x: e.clientX + (Math.random() - 0.5) * 50,
          y: e.clientY + (Math.random() - 0.5) * 50,
          radius: 0
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)

    const getThemeColors = () => {
      const isDark = (theme === "system" ? systemTheme : theme) === "dark"
      return {
        background: isDark ? "rgba(10, 10, 20, 0.1)" : "rgba(240, 240, 255, 0.1)",
        neuron: isDark ? 
          `hsl(${Math.random() * 60 + 180}, 70%, 60%)` : 
          `hsl(${Math.random() * 60 + 250}, 70%, 60%)`,
        connection: isDark ? "rgba(100, 200, 255, 0.2)" : "rgba(138, 43, 226, 0.2)",
        mouse: isDark ? "rgba(0, 194, 255, 0.3)" : "rgba(138, 43, 226, 0.3)"
      }
    }

    const drawBloomEffect = () => {
      const bloom = ctx.createRadialGradient(
        mouseRef.current.x, 
        mouseRef.current.y, 
        0, 
        mouseRef.current.x, 
        mouseRef.current.y, 
        150
      )
      bloom.addColorStop(0, getThemeColors().mouse)
      bloom.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = bloom
      ctx.fillRect(
        mouseRef.current.x - 150,
        mouseRef.current.y - 150,
        300,
        300
      )
    }

    const drawRipples = () => {
      rippleQueue.current = rippleQueue.current.filter(ripple => {
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(150, 200, 255, ${1 - ripple.radius / 200})`
        ctx.lineWidth = 2
        ctx.stroke()
        ripple.radius += 2
        return ripple.radius < 200
      })
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = getThemeColors().background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawBloomEffect()
      drawRipples()

      setNeurons((prevNeurons) => {
        const updatedNeurons = prevNeurons.map((neuron) => {
          // Mouse influence
          const dx = mouseRef.current.x - neuron.x
          const dy = mouseRef.current.y - neuron.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const speed = Math.sqrt(mouseRef.current.dx ** 2 + mouseRef.current.dy ** 2)
          
          // Size pulse based on mouse speed
          neuron.size = neuron.baseSize + Math.abs(Math.sin(Date.now() * 0.005)) * 2 + speed * 0.02

          // Magnetic field effect
          if (distance < 200) {
            const angle = Math.atan2(dy, dx)
            const force = (200 - distance) * 0.0005
            neuron.vx += Math.cos(angle) * force
            neuron.vy += Math.sin(angle) * force
          }

          // Update position with velocity damping
          neuron.x += neuron.vx *= 0.99
          neuron.y += neuron.vy *= 0.99

          // Boundary checks with soft bounce
          if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -0.8
          if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -0.8

          return neuron
        })

        // Dynamic connections
        updatedNeurons.forEach((neuron, i) => {
          neuron.connections = []
          updatedNeurons.forEach((otherNeuron, j) => {
            if (i !== j) {
              const dx = otherNeuron.x - neuron.x
              const dy = otherNeuron.y - neuron.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              
              if (distance < 150) {
                neuron.connections.push(j)
                
                // Draw connection with gradient
                const gradient = ctx.createLinearGradient(
                  neuron.x, neuron.y, 
                  otherNeuron.x, otherNeuron.y
                )
                gradient.addColorStop(0, getThemeColors().neuron)
                gradient.addColorStop(1, getThemeColors().connection)
                
                ctx.beginPath()
                ctx.moveTo(neuron.x, neuron.y)
                ctx.lineTo(otherNeuron.x, otherNeuron.y)
                ctx.strokeStyle = gradient
                ctx.lineWidth = 0.5 * (1 - distance / 150)
                ctx.stroke()
              }
            }
          })
        })

        // Draw neurons with halo effect
        updatedNeurons.forEach(neuron => {
          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2)
          
          // Inner glow
          const gradient = ctx.createRadialGradient(
            neuron.x, neuron.y, 0, 
            neuron.x, neuron.y, neuron.size * 3
          )
          gradient.addColorStop(0, getThemeColors().neuron)
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          
          ctx.fillStyle = gradient
          ctx.fill()
        })

        return updatedNeurons
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      animationFrameId.current && cancelAnimationFrame(animationFrameId.current)
    }
  }, [theme, systemTheme, createNeurons])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 transform translate-z-0" />
}

export default AnimatedBackground

