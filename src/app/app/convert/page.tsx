'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Repeat, ArrowDown, Building2, CheckCircle2, ChevronDown, Check, X, Globe, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { conversionAPI, bankAPI } from '@/lib/api'
import { useTheme } from '@/context/ThemeContext'

const SUPPORTED_CURRENCIES = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', rate: 1500 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', rate: 15.8 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', rate: 129.5 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', rate: 18.2 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', rate: 3680 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', rate: 2650 },
  { code: 'XOF', name: 'West African CFA', symbol: 'CFA', flag: '🇨🇲', rate: 610 }
]

export default function ConvertPage() {
  const { variant, colors } = useTheme()
  const [amount, setAmount] = useState<string>('')
  const [fiatCurrency, setFiatCurrency] = useState('NGN')
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  const selectedCurrInfo = SUPPORTED_CURRENCIES.find(c => c.code === fiatCurrency) || SUPPORTED_CURRENCIES[0]

  const { data: ratesData } = useQuery({
    queryKey: ['rates', fiatCurrency],
    queryFn: () => conversionAPI.getRates(fiatCurrency),
    initialData: { rate: selectedCurrInfo.rate }
  })

  const { data: banksData } = useQuery({
    queryKey: ['savedBanks'],
    queryFn: bankAPI.list,
    initialData: [
      { id: '1', bankName: 'Guaranty Trust Bank', accountNumber: '0123456789' },
      { id: '2', bankName: 'Zenith Bank', accountNumber: '9876543210' }
    ]
  })

  const rate = ratesData?.rate || selectedCurrInfo.rate
  const fee = 1.5 // USDT
  const numAmount = parseFloat(amount) || 0
  const receiveAmount = Math.max(0, (numAmount - fee) * rate)

  const handleNext = () => {
    if (numAmount <= fee) {
      toast.error('Amount must be greater than fee')
      return
    }
    setStep(2)
  }

  const handlePinInput = (num: string) => {
    const emptyIndex = pin.findIndex(p => p === '')
    if (emptyIndex !== -1) {
      const newPin = [...pin]
      newPin[emptyIndex] = num
      setPin(newPin)
      if (emptyIndex === 5) {
        executeConversion(newPin.join(''))
      }
    }
  }

  const handlePinDelete = () => {
    const lastFilledIndex = pin.map(p => p !== '').lastIndexOf(true)
    if (lastFilledIndex !== -1) {
      const newPin = [...pin]
      newPin[lastFilledIndex] = ''
      setPin(newPin)
    }
  }

  const executeConversion = async (finalPin: string) => {
    setIsLoading(true)
    try {
      await conversionAPI.execute({
        amount: numAmount,
        currency: fiatCurrency,
        bankAccountId: selectedBank,
        pin: finalPin
      })
      setStep(4) // Success
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Conversion failed')
      setPin(['', '', '', '', '', ''])
      setStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 py-6 md:p-8 max-w-md mx-auto min-h-[80vh] flex flex-col pt-4 pb-36">
      <AnimatePresence mode="wait">
        {/* Step 1: Amount & Currency */}
        {step === 1 && (
          <motion.div 
            key="step1" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="glass-card p-6 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <Repeat className="w-5 h-5" style={{ color: colors.primary }} /> Convert USDT to Fiat
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">Instant payout to your local bank account</p>
              </div>
            </div>
            
            <div className="space-y-5">
              {/* You Send */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 focus-within:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#94A3B8]">You Send (USDT)</label>
                  <button 
                    type="button" 
                    onClick={() => setAmount('100')} 
                    className="text-[11px] font-bold text-emerald-400 hover:underline"
                  >
                    Use $100
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-3xl font-extrabold text-white w-[60%] focus:outline-none appearance-none"
                  />
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-[#26A17B] flex items-center justify-center text-xs font-bold text-white">₮</div>
                    <span className="font-bold text-sm text-white">USDT</span>
                  </div>
                </div>
              </div>

              {/* Exchange Arrow */}
              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#0A0F1E] border border-white/10 flex items-center justify-center shadow-lg">
                  <ArrowDown className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              {/* You Receive (Est.) with Custom Glassmorphism Currency Selector Button */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">You Receive (Est. Fiat)</label>
                <div className="flex justify-between items-center gap-3">
                  <div className="text-2xl sm:text-3xl font-black text-white truncate max-w-[55%]">
                    {selectedCurrInfo.symbol} {receiveAmount > 0 ? receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                  </div>

                  {/* Sleek Custom Currency Trigger Button (Replaces ugly HTML select!) */}
                  <button
                    type="button"
                    onClick={() => setShowCurrencyModal(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 text-white font-bold text-sm transition-all shadow-md active:scale-95"
                    style={{ borderColor: colors.cardBorder }}
                  >
                    <span className="text-lg">{selectedCurrInfo.flag}</span>
                    <span className="font-extrabold text-white">{selectedCurrInfo.code}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Rate & Fee breakdown */}
              <div className="text-xs space-y-2 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Guaranteed Exchange Rate</span>
                  <span className="text-white font-bold">1 USDT = {selectedCurrInfo.symbol}{rate.toLocaleString()} {fiatCurrency}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Network Processing Fee</span>
                  <span className="text-white font-bold">{fee} USDT</span>
                </div>
              </div>

              <button 
                onClick={handleNext}
                disabled={!numAmount || numAmount <= fee}
                className="w-full py-4 rounded-xl text-center font-bold text-black shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: colors.gradientBg }}
              >
                Continue to Bank Selection
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Bank */}
        {step === 2 && (
          <motion.div 
            key="step2" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="glass-card p-6 space-y-6"
          >
            <button onClick={() => setStep(1)} className="text-[#94A3B8] hover:text-white mb-2 text-xs font-semibold flex items-center gap-1">
              ← Back to Amount
            </button>
            <h2 className="text-xl font-bold text-white">Select Bank Account</h2>
            
            <div className="space-y-3">
              {banksData?.map((bank: any) => (
                <label key={bank.id} className="flex items-center p-4 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all bg-white/[0.02]">
                  <input 
                    type="radio" 
                    name="bank" 
                    value={bank.id} 
                    checked={selectedBank === bank.id}
                    onChange={() => setSelectedBank(bank.id)}
                    className="mr-4 accent-emerald-500 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">{bank.bankName}</p>
                    <p className="text-xs text-[#94A3B8] font-mono mt-0.5">{bank.accountNumber}</p>
                  </div>
                </label>
              ))}
              
              <button 
                onClick={() => toast.success('Redirecting to Add Bank...')} 
                className="w-full p-4 border border-dashed border-white/20 rounded-2xl text-[#94A3B8] hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2 text-xs font-bold"
              >
                <Building2 className="w-4 h-4" /> Add New Bank Account
              </button>
            </div>

            <button 
              onClick={() => setStep(3)}
              disabled={!selectedBank}
              className="w-full py-4 rounded-xl text-center font-bold text-black shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
              style={{ background: colors.gradientBg }}
            >
              Review Withdrawal
            </button>
          </motion.div>
        )}

        {/* Step 3: PIN Security Confirmation */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 text-center space-y-6">
            <h2 className="text-xl font-bold text-white">Enter Transaction PIN</h2>
            <p className="text-xs text-[#94A3B8]">Confirm conversion of ${numAmount} USDT to {selectedCurrInfo.symbol}{receiveAmount.toLocaleString()} {fiatCurrency}</p>

            <div className="flex justify-center gap-3 my-6">
              {pin.map((digit, idx) => (
                <div key={idx} className={`w-10 h-12 rounded-xl border flex items-center justify-center text-xl font-bold ${digit ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 bg-white/5'}`}>
                  {digit ? '•' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button key={num} onClick={() => handlePinInput(num.toString())} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg active:scale-95">
                  {num}
                </button>
              ))}
              <button onClick={() => setStep(2)} className="p-3 rounded-xl bg-white/5 text-gray-400 text-xs font-bold">Cancel</button>
              <button onClick={() => handlePinInput('0')} className="p-3 rounded-xl bg-white/5 text-white font-bold text-lg">0</button>
              <button onClick={handlePinDelete} className="p-3 rounded-xl bg-white/5 text-red-400 font-bold text-sm">⌫</button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success Screen */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Conversion Submitted!</h2>
              <p className="text-xs text-[#94A3B8] mt-1">Your local bank account will receive {selectedCurrInfo.symbol}{receiveAmount.toLocaleString()} within 5 minutes.</p>
            </div>
            <button onClick={() => { setStep(1); setAmount(''); setPin(['','','','','','']) }} className="w-full py-3.5 rounded-xl font-bold text-black shadow-lg" style={{ background: colors.gradientBg }}>
              Done / Convert Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PREMIUM GLASSMORPHISM CURRENCY SELECTOR MODAL / BOTTOM SHEET ── */}
      <AnimatePresence>
        {showCurrencyModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-card w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl border border-white/15 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
              style={{ borderColor: variant === 'gold' ? 'rgba(212,160,23,0.4)' : 'rgba(181,226,61,0.4)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-white text-lg">Select Fiat Currency</h3>
                </div>
                <button onClick={() => setShowCurrencyModal(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Currency List Cards */}
              <div className="space-y-2.5">
                {SUPPORTED_CURRENCIES.map((curr) => {
                  const isSelected = fiatCurrency === curr.code
                  return (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setFiatCurrency(curr.code)
                        setShowCurrencyModal(false)
                        toast.success(`Selected ${curr.name} (${curr.code})`)
                      }}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                        isSelected 
                          ? 'bg-white/10 border-emerald-500/60 shadow-lg' 
                          : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                      }`}
                      style={isSelected ? { borderColor: colors.primary } : {}}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-3xl">{curr.flag}</span>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-base">{curr.code}</span>
                            <span className="text-xs text-[#94A3B8]">({curr.symbol})</span>
                          </div>
                          <p className="text-xs text-[#94A3B8] font-medium">{curr.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs font-bold text-emerald-400">1 USDT = {curr.symbol}{curr.rate.toLocaleString()}</p>
                          <p className="text-[10px] text-[#64748B]">Instant Payout</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-black" style={{ background: colors.primary }}>
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
