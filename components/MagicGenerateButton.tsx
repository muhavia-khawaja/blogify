'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2, Wand2, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  title: string
}

export default function MagicGenerateButton({
  categories,
}: {
  categories: Category[]
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [topic, setTopic] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const router = useRouter()

  const handleGenerate = async () => {
    if (!topic || !selectedCategory) {
      alert('Please provide both a topic and a category.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          categoryId: selectedCategory,
        }),
      })

      if (res.ok) {
        setSuccess(true)
        setTopic('')
        router.refresh()

        // Reset success state after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const errData = await res.json()
        alert(`Generation failed: ${errData.error}`)
      }
    } catch (err) {
      console.error('System Error:', err)
      alert('Lost connection to the AI Archive.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-2xl bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]'>
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200'>
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className='text-lg font-serif font-bold text-gray-900'>
            AI Content Forge
          </h3>
          <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
            Auto-generate Archive Exhibits
          </p>
        </div>
      </div>

      <div className='space-y-5'>
        {/* Topic Input */}
        <div className='space-y-2'>
          <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4'>
            Primary Topic
          </label>
          <input
            type='text'
            placeholder='e.g., The Impact of C++ on Modern Game Engines'
            className='w-full bg-gray-50 border-none p-5 rounded-3xl text-sm font-serif outline-none focus:ring-2 ring-emerald-100 transition-all'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Category Selection */}
        <div className='space-y-2'>
          <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4'>
            Archive Category
          </label>
          <select
            className='w-full bg-gray-50 border-none p-5 rounded-3xl text-sm font-serif outline-none focus:ring-2 ring-emerald-100 transition-all appearance-none'
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value=''>Select a destination...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* The Magic Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || success}
          className={`group relative w-full py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 overflow-hidden ${
            success
              ? 'bg-emerald-500 text-white'
              : 'bg-black text-white hover:bg-emerald-600'
          }`}
        >
          <span className='relative z-10 flex items-center justify-center gap-3'>
            {loading ? (
              <>
                <Loader2 className='animate-spin' size={18} />
                Cataloging Knowledge...
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={18} />
                Exhibit Added
              </>
            ) : (
              <>
                <Wand2
                  size={18}
                  className='group-hover:rotate-12 transition-transform'
                />
                Invoke Magic Generation
              </>
            )}
          </span>
          {!loading && !success && (
            <div className='absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
          )}
        </button>
      </div>

      <p className='mt-6 text-center text-[9px] font-medium text-gray-300 italic tracking-wide'>
        Powered by OpenAI GPT-4o-mini & The Hamza Learning Ecosystem
      </p>
    </div>
  )
}
