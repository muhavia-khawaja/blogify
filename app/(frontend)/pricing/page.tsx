'use client'

import { useState } from 'react'
import {
  Check,
  Copy,
  CheckCircle2,
  Lock,
  MessageCircle,
  Mail,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
} from 'lucide-react'

type Plan = {
  id: string
  name: string
  price: string
  period: string
  description: string
  popular?: boolean
  features: string[]
}

const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 'PKR 999',
    period: '/ month',
    description: 'Perfect for students and fast-paced learners.',
    features: [
      'Unlimited Article Translations',
      'Access to All 8+ Supported Languages',
      'Distraction-Free Reading Mode',
      'Priority AI Processing Speed',
    ],
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: 'PKR 7,999',
    period: '/ year',
    popular: true,
    description: 'Best value! Save over 30% with annual billing.',
    features: [
      'Everything in Pro Monthly',
      'Save > 30% compared to monthly',
      'Early access to new AI features',
      'VIP Dedicated Email Support',
    ],
  },
]

export default function PricingPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1])
  const [copied, setCopied] = useState(false)

  const JAZZCASH_NUMBER = '03295705457'
  const JAZZCASH_NAME = 'Khawaja Ameer Muhavia'
  const SUPPORT_EMAIL = 'educationwithhamza@gmail.com'
  const WHATSAPP_NUMBER = '923295705457'

  const handleCopy = () => {
    navigator.clipboard.writeText(JAZZCASH_NUMBER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setStep(2)
  }

  const whatsappMessage = encodeURIComponent(
    `Hello! I have sent the payment for the ${selectedPlan.name} plan (${selectedPlan.price}). Here is my payment receipt screenshot:`,
  )

  const emailSubject = encodeURIComponent(`Payment Proof: ${selectedPlan.name}`)
  const emailBody = encodeURIComponent(
    `Hi Team,\n\nI have transferred ${selectedPlan.price} via JazzCash for the ${selectedPlan.name} subscription.\n\nMy registered email: \n\nPlease find the payment screenshot attached.`,
  )

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center space-y-3 mb-10'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d348b]/10 text-[#3d348b] text-xs font-bold uppercase tracking-wider'>
            <Sparkles className='h-3.5 w-3.5' />
            <span>Unlock Full Access</span>
          </div>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight'>
            Upgrade to Pro
          </h1>
          <p className='text-slate-600 max-w-lg mx-auto text-sm sm:text-base'>
            Translate unlimited articles into Urdu, Hindi, Arabic & more with
            our high-accuracy translation suite.
          </p>

          <div className='flex items-center justify-center gap-3 pt-4'>
            <div
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                step === 1
                  ? 'bg-[#3d348b] text-white shadow-sm'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span className='h-4 w-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]'>
                1
              </span>
              <span>Select Plan</span>
            </div>
            <div className='h-0.5 w-6 bg-slate-200' />
            <div
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                step === 2
                  ? 'bg-[#3d348b] text-white shadow-sm'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span className='h-4 w-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]'>
                2
              </span>
              <span>Payment & Verification</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className='grid md:grid-cols-2 gap-6 items-stretch animate-in fade-in-50 duration-300'>
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-200 border-2 ${
                  plan.popular
                    ? 'border-[#3d348b] bg-white shadow-xl shadow-[#3d348b]/10'
                    : 'border-slate-200 bg-white/80 hover:border-slate-300 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className='absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#3d348b] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm'>
                    Most Popular
                  </div>
                )}

                <div>
                  <h2 className='text-xl font-bold text-slate-900'>
                    {plan.name}
                  </h2>
                  <p className='text-xs text-slate-500 mt-1 min-h-[32px]'>
                    {plan.description}
                  </p>

                  <div className='my-6 flex items-baseline gap-1'>
                    <span className='text-3xl sm:text-4xl font-extrabold text-slate-900'>
                      {plan.price}
                    </span>
                    <span className='text-xs font-medium text-slate-500'>
                      {plan.period}
                    </span>
                  </div>

                  <ul className='space-y-3 my-6 border-t border-slate-100 pt-6'>
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className='flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700'
                      >
                        <div className='h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0'>
                          <Check className='h-2.5 w-2.5 stroke-[3]' />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type='button'
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full mt-4 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-[#3d348b] hover:bg-[#302873] text-white shadow-md shadow-[#3d348b]/20 active:scale-[0.99]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.99]'
                  }`}
                >
                  <span>Choose {plan.name}</span>
                  <ArrowRight className='h-4 w-4' />
                </button>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className='max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 animate-in zoom-in-95 duration-200'>
            <button
              type='button'
              onClick={() => setStep(1)}
              className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors'
            >
              <ArrowLeft className='h-3.5 w-3.5' />
              <span>Back to plans</span>
            </button>

            <div className='flex items-center justify-between bg-slate-50 border border-slate-200/60 p-4 rounded-2xl mb-6'>
              <div>
                <p className='text-xs text-slate-500 font-medium'>
                  Selected Plan
                </p>
                <p className='text-sm font-bold text-slate-900'>
                  {selectedPlan.name}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-lg font-extrabold text-[#3d348b]'>
                  {selectedPlan.price}
                </p>
              </div>
            </div>

            <div className='space-y-6'>
              <div>
                <h2 className='text-lg font-bold text-slate-900 flex items-center gap-2'>
                  <CreditCard className='h-5 w-5 text-[#3d348b]' />
                  <span>Send Payment via JazzCash</span>
                </h2>
                <p className='text-xs text-slate-500 mt-1'>
                  Transfer the exact amount to our official JazzCash account to
                  activate your plan.
                </p>
              </div>

              <div className='p-5 rounded-2xl bg-gradient-to-br from-red-500/5 via-slate-50 to-amber-500/5 border border-red-200/60 relative overflow-hidden'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <span className='text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700'>
                      JazzCash Mobile Wallet
                    </span>
                    <p className='text-xs text-slate-500 mt-2 font-medium'>
                      Account Title:{' '}
                      <strong className='text-slate-800'>
                        {JAZZCASH_NAME}
                      </strong>
                    </p>
                    <p className='text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 mt-1 tracking-wider'>
                      {JAZZCASH_NUMBER}
                    </p>
                  </div>

                  <button
                    type='button'
                    onClick={handleCopy}
                    className='flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 transition-colors shrink-0'
                    title='Copy Number'
                  >
                    {copied ? (
                      <CheckCircle2 className='h-5 w-5 text-emerald-600' />
                    ) : (
                      <Copy className='h-5 w-5 text-slate-600' />
                    )}
                    <span className='text-[9px] font-bold mt-0.5'>
                      {copied ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                </div>
              </div>

              <div className='border-t border-slate-100 pt-6 space-y-4'>
                <h3 className='text-sm font-bold text-slate-900 flex items-center gap-2'>
                  <ShieldCheck className='h-4 w-4 text-emerald-600' />
                  <span>Next Step: Send Proof of Payment</span>
                </h3>
                <p className='text-xs text-slate-600 leading-relaxed'>
                  Take a screenshot of your successful transaction and send it
                  along with your <strong>registered email address</strong>.
                  Your account will be upgraded within 15–30 minutes.
                </p>

                <div className='grid sm:grid-cols-2 gap-3 pt-2'>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center gap-2.5 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99]'
                  >
                    <MessageCircle className='h-4 w-4 fill-white' />
                    <span>Send Screenshot on WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
                    className='flex items-center justify-center gap-2.5 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-slate-900/10 active:scale-[0.99]'
                  >
                    <Mail className='h-4 w-4' />
                    <span>Email Screenshot</span>
                  </a>
                </div>
              </div>

              <div className='bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 flex items-start gap-2 border border-slate-100'>
                <Lock className='h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5' />
                <span>
                  Transactions are verified manually. Please make sure the
                  screenshot shows the Transaction ID (TID) clearly.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
