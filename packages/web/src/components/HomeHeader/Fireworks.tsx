import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  radius: number
}

interface FireworksProps {
  x: number
  y: number
  onComplete: () => void
}

const COLORS = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#f59e0b',
  '#4ecdc4',
  '#ff6b6b',
  '#ffd700',
  '#00d2ff',
]

function createBurst(cx: number, cy: number, count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
    const speed = 1.5 + Math.random() * 5
    return {
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      radius: 2 + Math.random() * 2.5,
    }
  })
}

const Fireworks: React.FC<FireworksProps> = ({ x, y, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = createBurst(x, y, 60)
    let pendingBursts = 2
    let animId: number

    const t1 = setTimeout(() => {
      particles.push(
        ...createBurst(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 20, 40),
      )
      pendingBursts--
    }, 150)

    const t2 = setTimeout(() => {
      particles.push(
        ...createBurst(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 20, 40),
      )
      pendingBursts--
    }, 300)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false
      for (const p of particles) {
        if (p.alpha <= 0) continue
        alive = true

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08
        p.vx *= 0.99
        p.alpha -= 0.015

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      if (alive || pendingBursts > 0) {
        animId = requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [x, y, onComplete])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}

export default Fireworks
