'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Repeat, ArrowDown, Building2, CheckCircle2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { conversionAPI, bankAPI } from '@/lib/api'
import { useTheme } from '@/context/ThemeContext'

export default function ConvertPage() {
  const { variant, colors } = useTheme()
  const [amount, setAmount] = useState<string>('')
  const [fiatCurrency, setFiatCurrency] = useState('NGN')
  const [step, setStep] = useState(1)
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  const { data: ratesData, isLoading: isLoadingRates } = useQuery({
    queryKey: ['rates', fiatCurrency],
    queryFn: () => conversionAPI.getRates(fiatCurrency),
    initialData: { rate: fiatCurrency === 'NGN' ? 1500 : 13.5 }
  })

  const { data: banksData } = useQuery({
    queryKey: ['savedBanks'],
    queryFn: bankAPI.list,
    initialData: [
      { id: '1', bankName: 'Guaranty Trust Bank', accountNumber: '0123456789' },
      { id: '2', bankName: 'Zenith Bank', accountNumber: '9876543210' }
    ]
  })

  const rate = ratesData?.rate || 1500
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
    <div className="p-4 md:p-8 max-w-md mx-auto min-h-[80vh] flex flex-col pt-8">
      <AnimatePresence mode="wait">
        {/* Step 1: Amount & Currency */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className={`glass-card-${variant} p-6`}>
            <h2 className="text-xl font-bold text-white mb-6">Convert to Fiat</h2>
            
            <div className="space-y-6">
              {/* You Send */}
              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                <label className="text-xs text-[#94A3B8] mb-2 block">You Send</label>
                <div className="flex justify-between items-center">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-3xl font-bold text-white w-[60%] focus:outline-none appearance-none"
                  />
                  <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center text-[10px] font-bold text-white">₮</div>
                    <span className="font-medium text-sm">USDT</span>
                  </div>
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="flex justify-center -my-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#0F1629] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              {/* They Receive */}
              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                <label className="text-xs text-[#94A3B8] mb-2 block">You Receive (Est.)</label>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold text-white truncate max-w-[60%]">
                    {receiveAmount > 0 ? receiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                  </div>
                  <select 
                    value={fiatCurrency}
                    onChange={(e) => setFiatCurrency(e.target.value)}
                    className="bg-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-lg font-medium text-sm text-white border-none focus:ring-0 cursor-pointer"
                  >
                    <option value="NGN">NGN</option>
                    <option value="GHS">GHS</option>
                    <option value="KES">KES</option>
                  </select>
                </div>
              </div>

              <div className="text-sm space-y-2 py-2 border-y border-[rgba(255,255,255,0.05)]">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Rate</span>
                  <span className="text-white">1 USDT = {rate.toLocaleString()} {fiatCurrency}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Fee</span>
                  <span className="text-white">{fee} USDT</span>
                </div>
              </div>

              <button 
                onClick={handleNext}
                disabled={!numAmount || numAmount <= fee}
                className={`w-full py-4 rounded-xl text-center btn-${variant} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Bank */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={`glass-card-${variant} p-6`}>
            <button onClick={() => setStep(1)} className="text-[#94A3B8] hover:text-white mb-6 text-sm">← Back</button>
            <h2 className="text-xl font-bold text-white mb-6">Select Bank Account</h2>
            
            <div className="space-y-3 mb-6">
              {banksData?.map((bank: any) => (
                <label key={bank.id} className="flex items-center p-4 border border-[rgba(255,255,255,0.05)] rounded-xl cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <input 
                    type="radio" 
                    name="bank" 
                    value={bank.id} 
                    checked={selectedBank === bank.id}
                    onChange={() => setSelectedBank(bank.id)}
                    className="mr-4 accent-[#D4A017]"
                  />
                  <div>
                    <p className="font-medium text-white">{bank.bankName}</p>
                    <p className="text-xs text-[#94A3B8]">{bank.accountNumber}</p>
                  </div>
                </label>
              ))}
              
              <button className="w-full p-4 border border-dashed border-[rgba(255,255,255,0.2)] rounded-xl text-[#94A3B8] hover:text-white hover:border-[rgba(255,255,255,0.4)] transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                <Building2 className="w-4 h-4" /> Add New Bank Account
              </button>
            </div>

            <button 
              onClick={() => setStep(3)}
              disabled={!selectedBank}
              className={`w-full py-4 rounded-xl text-center btn-${variant} disabled:opacity-50`}
            >
              Review Withdrawal
            </button>
          </motion.div>
        )}

        {/* Step 3: PIN */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`glass-card-${variant} p-6 text-center`}>
            <button onClick={() => setStep(2)} className="absolute top-6 left-6 text-[#94A3B8] hover:text-white">←</button>
            <h2 className="text-xl font-bold text-white mb-2 mt-4">Enter PIN</h2>
            <p className="text-sm text-[#94A3B8] mb-8">Confirm withdrawal to your bank</p>
            
            <div className="flex justify-center gap-3 mb-8">
              {pin.map((p, i) => (
                <div key={i} className={`w-4 h-4 rounded-full ${p ? 'bg-white' : 'border border-[rgba(255,255,255,0.2)]'}`} style={p ? { backgroundColor: colors.primary } : {}} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} onClick={() => handlePinInput(num.toString())} className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-xl font-medium text-white transition-colors mx-auto flex items-center justify-center">
                  {num}
                </button>
              ))}
              <div />
              <button onClick={() => handlePinInput('0')} className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-xl font-medium text-white transition-colors mx-auto flex items-center justify-center">
                0
              </button>
              <button onClick={handlePinDelete} className="w-16 h-16 rounded-full text-[#94A3B8] hover:text-white transition-colors mx-auto flex items-center justify-center">
                ⌫
              </button>
            </div>

            {isLoading && <div className="mt-6 text-sm text-[#94A3B8]">Processing withdrawal...</div>}
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`glass-card-${variant} p-8 text-center`}>
            <div className="w-20 h-20 mx-auto rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Initiated</h2>
            <p className="text-[#94A3B8] mb-8">
              {receiveAmount.toLocaleString()} {fiatCurrency} will arrive in your bank account shortly. Estimated delivery: &lt; 5 minutes.
            </p>
            
            <button onClick={() => window.location.href = '/app/dashboard'} className={`w-full py-4 rounded-xl text-center btn-outline-${variant}`}>
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
