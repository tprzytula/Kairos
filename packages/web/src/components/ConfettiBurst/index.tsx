import { useEffect, useRef } from 'react'
import { ConfettiBurstProps } from './types'

const PARTICLE_COUNT = 40
const DURATION_MS = 1500
const COLORS = ['#6366f1', '#7c3aed', '#a78bfa', '#c084fc', '#818cf8', '#f59e0b']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
  isCircle: boolean
}

const createParticles = (centerX: number, centerY: number): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, () => ({
    x: centerX,
    y: centerY,
    vx: (Math.random() - 0.5) * 8,
    vy: -(Math.random() * 6 + 4),
    size: Math.random() * 4 + 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    opacity: 1,
    isCircle: Math.random() > 0.5,
  }))

const ConfettiBurst = ({ trigger, anchorRef }: ConfettiBurstProps): null => {
  const prevTriggerRef = useRef(false)
  const rafRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!trigger || prevTriggerRef.current || !anchorRef.current) {
      prevTriggerRef.current = trigger
      return
    }
    prevTriggerRef.current = trigger

    const rect = anchorRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '9999'
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return () => {
        if (canvasRef.current) {
          canvasRef.current.remove()
          canvasRef.current = null
        }
      }
    }

    const particles = createParticles(centerX, centerY)
    const startTime = performance.now()

    const animate = (now: number): void => {
      const elapsed = now - startTime
      if (elapsed > DURATION_MS) {
        canvas.remove()
        canvasRef.current = null
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.vy += 0.15
        p.y += p.vy
        p.rotation += p.rotationSpeed
        if (elapsed > DURATION_MS * 0.6) {
          p.opacity = Math.max(0, 1 - (elapsed - DURATION_MS * 0.6) / (DURATION_MS * 0.4))
        }

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color

        if (p.isCircle) {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        }

        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (canvasRef.current) {
        canvasRef.current.remove()
        canvasRef.current = null
      }
    }
  }, [trigger, anchorRef])

  return null
}

export default ConfettiBurst
