'use client'

import { useEffect, useState } from 'react'
import {
  BookOpen,
  X,
  Minus,
  Plus,
  RotateCcw,
  Type,
  AlignJustify,
  Bold,
  Palette,
  Maximize2,
  ChevronDown,
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

const themes: {
  id: Theme
  name: string
  bgClass: string
  previewClass: string
}[] = [
  {
    id: 'light',
    name: 'White',
    bgClass: 'bg-white',
    previewClass: 'bg-white border-gray-300',
  },
  {
    id: 'cream',
    name: 'Cream',
    bgClass: 'bg-[#fffdf5]',
    previewClass: 'bg-[#fffdf5] border-[#e8dfc8]',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    bgClass: 'bg-[#f4ecd8]',
    previewClass: 'bg-[#f4ecd8] border-[#d8c8a8]',
  },
  {
    id: 'dark',
    name: 'Dark',
    bgClass: 'bg-[#18181b]',
    previewClass: 'bg-[#18181b] border-gray-600',
  },
  {
    id: 'black',
    name: 'Black',
    bgClass: 'bg-black',
    previewClass: 'bg-black border-gray-700',
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
    } catch {}
  }, [])

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
    } catch {}
  }, [theme, textColor, fontSize, lineHeight, readingWidth, boldText])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

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

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='
          btn
          btn-primary
          btn-sm
          gap-2
          rounded-lg
          px-3
          shadow-sm
          transition-all
          hover:shadow-md
        '
      >
        <BookOpen className='h-4 w-4' />
        <span>Reading Mode</span>
      </button>

      {isOpen && (
        <div
          className={`
            fixed inset-0 z-[9999]
            flex h-dvh w-full flex-col
            transition-colors duration-300
            ${currentTheme.bgClass}
          `}
          role='dialog'
          aria-modal='true'
          aria-label='Reading mode'
        >
          <header
            className='
              sticky top-0 z-30
              shrink-0
              border-b border-black/10
              bg-inherit/95
              backdrop-blur-xl
            '
          >
            <div
              className='
                mx-auto
                flex
                w-full
                max-w-7xl
                items-center
                justify-between
                gap-3
                px-4
                py-3
                sm:px-6
              '
            >
              <div className='flex min-w-0 items-center gap-2.5'>
                <div
                  className='
                    flex h-9 w-9
                    shrink-0
                    items-center justify-center
                    rounded-lg
                    bg-[#3d348b]/10
                    text-[#3d348b]
                  '
                >
                  <BookOpen className='h-5 w-5' />
                </div>

                <div className='min-w-0'>
                  <p className='text-[10px] font-bold uppercase tracking-wider text-gray-500'>
                    Reading Mode
                  </p>

                  <h2 className='truncate text-sm font-bold text-gray-900 sm:text-base'>
                    {title}
                  </h2>
                </div>
              </div>

              <div className='hidden items-center gap-2 md:flex'>
                <div className='flex items-center overflow-hidden rounded-lg border border-black/10'>
                  <button
                    type='button'
                    onClick={decreaseFontSize}
                    disabled={fontSize === 'sm'}
                    className='
                      flex h-9 w-9
                      items-center justify-center
                      text-gray-700
                      transition
                      hover:bg-black/5
                      disabled:opacity-30
                    '
                  >
                    <Minus className='h-4 w-4' />
                  </button>

                  <div className='flex h-9 min-w-9 items-center justify-center border-x border-black/10 text-gray-700'>
                    <Type className='h-4 w-4' />
                  </div>

                  <button
                    type='button'
                    onClick={increaseFontSize}
                    disabled={fontSize === '2xl'}
                    className='
                      flex h-9 w-9
                      items-center justify-center
                      text-gray-700
                      transition
                      hover:bg-black/5
                      disabled:opacity-30
                    '
                  >
                    <Plus className='h-4 w-4' />
                  </button>
                </div>

                <button
                  type='button'
                  onClick={() => setBoldText(!boldText)}
                  className={`
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    border
                    transition
                    ${
                      boldText
                        ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                        : 'border-black/10 text-gray-700 hover:bg-black/5'
                    }
                  `}
                >
                  <Bold className='h-4 w-4' />
                </button>

                <button
                  type='button'
                  onClick={() => setShowSettings(!showSettings)}
                  className={`
                    flex h-9
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
                        : 'border-black/10 text-gray-700 hover:bg-black/5'
                    }
                  `}
                >
                  <Palette className='h-4 w-4' />
                  Customize
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      showSettings ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className='btn btn-circle btn-ghost text-gray-700'
                aria-label='Close reading mode'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </header>

          {showSettings && (
            <div
              className='
                absolute
                left-0
                right-0
                top-[65px]
                z-20
                max-h-[calc(100dvh-65px)]
                overflow-y-auto
                border-b
                border-black/10
                bg-inherit
                shadow-xl
              '
            >
              <div className='mx-auto max-w-5xl px-4 py-5 sm:px-6'>
                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                  <div>
                    <div className='mb-3 flex items-center gap-2'>
                      <Palette className='h-4 w-4 text-gray-600' />

                      <span className='text-xs font-bold uppercase tracking-wide text-gray-500'>
                        Background
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      {themes.map((item) => (
                        <button
                          key={item.id}
                          type='button'
                          onClick={() => setTheme(item.id)}
                          title={item.name}
                          className={`
                            h-9 w-9
                            rounded-full
                            border-2
                            transition
                            ${item.previewClass}
                            ${
                              theme === item.id
                                ? 'ring-2 ring-[#3d348b] ring-offset-2'
                                : ''
                            }
                          `}
                        />
                      ))}
                    </div>

                    <p className='mt-2 text-xs text-gray-400'>
                      {currentTheme.name}
                    </p>
                  </div>

                  <div>
                    <div className='mb-3 flex items-center gap-2'>
                      <Type className='h-4 w-4 text-gray-600' />

                      <span className='text-xs font-bold uppercase tracking-wide text-gray-500'>
                        Text Colour
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      {textColors.map((item) => (
                        <button
                          key={item.id}
                          type='button'
                          onClick={() => setTextColor(item.id)}
                          title={item.name}
                          className={`
                            h-8 w-8
                            rounded-full
                            border-2
                            border-gray-300
                            transition
                            ${item.previewClass}
                            ${
                              textColor === item.id
                                ? 'ring-2 ring-[#3d348b] ring-offset-2'
                                : ''
                            }
                          `}
                        />
                      ))}
                    </div>

                    <p className='mt-2 text-xs text-gray-400'>
                      {currentTextColor.name}
                    </p>
                  </div>

                  <div>
                    <div className='mb-3 flex items-center gap-2'>
                      <Type className='h-4 w-4 text-gray-600' />

                      <span className='text-xs font-bold uppercase tracking-wide text-gray-500'>
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
                                : 'border-black/10 text-gray-700 hover:bg-black/5'
                            }
                          `}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className='mb-3 flex items-center gap-2'>
                      <AlignJustify className='h-4 w-4 text-gray-600' />

                      <span className='text-xs font-bold uppercase tracking-wide text-gray-500'>
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
                                : 'border-black/10 text-gray-700 hover:bg-black/5'
                            }
                          `}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='mt-6 grid gap-6 sm:grid-cols-2'>
                  <div>
                    <div className='mb-3 flex items-center gap-2'>
                      <Maximize2 className='h-4 w-4 text-gray-600' />

                      <span className='text-xs font-bold uppercase tracking-wide text-gray-500'>
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
                                : 'border-black/10 text-gray-700 hover:bg-black/5'
                            }
                          `}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className='mb-3 flex items-center gap-2'>
                      <Bold className='h-4 w-4 text-gray-600' />

                      <span className='text-xs font-bold uppercase tracking-wide text-gray-500'>
                        Text Weight
                      </span>
                    </div>

                    <button
                      type='button'
                      onClick={() => setBoldText(!boldText)}
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
                            : 'border-black/10 text-gray-700 hover:bg-black/5'
                        }
                      `}
                    >
                      <Bold className='h-4 w-4' />

                      {boldText ? 'Bold text enabled' : 'Normal text'}
                    </button>
                  </div>
                </div>

                <div className='mt-6 flex justify-end border-t border-black/10 pt-4'>
                  <button
                    type='button'
                    onClick={resetSettings}
                    className='
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-black/10
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-gray-600
                      transition
                      hover:bg-black/5
                    '
                  >
                    <RotateCcw className='h-3.5 w-3.5' />
                    Reset all settings
                  </button>
                </div>
              </div>
            </div>
          )}

          <main className='flex-1 overflow-y-auto overscroll-contain'>
            <article
              className={`
                mx-auto
                w-full
                px-5
                py-10
                sm:px-8
                sm:py-14
                lg:py-16
                ${currentWidth.className}
              `}
            >
              {title && (
                <div className='mb-8 border-b border-current/10 pb-7 sm:mb-10'>
                  <div className='mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3d348b]'>
                    <BookOpen className='h-4 w-4' />
                    Reading Mode
                  </div>

                  <h1
                    className={`
                      text-3xl
                      font-black
                      leading-tight
                      tracking-tight
                      sm:text-4xl
                      lg:text-5xl
                      ${currentTextColor.className}
                    `}
                  >
                    {title}
                  </h1>
                </div>
              )}

              <div
                className={`
                  prose
                  max-w-none

                  ${currentFontSize.className}
                  ${currentLineHeight.className}

                  ${currentTextColor.className}

                  prose-headings:font-bold
                  prose-headings:tracking-tight

                  prose-p:leading-relaxed

                  prose-a:text-[#3d348b]
                  prose-a:font-semibold
                  prose-a:no-underline
                  hover:prose-a:underline

                  prose-strong:font-bold

                  prose-img:rounded-2xl
                  prose-img:shadow-lg

                  prose-blockquote:border-[#3d348b]
                  prose-blockquote:bg-black/5
                  prose-blockquote:px-5

                  prose-code:rounded
                  prose-code:bg-black/5
                  prose-code:px-1.5
                  prose-code:py-0.5

                  prose-hr:border-black/10

                  ${
                    boldText
                      ? `
                        prose-p:font-semibold
                        prose-li:font-semibold
                        prose-blockquote:font-semibold
                      `
                      : ''
                  }

                  /* Important:
                     DO NOT use prose-invert here.
                     Text colour is controlled manually.
                  */
                `}
                dangerouslySetInnerHTML={{
                  __html: longDesc || '<p>No content available.</p>',
                }}
              />

              <div className='h-20 sm:h-28' />
            </article>
          </main>

          <div
            className='
              shrink-0
              border-t
              border-black/10
              bg-inherit/95
              px-3
              py-2.5
              backdrop-blur-xl
              md:hidden
            '
          >
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center overflow-hidden rounded-lg border border-black/10'>
                <button
                  type='button'
                  onClick={decreaseFontSize}
                  disabled={fontSize === 'sm'}
                  className='
                    flex h-9 w-9
                    items-center justify-center
                    text-gray-700
                    disabled:opacity-30
                  '
                >
                  <Minus className='h-4 w-4' />
                </button>

                <Type className='h-4 w-4 text-gray-600' />

                <button
                  type='button'
                  onClick={increaseFontSize}
                  disabled={fontSize === '2xl'}
                  className='
                    flex h-9 w-9
                    items-center justify-center
                    text-gray-700
                    disabled:opacity-30
                  '
                >
                  <Plus className='h-4 w-4' />
                </button>
              </div>

              <button
                type='button'
                onClick={() => setBoldText(!boldText)}
                className={`
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  border
                  ${
                    boldText
                      ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                      : 'border-black/10 text-gray-700'
                  }
                `}
              >
                <Bold className='h-4 w-4' />
              </button>

              <button
                type='button'
                onClick={() => setShowSettings(!showSettings)}
                className={`
                  flex h-9
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  text-xs
                  font-semibold
                  ${
                    showSettings
                      ? 'border-[#3d348b] bg-[#3d348b]/10 text-[#3d348b]'
                      : 'border-black/10 text-gray-700'
                  }
                `}
              >
                <Palette className='h-4 w-4' />
                Customize
              </button>

              <button
                type='button'
                onClick={resetSettings}
                className='
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  border
                  border-black/10
                  text-gray-700
                '
                aria-label='Reset settings'
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
