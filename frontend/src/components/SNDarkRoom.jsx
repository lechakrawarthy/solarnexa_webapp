import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
  Dark Room — text is hidden by default.
  On desktop: cursor position drives a CSS mask-image radial-gradient
  that reveals the text exactly where the cursor sun sits.
  On mobile: scroll into view fades text in.
*/
export default function SNDarkRoom() {
  const sectionRef = useRef(null)
  const textRef    = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const text    = textRef.current
    if (!section || !text) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches

    if (isMobile) {
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.to(text, { opacity: 0.92, duration: 1.2, ease: 'power2.out' })
        },
      })
      return () => st.kill()
    }

    // Desktop: mask-image tracks cursor. Text starts fully hidden.
    // When cursor enters section, set cursor-active → mask kicks in.
    const onEnter = () => section.classList.add('cursor-active')
    const onLeave = () => section.classList.remove('cursor-active')

    const onMove = e => {
      const r = section.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(2)
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(2)
      section.style.setProperty('--mx', `${x}%`)
      section.style.setProperty('--my', `${y}%`)
    }

    section.addEventListener('mouseenter', onEnter)
    section.addEventListener('mouseleave', onLeave)
    section.addEventListener('mousemove',  onMove)

    return () => {
      section.removeEventListener('mouseenter', onEnter)
      section.removeEventListener('mouseleave', onLeave)
      section.removeEventListener('mousemove',  onMove)
    }
  }, [])

  return (
    <section ref={sectionRef} className="sn-darkroom" id="darkroom" aria-label="Mission statement">
      <div className="sn-darkroom__inner">
        <div className="sn-darkroom__label">— ILLUMINATE</div>
        <p ref={textRef} className="sn-darkroom__text">
          Urban India is running out of flat land for solar. EV adoption is{' '}
          <em>accelerating</em> — with nowhere clean to charge. SolarNexa builds
          at that intersection: infrastructure that municipalities want, developers
          need, and commuters use every day.
        </p>
      </div>
    </section>
  )
}
