'use client'

import React from 'react'
import {
  Sparkles,
  Wand2,
  FileText,
  CheckCircle2,
  Save,
  RefreshCw,
  Eye,
  AlertCircle,
  Copy,
  Check,
  Plus,
  X,
} from 'lucide-react'

import { getCategories } from '@/utils/admin/action'

interface Category {
  id: string
  name: string
}

interface GeneratedArticle {
  title: string
  slug: string
  short_desc: string
  long_desc: string
  tags: string[]
}

type SaveStatus = 'DRAFT' | 'PUBLISHED'

export default function AIWriterPage() {
  const [categories, setCategories] = React.useState<Category[]>([])

  const [loadingCategories, setLoadingCategories] = React.useState(true)

  const [topic, setTopic] = React.useState('')

  const [selectedCategory, setSelectedCategory] = React.useState('')

  const [keywords, setKeywords] = React.useState('')

  const [isGenerating, setIsGenerating] = React.useState(false)

  const [isSaving, setIsSaving] = React.useState(false)

  const [error, setError] = React.useState<string | null>(null)

  const [success, setSuccess] = React.useState<string | null>(null)

  const [generated, setGenerated] = React.useState<GeneratedArticle | null>(
    null,
  )

  const [newTagInput, setNewTagInput] = React.useState('')

  const [copied, setCopied] = React.useState(false)

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  React.useEffect(() => {
    let mounted = true

    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        setError(null)

        const result = await getCategories()

        if (!mounted) return

        const normalized: Category[] = (result ?? []).map((category: any) => ({
          id: String(category.id),

          name:
            category.name ??
            category.title ??
            category.label ??
            'Unnamed Category',
        }))

        setCategories(normalized)
      } catch (err) {
        console.error('Failed to load categories:', err)

        if (mounted) {
          setError('Failed to load categories.')
        }
      } finally {
        if (mounted) {
          setLoadingCategories(false)
        }
      }
    }

    loadCategories()

    return () => {
      mounted = false
    }
  }, [])

  // =====================================================
  // AUTO CLEAR ALERTS
  // =====================================================

  React.useEffect(() => {
    if (!error && !success) return

    const timer = setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 5000)

    return () => clearTimeout(timer)
  }, [error, success])

  // =====================================================
  // GENERATE ARTICLE
  // =====================================================

  const handleGenerate = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (!topic.trim()) {
      setError('Please enter a topic.')
      return
    }

    if (!selectedCategory) {
      setError('Please select a category.')
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          action: 'generate',

          topic: topic.trim(),

          categoryId: selectedCategory,

          keywords: keywords.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate article.')
      }

      // =================================================
      // EXISTING ARTICLE
      // =================================================

      if (data.alreadyExists && data.article) {
        setGenerated({
          title: data.article.title ?? '',

          slug: data.article.slug ?? '',

          short_desc: data.article.short_desc ?? '',

          long_desc: '',

          tags: [],
        })

        setError(
          'An article with this topic already exists. Generate a different topic.',
        )

        return
      }

      // =================================================
      // NEW ARTICLE
      // =================================================

      if (!data.article) {
        throw new Error('AI did not return article data.')
      }

      const article: GeneratedArticle = {
        title: data.article.title ?? '',

        slug: data.article.slug ?? '',

        short_desc: data.article.short_desc ?? '',

        long_desc: data.article.long_desc ?? '',

        tags: Array.isArray(data.article.tags)
          ? data.article.tags.map((tag: string) => tag.replace(/^#/, '').trim())
          : [],
      }

      setGenerated(article)

      setSuccess('Article generated successfully. Review it before saving.')
    } catch (err) {
      console.error('AI generation error:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while generating the article.',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  // =====================================================
  // SAVE ARTICLE
  // =====================================================

  const handleSaveArticle = async (status: SaveStatus) => {
    if (!generated) {
      setError('Please generate an article first.')
      return
    }

    if (!selectedCategory) {
      setError('Please select a category.')
      return
    }

    if (!generated.title.trim()) {
      setError('Article title is required.')
      return
    }

    if (!generated.slug.trim()) {
      setError('Article slug is required.')
      return
    }

    if (!generated.short_desc.trim()) {
      setError('Short description is required.')
      return
    }

    if (!generated.long_desc.trim()) {
      setError('Article content is required.')
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          action: 'save',

          title: generated.title.trim(),

          slug: generated.slug.trim(),

          short_desc: generated.short_desc.trim(),

          long_desc: generated.long_desc,

          categoryId: selectedCategory,

          status,

          tags: generated.tags,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to save article.')
      }

      setSuccess(
        status === 'PUBLISHED'
          ? 'Article published successfully!'
          : 'Article saved as draft successfully!',
      )

      // Keep the generated content visible.
    } catch (err) {
      console.error('Save article error:', err)

      setError(err instanceof Error ? err.message : 'Failed to save article.')
    } finally {
      setIsSaving(false)
    }
  }

  // =====================================================
  // COPY CONTENT
  // =====================================================

  const handleCopyContent = async () => {
    if (!generated?.long_desc) {
      return
    }

    try {
      await navigator.clipboard.writeText(generated.long_desc)

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  // =====================================================
  // ADD TAG
  // =====================================================

  const handleAddTag = () => {
    if (!newTagInput.trim() || !generated) {
      return
    }

    const formattedTag = newTagInput.trim().replace(/^#/, '')

    if (!formattedTag) return

    const alreadyExists = generated.tags.some(
      (tag) => tag.toLowerCase() === formattedTag.toLowerCase(),
    )

    if (!alreadyExists) {
      setGenerated({
        ...generated,

        tags: [...generated.tags, formattedTag],
      })
    }

    setNewTagInput('')
  }

  // =====================================================
  // REMOVE TAG
  // =====================================================

  const handleRemoveTag = (tagToRemove: string) => {
    if (!generated) return

    setGenerated({
      ...generated,

      tags: generated.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  // =====================================================
  // REGENERATE
  // =====================================================

  const handleRegenerate = () => {
    if (isGenerating || isSaving) {
      return
    }

    handleGenerate()
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className='min-h-screen bg-[#F8F6F0] px-3 py-4 text-[#1A1A18] sm:px-5 sm:py-6 lg:px-8 xl:px-10'>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className='mb-5 rounded-3xl border border-[#E0DCD5] bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex min-w-0 items-start gap-3'>
            <div className='shrink-0 rounded-2xl bg-amber-50 p-3 text-amber-600'>
              <Sparkles size={22} />
            </div>

            <div className='min-w-0'>
              <div className='flex flex-wrap items-center gap-2'>
                <h1 className='font-serif text-xl font-bold text-[#1A1A18] sm:text-2xl'>
                  AI Article Generator
                </h1>

                <span className='rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700'>
                  AI Writer
                </span>
              </div>

              <p className='mt-1 max-w-2xl text-xs leading-relaxed text-[#6B6860] sm:text-sm'>
                Generate SEO-optimized long-form educational articles
                automatically from a topic, category and target keywords.
              </p>
            </div>
          </div>

          {generated && (
            <button
              type='button'
              onClick={handleCopyContent}
              disabled={!generated.long_desc}
              className='flex w-full items-center justify-center gap-2 rounded-xl border border-[#E0DCD5] px-3 py-2 text-xs font-semibold transition hover:bg-[#FAF8F5] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
            >
              {copied ? (
                <>
                  <Check size={14} className='text-emerald-600' />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Content
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className='mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800'>
          <AlertCircle size={17} className='mt-0.5 shrink-0 text-rose-600' />

          <span className='leading-relaxed'>{error}</span>

          <button
            type='button'
            onClick={() => setError(null)}
            className='ml-auto shrink-0 font-bold text-rose-500 hover:text-rose-700'
          >
            ×
          </button>
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div className='mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800'>
          <CheckCircle2
            size={17}
            className='mt-0.5 shrink-0 text-emerald-600'
          />

          <span className='leading-relaxed'>{success}</span>

          <button
            type='button'
            onClick={() => setSuccess(null)}
            className='ml-auto shrink-0 font-bold text-emerald-500 hover:text-emerald-700'
          >
            ×
          </button>
        </div>
      )}

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className='grid grid-cols-1 gap-5 xl:grid-cols-12'>
        {/* =================================================
            LEFT - PROMPT SETTINGS
        ================================================= */}

        <div className='h-fit rounded-3xl border border-[#E0DCD5] bg-white p-4 shadow-sm sm:p-6 xl:col-span-4'>
          <div className='mb-5 flex items-center gap-2 border-b border-[#E0DCD5] pb-4'>
            <div className='rounded-xl bg-amber-50 p-2 text-amber-600'>
              <Wand2 size={17} />
            </div>

            <div>
              <h2 className='font-serif text-base font-bold'>
                Prompt Settings
              </h2>

              <p className='text-[10px] text-[#8C887B]'>
                Provide details for AI generation
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className='space-y-5'>
            {/* Topic */}

            <div>
              <label className='mb-1.5 block text-xs font-semibold text-[#6B6860]'>
                Main Topic / Article Idea *
              </label>

              <input
                type='text'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='e.g. Next.js Server Actions Best Practices'
                required
                disabled={isGenerating}
                className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-3 text-sm outline-none transition placeholder:text-[#AAA59B] focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60'
              />
            </div>

            {/* Category */}

            <div>
              <label className='mb-1.5 block text-xs font-semibold text-[#6B6860]'>
                Category *
              </label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                disabled={loadingCategories || isGenerating}
                className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60'
              >
                <option value=''>
                  {loadingCategories
                    ? 'Loading categories...'
                    : 'Select Category'}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Keywords */}

            <div>
              <label className='mb-1.5 block text-xs font-semibold text-[#6B6860]'>
                Focus Keywords / Subtopics
              </label>

              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder='React 19, Server Components, Prisma, SEO...'
                rows={4}
                disabled={isGenerating}
                className='w-full resize-y rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] p-3 text-xs leading-relaxed outline-none transition placeholder:text-[#AAA59B] focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60'
              />

              <p className='mt-1.5 text-[10px] text-[#8C887B]'>
                Comma-separated keywords help guide SEO output.
              </p>
            </div>

            {/* Generate */}

            <button
              type='submit'
              disabled={
                isGenerating ||
                loadingCategories ||
                !topic.trim() ||
                !selectedCategory
              }
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A18] py-3.5 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className='animate-spin' />
                  Generating Article...
                </>
              ) : (
                <>
                  <Sparkles size={16} className='text-amber-400' />
                  Generate Article with AI
                </>
              )}
            </button>
          </form>

          {/* Tips */}

          <div className='mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4'>
            <p className='mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700'>
              Writing Tips
            </p>

            <ul className='space-y-1.5 text-[10px] leading-relaxed text-amber-900/70'>
              <li>• Specify explicit topics for detailed responses.</li>

              <li>• Add target long-tail search terms.</li>

              <li>• Select the correct category.</li>

              <li>• Always review AI content before publishing.</li>
            </ul>
          </div>
        </div>

        {/* =================================================
            RIGHT - OUTPUT
        ================================================= */}

        <div className='min-w-0 rounded-3xl border border-[#E0DCD5] bg-white p-4 shadow-sm sm:p-6 xl:col-span-8'>
          {/* Output Header */}

          <div className='mb-5 flex flex-col gap-3 border-b border-[#E0DCD5] pb-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-2'>
              <div className='rounded-xl bg-amber-50 p-2 text-amber-600'>
                <FileText size={17} />
              </div>

              <div>
                <h2 className='font-serif text-base font-bold'>
                  Generated Output
                </h2>

                <p className='text-[10px] text-[#8C887B]'>
                  Review and edit before publishing
                </p>
              </div>
            </div>

            {generated && (
              <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
                <button
                  type='button'
                  onClick={handleRegenerate}
                  disabled={isGenerating || isSaving}
                  className='flex items-center justify-center gap-1.5 rounded-xl border border-[#E0DCD5] px-3 py-2 text-xs font-medium transition hover:bg-[#FAF8F5] disabled:opacity-50'
                >
                  <RefreshCw size={13} />
                  Regenerate
                </button>

                <button
                  type='button'
                  onClick={() => handleSaveArticle('DRAFT')}
                  disabled={isSaving}
                  className='flex items-center justify-center gap-1.5 rounded-xl border border-[#E0DCD5] px-3 py-2 text-xs font-medium transition hover:bg-[#FAF8F5] disabled:opacity-50'
                >
                  <Save size={13} />

                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>

                <button
                  type='button'
                  onClick={() => handleSaveArticle('PUBLISHED')}
                  disabled={isSaving}
                  className='flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50'
                >
                  <Eye size={13} />
                  Publish
                </button>
              </div>
            )}
          </div>

          {/* Empty */}

          {!generated && !isGenerating && (
            <div className='flex min-h-[420px] flex-col items-center justify-center px-5 py-16 text-center'>
              <div className='mb-4 rounded-3xl bg-[#FAF8F5] p-5 text-[#8C887B]'>
                <Sparkles size={30} />
              </div>

              <h3 className='font-serif text-base font-bold'>
                Ready to Create
              </h3>

              <p className='mt-2 max-w-sm text-xs leading-relaxed text-[#8C887B]'>
                Enter your article details in the prompt settings panel to
                generate an SEO-optimized article.
              </p>
            </div>
          )}

          {/* Loading */}

          {isGenerating && (
            <div className='flex min-h-[420px] flex-col items-center justify-center px-5 py-16 text-center'>
              <div className='mb-5 rounded-3xl bg-amber-50 p-5 text-amber-600'>
                <RefreshCw size={30} className='animate-spin' />
              </div>

              <h3 className='font-serif text-base font-bold'>
                Drafting Content
              </h3>

              <p className='mt-2 max-w-md text-xs leading-relaxed text-[#8C887B]'>
                AI is generating structured sections, SEO content and article
                metadata...
              </p>
            </div>
          )}

          {/* Generated */}

          {generated && !isGenerating && (
            <div className='space-y-5'>
              {/* Title + Slug */}

              <div className='rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5] p-4'>
                <div className='mb-4'>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8C887B]'>
                    Generated Title
                  </label>

                  <input
                    type='text'
                    value={generated.title}
                    onChange={(e) =>
                      setGenerated({
                        ...generated,
                        title: e.target.value,
                      })
                    }
                    className='w-full bg-transparent font-serif text-lg font-bold leading-tight text-[#1A1A18] outline-none sm:text-xl'
                  />
                </div>

                <div>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8C887B]'>
                    Slug
                  </label>

                  <input
                    type='text'
                    value={generated.slug}
                    onChange={(e) =>
                      setGenerated({
                        ...generated,
                        slug: e.target.value,
                      })
                    }
                    className='w-full bg-transparent font-mono text-xs text-amber-800 outline-none'
                  />
                </div>
              </div>

              {/* Short Description */}

              <div>
                <label className='mb-1.5 block text-xs font-semibold text-[#6B6860]'>
                  Short Description / Excerpt
                </label>

                <textarea
                  value={generated.short_desc}
                  onChange={(e) =>
                    setGenerated({
                      ...generated,
                      short_desc: e.target.value,
                    })
                  }
                  rows={3}
                  maxLength={160}
                  className='w-full resize-y rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5] p-4 text-xs leading-relaxed text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
                />

                <div className='mt-1 flex justify-end text-[10px] text-[#8C887B]'>
                  {generated.short_desc.length}
                  /160
                </div>
              </div>

              {/* Article Body */}

              <div>
                <div className='mb-1.5 flex items-center justify-between gap-3'>
                  <label className='text-xs font-semibold text-[#6B6860]'>
                    Article Body
                  </label>

                  <span className='text-right text-[10px] text-[#AAA59B]'>
                    HTML format supported
                  </span>
                </div>

                <textarea
                  value={generated.long_desc}
                  onChange={(e) =>
                    setGenerated({
                      ...generated,
                      long_desc: e.target.value,
                    })
                  }
                  rows={22}
                  className='w-full resize-y rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5] p-4 font-mono text-xs leading-6 text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 sm:text-sm'
                />
              </div>

              {/* Tags */}

              <div>
                <label className='mb-2 block text-xs font-semibold text-[#6B6860]'>
                  SEO Tags
                </label>

                <div className='mb-3 flex flex-wrap gap-1.5'>
                  {generated.tags.length > 0 ? (
                    generated.tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className='inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[11px] text-amber-800'
                      >
                        #{tag}
                        <button
                          type='button'
                          onClick={() => handleRemoveTag(tag)}
                          className='text-amber-600 transition hover:text-amber-900'
                          aria-label={`Remove ${tag}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className='text-xs text-[#AAA59B]'>
                      No tags generated.
                    </span>
                  )}
                </div>

                <div className='flex max-w-md gap-2'>
                  <input
                    type='text'
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder='Add new tag...'
                    className='min-w-0 flex-1 rounded-lg border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2 font-mono text-xs outline-none focus:border-amber-500'
                  />

                  <button
                    type='button'
                    onClick={handleAddTag}
                    className='shrink-0 rounded-lg bg-[#1A1A18] p-2 text-white transition hover:bg-black'
                    aria-label='Add tag'
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}

              <div className='sticky bottom-2 z-10 rounded-2xl border border-[#E0DCD5] bg-white/95 p-3 shadow-lg backdrop-blur'>
                <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
                  <button
                    type='button'
                    onClick={() => handleSaveArticle('DRAFT')}
                    disabled={isSaving}
                    className='flex items-center justify-center gap-2 rounded-xl border border-[#E0DCD5] px-5 py-2.5 text-xs font-semibold transition hover:bg-[#FAF8F5] disabled:opacity-50'
                  >
                    <Save size={14} />

                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </button>

                  <button
                    type='button'
                    onClick={() => handleSaveArticle('PUBLISHED')}
                    disabled={isSaving}
                    className='flex items-center justify-center gap-2 rounded-xl bg-[#1A1A18] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-50'
                  >
                    <CheckCircle2 size={14} />

                    {isSaving ? 'Publishing...' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
