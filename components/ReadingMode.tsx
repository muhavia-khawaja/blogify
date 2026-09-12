'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlignJustify,
  BookOpen,
  Bold,
  Check,
  ChevronDown,
  Maximize2,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  Type,
  X,
} from 'lucide-react'

interface ReadingModeProps {
  longDesc: string
  title?: string
}

type Theme = 'light' | 'cream' | 'sepia' | 'dark' | 'black'

type TextColor =
  | 'black'
  | 'dark'
  | 'blue'
  | 'brown'
  | 'gray'
  | 'cream'
  | 'white'

type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

type LineHeight = 'normal' | 'relaxed' | 'loose'

type ReadingWidth = 'narrow' | 'comfortable' | 'wide'

type TranslationEventDetail = {
  title: string
  content: string
  language: string
  translated: boolean
}

const themes: {
  id: Theme
  name: string
  bgClass: string
  previewClass: string
  uiTextClass: string
  borderClass: string
}[] = [
  {
    id: 'light',
    name: 'White',
    bgClass: 'bg-white',
    previewClass: 'bg-white border-gray-300',
    uiTextClass: 'text-gray-900',
    borderClass: 'border-black/10',
  },
  {
    id: 'cream',
    name: 'Cream',
    bgClass: 'bg-[#fffdf5]',
    previewClass: 'bg-[#fffdf5] border-[#e8dfc8]',
    uiTextClass: 'text-[#3d372d]',
    borderClass: 'border-[#3d372d]/15',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    bgClass: 'bg-[#f4ecd8]',
    previewClass: 'bg-[#f4ecd8] border-[#d8c8a8]',
    uiTextClass: 'text-[#4a4032]',
    borderClass: 'border-[#4a4032]/15',
  },
  {
    id: 'dark',
    name: 'Dark',
    bgClass: 'bg-[#18181b]',
    previewClass: 'bg-[#18181b] border-gray-600',
    uiTextClass: 'text-gray-100',
    borderClass: 'border-white/10',
  },
  {
    id: 'black',
    name: 'Black',
    bgClass: 'bg-black',
    previewClass: 'bg-black border-gray-700',
    uiTextClass: 'text-gray-100',
    borderClass: 'border-white/10',
  },
]

const textColors: {
  id: TextColor
  name: string
  className: string
  previewClass: string
}[] = [
  {
    id: 'black',
    name: 'Black',
    className: 'text-black',
    previewClass: 'bg-black',
  },
  {
    id: 'dark',
    name: 'Dark Gray',
    className: 'text-gray-800',
    previewClass: 'bg-gray-800',
  },
  {
    id: 'blue',
    name: 'Dark Blue',
    className: 'text-[#1e293b]',
    previewClass: 'bg-[#1e293b]',
  },
  {
    id: 'brown',
    name: 'Brown',
    className: 'text-[#4a4032]',
    previewClass: 'bg-[#4a4032]',
  },
  {
    id: 'gray',
    name: 'Gray',
    className: 'text-gray-500',
    previewClass: 'bg-gray-500',
  },
  {
    id: 'cream',
    name: 'Cream',
    className: 'text-[#f5ead2]',
    previewClass: 'bg-[#f5ead2]',
  },
  {
    id: 'white',
    name: 'White',
    className: 'text-white',
    previewClass: 'bg-white',
  },
]

const fontSizes: {
  id: FontSize
  label: string
  className: string
}[] = [
  {
    id: 'sm',
    label: 'Small',
    className: 'prose-sm',
  },
  {
    id: 'md',
    label: 'Normal',
    className: 'prose-base',
  },
  {
    id: 'lg',
    label: 'Large',
    className: 'prose-lg',
  },
  {
    id: 'xl',
    label: 'Extra Large',
    className: 'prose-xl',
  },
  {
    id: '2xl',
    label: 'Huge',
    className: 'prose-2xl',
  },
]

const lineHeights: {
  id: LineHeight
  label: string
  className: string
}[] = [
  {
    id: 'normal',
    label: 'Normal',
    className: 'prose-p:leading-7',
  },
  {
    id: 'relaxed',
    label: 'Relaxed',
    className: 'prose-p:leading-8',
  },
  {
    id: 'loose',
    label: 'Loose',
    className: 'prose-p:leading-9',
  },
]

const widths: {
  id: ReadingWidth
  label: string
  className: string
}[] = [
  {
    id: 'narrow',
    label: 'Narrow',
    className: 'max-w-2xl',
  },
  {
    id: 'comfortable',
    label: 'Comfortable',
    className: 'max-w-3xl',
  },
  {
    id: 'wide',
    label: 'Wide',
    className: 'max-w-5xl',
  },
]

const RTL_LANGUAGES = ['ur', 'ar', 'fa']

export default function ReadingMode({
  longDesc,
  title = 'Reading Mode',
}: ReadingModeProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [theme, setTheme] = useState<Theme>('light')
  const [textColor, setTextColor] = useState<TextColor>('dark')
  const [fontSize, setFontSize] = useState<FontSize>('md')
  const [lineHeight, setLineHeight] = useState<LineHeight>('relaxed')
  const [readingWidth, setReadingWidth] = useState<ReadingWidth>('comfortable')
  const [boldText, setBoldText] = useState(false)

  const [showSettings, setShowSettings] = useState(false)

  const [readingTitle, setReadingTitle] = useState(title)
  const [readingContent, setReadingContent] = useState(longDesc)
  const [language, setLanguage] = useState('en')
  const [isTranslated, setIsTranslated] = useState(false)

  /*
   * Load saved settings.
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('reading-mode-settings')

      if (!saved) return

      const settings = JSON.parse(saved)

      if (settings.theme) {
        setTheme(settings.theme)
      }

      if (settings.textColor) {
        setTextColor(settings.textColor)
      }

      if (settings.fontSize) {
        setFontSize(settings.fontSize)
      }

      if (settings.lineHeight) {
        setLineHeight(settings.lineHeight)
      }

      if (settings.readingWidth) {
        setReadingWidth(settings.readingWidth)
      }

      if (typeof settings.boldText === 'boolean') {
        setBoldText(settings.boldText)
      }
    } catch {
      // Ignore invalid localStorage data.
    }
  }, [])

  /*
   * Keep original article data synchronized
   * if the parent changes articles.
   */
  useEffect(() => {
    if (!isTranslated) {
      setReadingTitle(title)
      setReadingContent(longDesc)
      setLanguage('en')
    }
  }, [title, longDesc, isTranslated])

  /*
   * Listen for article translations.
   */
  useEffect(() => {
    const handleTranslation = (event: Event) => {
      const customEvent = event as CustomEvent<TranslationEventDetail>

      const detail = customEvent.detail

      if (!detail) return

      setReadingTitle(detail.title || title)
      setReadingContent(detail.content || longDesc)
      setLanguage(detail.language || 'en')
      setIsTranslated(Boolean(detail.translated))
    }

    window.addEventListener('article-translation', handleTranslation)

    return () => {
      window.removeEventListener('article-translation', handleTranslation)
    }
  }, [title, longDesc])

  /*
   * Save settings.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        'reading-mode-settings',
        JSON.stringify({
          theme,
          textColor,
          fontSize,
          lineHeight,
          readingWidth,
          boldText,
        }),
      )
    } catch {
      // Ignore localStorage errors.
    }
  }, [theme, textColor, fontSize, lineHeight, readingWidth, boldText])

  /*
   * Lock page scrolling while Reading Mode is open.
   */
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = ''
      return
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  /*
   * Keyboard shortcuts.
   */
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false)
          return
        }

        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, showSettings])

  const resetSettings = () => {
    setTheme('light')
    setTextColor('dark')
    setFontSize('md')
    setLineHeight('relaxed')
    setReadingWidth('comfortable')
    setBoldText(false)
  }

  const decreaseFontSize = () => {
    const index = fontSizes.findIndex((item) => item.id === fontSize)

    if (index > 0) {
      setFontSize(fontSizes[index - 1].id)
    }
  }

  const increaseFontSize = () => {
    const index = fontSizes.findIndex((item) => item.id === fontSize)

    if (index < fontSizes.length - 1) {
      setFontSize(fontSizes[index + 1].id)
    }
  }

  const currentTheme = themes.find((item) => item.id === theme) || themes[0]

  const currentTextColor =
    textColors.find((item) => item.id === textColor) || textColors[1]

  const currentFontSize =
    fontSizes.find((item) => item.id === fontSize) || fontSizes[1]

  const currentLineHeight =
    lineHeights.find((item) => item.id === lineHeight) || lineHeights[1]

  const currentWidth =
    widths.find((item) => item.id === readingWidth) || widths[1]

  const isRTL = useMemo(
    () => isTranslated && RTL_LANGUAGES.includes(language),
    [isTranslated, language],
  )

  const openReadingMode = () => {
    setIsOpen(true)
    setShowSettings(false)
  }

  const closeReadingMode = () => {
    setShowSettings(false)
    setIsOpen(false)
  }

  return (
    <>
      {/* Open Reading Mode */}
      <button
        type='button'
        onClick={openReadingMode}
        className='
          inline-flex
          h-10
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-[#3d348b]
          px-3
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition-all
          hover:bg-[#302873]
          hover:shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-[#7678ed]
          focus:ring-offset-2
          sm:px-4
        '
        aria-label='Open reading mode'
      >
        <BookOpen className='h-4 w-4 shrink-0' />

        <span className='hidden xs:inline sm:inline'>Reading Mode</span>
      </button>

      {isOpen && (
        <div
          className={`
            fixed
            inset-0
            z-[9999]
            flex
            h-[100dvh]
            w-full
            flex-col
            overflow-hidden
            transition-colors
            duration-300
            ${currentTheme.bgClass}
          `}
          role='dialog'
          aria-modal='true'
          aria-label='Reading mode'
        >
          {/* =========================
              HEADER
          ========================== */}
          <header
            className={`
              relative
              z-50
              shrink-0
              border-b
              ${currentTheme.borderClass}
              bg-inherit/95
              backdrop-blur-xl
            `}
          >
            <div
              className='
                mx-auto
                flex
                min-h-[60px]
                w-full
                max-w-7xl
                items-center
                gap-2
                px-3
                py-2.5
                sm:min-h-[68px]
                sm:px-6
                sm:py-3
              '
            >
              {/* Left */}
              <div className='flex min-w-0 flex-1 items-center gap-2.5'>
                <div
                  className='
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#3d348b]/10
                    text-[#3d348b]
                    sm:h-10
                    sm:w-10
                  '
                >
                  <BookOpen className='h-4 w-4 sm:h-5 sm:w-5' />
                </div>

                <div className='min-w-0'>
                  <div className='flex items-center gap-1.5'>
                    <p
                      className={`
                        truncate
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        opacity-60
                        sm:text-[10px]
                      `}
                    >
                      Reading Mode
                    </p>

                    {isTranslated && (
                      <span className='hidden shrink-0 rounded-full bg-[#3d348b]/10 px-2 py-0.5 text-[9px] font-bold text-[#3d348b] sm:inline-flex'>
                        Translated
                      </span>
                    )}
                  </div>

                  <h2
                    className={`
                      max-w-[45vw]
                      truncate
                      text-xs
                      font-bold
                      sm:max-w-md
                      sm:text-base
                      ${currentTheme.uiTextClass}
                    `}
                    title={readingTitle}
                  >
                    {readingTitle}
                  </h2>
                </div>
              </div>

              {/* Desktop controls */}
              <div className='hidden items-center gap-2 md:flex'>
                {/* Font size */}
                <div
                  className={`
                    flex
                    items-center
                    overflow-hidden
                    rounded-lg
                    border
                    ${currentTheme.borderClass}
                  `}
                >
                  <button
                    type='button'
                    onClick={decreaseFontSize}
                    disabled={fontSize === 'sm'}
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      transition
                      disabled:opacity-30
                      ${currentTheme.uiTextClass}
                    `}
                    aria-label='Decrease text size'
                  >
                    <Minus className='h-4 w-4' />
                  </button>

                  <div
                    className={`
                      flex
                      h-9
                      min-w-9
                      items-center
                      justify-center
                      border-x
                      ${currentTheme.borderClass}
                    `}
                  >
                    <Type className='h-4 w-4 opacity-70' />
                  </div>

                  <button
                    type='button'
                    onClick={increaseFontSize}
                    disabled={fontSize === '2xl'}
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      transition
                      disabled:opacity-30
                      ${currentTheme.uiTextClass}
                    `}
                    aria-label='Increase text size'
                  >
                    <Plus className='h-4 w-4' />
                  </button>
                </div>

                {/* Bold */}
                <button
                  type='button'
                  onClick={() => setBoldText((value) => !value)}
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    transition
                    ${
                      boldText
                        ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                        : `${currentTheme.borderClass} ${currentTheme.uiTextClass}`
                    }
                  `}
                  aria-label={
                    boldText ? 'Disable bold text' : 'Enable bold text'
                  }
                  aria-pressed={boldText}
                >
                  <Bold className='h-4 w-4' />
                </button>

                {/* Customize */}
                <button
                  type='button'
                  onClick={() => setShowSettings((value) => !value)}
                  className={`
                    flex
                    h-9
                    items-center
                    gap-2
                    rounded-lg
                    border
                    px-3
                    text-xs
                    font-semibold
                    transition
                    ${
                      showSettings
                        ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                        : `${currentTheme.borderClass} ${currentTheme.uiTextClass}`
                    }
                  `}
                  aria-expanded={showSettings}
                >
                  <Palette className='h-4 w-4' />
                  Customize
                  <ChevronDown
                    className={`
                      h-3.5
                      w-3.5
                      transition-transform
                      ${showSettings ? 'rotate-180' : ''}
                    `}
                  />
                </button>
              </div>

              {/* Close */}
              <button
                type='button'
                onClick={closeReadingMode}
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition
                  ${currentTheme.uiTextClass}
                  hover:bg-black/5
                  dark:hover:bg-white/10
                  sm:h-10
                  sm:w-10
                `}
                aria-label='Close reading mode'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </header>

          {/* =========================
              SETTINGS PANEL
          ========================== */}
          {showSettings && (
            <>
              {/* Mobile backdrop */}
              <button
                type='button'
                aria-label='Close customization'
                onClick={() => setShowSettings(false)}
                className='
                  fixed
                  inset-0
                  z-30
                  bg-black/20
                  backdrop-blur-[2px]
                  md:hidden
                '
              />

              <div
                className={`
                  absolute
                  left-0
                  right-0
                  top-[60px]
                  z-40
                  max-h-[calc(100dvh-60px)]
                  overflow-y-auto
                  border-b
                  ${currentTheme.borderClass}
                  bg-inherit
                  shadow-2xl
                  sm:top-[68px]
                  md:top-[68px]
                  md:max-h-[calc(100dvh-68px)]
                `}
              >
                <div
                  className='
                    mx-auto
                    w-full
                    max-w-6xl
                    px-4
                    py-5
                    sm:px-6
                    sm:py-6
                  '
                >
                  {/* Mobile panel header */}
                  <div className='mb-5 flex items-center justify-between md:hidden'>
                    <div>
                      <p
                        className={`
                          text-sm
                          font-bold
                          ${currentTheme.uiTextClass}
                        `}
                      >
                        Reading preferences
                      </p>

                      <p className='mt-0.5 text-xs opacity-50'>
                        Customize your reading experience
                      </p>
                    </div>

                    <button
                      type='button'
                      onClick={() => setShowSettings(false)}
                      className='
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-black/5
                        text-gray-600
                      '
                      aria-label='Close settings'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>

                  {/* Settings grid */}
                  <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                    {/* Background */}
                    <div>
                      <div className='mb-3 flex items-center gap-2'>
                        <Palette className='h-4 w-4 opacity-60' />

                        <span className='text-[11px] font-bold uppercase tracking-wider opacity-60'>
                          Background
                        </span>
                      </div>

                      <div className='flex flex-wrap gap-3'>
                        {themes.map((item) => (
                          <button
                            key={item.id}
                            type='button'
                            onClick={() => setTheme(item.id)}
                            title={item.name}
                            aria-label={`Use ${item.name} background`}
                            aria-pressed={theme === item.id}
                            className={`
                              h-9
                              w-9
                              rounded-full
                              border-2
                              transition
                              hover:scale-105
                              ${item.previewClass}
                              ${
                                theme === item.id
                                  ? 'ring-2 ring-[#3d348b] ring-offset-2'
                                  : ''
                              }
                            `}
                          >
                            {theme === item.id && (
                              <Check
                                className={`mx-auto h-4 w-4 ${
                                  item.id === 'dark' || item.id === 'black'
                                    ? 'text-white'
                                    : 'text-[#3d348b]'
                                }`}
                              />
                            )}
                          </button>
                        ))}
                      </div>

                      <p className='mt-2 text-xs opacity-50'>
                        {currentTheme.name}
                      </p>
                    </div>

                    {/* Text colour */}
                    <div>
                      <div className='mb-3 flex items-center gap-2'>
                        <Type className='h-4 w-4 opacity-60' />

                        <span className='text-[11px] font-bold uppercase tracking-wider opacity-60'>
                          Text Colour
                        </span>
                      </div>

                      <div className='flex flex-wrap gap-3'>
                        {textColors.map((item) => (
                          <button
                            key={item.id}
                            type='button'
                            onClick={() => setTextColor(item.id)}
                            title={item.name}
                            aria-label={`Use ${item.name} text`}
                            aria-pressed={textColor === item.id}
                            className={`
                              relative
                              h-8
                              w-8
                              rounded-full
                              border-2
                              border-gray-300
                              transition
                              hover:scale-105
                              ${item.previewClass}
                              ${
                                textColor === item.id
                                  ? 'ring-2 ring-[#3d348b] ring-offset-2'
                                  : ''
                              }
                            `}
                          >
                            {textColor === item.id && (
                              <Check
                                className={`
                                  mx-auto
                                  h-3.5
                                  w-3.5
                                  ${
                                    item.id === 'white' || item.id === 'cream'
                                      ? 'text-gray-700'
                                      : 'text-white'
                                  }
                                `}
                              />
                            )}
                          </button>
                        ))}
                      </div>

                      <p className='mt-2 text-xs opacity-50'>
                        {currentTextColor.name}
                      </p>
                    </div>

                    {/* Font size */}
                    <div>
                      <div className='mb-3 flex items-center gap-2'>
                        <Type className='h-4 w-4 opacity-60' />

                        <span className='text-[11px] font-bold uppercase tracking-wider opacity-60'>
                          Text Size
                        </span>
                      </div>

                      <div className='flex flex-wrap gap-1.5'>
                        {fontSizes.map((item) => (
                          <button
                            key={item.id}
                            type='button'
                            onClick={() => setFontSize(item.id)}
                            className={`
                              rounded-lg
                              border
                              px-2.5
                              py-1.5
                              text-xs
                              font-semibold
                              transition
                              ${
                                fontSize === item.id
                                  ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                                  : `${currentTheme.borderClass} ${currentTheme.uiTextClass} hover:bg-black/5`
                              }
                            `}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Line spacing */}
                    <div>
                      <div className='mb-3 flex items-center gap-2'>
                        <AlignJustify className='h-4 w-4 opacity-60' />

                        <span className='text-[11px] font-bold uppercase tracking-wider opacity-60'>
                          Line Spacing
                        </span>
                      </div>

                      <div className='flex flex-wrap gap-1.5'>
                        {lineHeights.map((item) => (
                          <button
                            key={item.id}
                            type='button'
                            onClick={() => setLineHeight(item.id)}
                            className={`
                              rounded-lg
                              border
                              px-2.5
                              py-1.5
                              text-xs
                              font-semibold
                              transition
                              ${
                                lineHeight === item.id
                                  ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                                  : `${currentTheme.borderClass} ${currentTheme.uiTextClass} hover:bg-black/5`
                              }
                            `}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom settings */}
                  <div className='mt-6 grid gap-6 border-t border-current/10 pt-6 sm:grid-cols-2'>
                    {/* Reading width */}
                    <div>
                      <div className='mb-3 flex items-center gap-2'>
                        <Maximize2 className='h-4 w-4 opacity-60' />

                        <span className='text-[11px] font-bold uppercase tracking-wider opacity-60'>
                          Reading Width
                        </span>
                      </div>

                      <div className='flex flex-wrap gap-1.5'>
                        {widths.map((item) => (
                          <button
                            key={item.id}
                            type='button'
                            onClick={() => setReadingWidth(item.id)}
                            className={`
                              rounded-lg
                              border
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              transition
                              ${
                                readingWidth === item.id
                                  ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                                  : `${currentTheme.borderClass} ${currentTheme.uiTextClass} hover:bg-black/5`
                              }
                            `}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text weight */}
                    <div>
                      <div className='mb-3 flex items-center gap-2'>
                        <Bold className='h-4 w-4 opacity-60' />

                        <span className='text-[11px] font-bold uppercase tracking-wider opacity-60'>
                          Text Weight
                        </span>
                      </div>

                      <button
                        type='button'
                        onClick={() => setBoldText((value) => !value)}
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          border
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          transition
                          ${
                            boldText
                              ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                              : `${currentTheme.borderClass} ${currentTheme.uiTextClass} hover:bg-black/5`
                          }
                        `}
                        aria-pressed={boldText}
                      >
                        <Bold className='h-4 w-4' />

                        {boldText ? 'Bold text enabled' : 'Normal text'}
                      </button>
                    </div>
                  </div>

                  {/* Reset */}
                  <div className='mt-6 flex justify-start border-t border-current/10 pt-4 sm:justify-end'>
                    <button
                      type='button'
                      onClick={resetSettings}
                      className={`
                        inline-flex
                        min-h-10
                        items-center
                        gap-2
                        rounded-lg
                        border
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        transition
                        ${currentTheme.borderClass}
                        ${currentTheme.uiTextClass}
                        hover:bg-black/5
                      `}
                    >
                      <RotateCcw className='h-3.5 w-3.5' />
                      Reset all settings
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =========================
              ARTICLE
          ========================== */}
          <main
            className='
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              scroll-smooth
            '
          >
            <article
              dir={isRTL ? 'rtl' : 'ltr'}
              lang={language}
              className={`
                mx-auto
                w-full
                px-4
                py-8
                sm:px-8
                sm:py-12
                lg:py-16
                ${currentWidth.className}
              `}
            >
              {/* Reading header */}
              {readingTitle && (
                <div
                  className='
                    mb-8
                    border-b
                    border-current/10
                    pb-7
                    sm:mb-10
                    sm:pb-9
                  '
                >
                  <div
                    className={`
                      mb-4
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#3d348b]
                      ${isRTL ? 'flex-row-reverse justify-end' : ''}
                    `}
                  >
                    <BookOpen className='h-4 w-4' />

                    <span>
                      {isTranslated
                        ? 'Translated Reading Mode'
                        : 'Reading Mode'}
                    </span>
                  </div>

                  <h1
                    className={`
                      break-words
                      text-3xl
                      font-black
                      leading-[1.12]
                      tracking-tight
                      sm:text-4xl
                      lg:text-5xl
                      ${currentTextColor.className}
                    `}
                  >
                    {readingTitle}
                  </h1>
                </div>
              )}

              {/* Article content */}
              <div
                className={`
                  prose
                  max-w-none
                  ${currentFontSize.className}
                  ${currentLineHeight.className}
                  ${currentTextColor.className}

                  prose-headings:font-bold
                  prose-headings:tracking-tight
                  prose-headings:text-inherit

                  prose-p:text-inherit
                  prose-p:leading-relaxed

                  prose-li:text-inherit
                  prose-strong:text-inherit

                  prose-a:font-semibold
                  prose-a:text-[#3d348b]
                  prose-a:no-underline
                  hover:prose-a:underline

                  prose-img:mx-auto
                  prose-img:max-w-full
                  prose-img:rounded-2xl
                  prose-img:shadow-lg

                  prose-blockquote:border-[#3d348b]
                  prose-blockquote:bg-black/5
                  prose-blockquote:px-5
                  prose-blockquote:py-3
                  prose-blockquote:rounded-r-xl

                  prose-code:rounded
                  prose-code:bg-black/5
                  prose-code:px-1.5
                  prose-code:py-0.5

                  prose-pre:overflow-x-auto
                  prose-pre:rounded-2xl

                  prose-hr:border-current/10

                  ${
                    boldText
                      ? `
                      prose-p:font-semibold
                      prose-li:font-semibold
                      prose-blockquote:font-semibold
                    `
                      : ''
                  }
                `}
                dangerouslySetInnerHTML={{
                  __html: readingContent || '<p>No content available.</p>',
                }}
              />

              {/* Bottom breathing space */}
              <div className='h-24 sm:h-32' />
            </article>
          </main>

          {/* =========================
              MOBILE TOOLBAR
          ========================== */}
          <div
            className={`
              shrink-0
              border-t
              ${currentTheme.borderClass}
              bg-inherit/95
              px-3
              pb-[max(0.65rem,env(safe-area-inset-bottom))]
              pt-2.5
              backdrop-blur-xl
              md:hidden
            `}
          >
            <div className='mx-auto flex w-full max-w-xl items-center gap-2'>
              {/* Font size */}
              <div
                className={`
                  flex
                  h-10
                  shrink-0
                  items-center
                  overflow-hidden
                  rounded-lg
                  border
                  ${currentTheme.borderClass}
                `}
              >
                <button
                  type='button'
                  onClick={decreaseFontSize}
                  disabled={fontSize === 'sm'}
                  className={`
                    flex
                    h-10
                    w-9
                    items-center
                    justify-center
                    ${currentTheme.uiTextClass}
                    disabled:opacity-30
                  `}
                  aria-label='Decrease text size'
                >
                  <Minus className='h-4 w-4' />
                </button>

                <div
                  className={`
                    flex
                    h-10
                    w-7
                    items-center
                    justify-center
                    border-x
                    ${currentTheme.borderClass}
                  `}
                >
                  <Type className='h-3.5 w-3.5 opacity-70' />
                </div>

                <button
                  type='button'
                  onClick={increaseFontSize}
                  disabled={fontSize === '2xl'}
                  className={`
                    flex
                    h-10
                    w-9
                    items-center
                    justify-center
                    ${currentTheme.uiTextClass}
                    disabled:opacity-30
                  `}
                  aria-label='Increase text size'
                >
                  <Plus className='h-4 w-4' />
                </button>
              </div>

              {/* Bold */}
              <button
                type='button'
                onClick={() => setBoldText((value) => !value)}
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  ${
                    boldText
                      ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                      : `${currentTheme.borderClass} ${currentTheme.uiTextClass}`
                  }
                `}
                aria-label='Toggle bold text'
                aria-pressed={boldText}
              >
                <Bold className='h-4 w-4' />
              </button>

              {/* Customize */}
              <button
                type='button'
                onClick={() => setShowSettings((value) => !value)}
                className={`
                  flex
                  h-10
                  min-w-0
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  px-3
                  text-xs
                  font-semibold
                  ${
                    showSettings
                      ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                      : `${currentTheme.borderClass} ${currentTheme.uiTextClass}`
                  }
                `}
                aria-expanded={showSettings}
              >
                <Palette className='h-4 w-4 shrink-0' />

                <span>Customize</span>

                <ChevronDown
                  className={`
                    hidden
                    h-3.5
                    w-3.5
                    transition-transform
                    min-[380px]:block
                    ${showSettings ? 'rotate-180' : ''}
                  `}
                />
              </button>

              {/* Reset */}
              <button
                type='button'
                onClick={resetSettings}
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  ${currentTheme.borderClass}
                  ${currentTheme.uiTextClass}
                `}
                aria-label='Reset reading settings'
              >
                <RotateCcw className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
