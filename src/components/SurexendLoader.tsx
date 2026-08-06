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

  // Color profiles
  const theme = isGold
    ? {
        bgColor: '#D4A017',
        bgGradient: 'radial-gradient(circle at center, #F0C430 0%, #D4A017 50%, #9E7408 100%)',
        screenBg: 'radial-gradient(circle at center, #2A2005 0%, #0A0F1E 100%)',
        glowColor: '#FFD700',
        glowRgb: '212, 160, 23',
        logoImg: '/logo-gold.png',
        shimmer: 'rgba(255, 230, 100, 0.4)',
      }
    : {
        bgColor: '#B5E23D',
        bgGradient: 'radial-gradient(circle at center, #D0F060 0%, #B5E23D 50%, #7A9E18 100%)',
        screenBg: 'radial-gradient(circle at center, #1B2908 0%, #0A0F1E 100%)',
        glowColor: '#D4FF4A',
        glowRgb: '181, 226, 61',
        logoImg: '/logo-lemon.png',
        shimmer: 'rgba(212, 255, 74, 0.4)',
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

  const loaderElement = (
    <motion.div
      className="relative flex flex-col items-center justify-center select-none"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer Theme Glow Halo */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 1.3,
          height: size * 1.3,
          background: `radial-gradient(circle, rgba(${theme.glowRgb}, 0.5) 0%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Official High-Res Logo Image */}
      <motion.div
        className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          width: size,
          height: size,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(${theme.glowRgb}, 0.4)`,
        }}
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={theme.logoImg}
          alt="SureXend Logo"
          className="w-full h-full object-cover"
        />

        {/* Diagonal Shimmer Sweep Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(115deg, transparent 30%, ${theme.shimmer} 50%, transparent 70%)`,
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['-200% center', '300% center'] }}
          transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1, ease: 'linear' }}
        />
      </motion.div>

      {/* Animated Loading Dots */}
      <motion.div
        className="flex items-center gap-2 mt-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span
          className="text-xs font-extrabold tracking-[0.3em] uppercase"
          style={{ color: theme.glowColor, textShadow: `0 0 10px ${theme.glowColor}` }}
        >
          Loading
        </span>
        <div className="flex gap-1.5 ml-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.glowColor }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )

  if (!fullScreen) return loaderElement

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: theme.screenBg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ambient Background Aura */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 80% at 50% 50%, rgba(${theme.glowRgb}, 0.25), transparent 75%)`,
            }}
          />
          {loaderElement}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
