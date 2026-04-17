import { useEffect } from 'react'

// Interpolates the .sn-body background-color from cool paper → warm paper as
// the user scrolls from top to bottom. Subtle — only a few RGB units shift.
const COOL = [244, 240, 230]  // #F4F0E6 — --paper
const WARM = [242, 236, 222]  // slightly warmer cream at the bottom

function lerp(a, b, t) { return Math.round(a + (b - a) * t) }

export default function useBgWarmth() {
  useEffect(() => {
    let raf
    let currentP = 0
    let targetP  = 0

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      targetP = max > 0 ? Math.min(1, window.scrollY / max) : 0
    }

    const tick = () => {
      // smooth lerp so the shift doesn't jump
      currentP += (targetP - currentP) * 0.04
      const r = lerp(COOL[0], WARM[0], currentP)
      const g = lerp(COOL[1], WARM[1], currentP)
      const b = lerp(COOL[2], WARM[2], currentP)
      const body = document.querySelector('.sn-body')
      if (body) body.style.backgroundColor = `rgb(${r},${g},${b})`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      const body = document.querySelector('.sn-body')
      if (body) body.style.backgroundColor = ''
    }
  }, [])
}
