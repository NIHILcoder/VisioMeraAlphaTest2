"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Node {
  x: number
  y: number
  size: number
  color: string
}

const ComfyNodes = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<Node[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createNodes = () => {
      const nodeCount = 10
      const nodes: Node[] = []

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        })
      }

      nodesRef.current = nodes
    }

    createNodes()

    const handleResize = () => {
      createNodes()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {nodesRef.current.map((node, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            backgroundColor: node.color,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

export default ComfyNodes

