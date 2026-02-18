import { useEffect } from 'react'

export function useScrollReveal(selector = '.reveal', options = {}) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add('is-visible')
        }
      },
      { threshold: 0.12, ...options }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [selector])
}
