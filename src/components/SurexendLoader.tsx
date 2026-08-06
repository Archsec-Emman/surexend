'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

interface SurexendLoaderProps {
  variant?: 'gold' | 'lemon'
  duration?: number // time in ms before fade-out (default 5000)
  onLoadingComplete?: () => void
  isLoading?: boolean // set to false to trigger fade-out early
  size?: number
  fullScreen?: boolean
}

const themeColors = {
  gold: {
    bgFrom: '#E5B31B',
    bgTo: '#C99512',
    highlight: '#FFD700',
    textGlow: '#FFD700',
    accent: '#FFD700',
    paperOutline: 'rgba(255,215,0,0.6)',
    trail: '#FFD700',
  },
  lemon: {
    bgFrom: '#B5E23D',
    bgTo: '#9BCB2A',
    highlight: '#D4FF4A',
    textGlow: '#D4FF4A',
    accent: '#D4FF4A',
    paperOutline: 'rgba(212,255,74,0.6)',
    trail: '#D4FF4A',
  },
}

export default function SurexendLoader({
  variant: propVariant,
  duration = 5000,
  onLoadingComplete,
  isLoading = true,
  size,
  fullScreen = true,
}: SurexendLoaderProps) {
  const { variant: contextVariant } = useTheme()
  const activeVariant = propVariant || contextVariant || 'gold'
  const [visible, setVisible] = useState(true)
  const colors = themeColors[activeVariant]

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

  // ---- Animation variants ----
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.8, ease: 'easeIn' } },
  }

  const content = (
    <div
      className="relative aspect-square w-[300px] sm:w-[380px] md:w-[440px] rounded-3xl overflow-hidden select-none"
      style={{
        background: `linear-gradient(135deg, ${colors.bgFrom}, ${colors.bgTo})`,
        boxShadow: `0 0 90px ${colors.highlight}66, inset 0 2px 0 rgba(255,255,255,0.4)`,
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pulsing glow */}
        <div
          className="absolute inset-0 rounded-3xl animate-pulse-glow"
          style={{ background: `radial-gradient(circle at center, ${colors.highlight}55, transparent 70%)` }}
        />
        {/* Metallic shine sweep */}
        <div className="absolute inset-0 rounded-3xl animate-shine-sweep" />
        {/* Radial vignette */}
        <div className="absolute inset-0 rounded-3xl bg-radial-vignette" />
      </div>

      {/* Logo container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 z-10">
        {/* Paper plane and X base */}
        <motion.div
          className="relative w-2/3 max-w-[220px] aspect-square flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1, 1, 1, 1, 1, 0.95, 1],
            opacity: [0, 1, 1, 1, 1, 1, 1, 1],
          }}
          transition={{
            duration: 5,
            times: [0, 0.1, 0.16, 0.28, 0.7, 0.84, 0.9, 1],
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          {/* X base */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [0.8, 1, 1, 1, 1.1, 1, 1, 1],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1],
            }}
            transition={{
              duration: 5,
              times: [0, 0.1, 0.16, 0.28, 0.7, 0.84, 0.9, 1],
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M22 22 L78 78 M78 22 L22 78"
                stroke="black"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-[0_0_10px_rgba(0,0,0,0.4)]"
              />
            </svg>
          </motion.div>

          {/* Paper plane (detaches and orbits) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotate: [0, 0, -15, 15, -10, 0, 0, 0],
              x: [0, 0, 0, 45, -45, 0, 0, 0],
              y: [0, 0, -20, -50, -20, 0, 0, 0],
              scale: [0.7, 1, 1, 1.25, 1, 0.95, 1, 1],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1],
            }}
            transition={{
              duration: 5,
              times: [0, 0.1, 0.16, 0.4, 0.7, 0.84, 0.9, 1],
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
              <path
                d="M50 8 L92 88 L50 68 L8 88 L50 8 Z"
                fill="black"
                stroke={colors.paperOutline}
                strokeWidth="2.5"
                className="drop-shadow-[0_0_14px_rgba(0,0,0,0.6)]"
              />
            </svg>
          </motion.div>

          {/* Orbit Trail Micro-Icons (✓ Checkmark & ⚡ Lightning) */}
          <motion.div
            className="absolute -top-4 right-2 text-xl font-bold pointer-events-none select-none"
            animate={{
              opacity: [0, 0, 1, 0, 0],
              scale: [0.5, 1, 1.3, 1, 0.5],
            }}
            transition={{ duration: 5, times: [0, 0.35, 0.45, 0.6, 1], repeat: Infinity }}
            style={{ color: colors.highlight, filter: `drop-shadow(0 0 8px ${colors.highlight})` }}
          >
            ✓
          </motion.div>

          <motion.div
            className="absolute -top-6 left-2 text-xl font-bold pointer-events-none select-none"
            animate={{
              opacity: [0, 0, 0, 1, 0],
              scale: [0.5, 0.5, 1, 1.3, 0.5],
            }}
            transition={{ duration: 5, times: [0, 0.5, 0.6, 0.72, 1], repeat: Infinity }}
            style={{ color: colors.highlight, filter: `drop-shadow(0 0 8px ${colors.highlight})` }}
          >
            ⚡
          </motion.div>
        </motion.div>

        {/* SUREXEND text */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0, 1, 1, 1, 1, 1, 1, 1],
            y: [10, 0, 0, 0, 0, 0, 0, 0],
          }}
          transition={{
            duration: 5,
            times: [0, 0.1, 0.16, 0.28, 0.7, 0.84, 0.9, 1],
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-wider"
            style={{ fontFamily: "'Inter', sans-serif", color: 'black' }}
          >
            {'SUREXEND'.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.2,
                  ease: 'easeOut',
                }}
                style={
                  char === 'X'
                    ? {
                        color: colors.accent,
                        filter: `drop-shadow(0 0 14px ${colors.accent})`,
                      }
                    : {}
                }
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </motion.div>
      </div>
    </div>
  )

  if (!fullScreen) {
    return content
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ background: `radial-gradient(circle at center, ${colors.highlight}25, #0A0F1E 80%)` }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
