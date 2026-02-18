import React, { useEffect, useRef } from 'react'

function rand(min, max) {
  return Math.random() * (max - min) + min
}

export default function Particles({ count = 70 }) {
  const ref = useRef(null)
  const rafRef = useRef(0)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(canvas.clientWidth * dpr)
      canvas.height = Math.floor(canvas.clientHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      particlesRef.current = Array.from({ length: count }).map(() => ({
        x: rand(0, canvas.clientWidth),
        y: rand(0, canvas.clientHeight),
        r: rand(0.6, 2.2),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.18, 0.18),
        a: rand(0.08, 0.22),
      }))
    }

    const step = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      // soft vignette
      const g = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.2, Math.max(w, h))
      g.addColorStop(0, 'rgba(255,255,255,0.03)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      const p = particlesRef.current
      for (let i = 0; i < p.length; i++) {
        const s = p[i]
        s.x += s.vx
        s.y += s.vy

        if (s.x < -10) s.x = w + 10
        if (s.x > w + 10) s.x = -10
        if (s.y < -10) s.y = h + 10
        if (s.y > h + 10) s.y = -10

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.a})`
        ctx.fill()
      }

      // connect nearby
      for (let i = 0; i < p.length; i++) {
        for (let j = i + 1; j < p.length; j++) {
          const dx = p[i].x - p[j].x
          const dy = p[i].y - p[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < 140 * 140) {
            const a = 0.08 * (1 - d2 / (140 * 140))
            ctx.strokeStyle = `rgba(124,58,237,${a})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p[i].x, p[i].y)
            ctx.lineTo(p[j].x, p[j].y)
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    const onResize = () => {
      resize()
      init()
    }

    resize()
    init()
    rafRef.current = requestAnimationFrame(step)

    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [count])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full opacity-70"
      style={{ pointerEvents: 'none' }}
    />
  )
}
