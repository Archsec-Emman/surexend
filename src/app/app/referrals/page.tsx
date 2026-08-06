'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { referralAPI } from '@/lib/api'
import {
  Copy, Share2, Gift, Users, DollarSign,
  TrendingUp, ChevronRight, Star, Award, Crown,
  CheckCircle, ArrowUpRight
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Tier config ────────────────────────────────────────────────────────────
const TIERS = [
  { name: 'Bronze', icon: Star, min: 0, max: 9, color: '#CD7F32', bg: 'rgba(205,127,50,0.12)', desc: '0.3% of fees' },
  { name: 'Silver', icon: Award, min: 10, max: 49, color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', desc: '0.4% of fees' },
  { name: 'Gold', icon: Crown, min: 50, max: 199, color: '#FFD700', bg: 'rgba(255,215,0,0.12)', desc: '0.5% of fees' },
  { name: 'Platinum', icon: Crown, min: 200, max: Infinity, color: '#00D4FF', bg: 'rgba(0,212,255,0.12)', desc: '0.6% of fees' },
]

function getTier(count: number) {
  return TIERS.find(t => count >= t.min && count <= t.max) || TIERS[0]
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accentRgb, accentHex, delay = 0 }: {
  label: string; value: string; sub?: string; icon: any; accentRgb: string; accentHex: string; delay?: number
}) {
  return (
    <motion.div
      className="bg-[#0F1629] rounded-2xl p-5 border border-white/5"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ borderColor: `rgba(${accentRgb}, 0.2)`, y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `rgba(${accentRgb}, 0.12)` }}>
          <Icon size={17} style={{ color: accentHex }} />
        </div>
        {sub && (
          <span className="text-[#10B981] text-xs font-medium flex items-center gap-1">
            <TrendingUp size={11} />{sub}
          </span>
        )}
      </div>
      <p className="text-[#64748B] text-xs mb-1">{label}</p>
      <p className="text-white font-inter font-bold text-2xl">{value}</p>
    </motion.div>
  )
}

// ── Referral row ───────────────────────────────────────────────────────────
function ReferralRow({ user, earned, accentHex, accentRgb, idx }: {
  user: any; earned: number; accentHex: string; accentRgb: string; idx: number
}) {
  return (
    <motion.div
      className="flex items-center gap-4 py-3.5 border-b border-white/5 last:border-0"
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.06 }}
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
        style={{ background: `rgba(${accentRgb}, 0.15)`, color: accentHex }}>
        {user.firstName?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">
          {user.firstName} {user.lastName?.[0]}.
        </p>
        <p className="text-[#64748B] text-xs">
          Joined {new Date(user.joinedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[#10B981] text-sm font-semibold">+${earned.toFixed(2)}</p>
        <div className="flex items-center gap-1 justify-end mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <p className="text-[#64748B] text-xs">Active</p>
        </div>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// REFERRALS PAGE
// ══════════════════════════════════════════════════════════════════════════

export default function ReferralsPage() {
  const { variant, colors } = useTheme()
  const isGold = variant === 'gold'
  const accentRgb = isGold ? '212, 160, 23' : '181, 226, 61'
  const accentHex = isGold ? '#D4A017' : '#B5E23D'
  const btnClass = isGold ? 'btn-gold' : 'btn-lemon'

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'earnings'>('overview')

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['referral-stats'],
    queryFn: referralAPI.getStats,
  })

  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => referralAPI.getReferrals(1, 50),
    enabled: activeTab === 'referrals',
  })

  const { data: earnings } = useQuery({
    queryKey: ['referral-earnings'],
    queryFn: referralAPI.getEarnings,
    enabled: activeTab === 'earnings',
  })

  const referralLink = stats?.referralCode
    ? `https://surexend.com/ref/${stats.referralCode}`
    : 'Loading...'

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join SureXend',
        text: '🚀 I\'ve been using SureXend to send money and pay bills with crypto. Join using my link and we both earn!',
        url: referralLink,
      })
    } else {
      copyLink()
    }
  }

  const totalReferrals = stats?.totalReferrals || 0
  const tier = getTier(totalReferrals)
  const TierIcon = tier.icon
  const nextTier = TIERS[TIERS.indexOf(tier) + 1]
  const tierProgress = nextTier
    ? ((totalReferrals - tier.min) / (nextTier.min - tier.min)) * 100
    : 100

  return (
    <div className="min-h-screen bg-[#0A0F1E] pb-32">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
        <h1 className="text-white font-inter font-bold text-xl mb-1">Referrals</h1>
        <p className="text-[#64748B] text-sm">Invite friends. Earn from every transaction they make.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-4">

        {/* Referral link card */}
        <motion.div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: colors.gradientBg,
            boxShadow: `0 20px 60px rgba(${accentRgb}, 0.25)`,
          }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)` }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Gift size={18} className="text-black" />
              <p className="font-semibold text-black text-sm">Your Referral Link</p>
            </div>
            <div className="bg-black/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
              <p className="text-black/80 text-sm flex-1 truncate font-mono">{referralLink}</p>
              <motion.button whileTap={{ scale: 0.9 }} onClick={copyLink}
                className="flex-shrink-0">
                {copied
                  ? <CheckCircle size={18} className="text-black" />
                  : <Copy size={18} className="text-black/60" />
                }
              </motion.button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                className="py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold bg-black/20 text-black hover:bg-black/30 transition-colors"
                whileTap={{ scale: 0.97 }}
                onClick={copyLink}
              >
                <Copy size={15} /> Copy Link
              </motion.button>
              <motion.button
                className="py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold bg-black text-white hover:bg-black/80 transition-colors"
                whileTap={{ scale: 0.97 }}
                onClick={shareLink}
              >
                <Share2 size={15} /> Share
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tier card */}
        <motion.div
          className="bg-[#0F1629] rounded-2xl p-5 border border-white/5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#64748B] text-sm">Your Tier</p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: tier.bg }}>
              <TierIcon size={13} style={{ color: tier.color }} />
              <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: tier.bg }}>
              <TierIcon size={28} style={{ color: tier.color }} />
            </div>
            <div>
              <p className="text-white font-inter font-bold text-2xl">{totalReferrals}</p>
              <p className="text-[#64748B] text-xs">total referrals · {tier.desc}</p>
            </div>
          </div>
          {nextTier && (
            <>
              <div className="flex justify-between text-xs text-[#64748B] mb-2">
                <span>{totalReferrals} referrals</span>
                <span>{nextTier.min} for {nextTier.name}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${accentHex}, ${accentHex}99)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, tierProgress)}%` }}
                  transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                />
              </div>
              <p className="text-[#64748B] text-xs mt-2">
                {nextTier.min - totalReferrals} more referrals to reach {nextTier.name}
              </p>
            </>
          )}
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Earned" value={`$${(stats?.totalEarned || 0).toFixed(2)}`}
            sub={`+$${(stats?.thisMonthEarned || 0).toFixed(2)} this month`}
            icon={DollarSign} accentRgb={accentRgb} accentHex={accentHex} delay={0.2} />
          <StatCard label="Active Referrals" value={stats?.activeReferrals?.toString() || '0'}
            sub={`${stats?.totalReferrals || 0} total`}
            icon={Users} accentRgb={accentRgb} accentHex={accentHex} delay={0.25} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0F1629] p-1 rounded-xl border border-white/5">
          {[
            { key: 'overview', label: 'How It Works' },
            { key: 'referrals', label: 'Your Referrals' },
            { key: 'earnings', label: 'Earnings' },
          ].map(tab => (
            <button
              key={tab.key}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={activeTab === tab.key ? {
                background: `rgba(${accentRgb}, 0.15)`,
                color: accentHex,
              } : { color: '#64748B' }}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview"
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {[
                { step: '1', title: 'Share Your Link', desc: 'Send your unique referral link to friends and family across Africa.' },
                { step: '2', title: 'They Sign Up & Transact', desc: 'Your friend creates an account and starts using SureXend — sending, converting, or paying bills.' },
                { step: '3', title: 'You Earn Automatically', desc: `You earn ${tier.desc} on every transaction fee they pay. Credited monthly to your wallet.` },
                { step: '4', title: 'Climb the Tiers', desc: 'More referrals = higher tier = higher commission. Platinum earners can make passive income every month.' },
              ].map(({ step, title, desc }, i) => (
                <motion.div key={step}
                  className="bg-[#0F1629] rounded-xl p-4 flex gap-4 border border-white/5"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5"
                    style={{ background: `rgba(${accentRgb}, 0.15)`, color: accentHex }}>
                    {step}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{title}</p>
                    <p className="text-[#64748B] text-xs leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
              {/* Tier breakdown */}
              <div className="bg-[#0F1629] rounded-xl p-4 border border-white/5">
                <p className="text-white font-semibold text-sm mb-3">Commission Tiers</p>
                <div className="space-y-2">
                  {TIERS.map(t => {
                    const Icon = t.icon
                    const isActive = tier.name === t.name
                    return (
                      <div key={t.name}
                        className="flex items-center gap-3 p-2 rounded-xl transition-colors"
                        style={isActive ? { background: t.bg } : {}}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: t.bg }}>
                          <Icon size={14} style={{ color: t.color }} />
                        </div>
                        <div className="flex-1">
                          <span className="text-white text-xs font-medium">{t.name}</span>
                          <span className="text-[#64748B] text-xs ml-2">
                            {t.max === Infinity ? `${t.min}+ referrals` : `${t.min}–${t.max} referrals`}
                          </span>
                        </div>
                        <span className="text-xs font-semibold" style={{ color: t.color }}>{t.desc}</span>
                        {isActive && <span className="text-xs text-[#10B981] font-medium">Current</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'referrals' && (
            <motion.div key="referrals"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0F1629] rounded-2xl p-5 border border-white/5">
                {referralsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="skeleton h-12 rounded-xl" />
                    ))}
                  </div>
                ) : referrals?.referrals?.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">👥</div>
                    <p className="text-white font-semibold mb-1">No referrals yet</p>
                    <p className="text-[#64748B] text-sm">Share your link to start earning</p>
                  </div>
                ) : (
                  <div>
                    {referrals?.referrals?.map((r: any, i: number) => (
                      <ReferralRow key={r.id} user={r.referred} earned={r.earnings}
                        accentHex={accentHex} accentRgb={accentRgb} idx={i} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div key="earnings"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0F1629] rounded-2xl p-5 border border-white/5">
                <p className="text-[#64748B] text-xs mb-4 uppercase tracking-wider">Monthly Breakdown</p>
                {earnings?.monthly?.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-[#64748B] text-sm">No earnings yet. Start referring!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {earnings?.monthly?.map((m: any, i: number) => (
                      <motion.div key={m.month}
                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                        <div>
                          <p className="text-white text-sm font-medium">{m.month}</p>
                          <p className="text-[#64748B] text-xs">{m.transactions} transactions from referrals</p>
                        </div>
                        <p className="text-[#10B981] font-inter font-bold">+${m.amount.toFixed(2)}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                  <p className="text-[#64748B] text-sm">Total Earned</p>
                  <p className="text-white font-inter font-bold text-lg">
                    ${(stats?.totalEarned || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
