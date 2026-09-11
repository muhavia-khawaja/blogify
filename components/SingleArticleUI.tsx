'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Eye,
  Calendar,
  User,
  Tag,
  Star,
  Bookmark,
  CheckCircle,
  XCircle,
  Trash2,
  Globe,
  BarChart2,
  Image as ImageIcon,
  AlertTriangle,
  X,
  Loader2,
} from 'lucide-react'

import {
  updateArticle,
  toggleArticlePublish,
  toggleArticleFeatured,
  toggleArticleMainPost,
  deleteArticle,
  UpdateArticleInput,
} from '@/utils/admin/action'

interface ArticleDetail {
  id: string
  title: string
  slug: string

  short_desc: string | null
  long_desc: string | null

  createdAt: string | Date
  updatedAt: string | Date

  published: boolean
  featured: boolean
  mainPost: boolean

  categoryId?: string | null

  image?: string | null

  tags?: string[] | null
  status?: string | null
  readTime?: string | null

  category?: {
    id: string
    title: string
  } | null

  user?: {
    name: string
    email?: string
  } | null

  analytics?: {
    totalImpressions?: number | null
    guestViews?: number | null
    userViews?: number | null
    totalReadTimeSec?: number | null
    avgReadTimeSec?: number | null
    avgScrollDepth?: number | null
    bounceCount?: number | null
    updatedAt?: string | Date | null
  } | null
}

interface Category {
  id: string
  title: string
}

interface SingleArticleUIProps {
  article: ArticleDetail
  categories: Category[]
}

type ActionResponse =
  | {
      success?: boolean
      error?: string
      message?: string
    }
  | undefined

export default function SingleArticleUI({
  article,
  categories = [],
}: SingleArticleUIProps) {
  const [formData, setFormData] = useState({
    title: article.title || '',
    slug: article.slug || '',
    short_desc: article.short_desc || '',
    long_desc: article.long_desc || '',
    categoryId: article.categoryId || article.category?.id || '',
    image: article.image || '',
  })

  const [isPublished, setIsPublished] = useState(article.published)
  const [isFeatured, setIsFeatured] = useState(article.featured)
  const [isMainPost, setIsMainPost] = useState(article.mainPost)

  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(false)
  const [isMainPostLoading, setIsMainPostLoading] = useState(false)

  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const showMessage = (message: string) => {
    setSaveMessage(message)

    window.setTimeout(() => {
      setSaveMessage(null)
    }, 3000)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      setSaveMessage('Article title is required.')
      return
    }

    if (!formData.slug.trim()) {
      setSaveMessage('Article slug is required.')
      return
    }

    if (!formData.long_desc.trim()) {
      setSaveMessage('Article content is required.')
      return
    }

    setIsSaving(true)
    setSaveMessage(null)

    try {
      const data: UpdateArticleInput = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        short_desc: formData.short_desc.trim(),
        long_desc: formData.long_desc,
        categoryId: formData.categoryId || null,
        image: formData.image.trim() || null,
      }

      const result = (await updateArticle(article.id, data)) as ActionResponse

      if (result?.success === false) {
        throw new Error(
          result.error || result.message || 'Failed to update article.',
        )
      }

      showMessage('Article updated successfully.')
    } catch (error) {
      console.error('Failed to update article:', error)

      setSaveMessage(
        error instanceof Error ? error.message : 'Failed to update article.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublishToggle = async () => {
    if (isPublishing) return

    const previousValue = isPublished
    const nextValue = !previousValue

    setIsPublishing(true)
    setSaveMessage(null)

    setIsPublished(nextValue)

    try {
      const result = (await toggleArticlePublish(
        article.id,
        previousValue,
      )) as ActionResponse

      if (result?.success === false) {
        throw new Error(
          result.error ||
            result.message ||
            'Failed to update publishing status.',
        )
      }

      showMessage(
        nextValue
          ? 'Article published successfully.'
          : 'Article unpublished successfully.',
      )
    } catch (error) {
      console.error('Failed to toggle publishing:', error)

      setIsPublished(previousValue)

      setSaveMessage(
        error instanceof Error
          ? error.message
          : 'Failed to update publishing status.',
      )
    } finally {
      setIsPublishing(false)
    }
  }

  const handleFeaturedToggle = async () => {
    if (isFeaturedLoading) return

    const previousValue = isFeatured
    const nextValue = !previousValue

    setIsFeaturedLoading(true)
    setSaveMessage(null)

    setIsFeatured(nextValue)

    try {
      const result = (await toggleArticleFeatured(
        article.id,
        previousValue,
      )) as ActionResponse

      if (result?.success === false) {
        throw new Error(
          result.error || result.message || 'Failed to update featured status.',
        )
      }

      showMessage(
        nextValue
          ? 'Article marked as featured.'
          : 'Article removed from featured.',
      )
    } catch (error) {
      console.error('Failed to toggle featured:', error)

      setIsFeatured(previousValue)

      setSaveMessage(
        error instanceof Error
          ? error.message
          : 'Failed to update featured status.',
      )
    } finally {
      setIsFeaturedLoading(false)
    }
  }

  const totalViews =
    (article.analytics?.guestViews ?? 0) + (article.analytics?.userViews ?? 0)

  const totalImpressions = article.analytics?.totalImpressions ?? 0

  const handleMainPostToggle = async () => {
    if (isMainPostLoading) return

    const previousValue = isMainPost
    const nextValue = !previousValue

    setIsMainPostLoading(true)
    setSaveMessage(null)

    setIsMainPost(nextValue)

    try {
      const result = (await toggleArticleMainPost(
        article.id,
        previousValue,
      )) as ActionResponse

      if (result?.success === false) {
        throw new Error(
          result.error ||
            result.message ||
            'Failed to update main post status.',
        )
      }

      showMessage(
        nextValue
          ? 'Article set as main post.'
          : 'Article removed from main post.',
      )
    } catch (error) {
      console.error('Failed to toggle main post:', error)

      setIsMainPost(previousValue)

      setSaveMessage(
        error instanceof Error
          ? error.message
          : 'Failed to update main post status.',
      )
    } finally {
      setIsMainPostLoading(false)
    }
  }

  const handleDelete = async () => {
    if (isDeleting) return

    setIsDeleting(true)
    setSaveMessage(null)

    try {
      const result = (await deleteArticle(article.id)) as ActionResponse

      if (result?.success === false) {
        throw new Error(
          result.error || result.message || 'Failed to delete article.',
        )
      }

      window.location.href = '/control/articles'
    } catch (error) {
      console.error('Failed to delete article:', error)

      setSaveMessage(
        error instanceof Error ? error.message : 'Failed to delete article.',
      )

      setIsDeleting(false)
    }
  }

  const formattedCreatedDate = formatDate(article.createdAt)
  const formattedUpdatedDate = formatDate(article.updatedAt)

  return (
    <div className='min-h-screen space-y-6 bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
      <div className='flex flex-col items-start justify-between gap-4 rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6'>
        <div className='flex min-w-0 items-center gap-3'>
          <Link
            href='/control/articles'
            className='shrink-0 rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] p-2 transition-colors hover:bg-[#F0ECE1]'
            aria-label='Back to articles'
          >
            <ArrowLeft size={18} className='text-[#1A1A18]' />
          </Link>

          <div className='min-w-0'>
            <h1 className='max-w-[220px] truncate font-serif text-xl font-bold text-[#1A1A18] sm:max-w-xl sm:text-2xl'>
              {formData.title || 'Untitled Article'}
            </h1>

            <p className='mt-0.5 truncate text-xs italic text-[#6B6860]'>
              ID: {article.id} • Created {formattedCreatedDate}
            </p>
          </div>
        </div>

        <div className='flex w-full items-center justify-end gap-2 sm:w-auto'>
          <button
            type='button'
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting || isSaving}
            className='rounded-xl border border-transparent p-2.5 text-rose-600 transition-colors hover:border-rose-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50'
            title='Delete Article'
          >
            <Trash2 size={18} />
          </button>

          <button
            type='submit'
            form='article-edit-form'
            disabled={isSaving}
            className='inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A1A18] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:text-sm'
          >
            {isSaving ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <Save size={16} />
            )}

            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`rounded-2xl border p-4 text-xs font-medium sm:text-sm ${
            saveMessage.toLowerCase().includes('success') ||
            saveMessage.toLowerCase().includes('published') ||
            saveMessage.toLowerCase().includes('featured') ||
            saveMessage.toLowerCase().includes('main post')
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className='grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          icon={<Eye size={20} />}
          iconClassName='bg-amber-50 text-amber-600'
          label='Total Views'
          value={formatNumber(totalViews)}
        />

        <StatCard
          icon={<BarChart2 size={20} />}
          iconClassName='bg-blue-50 text-blue-600'
          label='Unique Visitors'
          value={formatNumber(totalImpressions)}
        />

        <StatCard
          icon={<User size={20} />}
          iconClassName='bg-emerald-50 text-emerald-600'
          label='Author'
          value={article.user?.name || 'Admin'}
        />

        <StatCard
          icon={<Calendar size={20} />}
          iconClassName='bg-purple-50 text-purple-600'
          label='Last Updated'
          value={formattedUpdatedDate}
        />
      </div>

      <form
        id='article-edit-form'
        onSubmit={handleSubmit}
        className='grid grid-cols-1 gap-6 lg:grid-cols-3'
      >
        <div className='space-y-6 lg:col-span-2'>
          <div className='space-y-5 rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
            <h2 className='border-b border-[#E0DCD5] pb-3 font-serif text-lg font-bold text-[#1A1A18]'>
              Article Details
            </h2>

            <div>
              <label
                htmlFor='title'
                className='mb-1.5 block text-xs font-semibold text-[#6B6860]'
              >
                Article Title
              </label>

              <input
                id='title'
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isSaving}
                className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-2.5 text-sm font-medium text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 disabled:opacity-60'
              />
            </div>

            <div>
              <label
                htmlFor='slug'
                className='mb-1.5 block text-xs font-semibold text-[#6B6860]'
              >
                URL Slug
              </label>

              <div className='relative'>
                <Globe
                  size={16}
                  className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]'
                />

                <input
                  id='slug'
                  type='text'
                  name='slug'
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                  className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] py-2.5 pl-10 pr-4 font-mono text-xs text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 disabled:opacity-60'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='short_desc'
                className='mb-1.5 block text-xs font-semibold text-[#6B6860]'
              >
                Short Description / Excerpt
              </label>

              <textarea
                id='short_desc'
                name='short_desc'
                rows={4}
                value={formData.short_desc}
                onChange={handleChange}
                disabled={isSaving}
                placeholder='Brief description of the article...'
                className='w-full resize-y rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 disabled:opacity-60'
              />
            </div>

            <div>
              <label
                htmlFor='long_desc'
                className='mb-1.5 block text-xs font-semibold text-[#6B6860]'
              >
                Main Content
              </label>

              <textarea
                id='long_desc'
                name='long_desc'
                rows={20}
                value={formData.long_desc}
                onChange={handleChange}
                required
                disabled={isSaving}
                placeholder='Write article content here...'
                className='w-full resize-y rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] p-4 font-mono text-sm leading-relaxed text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 disabled:opacity-60'
              />
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='space-y-4 rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
            <h2 className='border-b border-[#E0DCD5] pb-3 font-serif text-lg font-bold text-[#1A1A18]'>
              Status & Visibility
            </h2>

            <div className='flex items-center justify-between gap-3 rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5] p-3'>
              <div className='flex min-w-0 items-center gap-2'>
                {isPublished ? (
                  <CheckCircle
                    size={18}
                    className='shrink-0 text-emerald-600'
                  />
                ) : (
                  <XCircle size={18} className='shrink-0 text-amber-600' />
                )}

                <span className='text-xs font-bold text-[#1A1A18]'>
                  {isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <button
                type='button'
                onClick={() => void handlePublishToggle()}
                disabled={isPublishing}
                className={`shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  isPublished
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {isPublishing ? (
                  <Loader2 size={13} className='animate-spin' />
                ) : isPublished ? (
                  'Unpublish'
                ) : (
                  'Publish Now'
                )}
              </button>
            </div>

            <button
              type='button'
              onClick={() => void handleFeaturedToggle()}
              disabled={isFeaturedLoading}
              className={`flex w-full items-center justify-between rounded-2xl border p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                isFeatured
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : 'border-[#E0DCD5] bg-[#FAF8F5] text-[#6B6860]'
              }`}
            >
              <span className='inline-flex items-center gap-2 text-xs font-semibold'>
                {isFeaturedLoading ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <Star size={16} fill={isFeatured ? 'currentColor' : 'none'} />
                )}
                Featured Article
              </span>

              <span className='text-xs font-bold'>
                {isFeatured ? 'Active' : 'Off'}
              </span>
            </button>

            <button
              type='button'
              onClick={() => void handleMainPostToggle()}
              disabled={isMainPostLoading}
              className={`flex w-full items-center justify-between rounded-2xl border p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                isMainPost
                  ? 'border-blue-200 bg-blue-50 text-blue-800'
                  : 'border-[#E0DCD5] bg-[#FAF8F5] text-[#6B6860]'
              }`}
            >
              <span className='inline-flex items-center gap-2 text-xs font-semibold'>
                {isMainPostLoading ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <Bookmark
                    size={16}
                    fill={isMainPost ? 'currentColor' : 'none'}
                  />
                )}
                Main Post Hero
              </span>

              <span className='text-xs font-bold'>
                {isMainPost ? 'Active' : 'Off'}
              </span>
            </button>

            <div className='pt-2'>
              <label
                htmlFor='categoryId'
                className='mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6B6860]'
              >
                <Tag size={14} />
                Category
              </label>

              <select
                id='categoryId'
                name='categoryId'
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isSaving}
                className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2.5 text-sm font-medium text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 disabled:opacity-60'
              >
                <option value=''>Uncategorized</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='space-y-4 rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
            <h2 className='flex items-center gap-2 border-b border-[#E0DCD5] pb-3 font-serif text-lg font-bold text-[#1A1A18]'>
              <ImageIcon size={18} />
              Cover Image
            </h2>

            <div>
              <label
                htmlFor='image'
                className='mb-1.5 block text-xs font-semibold text-[#6B6860]'
              >
                Image URL
              </label>

              <input
                id='image'
                type='url'
                name='image'
                value={formData.image}
                onChange={handleChange}
                disabled={isSaving}
                placeholder='https://example.com/image.jpg'
                className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2.5 text-xs text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 disabled:opacity-60'
              />
            </div>

            {formData.image ? (
              <div className='relative aspect-video overflow-hidden rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5]'>
                <img
                  src={formData.image}
                  alt={`${formData.title || 'Article'} cover`}
                  className='h-full w-full object-cover'
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            ) : (
              <div className='rounded-2xl border border-dashed border-[#E0DCD5] bg-[#FAF8F5] p-6 text-center text-xs text-[#8C887B]'>
                No cover image specified.
              </div>
            )}
          </div>

          <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
            <h2 className='mb-4 border-b border-[#E0DCD5] pb-3 font-serif text-lg font-bold text-[#1A1A18]'>
              Article Information
            </h2>

            <div className='space-y-3 text-xs'>
              <InfoRow label='Article ID' value={article.id} />

              <InfoRow label='Created' value={formattedCreatedDate} />

              <InfoRow label='Updated' value={formattedUpdatedDate} />

              <InfoRow label='Author' value={article.user?.name || 'Admin'} />

              <InfoRow
                label='Status'
                value={isPublished ? 'Published' : 'Draft'}
              />

              {article.readTime !== null && article.readTime !== undefined && (
                <InfoRow label='Read Time' value={`${article.readTime} min`} />
              )}

              {article.status && (
                <InfoRow label='Article Status' value={article.status} />
              )}
            </div>
          </div>
        </div>
      </form>

      {showDeleteModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm'
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setShowDeleteModal(false)
            }
          }}
        >
          <div
            className='relative w-full max-w-md space-y-4 rounded-3xl border border-[#E0DCD5] bg-white p-6 shadow-2xl'
            role='dialog'
            aria-modal='true'
            aria-labelledby='delete-article-title'
          >
            <button
              type='button'
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className='absolute right-4 top-4 rounded-lg p-1 text-[#8C887B] transition hover:bg-gray-100 hover:text-[#1A1A18] disabled:opacity-50'
              aria-label='Close delete dialog'
            >
              <X size={18} />
            </button>

            <div className='flex items-center gap-3 text-rose-600'>
              <div className='rounded-xl bg-rose-50 p-2'>
                <AlertTriangle size={24} />
              </div>

              <h3
                id='delete-article-title'
                className='text-lg font-bold text-[#1A1A18]'
              >
                Delete Article
              </h3>
            </div>

            <p className='break-words text-sm leading-6 text-[#6B6860]'>
              Are you sure you want to delete{' '}
              <span className='font-semibold text-[#1A1A18]'>
                &quot;{formData.title}&quot;
              </span>
              ?
            </p>

            <div className='rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-700'>
              This action cannot be undone. The article and its associated data
              may be permanently removed.
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button
                type='button'
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className='rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='button'
                disabled={isDeleting}
                onClick={() => void handleDelete()}
                className='inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isDeleting && <Loader2 size={14} className='animate-spin' />}

                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: React.ReactNode
  iconClassName: string
  label: string
  value: string
}) {
  return (
    <div className='flex min-w-0 items-center gap-3 rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
      <div className={`shrink-0 rounded-xl p-3 ${iconClassName}`}>{icon}</div>

      <div className='min-w-0'>
        <span className='block text-xs text-[#8C887B]'>{label}</span>

        <span
          className='block truncate text-sm font-bold text-[#1A1A18]'
          title={value}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-start justify-between gap-4 border-b border-[#F0ECE1] pb-2 last:border-0 last:pb-0'>
      <span className='text-[#8C887B]'>{label}</span>

      <span
        className='max-w-[60%] truncate text-right font-semibold text-[#1A1A18]'
        title={value}
      >
        {value}
      </span>
    </div>
  )
}

function formatNumber(value?: number) {
  return (Number(value) || 0).toLocaleString()
}

function formatDate(value: string | Date) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return date.toLocaleDateString()
}
