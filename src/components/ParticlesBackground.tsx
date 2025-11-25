// src/components/ParticlesBackground.tsx
import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number // Recordar tamaño original
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
    // Usar referencias mutables para el estado del mouse para evitar problemas de clausura
    const mouseRef = { x: -1000, y: -1000 }
    const isMouseDownRef = { current: false }

    // Configuración
    const particleCount = 80
    const connectionDistance = 150
    const mouseDistance = 250 // Aumentado para facilitar la interacción
    const particleColor = '#4fbac8'
    const particleSpeed = 0.5

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 1
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          size: size,
          baseSize: size
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, index) => {
        // --- INTERACCIÓN CON EL MOUSE ---
        const dxMouse = p.x - mouseRef.x
        const dyMouse = p.y - mouseRef.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        // 1. Efecto Burbuja (ELIMINADO)
        // p.size = p.baseSize

        // 2. Efecto Repulsión (Click) - SUTIL
        if (isMouseDownRef.current && distMouse < mouseDistance) {
          const force = (mouseDistance - distMouse) / mouseDistance
          const angle = Math.atan2(dyMouse, dxMouse)
          const push = force * 2 // Fuerza de empuje MUCHO más suave (era 15)

          // Aplicar empuje suave
          p.vx += Math.cos(angle) * push
          p.vy += Math.sin(angle) * push
        }

        // Movimiento normal
        p.x += p.vx
        p.y += p.vy

        // Normalizar velocidad (Evitar caos)
        // Si la velocidad supera el límite normal, la reducimos suavemente
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const maxSpeed = particleSpeed * 2 // Permitir solo un pequeño aumento temporal

        if (currentSpeed > maxSpeed) {
          p.vx *= 0.9 // Fricción fuerte para volver a la normalidad rápido
          p.vy *= 0.9
        } else if (currentSpeed > particleSpeed) {
          p.vx *= 0.98 // Fricción suave para estabilizar
          p.vy *= 0.98
        }

        // Rebote en bordes
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Dibujar punto
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Dibujar líneas a vecinos
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.strokeStyle = particleColor
            ctx.lineWidth = 0.5
            const opacity = 1 - distance / connectionDistance
            ctx.globalAlpha = opacity
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.globalAlpha = 1.0
          }
        }

        // Dibujar líneas al mouse
        if (distMouse < mouseDistance) {
          ctx.beginPath()
          ctx.strokeStyle = particleColor
          ctx.lineWidth = 1.0 // Línea más gruesa
          const opacity = 1 - distMouse / mouseDistance
          ctx.globalAlpha = opacity
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouseRef.x, mouseRef.y)
          ctx.stroke()
          ctx.globalAlpha = 1.0
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    // Inicialización
    resizeCanvas()
    createParticles()
    draw()

    // Event Listeners
    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.x = e.clientX
      mouseRef.y = e.clientY
    }
    const handleMouseLeave = () => {
      mouseRef.x = -1000
      mouseRef.y = -1000
    }
    const handleMouseDown = () => {
      isMouseDownRef.current = true
    }
    const handleMouseUp = () => {
      isMouseDownRef.current = false
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
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
