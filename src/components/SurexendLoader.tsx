'use client'

/**
 * SureXend Logo Loading Animation
 * ================================
 * Cinematic 5-phase animation:
 * Phase 1 (0–0.8s):   Logo assembles + text types in
 * Phase 2 (0.8–1.4s): Paper plane detaches from X base
 * Phase 3 (1.4–3.5s): Plane orbits in figure-8 with particle trail
 * Phase 4 (3.5–4.2s): Plane reattaches with light burst
 * Phase 5 (4.2–5s):   Idle breathing glow loop
 *
 * Built with Framer Motion — no external Lottie file needed.
 * Accepts `variant` prop: 'gold' | 'lemon'
 * Accepts `size` prop: number (px) for the container
 * Accepts `fullScreen` prop: renders as full-screen loading overlay
 */

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

// ── Particle component ─────────────────────────────────────────────────────
interface ParticleProps {
  x: number
  y: number
  color: string
  size: number
  delay: number
}

function Particle({ x, y, color, size, delay }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        y: [0, -20, -40],
        x: [0, (Math.random() - 0.5) * 30],
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 3.4,
      }}
    />
  )
}

// ── Micro icon that appears along trail ────────────────────────────────────
function MicroIcon({ icon, delay, x, y, color }: { icon: string; delay: number; x: number; y: number; color: string }) {
  return (
    <motion.div
      className="absolute text-lg pointer-events-none select-none"
      style={{ left: x, top: y, filter: `drop-shadow(0 0 6px ${color})` }}
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0],
        rotate: [-20, 0, 0, 20],
      }}
      transition={{
        duration: 0.7,
        delay,
        repeat: Infinity,
        repeatDelay: 4.2 - 0.7,
      }}
    >
      {icon}
    </motion.div>
  )
}

// ── Main Logo SVG (static representation) ─────────────────────────────────
function LogoIcon({ color, size }: { color: string; size: number }) {
  const s = size * 0.45 // icon takes 45% of container
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    >
      {/* X base (lower two legs) */}
      <motion.path
        d="M20 95 L50 60 L30 95 Z"
        fill="#0D0D0D"
        stroke={color}
        strokeWidth="1.5"
      />
      <motion.path
        d="M100 95 L70 60 L90 95 Z"
        fill="#0D0D0D"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Paper plane (upper part — the part that detaches) */}
      <motion.path
        d="M20 10 L100 55 L60 60 L20 10 Z"
        fill="#0D0D0D"
        stroke={color}
        strokeWidth="1.5"
      />
      <motion.path
        d="M60 60 L75 80 L55 65 Z"
        fill="#0D0D0D"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Center X crossing line */}
      <motion.line
        x1="40"
        y1="55"
        x2="80"
        y2="85"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.7"
      />
    </svg>
  )
}

// ── Flying plane SVG (the detached element) ────────────────────────────────
function FlyingPlane({ color, size }: { color: string; size: number }) {
  const s = size * 0.18
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 5 L55 20 L30 22 L0 5 Z"
        fill="#0D0D0D"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M30 22 L38 35 L25 26 Z"
        fill="#0D0D0D"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M18 20 L35 30"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  )
}

// ── Shimmer sweep overlay ──────────────────────────────────────────────────
function ShimmerSweep({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-[22%] pointer-events-none overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${color} 50%, transparent 60%)`,
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-200% center', '300% center'] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: 'linear' }}
      />
    </motion.div>
  )
}

// ── Light rays from center ─────────────────────────────────────────────────
function LightRays({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.div
          key={angle}
          className="absolute"
          style={{
            width: 2,
            height: '35%',
            background: `linear-gradient(to top, transparent, ${color})`,
            transformOrigin: 'bottom center',
            transform: `rotate(${angle}deg) translateY(-100%)`,
            opacity: 0,
          }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  )
}

// ── Orbit trail dots ───────────────────────────────────────────────────────
function OrbitTrail({ color, cx, cy, radius }: { color: string; cx: number; cy: number; radius: number }) {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius * 0.5
        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: x - 2,
              top: y - 2,
              width: 4,
              height: 4,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{
              duration: 4.2,
              delay: (i / 8) * 4.2,
              repeat: Infinity,
            }}
          />
        )
      })}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════

interface SurexendLoaderProps {
  variant?: 'gold' | 'lemon'
  size?: number
  fullScreen?: boolean
  onAnimationComplete?: () => void
}

export default function SurexendLoader({
  variant,
  size = 220,
  fullScreen = false,
  onAnimationComplete,
}: SurexendLoaderProps) {
  const { variant: contextVariant, colors: contextColors } = useTheme()
  const activeVariant = variant || contextVariant

  const colors = activeVariant === 'gold'
    ? {
        primary: '#D4A017',
        light: '#FFD700',
        glow: '#FFE066',
        glowRgb: '212, 160, 23',
        gradientBg: 'radial-gradient(ellipse at 40% 40%, #E8C030 0%, #C49015 45%, #8A6010 100%)',
        shimmer: 'rgba(255, 230, 100, 0.35)',
        particle: '#FFD700',
        text: '#1A1200',
        xHighlight: '#D4A017',
      }
    : {
        primary: '#B5E23D',
        light: '#D4FF4A',
        glow: '#CAFF3A',
        glowRgb: '181, 226, 61',
        gradientBg: 'radial-gradient(ellipse at 40% 40%, #D0F060 0%, #A8D428 45%, #78A010 100%)',
        shimmer: 'rgba(212, 255, 74, 0.35)',
        particle: '#D4FF4A',
        text: '#0A1A00',
        xHighlight: '#B5E23D',
      }

  // Phase states
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [showPlane, setShowPlane] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const [particles, setParticles] = useState<ParticleProps[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Letter-by-letter text for "SUREXEND"
  const LETTERS = ['S','U','R','E','X','E','N','D']

  // Generate particles along orbit
  useEffect(() => {
    const ps: ParticleProps[] = Array.from({ length: 12 }, (_, i) => ({
      x: size * 0.2 + Math.random() * size * 0.6,
      y: size * 0.15 + Math.random() * size * 0.5,
      color: colors.particle,
      size: 3 + Math.random() * 4,
      delay: i * 0.35,
    }))
    setParticles(ps)
  }, [size, colors.particle])

  // Phase sequencer
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 800)
    const t2 = setTimeout(() => { setPhase(3); setShowPlane(true) }, 1400)
    const t3 = setTimeout(() => { setPhase(4); setShowBurst(true) }, 3500)
    const t4 = setTimeout(() => { setPhase(5); setShowBurst(false) }, 4200)
    const t5 = setTimeout(() => {
      setPhase(1)
      setShowPlane(false)
      // re-trigger loop
    }, 5000)
    return () => { [t1,t2,t3,t4,t5].forEach(clearTimeout) }
  }, [])

  // ── Plane orbit path (figure-8 via keyframes) ──────────────────────────
  const planeVariants: Variants = {
    hidden: { opacity: 0, x: 0, y: 0, rotate: 0, scale: 0 },
    detach: {
      opacity: 1,
      x: [0, 20, 30],
      y: [0, -10, -20],
      rotate: [0, -10, -20],
      scale: [0, 1, 1],
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    orbit: {
      x: [30, 80, 30, -80, -30, 30],
      y: [-20, -60, -90, -60, -20, -20],
      rotate: [-20, 10, 0, -10, -30, -20],
      scale: 1,
      opacity: 1,
      transition: {
        duration: 2.1,
        ease: 'easeInOut',
        repeat: Infinity,
        times: [0, 0.25, 0.5, 0.75, 0.9, 1],
      },
    },
    reattach: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: [1, 1.3, 0],
      opacity: [1, 1, 0],
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  // ── Light burst on reattach ────────────────────────────────────────────
  const burstVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    show: {
      scale: [0, 1.5, 2.5],
      opacity: [0.8, 0.4, 0],
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  }

  // ── Container animation ────────────────────────────────────────────────
  const containerAnim = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const cx = size / 2
  const cy = size * 0.42

  const inner = (
    <motion.div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center select-none"
      style={{
        width: size,
        height: size,
        borderRadius: '22%',
        background: colors.gradientBg,
        boxShadow: `0 0 60px rgba(${colors.glowRgb}, 0.5), 0 0 120px rgba(${colors.glowRgb}, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)`,
        overflow: 'hidden',
      }}
      initial="initial"
      animate="animate"
      variants={containerAnim}
    >
      {/* Radial vignette that breathes */}
      <motion.div
        className="absolute inset-0 rounded-[22%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Light rays */}
      <LightRays color={colors.glow} />

      {/* Shimmer sweep */}
      <ShimmerSweep color={colors.shimmer} />

      {/* Orbit trail dots (visible in phase 3) */}
      {phase === 3 && (
        <OrbitTrail color={colors.particle} cx={cx} cy={cy} radius={size * 0.3} />
      )}

      {/* Particles (phase 3) */}
      {phase === 3 && particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Micro icons along trail */}
      {phase === 3 && (
        <>
          <MicroIcon icon="✓" delay={0.5} x={cx + 55} y={cy - 55} color={colors.glow} />
          <MicroIcon icon="⚡" delay={1.2} x={cx - 65} y={cy - 50} color={colors.glow} />
          <MicroIcon icon="✈" delay={1.9} x={cx + 20} y={cy - 85} color={colors.glow} />
        </>
      )}

      {/* Static logo icon (X base stays) */}
      <motion.div
        className="relative"
        style={{ marginTop: -size * 0.04 }}
        animate={
          phase === 5
            ? { filter: [`drop-shadow(0 0 6px ${colors.glow})`, `drop-shadow(0 0 16px ${colors.glow})`, `drop-shadow(0 0 6px ${colors.glow})`] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <LogoIcon color={colors.primary} size={size} />
      </motion.div>

      {/* Flying plane (phases 2–4) */}
      <AnimatePresence>
        {showPlane && (
          <motion.div
            className="absolute"
            style={{ left: cx - size * 0.09, top: cy - size * 0.22, zIndex: 20 }}
            variants={planeVariants}
            initial="hidden"
            animate={phase === 2 ? 'detach' : phase === 3 ? 'orbit' : 'reattach'}
            exit={{ opacity: 0 }}
          >
            {/* Motion blur trail */}
            <motion.div
              className="absolute"
              style={{
                right: '100%',
                top: '50%',
                height: 2,
                background: `linear-gradient(to left, ${colors.particle}, transparent)`,
                transformOrigin: 'right center',
              }}
              animate={{ width: [0, size * 0.3, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, ease: 'easeOut' }}
            />
            <FlyingPlane color={colors.primary} size={size} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Light burst on reattach (phase 4) */}
      <AnimatePresence>
        {showBurst && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: '50%',
              top: '42%',
              transform: 'translate(-50%, -50%)',
              width: size * 0.8,
              height: size * 0.8,
              background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
            }}
            variants={burstVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* SUREXEND wordmark — types in letter by letter */}
      <div
        className="absolute flex items-center justify-center"
        style={{ bottom: size * 0.1, left: 0, right: 0 }}
      >
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            className="font-inter font-bold tracking-widest"
            style={{
              fontSize: size * 0.095,
              color: letter === 'X' ? colors.primary : '#1A1A1A',
              textShadow: letter === 'X'
                ? `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}`
                : 'none',
              lineHeight: 1,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.05 + i * 0.08,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Text shine sweep over wordmark (phase 5) */}
      {phase === 5 && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            bottom: size * 0.08,
            left: '10%',
            right: '10%',
            height: size * 0.13,
            background: `linear-gradient(90deg, transparent 0%, ${colors.shimmer} 50%, transparent 100%)`,
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['-200% center', '300% center'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        />
      )}

      {/* Breathing border glow */}
      <motion.div
        className="absolute inset-0 rounded-[22%] pointer-events-none"
        style={{ border: `2px solid ${colors.primary}`, opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        style={{ backgroundColor: '#0A0F1E' }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Background ambient glow matching variant */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(${colors.glowRgb}, 0.08), transparent)`,
          }}
        />
        {inner}
        <motion.p
          className="mt-6 text-sm tracking-[0.3em] uppercase font-dm"
          style={{ color: `rgba(${colors.glowRgb}, 0.7)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading...
        </motion.p>
      </motion.div>
    )
  }

  return inner
}
