import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
  Architectural line-draw SolarTree SVG.
  Branches draw themselves (stroke-dashoffset) as section scrolls in.
  Plasma (#E07A1A) traces fire after the base structure is drawn.
*/

const TRUNK = 'M 120 420 L 120 260'
const BRANCHES = [
  // main structural branches
  'M 120 320 C 120 280 60 220 30 180',
  'M 120 300 C 120 260 80 210 55 175',
  'M 120 310 C 120 270 170 210 195 170',
  'M 120 290 C 120 250 155 200 185 155',
  // secondary branches left
  'M 60 200 C 50 185 35 165 25 145',
  'M 55 185 C 45 170 35 155 30 135',
  // secondary branches right
  'M 185 175 C 195 160 208 138 215 118',
  'M 185 160 C 195 145 210 128 218 108',
  // small tips
  'M 30 150 C 22 138 18 125 15 112',
  'M 215 125 C 220 112 224 98 226 85',
  'M 25 145 C 18 132 12 118 10 105',
  'M 218 110 C 222 96 228 82 230 68',
  // solar panel silhouettes — rectangles as short strokes
  'M 18 112 L 5 100',
  'M 10 105 L -2 92',
  'M 220 85 L 232 72',
  'M 224 68 L 236 55',
  // roots (base)
  'M 120 400 C 110 420 80 430 60 440',
  'M 120 405 C 115 425 100 440 90 450',
  'M 120 400 C 130 420 160 430 180 440',
  'M 120 408 C 128 428 148 442 162 452',
]

// Which branches get plasma-colored energy traces (subset)
const PLASMA_INDICES = [0, 2, 5, 7, 10, 12, 14]

export default function SNTreeSVG() {
  const svgRef    = useRef(null)
  const linesRef  = useRef([])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = linesRef.current.filter(Boolean)
    if (!paths.length) return

    // initialise all paths hidden
    paths.forEach(p => {
      const len = p.getTotalLength ? p.getTotalLength() : 200
      p.style.strokeDasharray  = len
      p.style.strokeDashoffset = len
    })

    // Stagger draw on scroll — trunk first, then branches outward
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: 'top 80%',
        end: 'bottom 30%',
        scrub: 1.5,
      },
    })

    // Trunk draws first
    tl.to(paths[0], { strokeDashoffset: 0, ease: 'none', duration: 0.12 }, 0)

    // Branches stagger in pairs
    paths.slice(1).forEach((p, i) => {
      tl.to(p, { strokeDashoffset: 0, ease: 'none', duration: 0.06 }, 0.1 + i * 0.025)
    })

    return () => { tl.kill() }
  }, [])

  // collect trunk + branches in order
  const ALL_PATHS = [TRUNK, ...BRANCHES]

  return (
    <svg
      ref={svgRef}
      className="sn-tree-svg"
      viewBox="0 -10 240 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SolarTree architectural diagram"
      aria-hidden="true"
    >
      {ALL_PATHS.map((d, i) => {
        const isPlasma = PLASMA_INDICES.includes(i)
        const isTrunk  = i === 0
        return (
          <path
            key={i}
            ref={el => { linesRef.current[i] = el }}
            d={d}
            stroke={isPlasma ? 'var(--plasma)' : isTrunk ? 'var(--ink)' : 'var(--ink-30)'}
            strokeWidth={isTrunk ? 3 : isPlasma ? 1.5 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={isTrunk ? 1 : isPlasma ? 0.9 : 0.55}
          />
        )
      })}

      {/* Panel nodes — small circles at branch tips */}
      {[
        [18, 112], [10, 105], [5, 100], [-2, 92],
        [220, 85], [224, 68], [232, 72], [236, 55],
      ].map(([cx, cy], i) => (
        <circle
          key={`node-${i}`}
          cx={cx} cy={cy} r={3}
          fill="var(--plasma)"
          opacity={0.7}
        />
      ))}

      {/* L2 port callout at base */}
      <g opacity={0.45}>
        <rect x={90} y={395} width={60} height={14} rx={3} stroke="var(--ink-30)" strokeWidth={0.8} />
        <text x={120} y={405} textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="var(--ink-50)">L2 · 7.4 kW</text>
      </g>
    </svg>
  )
}
