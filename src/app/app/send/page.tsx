'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { QrCode, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Confetti from 'react-confetti'
import toast from 'react-hot-toast'
import { walletAPI } from '@/lib/api'
import { useTheme } from '@/context/ThemeContext'

const sendSchema = z.object({
  address: z.string().min(10, 'Invalid wallet address'),
  network: z.enum(['TRC20', 'BEP20', 'POLYGON']),
  amount: z.number().positive('Amount must be positive')
})

type SendFormValues = z.infer<typeof sendSchema>

export default function SendPage() {
  const { variant, colors } = useTheme()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<SendFormValues>>({})
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 0, height: typeof window !== 'undefined' ? window.innerHeight : 0 })

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<SendFormValues>({
    resolver: zodResolver(sendSchema),
    defaultValues: { network: 'TRC20' }
  })

  const networkFee = 1.0 // Mock fee

  const onSubmitStep1 = (data: { address: string; network: 'TRC20'|'BEP20'|'POLYGON' }) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(2)
  }

  const onSubmitStep2 = (data: { amount: number }) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(3)
  }

  const handlePinInput = (num: string) => {
    const emptyIndex = pin.findIndex(p => p === '')
    if (emptyIndex !== -1) {
      const newPin = [...pin]
      newPin[emptyIndex] = num
      setPin(newPin)
      if (emptyIndex === 5) {
        executeSend(newPin.join(''))
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

  const executeSend = async (finalPin: string) => {
    setIsLoading(true)
    try {
      await walletAPI.send({
        address: formData.address!,
        amount: formData.amount!,
        network: formData.network!,
        pin: finalPin
      })
      setIsSuccess(true)
      setStep(5)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Transaction failed')
      setPin(['', '', '', '', '', ''])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-md mx-auto min-h-[80vh] flex flex-col justify-center">
      {isSuccess && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      <AnimatePresence mode="wait">
        {/* Step 1: Address & Network */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={`glass-card-${variant} p-6`}>
            <h2 className="text-2xl font-bold text-white mb-6">Send USDT</h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-[#94A3B8] mb-2 block">Recipient Address</label>
                <div className="relative">
                  <input {...register('address')} placeholder="Paste USDT address" className={`input-field input-field-${variant} pr-12`} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white">
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
                {errors.address && <p className="text-[#EF4444] text-sm mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#94A3B8] mb-2 block">Network</label>
                <div className="grid grid-cols-3 gap-2">
                  {['TRC20', 'BEP20', 'POLYGON'].map((net) => (
                    <label key={net} className="cursor-pointer">
                      <input type="radio" value={net} {...register('network')} className="peer sr-only" />
                      <div className={`text-center py-2 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] text-sm font-medium text-[#94A3B8] peer-checked:bg-[rgba(255,255,255,0.1)] peer-checked:text-white peer-checked:border-[${colors.primary}] transition-all`}>
                        {net}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSubmit(onSubmitStep1 as any)} 
                className={`w-full py-4 rounded-xl text-center btn-${variant} flex justify-center items-center mt-4`}
              >
                Next <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={`glass-card-${variant} p-6`}>
            <button onClick={() => setStep(1)} className="text-[#94A3B8] hover:text-white mb-6 flex items-center text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Enter Amount</h2>
            
            <div className="space-y-6 text-center">
              <div>
                <div className="flex justify-center items-baseline mb-2">
                  <span className="text-2xl text-[#64748B]">$</span>
                  <input 
                    {...register('amount', { valueAsNumber: true })} 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    className="bg-transparent text-5xl font-bold text-white text-center w-full max-w-[200px] focus:outline-none appearance-none"
                  />
                </div>
                <div className="text-sm text-[#94A3B8]">
                  Balance: $2,450.75 <button type="button" onClick={() => setValue('amount', 2450.75)} className="text-white hover:underline" style={{ color: colors.primary }}>Max</button>
                </div>
                {errors.amount && <p className="text-[#EF4444] text-sm mt-1">{errors.amount.message}</p>}
              </div>

              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex justify-between text-sm">
                <span className="text-[#94A3B8]">Network Fee</span>
                <span className="text-white">${networkFee.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleSubmit(onSubmitStep2 as any)} 
                className={`w-full py-4 rounded-xl text-center btn-${variant} flex justify-center items-center`}
              >
                Review <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={`glass-card-${variant} p-6`}>
            <button onClick={() => setStep(2)} className="text-[#94A3B8] hover:text-white mb-6 flex items-center text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Review Transfer</h2>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#94A3B8]">To</span>
                  <span className="text-white font-medium truncate w-32">{formData.address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#94A3B8]">Network</span>
                  <span className="text-white font-medium">{formData.network}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#94A3B8]">Amount</span>
                  <span className="text-white font-medium">${formData.amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#94A3B8]">Fee</span>
                  <span className="text-white font-medium">${networkFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[rgba(255,255,255,0.1)] pt-3 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${((formData.amount || 0) + networkFee).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(4)} className={`w-full py-4 rounded-xl text-center btn-${variant} flex justify-center items-center`}>
              Confirm
            </button>
          </motion.div>
        )}

        {/* Step 4: PIN */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`glass-card-${variant} p-6 text-center`}>
            <button onClick={() => setStep(3)} className="absolute top-6 left-6 text-[#94A3B8] hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2 mt-4">Enter PIN</h2>
            <p className="text-sm text-[#94A3B8] mb-8">Enter your 6-digit PIN to authorize</p>
            
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
              <div /> {/* Empty space */}
              <button onClick={() => handlePinInput('0')} className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-xl font-medium text-white transition-colors mx-auto flex items-center justify-center">
                0
              </button>
              <button onClick={handlePinDelete} className="w-16 h-16 rounded-full text-[#94A3B8] hover:text-white transition-colors mx-auto flex items-center justify-center">
                ⌫
              </button>
            </div>

            {isLoading && <div className="mt-6 text-sm text-[#94A3B8]">Processing...</div>}
          </motion.div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`glass-card-${variant} p-8 text-center`}>
            <div className="w-20 h-20 mx-auto rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sent Successfully</h2>
            <p className="text-[#94A3B8] mb-8">Your USDT is on its way.</p>
            
            <button onClick={() => window.location.href = '/app/dashboard'} className={`w-full py-4 rounded-xl text-center btn-outline-${variant}`}>
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
