import React, { useMemo, useRef } from 'react'

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const supportsHover = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia && window.matchMedia('(hover: hover)').matches
  }, [])

  const onMove = (e) => {
    if (!supportsHover) return
    const el = ref.current
    if (!el) return

    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height

    const rotY = (px - 0.5) * 10
    const rotX = -(py - 0.5) * 10

    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`glass rounded-2xl shadow-glow transition-transform duration-200 will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
