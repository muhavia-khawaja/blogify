'use client'
import { useState, useEffect, useRef } from 'react'
import { FiVolume2, FiSquare, FiPlay, FiRefreshCw } from 'react-icons/fi'

export default function ReadAloud({ text }: { text: string }) {
  const [isReading, setIsReading] = useState(false)
  const [resumeIndex, setResumeIndex] = useState(0)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const plainText = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    return () => {
      if (synthRef.current) synthRef.current.cancel()
    }
  }, [])

  const toggleRead = () => {
    if (isReading) {
      synthRef.current?.cancel()
      setIsReading(false)
      return
    }

    const textToRead = plainText.slice(resumeIndex)
    const utterance = new SpeechSynthesisUtterance(textToRead)

    utterance.rate = 0.9

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const totalCharIndex = event.charIndex + resumeIndex
        setResumeIndex(totalCharIndex)

        const wordIndex = plainText
          .substring(0, totalCharIndex)
          .split(/\s+/)
          .filter(Boolean).length
        highlightWord(wordIndex)
      }
    }

    utterance.onend = () => {
      setIsReading(false)
      if (resumeIndex >= plainText.length - 10) {
        setResumeIndex(0)
        clearHighlights()
      }
    }

    setIsReading(true)
    synthRef.current?.speak(utterance)
  }

  const highlightWord = (index: number) => {
    clearHighlights()
    const wordEl = document.querySelector(`[data-word-idx="${index}"]`)
    if (wordEl) {
      wordEl.classList.add(
        'bg-emerald-50',
        'text-emerald-900',
        'border-b-2',
        'border-emerald-500',
        'transition-all',
        'duration-300',
      )
      wordEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const clearHighlights = () => {
    document.querySelectorAll('.read-word').forEach((el) => {
      el.classList.remove(
        'bg-emerald-50',
        'text-emerald-900',
        'border-b-2',
        'border-emerald-500',
      )
    })
  }

  return (
    <div className='flex flex-col items-center group'>
      <div className='relative'>
        {isReading && (
          <span className='absolute inset-0 rounded-full bg-emerald-400/20 animate-ping' />
        )}

        <button
          onClick={toggleRead}
          className={`relative z-10 w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-500 shadow-sm ${
            isReading
              ? 'bg-black text-white border-black scale-110 shadow-emerald-200/50'
              : 'bg-white text-gray-400 border-gray-100 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-xl hover:-translate-y-1'
          }`}
        >
          {isReading ? (
            <FiSquare size={14} className='animate-pulse' />
          ) : resumeIndex > 0 ? (
            <FiPlay size={14} className='ml-0.5' />
          ) : (
            <FiVolume2 size={16} />
          )}
        </button>
      </div>

      <p className='text-[9px] mt-4 font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors'>
        {isReading ? 'Now Reading' : resumeIndex > 0 ? 'Resume' : 'Listen'}
      </p>

      {resumeIndex > 0 && !isReading && (
        <button
          onClick={() => {
            setResumeIndex(0)
            clearHighlights()
          }}
          className='flex items-center gap-1 text-[8px] mt-3 text-gray-300 hover:text-emerald-600 font-bold uppercase tracking-widest transition-colors'
        >
          <FiRefreshCw size={8} /> Reset
        </button>
      )}
    </div>
  )
}
