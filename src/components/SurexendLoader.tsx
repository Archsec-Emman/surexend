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

export default function SurexendLoader({
  variant: propVariant,
  duration = 3500,
  onLoadingComplete,
  isLoading = true,
  fullScreen = true,
}: SurexendLoaderProps) {
  const { variant: contextVariant } = useTheme()
  const activeVariant = propVariant || contextVariant || 'lemon'
  const isGold = activeVariant === 'gold'
  const [visible, setVisible] = useState(true)

  const t = useMemo(() => {
    return isGold
      ? {
          accent: '#D4A017',
          accentLight: '#FFD700',
          accentRgb: '212, 160, 23',
          // CSS filter to turn black icon → gold
          // invert(1): black→white | sepia + hue-rotate: white→gold
          iconFilter: 'invert(1) sepia(0.6) saturate(4) hue-rotate(10deg) brightness(0.95)',
          meshA: 'rgba(212, 160, 23, 0.04)',
          meshB: 'rgba(255, 215, 0, 0.03)',
        }
      : {
          accent: '#B5E23D',
          accentLight: '#D4FF4A',
          accentRgb: '181, 226, 61',
          // CSS filter to turn black icon → lemon
          iconFilter: 'invert(1) sepia(0.5) saturate(6) hue-rotate(30deg) brightness(1.1)',
          meshA: 'rgba(181, 226, 61, 0.04)',
          meshB: 'rgba(212, 255, 74, 0.03)',
        }
  }, [isGold])

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

  // The logo image path — use the gold-accent version for gold, plain for lemon
  const logoSrc = isGold ? '/logo-mark-gold.png' : '/logo-mark-plain.png'

  const content = (
    <motion.div
      className="relative flex flex-col items-center justify-center select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      {/* ── Ambient glow behind logo ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${t.accentRgb}, 0.2) 0%, transparent 70%)`,
          filter: 'blur(40px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Logo Image ── */}
      <motion.div
        className="relative z-10 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <motion.img
          src={logoSrc}
          alt="SureXend"
          draggable={false}
          style={{
            width: 140,
            height: 140,
            objectFit: 'contain',
            filter: t.iconFilter,
            userSelect: 'none',
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* ── Wordmark ── */}
      <motion.div
        className="relative z-10 flex items-baseline"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <span
          className="font-inter font-bold tracking-[0.25em]"
          style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          SURE
        </span>
        <span
          className="font-inter font-bold tracking-[0.25em]"
          style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            color: t.accentLight,
            textShadow: `0 0 20px rgba(${t.accentRgb}, 0.5)`,
          }}
        >
          X
        </span>
        <span
          className="font-inter font-bold tracking-[0.25em]"
          style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          END
        </span>
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
          {/* ── Ambient gradient orb 1 — very subtle, slow ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '80vmax',
              height: '80vmax',
              borderRadius: '50%',
              background: `radial-gradient(circle at 40% 40%, ${t.meshA}, transparent 60%)`,
              filter: 'blur(80px)',
              top: '-20%',
              left: '-15%',
            }}
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 15, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Ambient gradient orb 2 ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: '70vmax',
              height: '70vmax',
              borderRadius: '50%',
              background: `radial-gradient(circle at 60% 60%, ${t.meshB}, transparent 55%)`,
              filter: 'blur(60px)',
              bottom: '-20%',
              right: '-10%',
            }}
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 20, -25, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          />

          {/* ── Content ── */}
          <div className="relative z-10">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
