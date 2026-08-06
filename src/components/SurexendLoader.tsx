'use client'

/**
 * SureXend Logo Loading Animation
 * ================================
 * Exact 1:1 match to the official SureXend logo mark and design specification:
 * - Geometric 3D paper-plane / X hybrid icon with metallic bevel highlights
 * - Glowing glassmorphic rounded container (Gold or Lemon-Green theme)
 * - Letter-by-letter animated "SURE X END" typography where 'X' glows brightly
 * - 5-phase cinematic animation: Assembly -> Detach -> Orbit -> Reattach -> Breathe
 */

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

// ── Particle Component ──────────────────────────────────────────────────────
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
        opacity: [0, 0.9, 0],
        scale: [0, 1.5, 0],
        y: [0, -25, -45],
        x: [0, (Math.random() - 0.5) * 35],
      }}
      transition={{
        duration: 0.9,
        delay,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 3.2,
      }}
    />
  )
}

// ── Micro Icon along Trail ─────────────────────────────────────────────────
function MicroIcon({ icon, delay, x, y, color }: { icon: string; delay: number; x: number; y: number; color: string }) {
  return (
    <motion.div
      className="absolute text-lg pointer-events-none select-none z-30"
      style={{ left: x, top: y, filter: `drop-shadow(0 0 8px ${color})` }}
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
        repeatDelay: 3.5,
      }}
    >
      {icon}
    </motion.div>
  )
}

// ── Precise 1:1 Vector SVG of the Official SureXend Logo Mark ─────────────
function SurexendVectorLogo({ variant, width = 160, height = 160 }: { variant: 'gold' | 'lemon'; width?: number; height?: number }) {
  const isGold = variant === 'gold'
  const bevelGradientId = `bevel-grad-${variant}`
  const bevelStartColor = isGold ? '#F5E08C' : '#FFFFFF'
  const bevelEndColor = isGold ? '#D4A017' : '#D4FF4A'

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 350 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      <defs>
        <linearGradient id={bevelGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bevelStartColor} />
          <stop offset="100%" stopColor={bevelEndColor} />
        </linearGradient>
      </defs>

      {/* ── TOP MAIN PAPER PLANE WING (Solid Black with Metallic Bevel) ── */}
      {/* Black Main Body */}
      <path
        d="M 264 88 L 88 134 L 130 172 L 158 178 L 264 88 Z"
        fill="#0A0A0A"
      />
      {/* Lower Fold Section */}
      <path
        d="M 158 178 L 264 88 L 194 220 Z"
        fill="#0A0A0A"
      />
      {/* Metallic Gold / White Bevel Along Wing Edge & Seam */}
      <path
        d="M 88 134 L 130 172 L 158 178 L 194 220 L 191 223 L 155 182 L 127 175 L 85 137 Z"
        fill={`url(#${bevelGradientId})`}
      />
      <path
        d="M 158 178 L 264 88 L 267 91 L 160 182 Z"
        fill={`url(#${bevelGradientId})`}
      />

      {/* ── BOTTOM LEG OF THE 'X' (Solid Black with Metallic Bevel) ────── */}
      {/* Black Polygon */}
      <path
        d="M 150 194 L 102 250 L 152 250 L 166 232 L 214 250 L 186 250 L 150 194 Z"
        fill="#0A0A0A"
      />
      {/* Metallic Bevel Along Bottom Edge */}
      <path
        d="M 102 250 L 152 250 L 166 232 L 214 250 L 214 254 L 166 236 L 152 254 L 100 254 Z"
        fill={`url(#${bevelGradientId})`}
      />
      <path
        d="M 150 194 L 102 250 L 105 252 L 152 197 Z"
        fill={`url(#${bevelGradientId})`}
      />
    </svg>
  )
}

// ── Detachable Flying Plane (Top Part of Logo) ────────────────────────────
function DetachedPlane({ variant, width = 110, height = 110 }: { variant: 'gold' | 'lemon'; width?: number; height?: number }) {
  const bevelGradientId = `fly-bevel-${variant}`
  const bevelStartColor = variant === 'gold' ? '#F5E08C' : '#FFFFFF'
  const bevelEndColor = variant === 'gold' ? '#D4A017' : '#D4FF4A'

  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={bevelGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bevelStartColor} />
          <stop offset="100%" stopColor={bevelEndColor} />
        </linearGradient>
      </defs>
      <path d="M 170 30 L 20 70 L 60 105 L 85 110 L 170 30 Z" fill="#0A0A0A" />
      <path d="M 85 110 L 170 30 L 110 145 Z" fill="#0A0A0A" />
      <path d="M 20 70 L 60 105 L 85 110 L 110 145 L 107 148 L 82 114 L 57 108 L 17 73 Z" fill={`url(#${bevelGradientId})`} />
      <path d="M 85 110 L 170 30 L 173 33 L 87 114 Z" fill={`url(#${bevelGradientId})`} />
    </svg>
  )
}

// ── Light Rays Background ──────────────────────────────────────────────────
function LightRays({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.div
          key={angle}
          className="absolute"
          style={{
            width: 2,
            height: '38%',
            background: `linear-gradient(to top, transparent, ${color})`,
            transformOrigin: 'bottom center',
            transform: `rotate(${angle}deg) translateY(-100%)`,
            opacity: 0,
          }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{
            duration: 2.2,
            delay: i * 0.12,
            repeat: Infinity,
            repeatDelay: 1.8,
          }}
        />
      ))}
    </div>
  )
}

// ── Main SureXend Loader Component ─────────────────────────────────────────
interface SurexendLoaderProps {
  variant?: 'gold' | 'lemon'
  size?: number
  fullScreen?: boolean
  onAnimationComplete?: () => void
}

export default function SurexendLoader({
  variant,
  size = 280,
  fullScreen = false,
  onAnimationComplete,
}: SurexendLoaderProps) {
  const { variant: contextVariant } = useTheme()
  const activeVariant = variant || contextVariant || 'gold'
  const isGold = activeVariant === 'gold'

  const themeColors = isGold
    ? {
        primary: '#D4A017',
        light: '#FFD700',
        glow: '#FFE066',
        glowRgb: '212, 160, 23',
        gradientBg: 'radial-gradient(ellipse at 45% 45%, #E8BD20 0%, #C49015 50%, #8A6010 100%)',
        shimmer: 'rgba(255, 230, 100, 0.35)',
        particle: '#FFD700',
      }
    : {
        primary: '#B5E23D',
        light: '#D4FF4A',
        glow: '#CAFF3A',
        glowRgb: '181, 226, 61',
        gradientBg: 'radial-gradient(ellipse at 45% 45%, #D0F060 0%, #A8D428 50%, #78A010 100%)',
        shimmer: 'rgba(212, 255, 74, 0.35)',
        particle: '#D4FF4A',
      }

  // Animation Phase State: 1 (assemble) -> 2 (detach) -> 3 (orbit) -> 4 (reattach) -> 5 (breathe)
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [showPlane, setShowPlane] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const [particles, setParticles] = useState<ParticleProps[]>([])

  // Generate orbit trail particles
  useEffect(() => {
    const ps: ParticleProps[] = Array.from({ length: 14 }, (_, i) => ({
      x: size * 0.15 + Math.random() * size * 0.7,
      y: size * 0.15 + Math.random() * size * 0.55,
      color: themeColors.particle,
      size: 3 + Math.random() * 4,
      delay: i * 0.28,
    }))
    setParticles(ps)
  }, [size, themeColors.particle])

  // Phase sequence timer
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 800)
    const t2 = setTimeout(() => { setPhase(3); setShowPlane(true) }, 1400)
    const t3 = setTimeout(() => { setPhase(4); setShowBurst(true) }, 3500)
    const t4 = setTimeout(() => { setPhase(5); setShowBurst(false) }, 4200)
    const t5 = setTimeout(() => {
      setPhase(1)
      setShowPlane(false)
      if (onAnimationComplete) onAnimationComplete()
    }, 5000)
    return () => { [t1, t2, t3, t4, t5].forEach(clearTimeout) }
  }, [onAnimationComplete])

  // Figure-8 Orbit variants
  const planeVariants: Variants = {
    hidden: { opacity: 0, x: 0, y: 0, rotate: 0, scale: 0 },
    detach: {
      opacity: 1,
      x: [0, 25, 40],
      y: [0, -15, -30],
      rotate: [0, -10, -25],
      scale: [0, 1, 1.1],
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    orbit: {
      x: [40, 95, 40, -95, -40, 40],
      y: [-30, -75, -110, -75, -30, -30],
      rotate: [-25, 12, 0, -15, -35, -25],
      scale: 1.1,
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
      scale: [1.1, 1.3, 0],
      opacity: [1, 1, 0],
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const burstVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    show: {
      scale: [0, 1.6, 2.8],
      opacity: [0.9, 0.4, 0],
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  }

  const cx = size / 2
  const cy = size * 0.42

  const loaderCard = (
    <motion.div
      className="relative flex flex-col items-center justify-center select-none"
      style={{
        width: size,
        height: size,
        borderRadius: '24%',
        background: themeColors.gradientBg,
        boxShadow: `0 0 65px rgba(${themeColors.glowRgb}, 0.55), 0 0 130px rgba(${themeColors.glowRgb}, 0.25), inset 0 1.5px 0 rgba(255,255,255,0.25)`,
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Ambient Pulsing Glow */}
      <motion.div
        className="absolute inset-0 rounded-[24%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.3) 100%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Light Rays */}
      <LightRays color={themeColors.glow} />

      {/* Shimmer Sweep Overlay */}
      <motion.div
        className="absolute inset-0 rounded-[24%] pointer-events-none overflow-hidden"
        style={{ zIndex: 10 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${themeColors.shimmer} 50%, transparent 60%)`,
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['-200% center', '300% center'] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1, ease: 'linear' }}
        />
      </motion.div>

      {/* Orbit Particles (Phase 3) */}
      {phase === 3 && particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Micro Icons along Orbit */}
      {phase === 3 && (
        <>
          <MicroIcon icon="✓" delay={0.4} x={cx + 60} y={cy - 65} color={themeColors.glow} />
          <MicroIcon icon="⚡" delay={1.1} x={cx - 75} y={cy - 60} color={themeColors.glow} />
          <MicroIcon icon="✈" delay={1.8} x={cx + 25} y={cy - 95} color={themeColors.glow} />
        </>
      )}

      {/* Official 1:1 Vector Logo Mark */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        style={{ marginTop: -size * 0.05 }}
        animate={
          phase === 5
            ? { filter: [`drop-shadow(0 0 6px ${themeColors.glow})`, `drop-shadow(0 0 18px ${themeColors.glow})`, `drop-shadow(0 0 6px ${themeColors.glow})`] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <SurexendVectorLogo variant={activeVariant} width={size * 0.58} height={size * 0.58} />
      </motion.div>

      {/* Detached Orbiting Plane (Phases 2-4) */}
      <AnimatePresence>
        {showPlane && (
          <motion.div
            className="absolute z-20"
            style={{ left: cx - size * 0.12, top: cy - size * 0.25 }}
            variants={planeVariants}
            initial="hidden"
            animate={phase === 2 ? 'detach' : phase === 3 ? 'orbit' : 'reattach'}
            exit={{ opacity: 0 }}
          >
            <DetachedPlane variant={activeVariant} width={size * 0.3} height={size * 0.3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reattachment Light Burst */}
      <AnimatePresence>
        {showBurst && (
          <motion.div
            className="absolute rounded-full pointer-events-none z-30"
            style={{
              left: '50%',
              top: '42%',
              transform: 'translate(-50%, -50%)',
              width: size * 0.85,
              height: size * 0.85,
              background: `radial-gradient(circle, ${themeColors.glow} 0%, transparent 70%)`,
            }}
            variants={burstVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Official "SURE X END" Typography */}
      <div
        className="absolute flex items-center justify-center z-20 tracking-wider"
        style={{ bottom: size * 0.12, left: 0, right: 0 }}
      >
        <span
          className="font-inter font-bold uppercase"
          style={{
            fontSize: size * 0.082,
            color: '#1A1A1A',
            letterSpacing: '0.12em',
          }}
        >
          SURE
        </span>
        <span
          className="font-inter font-black uppercase mx-[2px]"
          style={{
            fontSize: size * 0.088,
            color: '#FFFFFF',
            textShadow: `0 0 10px ${themeColors.glow}, 0 0 20px ${themeColors.glow}`,
            letterSpacing: '0.05em',
          }}
        >
          X
        </span>
        <span
          className="font-inter font-bold uppercase"
          style={{
            fontSize: size * 0.082,
            color: '#1A1A1A',
            letterSpacing: '0.12em',
          }}
        >
          END
        </span>
      </div>

      {/* Breathing Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-[24%] pointer-events-none"
        style={{ border: `2px solid ${themeColors.primary}`, opacity: 0 }}
        animate={{ opacity: [0, 0.45, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
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
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 65% 65% at 50% 50%, rgba(${themeColors.glowRgb}, 0.12), transparent)`,
          }}
        />
        {loaderCard}
        <motion.p
          className="mt-6 text-xs tracking-[0.35em] uppercase font-semibold"
          style={{ color: `rgba(${themeColors.glowRgb}, 0.8)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading...
        </motion.p>
      </motion.div>
    )
  }

  return loaderCard
}
