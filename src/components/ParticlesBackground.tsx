// src/components/ParticlesBackground.tsx
import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

export const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    // Configuración
    const particleCount = 80 // Cantidad de puntos
    const connectionDistance = 150 // Distancia para conectar líneas
    const particleColor = '#4fbac8' // Cian
    const particleSpeed = 0.5 // Velocidad base

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          size: Math.random() * 2 + 1 // Tamaño entre 1 y 3
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Actualizar y dibujar partículas
      particles.forEach((p, index) => {
        // Movimiento
        p.x += p.vx
        p.y += p.vy

        // Rebote en bordes
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Dibujar punto
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Dibujar líneas a vecinos cercanos
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.strokeStyle = particleColor
            ctx.lineWidth = 0.5
            // Opacidad basada en la distancia (más lejos = más transparente)
            const opacity = 1 - distance / connectionDistance
            ctx.globalAlpha = opacity
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.globalAlpha = 1.0 // Resetear opacidad
          }
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    // Inicialización
    resizeCanvas()
    createParticles()
    draw()

    // Event Listeners
    window.addEventListener('resize', () => {
      resizeCanvas()
      createParticles() // Recrear para distribuir bien
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Detrás de todo
        backgroundColor: 'var(--White)', // Fondo blanco base
        pointerEvents: 'none' // No bloquear clicks
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </Box>
  )
}
