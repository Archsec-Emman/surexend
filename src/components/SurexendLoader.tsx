'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

interface SurexendLoaderProps {
  variant?: 'gold' | 'lemon'
  duration?: number
  onLoadingComplete?: () => void
  isLoading?: boolean
  fullScreen?: boolean
}

// ─── Premium SVG Logo (paper-plane / X mark — NO box) ──────────────────
function LogoIcon({ color, size = 80 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* The X base */}
      <path
        d="M20 95L50 60L20 25H42L60 48L78 25H100L70 60L60 72L42 95H20Z"
        fill={color}
      />
      {/* Paper plane overlapping the X */}
      <path
        d="M55 15L105 55L70 60L85 95L55 55L55 15Z"
        fill={color}
        opacity="0.85"
      />
      {/* Plane wing accent */}
      <path
        d="M55 15L70 60L55 55L55 15Z"
        fill="white"
        opacity="0.15"
      />
    </svg>
  )
}

export default function SurexendLoader({
  variant: propVariant,
  duration = 4000,
  onLoadingComplete,
  isLoading = true,
  fullScreen = true,
}: SurexendLoaderProps) {
  const { variant: contextVariant } = useTheme()
  const activeVariant = propVariant || contextVariant || 'lemon'
  const isGold = activeVariant === 'gold'
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  // ── Theme palette ──
  const t = useMemo(() => {
    return isGold
      ? {
          accent: '#D4A017',
          accentLight: '#FFD700',
          accentRgb: '212, 160, 23',
          gradA: '#1a1000',
          gradB: '#0d0800',
          gradC: '#2a1800',
          gradD: '#050510',
          meshA: 'rgba(212, 160, 23, 0.12)',
          meshB: 'rgba(255, 215, 0, 0.06)',
          meshC: 'rgba(180, 130, 10, 0.08)',
        }
      : {
          accent: '#B5E23D',
          accentLight: '#D4FF4A',
          accentRgb: '181, 226, 61',
          gradA: '#0a1400',
          gradB: '#050d00',
          gradC: '#0f1f00',
          gradD: '#050510',
          meshA: 'rgba(181, 226, 61, 0.12)',
          meshB: 'rgba(212, 255, 74, 0.06)',
          meshC: 'rgba(140, 190, 40, 0.08)',
        }
  }, [isGold])

  // ── Timer & progress ──
  useEffect(() => {
    if (!isLoading) {
      setVisible(false)
      onLoadingComplete?.()
      return
    }

    // Smooth progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        // Ease-out: fast at start, slower toward end
        const remaining = 100 - prev
        const increment = Math.max(0.3, remaining * 0.04)
        return Math.min(100, prev + increment)
      })
    }, 30)

    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setVisible(false)
        onLoadingComplete?.()
      }, 400)
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [isLoading, duration, onLoadingComplete])

  const wordmark = 'SUREXEND'
  const xIndex = 4 // The "X" in SUREXEND

  const content = (
    <motion.div
      className="relative flex flex-col items-center justify-center select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* ── Logo Icon with glow bloom ── */}
      <motion.div
        className="relative mb-10"
        initial={{ scale: 0.7, opacity: 0, filter: 'blur(20px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        {/* Glow behind the logo */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(${t.accentRgb}, 0.4) 0%, transparent 70%)`,
            filter: 'blur(40px)',
            transform: 'scale(2.5)',
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [2.2, 2.8, 2.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <LogoIcon color={t.accent} size={90} />
      </motion.div>

      {/* ── Wordmark: letter-by-letter reveal ── */}
      <motion.div
        className="flex items-center gap-[3px] mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {wordmark.split('').map((char, i) => (
          <motion.span
            key={i}
            className="font-inter font-black tracking-[0.15em]"
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
              color: i === xIndex ? t.accentLight : 'rgba(255, 255, 255, 0.9)',
              textShadow: i === xIndex ? `0 0 30px ${t.accent}, 0 0 60px rgba(${t.accentRgb}, 0.3)` : 'none',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.0 + i * 0.08,
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* ── Minimal progress bar ── */}
      <motion.div
        className="relative overflow-hidden rounded-full"
        style={{
          width: 200,
          height: 2,
          background: 'rgba(255, 255, 255, 0.06)',
        }}
        initial={{ opacity: 0, scaleX: 0.5 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${t.accent}, ${t.accentLight})`,
            boxShadow: `0 0 12px rgba(${t.accentRgb}, 0.6)`,
            transition: 'width 0.1s ease-out',
          }}
        />
        {/* Shimmer on progress bar */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </motion.div>
  )

  if (!fullScreen) return content

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#050510' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Living Gradient Mesh Background ── */}

          {/* Mesh orb 1 — large, slow drift */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '130vmax',
              height: '130vmax',
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 40%, ${t.meshA}, transparent 60%)`,
              filter: 'blur(80px)',
              top: '-30%',
              left: '-20%',
            }}
            animate={{
              x: [0, 60, -30, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.08, 0.95, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Mesh orb 2 — mid-right, drifts opposite */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '100vmax',
              height: '100vmax',
              borderRadius: '50%',
              background: `radial-gradient(circle at 70% 60%, ${t.meshB}, transparent 55%)`,
              filter: 'blur(60px)',
              bottom: '-25%',
              right: '-15%',
            }}
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 30, -50, 0],
              scale: [1, 0.92, 1.06, 1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />

          {/* Mesh orb 3 — small accent glow */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '50vmax',
              height: '50vmax',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${t.meshC}, transparent 70%)`,
              filter: 'blur(50px)',
              top: '40%',
              left: '30%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 40, 0],
              opacity: [0.6, 1, 0.5, 0.6],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Subtle radial center light */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(${t.accentRgb}, 0.05), transparent 80%)`,
            }}
          />

          {/* Very subtle grain noise */}
          <div
            className="absolute inset-0 pointer-events-none noise-overlay"
            style={{ opacity: 0.3 }}
          />

          {/* ── Centered content ── */}
          <div className="relative z-10">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
