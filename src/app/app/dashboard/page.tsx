'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Eye, EyeOff, Send, Download, Repeat, Smartphone, ArrowUpRight, ArrowDownLeft, Clock, User } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'
import { walletAPI, transactionAPI } from '@/lib/api'
import { useTheme } from '@/context/ThemeContext'

// Dummy chart data
const chartData = [
  { value: 1200 }, { value: 1400 }, { value: 1100 }, { value: 1600 }, { value: 1550 }, { value: 1900 }, { value: 2100 }
]

export default function DashboardPage() {
  const { variant, colors } = useTheme()
  const [showBalance, setShowBalance] = useState(true)
  const [currency, setCurrency] = useState<'USDT' | 'NGN'>('USDT')
  
  const { data: balanceData, isLoading: isLoadingBalance, refetch: refetchBalance } = useQuery({
    queryKey: ['balance'],
    queryFn: walletAPI.getBalance,
    // Provide some default dummy data in case API fails
    initialData: { usdt: 2450.75, fiat: 3675000, rate: 1500 }
  })

  const { data: txData, isLoading: isLoadingTx, refetch: refetchTx } = useQuery({
    queryKey: ['recentTx'],
    queryFn: () => transactionAPI.getHistory({ limit: 5 }),
    initialData: {
      transactions: [
        { id: '1', type: 'send', amount: 150, currency: 'USDT', status: 'completed', date: new Date().toISOString() },
        { id: '2', type: 'receive', amount: 500, currency: 'USDT', status: 'completed', date: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', type: 'convert', amount: 100, currency: 'USDT', status: 'pending', date: new Date(Date.now() - 172800000).toISOString() },
      ]
    }
  })

  const handleRefresh = () => {
    refetchBalance()
    refetchTx()
  }

  // CountUp animation component
  const CountUp = ({ value, prefix = '', suffix = '', decimals = 2 }: any) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      let start = 0
      const end = parseFloat(value)
      if (start === end) return
      const duration = 1000
      let startTime: number | null = null
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(progress * end)
        if (progress < 1) {
          window.requestAnimationFrame(step)
        } else {
          setCount(end)
        }
      }
      window.requestAnimationFrame(step)
    }, [value])

    return <span>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-32">
      {/* Live rates ticker */}
      <div className="w-full overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg py-2 flex items-center">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="flex whitespace-nowrap gap-8 px-4 text-xs font-medium"
        >
          <span className="text-white">USDT/NGN: <span style={{ color: colors.primary }}>₦1,500</span></span>
          <span className="text-white">BTC/USD: <span style={{ color: colors.primary }}>$65,420</span></span>
          <span className="text-white">ETH/USD: <span style={{ color: colors.primary }}>$3,540</span></span>
          <span className="text-white">USDT/GHS: <span style={{ color: colors.primary }}>₵13.5</span></span>
          {/* Duplicate for infinite effect */}
          <span className="text-white">USDT/NGN: <span style={{ color: colors.primary }}>₦1,500</span></span>
          <span className="text-white">BTC/USD: <span style={{ color: colors.primary }}>$65,420</span></span>
          <span className="text-white">ETH/USD: <span style={{ color: colors.primary }}>$3,540</span></span>
        </motion.div>
      </div>

      {/* Balance Card */}
      <motion.div 
        className={`glass-card-${variant} p-6 relative overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[#94A3B8] text-sm font-medium mb-1 flex items-center gap-2">
              Total Balance
              <button onClick={() => setShowBalance(!showBalance)} className="text-[#64748B] hover:text-white transition-colors">
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </p>
            <div className="text-4xl font-bold text-white tracking-tight">
              {isLoadingBalance ? (
                <div className="h-10 w-48 skeleton rounded-lg"></div>
              ) : showBalance ? (
                currency === 'USDT' 
                  ? <CountUp value={balanceData?.usdt || 0} prefix="$" /> 
                  : <CountUp value={balanceData?.fiat || 0} prefix="₦" decimals={0} />
              ) : (
                '****'
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setCurrency(currency === 'USDT' ? 'NGN' : 'USDT')}
            className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-xs font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-1.5"
          >
            <Repeat className="w-3 h-3" />
            {currency === 'USDT' ? 'Show NGN' : 'Show USDT'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Send, label: 'Send', href: '/app/send', color: '#10B981' },
            { icon: Download, label: 'Receive', href: '/app/receive', color: '#3B82F6' },
            { icon: Repeat, label: 'Convert', href: '/app/convert', color: '#F59E0B' },
            { icon: Smartphone, label: 'Bills', href: '/app/bills', color: '#8B5CF6' }
          ].map((action, idx) => (
            <Link key={idx} href={action.href} className="group flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center group-hover:scale-105 transition-all group-hover:bg-[rgba(255,255,255,0.08)]">
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-xs font-medium text-[#94A3B8] group-hover:text-white transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <motion.div 
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Portfolio Trend</h3>
            <span className="text-xs text-[#10B981] bg-[rgba(16,185,129,0.1)] px-2 py-1 rounded-md font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +15.4%
            </span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.primary} 
                  strokeWidth={3} 
                  dot={false}
                  animationDuration={1500}
                />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Referrals Teaser */}
        <motion.div 
          className="glass-card p-5 flex flex-col justify-between relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <User className="w-40 h-40" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Invite & Earn</h3>
            <p className="text-sm text-[#94A3B8] mb-4">Earn up to $10 for every friend who signs up and makes their first transaction.</p>
          </div>
          <Link href="/app/referrals" className={`py-2.5 px-4 rounded-xl text-sm font-semibold inline-block text-center w-max btn-outline-${variant}`}>
            Get Referral Link
          </Link>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div 
        className="glass-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white">Recent Transactions</h3>
          <Link href="/app/history" className="text-sm text-[#94A3B8] hover:text-white transition-colors">See All</Link>
        </div>

        <div className="space-y-4">
          {isLoadingTx ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 skeleton rounded" />
                  <div className="h-3 w-16 skeleton rounded" />
                </div>
              </div>
            ))
          ) : txData?.transactions?.length > 0 ? (
            txData.transactions.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.02)] transition-colors -mx-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'send' ? 'bg-[rgba(239,68,68,0.1)] text-[#EF4444]' :
                    tx.type === 'receive' ? 'bg-[rgba(16,185,129,0.1)] text-[#10B981]' :
                    'bg-[rgba(245,158,11,0.1)] text-[#F59E0B]'
                  }`}>
                    {tx.type === 'send' ? <ArrowUpRight className="w-5 h-5" /> :
                     tx.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> :
                     <Repeat className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-white capitalize">{tx.type}</p>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'send' ? 'text-white' : 'text-[#10B981]'}`}>
                    {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.currency}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-medium badge-${tx.status}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#64748B]">
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
