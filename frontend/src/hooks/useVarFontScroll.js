import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useVarFontScroll
 * Finds all .sn-section-title em and .sn-hero__title em elements.
 * On scroll entry, animates font-variation-settings wght 200 → 700.
 * This is the signature typographic scroll detail from the HTML experiment.
 */
export default function useVarFontScroll() {
  useEffect(() => {
    // Small delay to let DOM settle after React render
    const timeout = setTimeout(() => {
      const targets = document.querySelectorAll(
        '.sn-section-title em, .sn-mission__title em, .sn-cta__title em, .sn-hero__title em'
      )

      const triggers = []

      targets.forEach((el) => {
        // Set starting state
        gsap.set(el, { fontVariationSettings: '"opsz" 9, "wght" 200' })

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              fontVariationSettings: '"opsz" 9, "wght" 700',
              duration: 1.1,
              ease: 'power3.out',
            })
          },
        })
        triggers.push(st)
      })

      return () => triggers.forEach((t) => t.kill())
    }, 300)

    return () => clearTimeout(timeout)
  }, [])
}
