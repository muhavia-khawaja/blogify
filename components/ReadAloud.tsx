'use client'
import { useState, useEffect, useRef } from 'react'
import { FiVolume2, FiSquare, FiPlay } from 'react-icons/fi'

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
      if (resumeIndex >= plainText.length - 5) {
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
        'bg-blue-100',
        'text-blue-900',
        'font-bold',
        'rounded-sm',
        'ring-2',
        'ring-blue-100',
      )
      wordEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const clearHighlights = () => {
    document.querySelectorAll('.read-word').forEach((el) => {
      el.classList.remove(
        'bg-blue-100',
        'text-blue-900',
        'font-bold',
        'rounded-sm',
        'ring-2',
        'ring-blue-100',
      )
    })
  }

  return (
    <div className='flex flex-col items-center'>
      <button
        onClick={toggleRead}
        className={`group w-16 h-16 rounded-2xl border flex flex-col items-center justify-center transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 mt-4 ${
          isReading
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-400 border-gray-100 hover:text-blue-600 hover:border-blue-200'
        }`}
      >
        {isReading ? (
          <FiSquare size={16} />
        ) : resumeIndex > 0 ? (
          <FiPlay size={16} />
        ) : (
          <FiVolume2 size={16} />
        )}
        <span className='text-[10px] mt-1 font-bold uppercase'>
          {isReading ? 'Stop' : resumeIndex > 0 ? 'Resume' : 'Listen'}
        </span>
      </button>

      {resumeIndex > 0 && !isReading && (
        <button
          onClick={() => {
            setResumeIndex(0)
            clearHighlights()
          }}
          className='text-[9px] mt-2 text-gray-400 hover:text-red-500 font-bold uppercase tracking-tighter'
        >
          Reset to start
        </button>
      )}
    </div>
  )
}
