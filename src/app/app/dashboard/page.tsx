'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Eye, EyeOff, Send, Download, Repeat, Smartphone, ArrowUpRight, ArrowDownLeft, Clock, User, TrendingUp, TrendingDown, Coins, Activity, Building2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { walletAPI, transactionAPI } from '@/lib/api'
import { useTheme } from '@/context/ThemeContext'

// Market data for USDT and USDC
const cryptoMarketData = {
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    currentPrice: 1.0004,
    change24h: 0.04,
    high24h: 1.0018,
    low24h: 0.9982,
    volume24h: '42.5M',
    data: [
      { time: '10:25:40', value: 1.0001 },
      { time: '10:25:52', value: 1.0005 },
      { time: '10:26:01', value: 1.0002 },
      { time: '10:26:15', value: 1.0008 },
      { time: '10:26:22', value: 1.0004 },
      { time: '10:26:33', value: 1.0012 },
      { time: '10:26:43', value: 1.0009 },
      { time: '10:26:55', value: 1.0004 },
      { time: '10:27:04', value: 1.0007 },
      { time: '10:27:12', value: 1.0002 },
      { time: '10:27:23', value: 1.0011 },
      { time: '10:27:32', value: 1.0005 },
      { time: '10:27:40', value: 1.0008 },
      { time: '10:27:47', value: 1.0015 },
      { time: '10:27:55', value: 1.0004 },
    ]
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    currentPrice: 0.9998,
    change24h: -0.02,
    high24h: 1.0005,
    low24h: 0.9975,
    volume24h: '28.1M',
    data: [
      { time: '10:25:40', value: 0.9999 },
      { time: '10:25:52', value: 0.9996 },
      { time: '10:26:01', value: 1.0001 },
      { time: '10:26:15', value: 0.9994 },
      { time: '10:26:22', value: 0.9998 },
      { time: '10:26:33', value: 1.0002 },
      { time: '10:26:43', value: 0.9997 },
      { time: '10:26:55', value: 0.9998 },
      { time: '10:27:04', value: 1.0000 },
      { time: '10:27:12', value: 0.9995 },
      { time: '10:27:23', value: 1.0003 },
      { time: '10:27:32', value: 0.9996 },
      { time: '10:27:40', value: 0.9999 },
      { time: '10:27:47', value: 1.0004 },
      { time: '10:27:55', value: 0.9998 },
    ]
  }
}

// Cash Flow Money In vs Money Out data
const cashFlowData = [
  { day: 'Mon', moneyIn: 850, moneyOut: 210 },
  { day: 'Tue', moneyIn: 1200, moneyOut: 450 },
  { day: 'Wed', moneyIn: 640, moneyOut: 300 },
  { day: 'Thu', moneyIn: 1500, moneyOut: 620 },
  { day: 'Fri', moneyIn: 980, moneyOut: 180 },
  { day: 'Sat', moneyIn: 1850, moneyOut: 790 },
  { day: 'Sun', moneyIn: 2100, moneyOut: 340 },
]

export default function DashboardPage() {
  const { variant, colors } = useTheme()
  const [showBalance, setShowBalance] = useState(true)
  const [currency, setCurrency] = useState<'USDT' | 'NGN'>('USDT')
  const [selectedCrypto, setSelectedCrypto] = useState<'USDT' | 'USDC'>('USDT')
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D')

  const currentCrypto = cryptoMarketData[selectedCrypto]

  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['balance'],
    queryFn: walletAPI.getBalance,
    initialData: { usdt: 2450.75, fiat: 3675000, rate: 1500 }
  })

  const { data: txData, isLoading: isLoadingTx } = useQuery({
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

  const list = Array.isArray(txData) ? txData : (txData?.transactions || [])

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 py-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 pb-36 sm:pb-32">
      {/* Live rates ticker */}
      <div className="w-full overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg py-1.5 flex items-center">
        <motion.div 
          className="flex whitespace-nowrap text-xs text-[#94A3B8] gap-8 px-4"
          animate={{ x: [0, -400] }}
          transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
        >
          <span>USDT/NGN: <strong className="text-white">₦1,500.00</strong> <span className="text-[#10B981]">+0.4%</span></span>
          <span>BTC/USDT: <strong className="text-white">$67,473.54</strong> <span className="text-[#10B981]">+2.1%</span></span>
          <span>ETH/USDT: <strong className="text-white">$3,420.10</strong> <span className="text-[#EF4444]">-0.8%</span></span>
          <span>USDC/NGN: <strong className="text-white">₦1,498.50</strong> <span className="text-[#10B981]">+0.2%</span></span>
          <span>SOL/USDT: <strong className="text-white">$145.80</strong> <span className="text-[#10B981]">+5.4%</span></span>
        </motion.div>
      </div>

      {/* Balance Card */}
      <motion.div 
        className="glass-card p-5 sm:p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs sm:text-sm font-medium text-[#94A3B8] flex items-center gap-2">
              Total Wallet Balance
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="hover:text-white transition-colors"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </p>
            <div className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              {isLoadingBalance ? (
                <div className="h-8 sm:h-10 w-36 sm:w-48 skeleton rounded-lg"></div>
              ) : showBalance ? (
                currency === 'USDT' ? (
                  `$${balanceData?.usdt?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'} USDT`
                ) : (
                  `₦${balanceData?.fiat?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`
                )
              ) : (
                '••••••••'
              )}
            </div>
            {showBalance && (
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                {currency === 'USDT'
                  ? `≈ ₦${balanceData?.fiat?.toLocaleString() || '0.00'}`
                  : `≈ $${balanceData?.usdt?.toLocaleString()} USDT`}
              </p>
            )}
          </div>

          <button 
            onClick={() => setCurrency(currency === 'USDT' ? 'NGN' : 'USDT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all btn-outline-${variant}`}
          >
            <Repeat className="w-3 h-3" />
            {currency === 'USDT' ? 'Show NGN' : 'Show USDT'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 pt-2">
          {[
            { icon: Send, label: 'Send', href: '/app/send', color: '#10B981' },
            { icon: Download, label: 'Receive', href: '/app/receive', color: '#3B82F6' },
            { icon: Repeat, label: 'Convert', href: '/app/convert', color: '#F59E0B' },
            { icon: Building2, label: 'Withdraw', href: '/app/withdraw', color: '#EC4899' },
            { icon: Smartphone, label: 'Bills', href: '/app/bills', color: '#8B5CF6' }
          ].map((action, idx) => (
            <Link key={idx} href={action.href} className="group flex flex-col items-center gap-1.5 sm:gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center group-hover:scale-105 transition-all group-hover:bg-[rgba(255,255,255,0.08)]">
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: action.color }} />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-[#94A3B8] group-hover:text-white transition-colors text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 🟢 BIG MARKET CRYPTO LIVE CHART (USDT / USDC) */}
      <motion.div 
        className="glass-card p-4 sm:p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Top bar with crypto selector tabs & timeframes */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-medium mr-1">Market:</span>
            {(['USDT', 'USDC'] as const).map((crypto) => (
              <button
                key={crypto}
                onClick={() => setSelectedCrypto(crypto)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCrypto === crypto
                    ? 'bg-white/10 text-white border border-white/20 shadow-lg'
                    : 'text-[#64748B] hover:text-white hover:bg-white/5'
                }`}
                style={selectedCrypto === crypto ? { color: colors.primary } : {}}
              >
                <Coins className="w-3.5 h-3.5" />
                {crypto}/USD
              </button>
            ))}
          </div>

          {/* Timeframes */}
          <div className="flex items-center gap-1 bg-[#121827] p-1 rounded-xl border border-white/5 self-start sm:self-auto">
            {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  timeframe === tf ? 'bg-white/10 text-white' : 'text-[#64748B] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Live price stats banner */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ${currentCrypto.currentPrice.toFixed(4)}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                currentCrypto.change24h >= 0 
                  ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.2)]'
                  : 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.2)]'
              }`}>
                {currentCrypto.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {currentCrypto.change24h >= 0 ? '+' : ''}{currentCrypto.change24h}%
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">{currentCrypto.name} Live Rate</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#64748B]">
            <div>
              <p className="text-[10px] uppercase tracking-wider">24h High</p>
              <p className="text-white font-semibold">${currentCrypto.high24h.toFixed(4)}</p>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-wider">24h Low</p>
              <p className="text-white font-semibold">${currentCrypto.low24h.toFixed(4)}</p>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-wider">24h Volume</p>
              <p className="text-white font-semibold">{currentCrypto.volume24h}</p>
            </div>
          </div>
        </div>

        {/* Large Market Chart */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentCrypto.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cryptoMarketGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} dy={5} />
              <YAxis 
                domain={['dataMin - 0.001', 'dataMax + 0.001']} 
                stroke="#64748B" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `$${val.toFixed(4)}`} 
              />
              <Tooltip 
                cursor={{ stroke: '#3B82F6', strokeDasharray: '4 4', strokeWidth: 1.5 }}
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#181F32] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                        <p className="font-bold text-white text-sm">${payload[0].value?.toFixed(4)}</p>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">{selectedCrypto}/USD · {payload[0].payload.time}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors.primary} 
                strokeWidth={2.5} 
                fill="url(#cryptoMarketGradient)" 
                activeDot={{ r: 6, fill: colors.primary, stroke: '#ffffff', strokeWidth: 2 }}
                animationDuration={1800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 📊 SECOND ROW: CASH FLOW (MONEY IN vs MONEY OUT) & REFERRALS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Money In vs Money Out Cash Flow Chart */}
        <motion.div 
          className="glass-card p-4 sm:p-5 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <div>
              <h3 className="font-semibold text-white text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#10B981]" /> Cash Flow Movement
              </h3>
              <p className="text-[11px] text-[#64748B]">Money In vs. Money Out (7 Days)</p>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Money In
              </span>
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Money Out
              </span>
            </div>
          </div>

          {/* Cash flow totals */}
          <div className="grid grid-cols-2 gap-3 mb-3 bg-[#121827] p-3 rounded-xl border border-white/5">
            <div>
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Total Money In</p>
              <p className="text-sm font-bold text-[#10B981]">+$9,120.00</p>
            </div>
            <div>
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Total Money Out</p>
              <p className="text-sm font-bold text-[#EF4444]">-$2,890.00</p>
            </div>
          </div>

          <div className="h-52 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  cursor={{ stroke: '#3B82F6', strokeDasharray: '4 4' }}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#181F32] border border-white/10 p-3 rounded-xl shadow-2xl">
                          <p className="text-xs font-bold text-white mb-1.5">{payload[0]?.payload?.day}</p>
                          <p className="text-xs text-[#10B981] font-semibold">Money In: +${payload[0]?.value}</p>
                          <p className="text-xs text-[#EF4444] font-semibold mt-0.5">Money Out: -${payload[1]?.value}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area type="monotone" dataKey="moneyIn" stroke="#10B981" strokeWidth={2.5} fill="url(#inflowGradient)" />
                <Area type="monotone" dataKey="moneyOut" stroke="#EF4444" strokeWidth={2.5} fill="url(#outflowGradient)" />
              </AreaChart>
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
          <Link href="/app/history" className="text-xs font-semibold hover:underline" style={{ color: colors.primary }}>
            View All
          </Link>
        </div>

        {isLoadingTx ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 skeleton rounded-xl" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-[#64748B] mx-auto mb-2 opacity-50" />
            <p className="text-sm text-[#94A3B8]">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {list.slice(0, 5).map((tx: any) => {
              const isSend = tx.type === 'send'
              const isReceive = tx.type === 'receive'
              return (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.04)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSend ? 'bg-red-500/10 text-red-400' : isReceive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {isSend ? <ArrowUpRight className="w-5 h-5" /> : isReceive ? <ArrowDownLeft className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white capitalize">{tx.type}</p>
                      <p className="text-xs text-[#64748B]">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-bold ${isSend ? 'text-red-400' : isReceive ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isSend ? '-' : '+'}${tx.amount} {tx.currency || 'USDT'}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                      tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
