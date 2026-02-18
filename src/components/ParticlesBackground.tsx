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

    // Configuración - reducir partículas en móvil
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 25 : 80
    const connectionDistance = isMobile ? 100 : 150
    // Optimization: Pre-calculate squared distance for faster checks
    const connectionDistanceSq = connectionDistance * connectionDistance

    const mouseDistance = 250
    const particleColor = '#4fbac8'
    const particleSpeed = 0.5

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      // Recalcular cantidad en resize
      const currentIsMobile = window.innerWidth < 768
      const count = currentIsMobile ? 25 : 80
      for (let i = 0; i < count; i++) {
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

      // Update positions
      particles.forEach((p) => {
        // --- INTERACCIÓN CON EL MOUSE ---
        const dxMouse = p.x - mouseRef.x
        const dyMouse = p.y - mouseRef.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

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
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const maxSpeed = particleSpeed * 2

        if (currentSpeed > maxSpeed) {
          p.vx *= 0.9
          p.vy *= 0.9
        } else if (currentSpeed > particleSpeed) {
          p.vx *= 0.98
          p.vy *= 0.98
        }

        // Rebote en bordes
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })

      // Optimization: Batch draw points to minimize state changes
      ctx.fillStyle = particleColor
      ctx.beginPath()
      particles.forEach((p) => {
        ctx.moveTo(p.x + p.size, p.y)
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      })
      ctx.fill()

      // Optimization: Set common styles once
      ctx.strokeStyle = particleColor
      ctx.lineWidth = 0.5

      // Draw lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          // Optimization: Use squared distance to avoid expensive Math.sqrt
          const distSq = dx * dx + dy * dy

          if (distSq < connectionDistanceSq) {
            const distance = Math.sqrt(distSq)
            const opacity = 1 - distance / connectionDistance

            ctx.beginPath()
            ctx.globalAlpha = opacity
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.globalAlpha = 1.0
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    // Inicialización
    resizeCanvas()
    createParticles()
    draw()

    // Event Listeners with Debounce
    let resizeTimeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        resizeCanvas()
        createParticles()
      }, 200) // Debounce resize by 200ms
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

    // Touch events for mobile interactivity
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.x = e.touches[0].clientX
        mouseRef.y = e.touches[0].clientY
        isMouseDownRef.current = true
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.x = e.touches[0].clientX
        mouseRef.y = e.touches[0].clientY
      }
    }
    const handleTouchEnd = () => {
      isMouseDownRef.current = false
      mouseRef.x = -1000
      mouseRef.y = -1000
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
      clearTimeout(resizeTimeout)
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
