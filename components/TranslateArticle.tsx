'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  ChevronDown,
  Languages,
  Loader2,
  Lock,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react'

type TranslateArticleProps = {
  title: string
  content: string
}

type Language = {
  code: string
  name: string
  nativeName: string
  isPremium?: boolean
}

type TranslationEventDetail = {
  title: string
  content: string
  language: string
  translated: boolean
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', isPremium: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isPremium: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isPremium: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', isPremium: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isPremium: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isPremium: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', isPremium: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isPremium: true },
]

function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'en'
  }
  const browserLanguage = navigator.language?.toLowerCase() || 'en'
  const languageCode = browserLanguage.split('-')[0]
  const supported = LANGUAGES.some((language) => language.code === languageCode)
  return supported ? languageCode : 'en'
}

function dispatchTranslationEvent(detail: TranslationEventDetail) {
  if (typeof window === 'undefined') {
    return
  }
  window.dispatchEvent(
    new CustomEvent<TranslationEventDetail>('article-translation', {
      detail,
    }),
  )
}

export default function TranslateArticle({
  title,
  content,
}: TranslateArticleProps) {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [translatedTitle, setTranslatedTitle] = useState(title)
  const [translatedContent, setTranslatedContent] = useState(content)
  const [isTranslated, setIsTranslated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const selectedLanguageData = useMemo(
    () => LANGUAGES.find((language) => language.code === selectedLanguage),
    [selectedLanguage],
  )

  useEffect(() => {
    const browserLanguage = getBrowserLanguage()
    // Default to English if browser language is a premium feature
    const matchedLang = LANGUAGES.find((lang) => lang.code === browserLanguage)
    setSelectedLanguage(matchedLang?.isPremium ? 'en' : browserLanguage)
  }, [])

  useEffect(() => {
    setTranslatedTitle(title)
    setTranslatedContent(content)

    if (!isTranslated) {
      dispatchTranslationEvent({
        title,
        content,
        language: 'en',
        translated: false,
      })
    }
  }, [title, content, isTranslated])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleLanguageSelect = (language: Language) => {
    if (language.isPremium) {
      router.push('/pricing')
      return
    }
    setSelectedLanguage(language.code)
    setError('')
  }

  const translateArticle = async () => {
    setError('')

    const targetLangData = LANGUAGES.find((l) => l.code === selectedLanguage)
    if (targetLangData?.isPremium) {
      router.push('/pricing')
      return
    }

    if (selectedLanguage === 'en') {
      restoreOriginal()
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/translate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          targetLanguage: selectedLanguage,
        }),
      })

      let data: {
        success?: boolean
        title?: string
        content?: string
        message?: string
      }

      try {
        data = await response.json()
      } catch {
        throw new Error('The translation service returned an invalid response.')
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Translation failed. Please try again.')
      }

      const newTitle = data.title || title
      const newContent = data.content || content

      setTranslatedTitle(newTitle)
      setTranslatedContent(newContent)
      setIsTranslated(true)
      setOpen(false)

      dispatchTranslationEvent({
        title: newTitle,
        content: newContent,
        language: selectedLanguage,
        translated: true,
      })

      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      })
    } catch (error) {
      console.error('Translation error:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to translate this article. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const restoreOriginal = () => {
    setTranslatedTitle(title)
    setTranslatedContent(content)
    setIsTranslated(false)
    setError('')
    setSelectedLanguage('en')

    dispatchTranslationEvent({
      title,
      content,
      language: 'en',
      translated: false,
    })

    setOpen(false)

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    })
  }

  return (
    <div className='w-full max-w-md sm:max-w-none'>
      <div className='relative inline-block w-full sm:w-auto'>
        <button
          type='button'
          onClick={() => {
            setError('')
            setOpen((value) => !value)
          }}
          disabled={loading}
          aria-expanded={open}
          aria-haspopup='menu'
          aria-label='Translate article'
          className={`group flex h-11 w-full items-center justify-between gap-2.5 rounded-xl border px-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3d348b]/20 sm:w-auto sm:justify-start ${
            isTranslated
              ? 'border-[#3d348b]/30 bg-gradient-to-r from-[#3d348b]/10 to-[#7678ed]/10 text-[#3d348b] shadow-sm'
              : 'border-gray-200/80 bg-white/80 text-gray-700 shadow-sm backdrop-blur-md hover:border-[#7678ed]/40 hover:bg-[#3d348b]/5 hover:text-[#3d348b]'
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <div className='flex items-center gap-2.5 min-w-0'>
            <Languages className='h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 text-[#3d348b]' />
            <span className='truncate'>
              {isTranslated
                ? selectedLanguageData?.nativeName || 'Translated'
                : 'Translate'}
            </span>
          </div>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
              open ? 'rotate-180 text-[#3d348b]' : ''
            }`}
          />
        </button>

        {open && (
          <>
            <div
              onClick={() => setOpen(false)}
              className='fixed inset-0 z-40 bg-gray-950/20 backdrop-blur-xs transition-opacity sm:bg-transparent sm:backdrop-blur-none'
            />

            <div
              role='menu'
              className='fixed inset-x-4 bottom-4 z-50 max-h-[85vh] overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-2xl transition-all sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[320px] sm:rounded-2xl sm:p-3 sm:shadow-xl sm:shadow-gray-950/10 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5 sm:slide-in-from-top-2'
            >
              <div className='flex items-center justify-between border-b border-gray-100 px-1 pb-3 pt-1 sm:px-2'>
                <div className='flex items-center gap-2.5'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-[#3d348b]/10 text-[#3d348b]'>
                    <Sparkles className='h-4.5 w-4.5' />
                  </div>
                  <div>
                    <p className='text-sm font-bold text-gray-900 leading-tight'>
                      Translate Article
                    </p>
                    <p className='text-[11px] font-medium text-gray-400'>
                      Select target language
                    </p>
                  </div>
                </div>

                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  className='rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:hidden'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='my-2 max-h-56 sm:max-h-60 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-200'>
                {LANGUAGES.map((language) => {
                  const active = language.code === selectedLanguage

                  return (
                    <button
                      key={language.code}
                      type='button'
                      role='menuitem'
                      onClick={() => handleLanguageSelect(language)}
                      className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                        active
                          ? 'bg-[#3d348b]/10 text-[#3d348b]'
                          : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <div className='min-w-0'>
                        <div className='flex items-center gap-1.5'>
                          <p
                            className={`text-sm font-semibold leading-tight ${
                              active ? 'text-[#3d348b]' : 'text-gray-900'
                            }`}
                          >
                            {language.nativeName}
                          </p>
                        </div>
                        <p className='text-[11px] font-medium text-gray-400 group-hover:text-gray-500'>
                          {language.name}
                        </p>
                      </div>

                      {language.isPremium ? (
                        <div className='flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 border border-amber-200/60 text-[10px] font-bold text-amber-700 group-hover:bg-amber-100 transition-colors'>
                          <Lock className='h-3 w-3 text-amber-600' />
                          <span>PRO</span>
                        </div>
                      ) : active ? (
                        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-[#3d348b] text-white shadow-xs'>
                          <Check className='h-3 w-3 stroke-[3]' />
                        </div>
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {error && (
                <div
                  role='alert'
                  className='my-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 flex items-start gap-2'
                >
                  <span className='shrink-0 font-bold'>!</span>
                  <span>{error}</span>
                </div>
              )}

              <div className='mt-3 border-t border-gray-100 pt-3 space-y-2'>
                <button
                  type='button'
                  onClick={translateArticle}
                  disabled={loading}
                  className='flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3d348b] px-4 text-sm font-semibold text-white shadow-md shadow-[#3d348b]/20 transition-all hover:bg-[#302873] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {loading ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <span>Translating...</span>
                    </>
                  ) : selectedLanguageData?.isPremium ? (
                    <>
                      <Lock className='h-4 w-4' />
                      <span>Upgrade to Pro</span>
                    </>
                  ) : selectedLanguage === 'en' ? (
                    <>
                      <RotateCcw className='h-4 w-4' />
                      <span>Restore Original</span>
                    </>
                  ) : (
                    <>
                      <Languages className='h-4 w-4' />
                      <span>Translate Now</span>
                    </>
                  )}
                </button>

                {isTranslated && (
                  <button
                    type='button'
                    onClick={restoreOriginal}
                    disabled={loading}
                    className='flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50'
                  >
                    <RotateCcw className='h-3.5 w-3.5' />
                    Show original (English)
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {isTranslated && (
        <div className='mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#7678ed]/20 bg-gradient-to-r from-[#3d348b]/5 to-[#7678ed]/5 px-3.5 py-2.5 text-xs font-medium text-[#3d348b] shadow-xs'>
          <div className='flex items-center gap-2 min-w-0'>
            <span className='relative flex h-2 w-2 shrink-0'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3d348b] opacity-75'></span>
              <span className='relative inline-flex h-2 w-2 rounded-full bg-[#3d348b]'></span>
            </span>
            <span className='truncate'>
              Translated to{' '}
              <strong className='font-bold text-[#3d348b]'>
                {selectedLanguageData?.nativeName || selectedLanguageData?.name}
              </strong>
            </span>
          </div>

          <button
            type='button'
            onClick={restoreOriginal}
            className='inline-flex shrink-0 items-center gap-1 font-bold text-[#3d348b] hover:underline focus:outline-none'
          >
            <X className='h-3.5 w-3.5' />
            Original
          </button>
        </div>
      )}
    </div>
  )
}
