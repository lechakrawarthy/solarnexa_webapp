import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useReveal() {
  const location = useLocation()

  useEffect(() => {
    // Re-query after each route change so newly mounted elements get observed
    const els = document.querySelectorAll('.reveal:not(.in)')
    if (!els.length) return

    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [location.pathname])
}
