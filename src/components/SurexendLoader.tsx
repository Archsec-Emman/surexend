'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

interface SurexendLoaderProps {
  variant?: 'gold' | 'lemon'
  duration?: number
  onLoadingComplete?: () => void
  isLoading?: boolean
  size?: number
  fullScreen?: boolean
}

/**
 * Stylized paper-plane emblem — the folded-dart artwork used on the
 * SureXend logo tiles (gold & lemon variants). Kept monochrome with a
 * thin accent bevel so it reads on either brand gradient.
 */
function PlaneEmblem({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs>
        <filter id="surexend-plane-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#surexend-plane-shadow)">
        {/* top wing */}
        <polygon points="108,60 36,20 64,60" fill="#0D0D0D" />
        {/* bottom wing */}
        <polygon points="108,60 36,100 64,60" fill="#0D0D0D" />
        {/* central keel / fold */}
        <polygon points="64,60 36,20 12,60 36,100" fill="#1B1B21" />
        {/* folded-paper bevel highlights */}
        <path d="M64 60 L36 20" stroke={accent} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M64 60 L36 100" stroke={accent} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M64 60 L12 60" stroke={accent} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.85" />
      </g>
    </svg>
  )
}

export default function SurexendLoader({
  variant: propVariant,
  duration = 5000,
  onLoadingComplete,
  isLoading = true,
  size = 360,
  fullScreen = true,
}: SurexendLoaderProps) {
  const { variant: contextVariant } = useTheme()
  const activeVariant = propVariant || contextVariant || 'lemon'
  const isGold = activeVariant === 'gold'
  const [visible, setVisible] = useState(true)

  // Brand theme profiles — the screen mirrors each logo tile's gradient
  const theme = isGold
    ? {
        screenBg:
          'radial-gradient(130% 130% at 50% 40%, #F7D05C 0%, #D4A017 40%, #9E7408 78%, #6E5206 100%)',
        glowRgb: '255, 224, 102',
        accent: '#FFE066',
        logoImg: '/logo-gold.png',
        orbA: 'rgba(255, 255, 255, 0.55)',
        orbB: 'rgba(122, 87, 6, 0.35)',
      }
    : {
        screenBg:
          'radial-gradient(130% 130% at 50% 40%, #DDF578 0%, #B5E23D 40%, #8AB52A 78%, #5F7E15 100%)',
        glowRgb: '212, 255, 74',
        accent: '#F1FFB0',
        logoImg: '/logo-lemon.png',
        orbA: 'rgba(255, 255, 255, 0.55)',
        orbB: 'rgba(95, 126, 21, 0.35)',
      }

  useEffect(() => {
    if (!isLoading) {
      setVisible(false)
      onLoadingComplete?.()
      return
    }
    const timer = setTimeout(() => {
      setVisible(false)
      onLoadingComplete?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [isLoading, duration, onLoadingComplete])

  // ── Geometry: logo size drives the whole composition ───────────────────
  const logoSize = size
  const orbitR = Math.round(size * 0.95) // orbit radius around the logo
  const planeSize = Math.round(size * 0.26) // flying plane size
  const stageSize = Math.round(orbitR * 2 + planeSize + 28)
  const ringSize = orbitR * 2 + planeSize

  // Smooth circular flight path (clockwise, starting at the top)
  const orbitPath =
    `M 0 ${-orbitR}` +
    ` C ${Math.round(orbitR * 0.6)} ${-orbitR} ${orbitR} ${-Math.round(orbitR * 0.6)} ${orbitR} 0` +
    ` C ${orbitR} ${Math.round(orbitR * 0.6)} ${Math.round(orbitR * 0.6)} ${orbitR} 0 ${orbitR}` +
    ` C ${-Math.round(orbitR * 0.6)} ${orbitR} ${-orbitR} ${Math.round(orbitR * 0.6)} ${-orbitR} 0` +
    ` C ${-orbitR} ${-Math.round(orbitR * 0.6)} ${-Math.round(orbitR * 0.6)} ${-orbitR} 0 ${-orbitR} Z`

  // Twinkling sparkles scattered around the flight ring
  const sparkles = [
    { angle: 30, d: 5, c: '#0D0D0D', o: 0.5 },
    { angle: 95, d: 3.5, c: '#FFFFFF', o: 0.8 },
    { angle: 160, d: 6, c: '#0D0D0D', o: 0.45 },
    { angle: 215, d: 4, c: '#FFFFFF', o: 0.75 },
    { angle: 275, d: 5.5, c: '#0D0D0D', o: 0.5 },
    { angle: 330, d: 3.5, c: '#FFFFFF', o: 0.8 },
  ].map(s => {
    const rad = (s.angle * Math.PI) / 180
    return {
      ...s,
      x: Math.cos(rad) * (orbitR + 28) - s.d / 2,
      y: Math.sin(rad) * (orbitR + 28) - s.d / 2,
    }
  })

  const loaderElement = (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* ── Stage: logo + orbiting plane ─────────────────────────────── */}
      <div className="relative flex items-center justify-center" style={{ width: stageSize, height: stageSize }}>
        {/* Pulsing glow behind the logo (free-floating, no card box) */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: logoSize * 1.9,
            height: logoSize * 1.9,
            background: `radial-gradient(circle, rgba(${theme.glowRgb}, 0.55) 0%, transparent 65%)`,
            filter: 'blur(22px)',
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Dashed orbit trail */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: ringSize, height: ringSize }}
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={orbitR}
            fill="none"
            stroke="rgba(13, 13, 13, 0.30)"
            strokeWidth="2"
            strokeDasharray="3 14"
            strokeLinecap="round"
            className="loader-trail"
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={orbitR + 18}
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
        </svg>

        {/* The plane flying around the logo */}
        <div
          className="absolute left-1/2 top-1/2 loader-plane"
          style={{
            width: planeSize,
            height: planeSize,
            marginLeft: -planeSize / 2,
            marginTop: -planeSize / 2,
            offsetPath: `path('${orbitPath}')`,
            offsetRotate: 'auto',
          }}
        >
          <div className="w-full h-full loader-plane-bob">
            <PlaneEmblem accent={theme.accent} />
          </div>
        </div>

        {/* Twinkling sparkles */}
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: s.d,
              height: s.d,
              left: '50%',
              top: '50%',
              marginLeft: s.x,
              marginTop: s.y,
              backgroundColor: s.c,
              opacity: s.o,
              boxShadow: `0 0 8px ${s.c}`,
            }}
            animate={{ scale: [1, 1.7, 1], opacity: [s.o, 1, s.o] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          />
        ))}

        {/* Official high-res logo image — floating free, no box */}
        <motion.div
          className="relative z-10"
          animate={{ y: [0, -10, 0], scale: [1, 1.015, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={theme.logoImg}
            alt="SureXend Logo"
            width={logoSize}
            height={logoSize}
            className="rounded-[22%]"
            style={{
              boxShadow:
                '0 24px 50px rgba(0,0,0,0.22), 0 0 0 5px rgba(255,255,255,0.10), 0 0 60px rgba(255,255,255,0.20)',
            }}
          />
        </motion.div>
      </div>

      {/* ── Loading label + dots + progress bar ──────────────────────── */}
      <div className="relative mt-8 flex flex-col items-center gap-4 z-10">
        <div className="flex items-center gap-2.5">
          <span
            className="text-[11px] font-extrabold tracking-[0.42em] uppercase"
            style={{ color: 'rgba(13, 13, 13, 0.85)' }}
          >
            Loading
          </span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(13, 13, 13, 0.85)' }}
                animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 0.9, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        <div
          className="overflow-hidden rounded-full"
          style={{ width: Math.min(logoSize, 260), height: 3, background: 'rgba(13, 13, 13, 0.14)' }}
        >
          <motion.div
            className="h-full rounded-full origin-left"
            style={{ background: 'rgba(13, 13, 13, 0.85)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: Math.min(duration, 3200) / 1000, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  )

  if (!fullScreen) return loaderElement

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: theme.screenBg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Faint dark dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.16]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.2' fill='%23000000'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Soft edge depth — warm, not black */}
          <div className="absolute inset-0 pointer-events-none bg-radial-vignette" />

          {/* Floating ambient glows */}
          <motion.div
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{ width: 420, height: 420, top: '8%', left: '-8%', background: theme.orbA }}
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{ width: 380, height: 380, bottom: '6%', right: '-6%', background: theme.orbB }}
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />

          {/* Responsive scale so the orbit fits small phones */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="origin-center scale-[0.58] xs:scale-[0.72] sm:scale-100">
              {loaderElement}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
