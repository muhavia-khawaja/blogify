'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Loader2,
  Wand2,
  CheckCircle2,
  Copy,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  title: string
}

interface GeneratedArticle {
  id: string
  title: string
  short_desc: string
  slug: string
  status: string
}

export default function MagicGenerateButton({
  categories,
}: {
  categories: Category[]
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topic, setTopic] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [generatedArticle, setGeneratedArticle] =
    useState<GeneratedArticle | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!topic.trim() || !selectedCategory) {
      setError('Please provide both a topic and a category.')
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedArticle(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          categoryId: selectedCategory,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success && data.article) {
        setGeneratedArticle(data.article)
        setSuccess(true)
        setTopic('')
        setSelectedCategory('')
        router.refresh()
        setTimeout(() => setSuccess(false), 8000)
      } else {
        setError(data.error || 'Failed to generate article. Please try again.')
      }
    } catch (err) {
      console.error('Generation Error:', err)
      setError('Lost connection. Please check your network and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (generatedArticle?.title) {
      navigator.clipboard.writeText(generatedArticle.title)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isReady = topic.trim().length > 0 && selectedCategory.length > 0

  return (
    <div className='w-full space-y-5'>
      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
        <div className='px-7 py-5 border-b border-gray-100 flex items-center gap-3'>
          <div className='w-9 h-9 bg-[#0F0F0F] rounded-xl flex items-center justify-center shrink-0'>
            <Sparkles size={16} className='text-emerald-400' />
          </div>
          <div>
            <h3 className='text-sm font-serif font-bold text-[#1A1A1A]'>
              AI Content Generator
            </h3>
            <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mt-0.5'>
              Powered by GPT-4o
            </p>
          </div>
        </div>

        <div className='px-7 py-6 space-y-5'>
          {error && (
            <div className='flex gap-3 px-4 py-3.5 bg-red-50 border border-red-100 rounded-xl'>
              <AlertCircle size={16} className='text-red-500 shrink-0 mt-0.5' />
              <p className='text-sm text-red-600 font-serif'>{error}</p>
            </div>
          )}

          <div className='space-y-1.5'>
            <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1'>
              Topic
            </label>
            <input
              type='text'
              placeholder='e.g. The Future of AI in Design Systems'
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value)
                setError(null)
              }}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isReady) handleGenerate()
              }}
              className='w-full bg-white border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-serif text-[#1A1A1A] placeholder:text-gray-300 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all disabled:opacity-50'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1'>
              Category
            </label>
            <div className='relative'>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setError(null)
                }}
                disabled={loading}
                className='w-full bg-white border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-serif text-[#1A1A1A] outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all disabled:opacity-50 appearance-none cursor-pointer'
              >
                <option value=''>Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className='absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || success || !isReady}
            className={`group relative w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
              success
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-[#0F0F0F] text-white'
            }`}
          >
            <span className='relative z-10 flex items-center justify-center gap-2.5'>
              {loading ? (
                <>
                  <Loader2 className='animate-spin' size={15} />
                  Generating Article...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={15} />
                  Article Created
                </>
              ) : (
                <>
                  <Wand2
                    size={15}
                    className='group-hover:rotate-12 transition-transform duration-300'
                  />
                  Generate Article
                </>
              )}
            </span>

            {!success && (
              <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
            )}
          </button>

          {loading && (
            <div className='space-y-2'>
              <div className='h-1 w-full bg-gray-100 rounded-full overflow-hidden'>
                <div className='h-full bg-emerald-500 rounded-full animate-[progress_20s_ease-in-out_forwards]' />
              </div>
              <p className='text-[9px] font-black uppercase tracking-widest text-gray-400 text-center'>
                AI is writing your article...
              </p>
            </div>
          )}
        </div>
      </div>

      {success && generatedArticle && (
        <div className='bg-white rounded-2xl border border-emerald-100 overflow-hidden'>
          <div className='bg-[#0F0F0F] px-6 py-4 flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2.5'>
              <div className='w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center'>
                <CheckCircle2 size={14} className='text-emerald-400' />
              </div>
              <div>
                <p className='text-[10px] font-black uppercase tracking-[0.3em] text-white'>
                  Article Generated
                </p>
                <p className='text-[9px] text-white/40 uppercase tracking-widest font-bold mt-0.5'>
                  {generatedArticle.status}
                </p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className='w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors'
              title='Copy title'
            >
              {copied ? (
                <CheckCircle2 size={14} className='text-emerald-400' />
              ) : (
                <Copy size={14} className='text-white/60' />
              )}
            </button>
          </div>

          <div className='px-6 py-5 space-y-4'>
            <div>
              <p className='text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2'>
                Title
              </p>
              <p className='font-serif font-bold text-lg text-[#1A1A1A] leading-snug'>
                {generatedArticle.title}
              </p>
            </div>

            <div className='pt-4 border-t border-gray-50'>
              <p className='text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2'>
                Summary
              </p>
              <p className='text-sm font-serif italic text-gray-500 leading-relaxed'>
                {generatedArticle.short_desc}
              </p>
            </div>
          </div>

          <div className='px-6 py-4 border-t border-gray-50 flex items-center justify-between'>
            <p className='text-[9px] font-black uppercase tracking-widest text-gray-300'>
              ID · {generatedArticle.id.slice(0, 8)}
            </p>
            <Link
              href={`/articles/${generatedArticle.slug}`}
              target='_blank'
              className='flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-emerald-600 hover:text-emerald-800 transition-colors'
            >
              View Article
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 90% }
        }
      `}</style>
    </div>
  )
}
