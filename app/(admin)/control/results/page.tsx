'use client'

import React, { useCallback, useEffect, useState, useTransition } from 'react'

import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  AlertTriangle,
  X,
  Link as LinkIcon,
} from 'lucide-react'

import {
  getResults,
  createResult,
  updateResult,
  toggleResultStatus,
  deleteResult,
} from '@/utils/admin-action'

interface Result {
  id: string
  status: boolean
  title: string
  url: string
  refUrl?: string | null
  createdAt: string | Date
}

type ActionResult = {
  success?: boolean
  error?: string
  message?: string
}

const DEFAULT_PAGE_SIZE = 10

export default function AdminResultsPage() {
  const [results, setResults] = useState<Result[]>([])

  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [isPending, startTransition] = useTransition()

  const [activeDelete, setActiveDelete] = useState<Result | null>(null)

  const [activeEdit, setActiveEdit] = useState<Result | null>(null)

  const [showCreate, setShowCreate] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  const [actionError, setActionError] = useState('')

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setLoadError('')

    try {
      const result = await getResults({
        query: query.trim(),
        status: status as 'ALL' | 'ACTIVE' | 'INACTIVE',
        page,
        limit: DEFAULT_PAGE_SIZE,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      setResults(
        Array.isArray(result.results) ? (result.results as Result[]) : [],
      )

      setTotalPages(Math.max(1, Number(result.totalPages) || 1))

      setTotalCount(Math.max(0, Number(result.totalCount) || 0))
    } catch (error) {
      console.error('Failed to load results:', error)

      setLoadError(
        error instanceof Error ? error.message : 'Failed to load results.',
      )

      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [query, status, page])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const updateResultInState = (id: string, updates: Partial<Result>) => {
    setResults((current) =>
      current.map((result) =>
        result.id === id
          ? {
              ...result,
              ...updates,
            }
          : result,
      ),
    )
  }

  const runAction = (
    action: () => Promise<unknown>,
    id: string,
    updates: Partial<Result>,
  ) => {
    setActionError('')

    startTransition(async () => {
      try {
        const result = (await action()) as ActionResult | undefined

        if (result && result.success === false) {
          throw new Error(
            result.error || result.message || 'The action failed.',
          )
        }

        updateResultInState(id, updates)
      } catch (error) {
        console.error('Result action failed:', error)

        setActionError(
          error instanceof Error
            ? error.message
            : 'The action could not be completed.',
        )
      }
    })
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    setActionError('')

    try {
      const result = (await deleteResult(id)) as ActionResult

      if (result && result.success === false) {
        throw new Error(
          result.error || result.message || 'Failed to delete result.',
        )
      }

      setActiveDelete(null)

      if (results.length === 1 && page > 1) {
        setPage((current) => current - 1)
      } else {
        await loadData()
      }
    } catch (error) {
      console.error('Delete result failed:', error)

      setActionError(
        error instanceof Error ? error.message : 'Failed to delete result.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
  }

  const clearFilters = () => {
    setQuery('')
    setStatus('ALL')
    setPage(1)
  }

  return (
    <div className='min-h-screen space-y-6 bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
      {/* Header */}
      <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='font-serif text-2xl font-bold text-[#1A1A18] sm:text-3xl'>
              Results Management
            </h1>

            <p className='mt-1 font-serif text-xs italic text-[#6B6860] sm:text-sm'>
              Manage result links, reference URLs, and publication status. (
              {totalCount} total)
            </p>
          </div>

          <button
            type='button'
            onClick={() => {
              setActionError('')
              setShowCreate(true)
            }}
            className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A1A18] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black'
          >
            <Plus size={16} />
            Add Result
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
        <form
          onSubmit={handleFilterSubmit}
          className='flex w-full flex-col gap-3 lg:flex-row'
        >
          <div className='relative min-w-0 flex-1'>
            <Search
              size={18}
              className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]'
            />

            <input
              type='text'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search by title or URL...'
              className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-sm text-[#1A1A18] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            className='rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#1A1A18] outline-none focus:border-amber-500'
          >
            <option value='ALL'>All Statuses</option>
            <option value='ACTIVE'>Published</option>
            <option value='INACTIVE'>Unpublished</option>
          </select>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={isLoading}
              className='inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A1A18] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none'
            >
              {isLoading && <Loader2 size={16} className='animate-spin' />}
              Filter
            </button>

            {(query || status !== 'ALL') && (
              <button
                type='button'
                onClick={clearFilters}
                className='rounded-xl border border-[#E0DCD5] bg-white px-4 py-2.5 text-sm font-semibold text-[#6B6860] transition hover:bg-[#FAF8F5]'
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Errors */}
      {(loadError || actionError) && (
        <div className='flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700'>
          <AlertTriangle size={18} className='mt-0.5 shrink-0' />

          <div className='min-w-0 flex-1'>
            <p className='font-semibold'>Something went wrong</p>

            <p className='mt-1 break-words'>{loadError || actionError}</p>
          </div>

          <button
            type='button'
            onClick={() => {
              setLoadError('')
              setActionError('')
              void loadData()
            }}
            className='shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm'
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className='overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[950px] border-collapse text-left'>
            <thead>
              <tr className='border-b border-[#E0DCD5] bg-[#FAF8F5] text-xs font-bold uppercase text-[#8C887B]'>
                <th className='px-4 py-4'>Title</th>

                <th className='px-4 py-4'>Result URL</th>

                <th className='px-4 py-4'>Reference</th>

                <th className='px-4 py-4'>Created</th>

                <th className='px-4 py-4'>Status</th>

                <th className='px-4 py-4 text-right'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[#E0DCD5]'>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className='py-16 text-center'>
                    <Loader2
                      size={30}
                      className='mx-auto animate-spin text-amber-500'
                    />

                    <p className='mt-3 text-sm text-[#6B6860]'>
                      Loading results...
                    </p>
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={6} className='py-16 text-center text-[#6B6860]'>
                    <FileText
                      size={36}
                      className='mx-auto mb-3 text-[#8C887B]'
                    />

                    <p className='text-sm font-semibold'>No results found</p>

                    <p className='mt-1 text-xs'>
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr
                    key={result.id}
                    className='transition-colors hover:bg-[#FAF8F5]'
                  >
                    {/* Title */}
                    <td className='max-w-xs px-4 py-4'>
                      <div
                        className='truncate text-sm font-semibold text-[#1A1A18]'
                        title={result.title}
                      >
                        {result.title}
                      </div>

                      <div className='mt-1 text-xs text-[#8C887B]'>
                        ID: {result.id}
                      </div>
                    </td>

                    {/* URL */}
                    <td className='max-w-sm px-4 py-4'>
                      <a
                        href={result.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group flex max-w-sm items-center gap-2'
                      >
                        <LinkIcon
                          size={14}
                          className='shrink-0 text-[#8C887B]'
                        />

                        <span
                          className='truncate text-xs font-medium text-[#4A473F] group-hover:text-amber-600'
                          title={result.url}
                        >
                          {result.url}
                        </span>

                        <ExternalLink
                          size={13}
                          className='shrink-0 text-[#8C887B]'
                        />
                      </a>
                    </td>

                    {/* Reference URL */}
                    <td className='max-w-sm px-4 py-4'>
                      {result.refUrl ? (
                        <a
                          href={result.refUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='group flex max-w-sm items-center gap-2'
                        >
                          <LinkIcon
                            size={14}
                            className='shrink-0 text-[#8C887B]'
                          />

                          <span
                            className='truncate text-xs font-medium text-[#4A473F] group-hover:text-amber-600'
                            title={result.refUrl}
                          >
                            {result.refUrl}
                          </span>
                        </a>
                      ) : (
                        <span className='text-xs text-[#8C887B]'>
                          No reference
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className='whitespace-nowrap px-4 py-4 text-xs text-[#6B6860]'>
                      {formatDate(result.createdAt)}
                    </td>

                    {/* Status */}
                    <td className='whitespace-nowrap px-4 py-4'>
                      <button
                        type='button'
                        disabled={isPending}
                        onClick={() =>
                          runAction(
                            () => toggleResultStatus(result.id, result.status),
                            result.id,
                            {
                              status: !result.status,
                            },
                          )
                        }
                        className='transition disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {result.status ? (
                          <span className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700'>
                            <CheckCircle size={12} />
                            Published
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700'>
                            <XCircle size={12} />
                            Unpublished
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className='whitespace-nowrap px-4 py-4 text-right'>
                      <div className='flex items-center justify-end gap-1.5'>
                        <button
                          type='button'
                          onClick={() => {
                            setActionError('')
                            setActiveEdit(result)
                          }}
                          className='rounded-lg p-1.5 text-[#6B6860] transition hover:bg-[#FAF8F5] hover:text-amber-600'
                          title='Edit Result'
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type='button'
                          onClick={() =>
                            window.open(
                              result.url,
                              '_blank',
                              'noopener,noreferrer',
                            )
                          }
                          className='rounded-lg p-1.5 text-[#6B6860] transition hover:bg-[#FAF8F5] hover:text-amber-600'
                          title='Open Result'
                        >
                          <ExternalLink size={16} />
                        </button>

                        <button
                          type='button'
                          onClick={() => {
                            setActionError('')
                            setActiveDelete(result)
                          }}
                          className='rounded-lg p-1.5 text-[#8C887B] transition hover:bg-rose-50 hover:text-rose-600'
                          title='Delete Result'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex flex-col gap-3 border-t border-[#E0DCD5] bg-[#FAF8F5] p-4 sm:flex-row sm:items-center sm:justify-between'>
          <span className='text-xs text-[#6B6860]'>
            Page {page} of {totalPages}
            {totalCount > 0 ? ` • ${totalCount} results` : ''}
          </span>

          <div className='flex items-center justify-between gap-2 sm:justify-end'>
            <button
              type='button'
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className='inline-flex items-center gap-1 rounded-xl border border-[#E0DCD5] bg-white px-3 py-2 text-xs font-semibold transition hover:bg-[#FAF8F5] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <span className='rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#6B6860]'>
              {page} / {totalPages}
            </span>

            <button
              type='button'
              disabled={page >= totalPages || isLoading}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className='inline-flex items-center gap-1 rounded-xl border border-[#E0DCD5] bg-white px-3 py-2 text-xs font-semibold transition hover:bg-[#FAF8F5] disabled:cursor-not-allowed disabled:opacity-40'
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <ResultFormModal
          title='Create Result'
          submitLabel='Create Result'
          onClose={() => setShowCreate(false)}
          onSubmit={async (data) => {
            const result = await createResult(data)

            if (!result.success) {
              throw new Error(result.error || 'Failed to create result.')
            }

            setShowCreate(false)
            await loadData()
          }}
        />
      )}

      {/* Edit Modal */}
      {activeEdit && (
        <ResultFormModal
          title='Edit Result'
          submitLabel='Save Changes'
          initialData={activeEdit}
          onClose={() => setActiveEdit(null)}
          onSubmit={async (data) => {
            const result = await updateResult(activeEdit.id, data)

            if (!result.success) {
              throw new Error(result.error || 'Failed to update result.')
            }

            setActiveEdit(null)
            await loadData()
          }}
        />
      )}

      {/* Delete Modal */}
      {activeDelete && (
        <ModalOverlay
          onClose={() => {
            if (!isDeleting) {
              setActiveDelete(null)
            }
          }}
        >
          <div className='relative w-full max-w-md space-y-4 rounded-3xl border border-[#E0DCD5] bg-white p-6 shadow-2xl'>
            <button
              type='button'
              onClick={() => setActiveDelete(null)}
              disabled={isDeleting}
              className='absolute right-4 top-4 rounded-lg p-1 text-[#8C887B] transition hover:bg-gray-100 hover:text-[#1A1A18] disabled:opacity-50'
            >
              <X size={18} />
            </button>

            <div className='flex items-center gap-3 text-rose-600'>
              <div className='rounded-xl bg-rose-50 p-2'>
                <AlertTriangle size={24} />
              </div>

              <h3 className='text-lg font-bold text-[#1A1A18]'>
                Delete Result
              </h3>
            </div>

            <p className='break-words text-sm text-[#6B6860]'>
              Are you sure you want to delete{' '}
              <span className='font-semibold text-[#1A1A18]'>
                {activeDelete.title}
              </span>
              ?
            </p>

            <div className='rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700'>
              This action cannot be undone.
            </div>

            {actionError && (
              <p className='text-xs font-medium text-rose-600'>{actionError}</p>
            )}

            <div className='flex justify-end gap-2 pt-2'>
              <button
                type='button'
                onClick={() => setActiveDelete(null)}
                disabled={isDeleting}
                className='rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50'
              >
                Cancel
              </button>

              <button
                type='button'
                disabled={isDeleting}
                onClick={() => void handleDelete(activeDelete.id)}
                className='inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isDeleting && <Loader2 size={14} className='animate-spin' />}

                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  )
}

function ResultFormModal({
  title,
  submitLabel,
  initialData,
  onClose,
  onSubmit,
}: {
  title: string
  submitLabel: string
  initialData?: Result
  onClose: () => void
  onSubmit: (data: {
    title: string
    url: string
    refUrl?: string | null
    status?: boolean
  }) => Promise<void>
}) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    url: initialData?.url || '',
    refUrl: initialData?.refUrl || '',
    status: initialData?.status ?? false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    if (!form.url.trim()) {
      setError('Result URL is required.')
      return
    }

    setIsSaving(true)

    try {
      await onSubmit({
        title: form.title.trim(),
        url: form.url.trim(),
        refUrl: form.refUrl.trim() || null,
        status: form.status,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ModalOverlay onClose={isSaving ? () => {} : onClose}>
      <div className='relative w-full max-w-lg rounded-3xl border border-[#E0DCD5] bg-white p-6 shadow-2xl'>
        <button
          type='button'
          onClick={onClose}
          disabled={isSaving}
          className='absolute right-4 top-4 rounded-lg p-1 text-[#8C887B] hover:bg-gray-100 disabled:opacity-50'
        >
          <X size={18} />
        </button>

        <div className='mb-6'>
          <h2 className='text-xl font-bold text-[#1A1A18]'>{title}</h2>

          <p className='mt-1 text-xs text-[#8C887B]'>
            Add the result URL and optional reference URL.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-[#4A473F]'>
              Title
            </label>

            <input
              type='text'
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder='Enter result title'
              className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold text-[#4A473F]'>
              Result URL
            </label>

            <input
              type='url'
              value={form.url}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  url: event.target.value,
                }))
              }
              placeholder='https://example.com/result'
              className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold text-[#4A473F]'>
              Reference URL
              <span className='ml-1 font-normal text-[#8C887B]'>
                (optional)
              </span>
            </label>

            <input
              type='url'
              value={form.refUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  refUrl: event.target.value,
                }))
              }
              placeholder='https://example.com/reference'
              className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
            />
          </div>

          <label className='flex cursor-pointer items-center gap-3 rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] p-3'>
            <input
              type='checkbox'
              checked={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.checked,
                }))
              }
              className='h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
            />

            <span>
              <span className='block text-sm font-semibold text-[#1A1A18]'>
                Published
              </span>

              <span className='block text-xs text-[#8C887B]'>
                Make this result visible on the public site.
              </span>
            </span>
          </label>

          {error && (
            <div className='rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700'>
              {error}
            </div>
          )}

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSaving}
              className='rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={isSaving}
              className='inline-flex items-center gap-2 rounded-xl bg-[#1A1A18] px-5 py-2.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-50'
            >
              {isSaving && <Loader2 size={14} className='animate-spin' />}

              {isSaving ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  )
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      role='dialog'
      aria-modal='true'
    >
      {children}
    </div>
  )
}

function formatDate(value: string | Date) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return date.toLocaleDateString()
}
