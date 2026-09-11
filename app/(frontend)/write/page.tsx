'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  FiArrowLeft,
  FiChevronDown,
  FiImage,
  FiLock,
  FiSend,
  FiX,
  FiHash,
  FiCheck,
  FiLoader,
} from 'react-icons/fi'

import {
  createArticle,
  getAllCategories,
  getAllTopics,
  getCurrentUser,
} from '@/utils/actions'

import RichTextEditor from '@/components/RichTextEditor'

interface Category {
  id: string
  title: string
  slug: string
}

interface Topic {
  id: string
  name: string
  slug: string
}

interface CurrentUser {
  id: string
  name: string
  email?: string
  image?: string | null
}

export default function WritePage() {
  const router = useRouter()

  const [user, setUser] = useState<CurrentUser | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [topics, setTopics] = useState<Topic[]>([])

  const [loading, setLoading] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [step, setStep] = useState<1 | 2>(1)

  const [form, setForm] = useState({
    title: '',
    short_desc: '',
    long_desc: '',
    tags: '',
    categoryId: '',
    topicIds: [] as string[],
  })

 

  useEffect(() => {
    const initPage = async () => {
      try {
        const [currentUser, allCategories, allTopics] = await Promise.all([
          getCurrentUser(),
          getAllCategories(),
          getAllTopics(),
        ])

        if (currentUser) {
          setUser(currentUser)
          setCategories(allCategories || [])
          setTopics(allTopics || [])
        }
      } catch (error) {
        console.error('Failed to initialize write page:', error)
      } finally {
        setAuthChecking(false)
      }
    }

    initPage()
  }, [])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setImageFile(file)

    const reader = new FileReader()

    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const toggleTopic = (topicId: string) => {
    setForm((previous) => {
      const alreadySelected = previous.topicIds.includes(topicId)

      return {
        ...previous,
        topicIds: alreadySelected
          ? previous.topicIds.filter((id) => id !== topicId)
          : [...previous.topicIds, topicId],
      }
    })
  }

  const continueToEditor = () => {
    if (!form.title.trim()) {
      alert('Please add a title.')
      return
    }

    if (!form.categoryId) {
      alert('Please select a category.')
      return
    }

    setStep(2)
  }

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault()

  if (!form.title.trim()) {
    alert('Please add a title.')
    setStep(1)
    return
  }

  if (!form.categoryId) {
    alert('Please select a category.')
    setStep(1)
    return
  }

  if (!form.long_desc.trim()) {
    alert('Please write some content before publishing.')
    return
  }

  setLoading(true)

  try {
    const formData = new FormData()

    formData.append('title', form.title.trim())
    formData.append(
      'short_desc',
      form.short_desc.trim()
    )
    formData.append(
      'long_desc',
      form.long_desc
    )
    formData.append(
      'tags',
      form.tags.trim()
    )
    formData.append(
      'categoryId',
      form.categoryId
    )

    form.topicIds.forEach((topicId) => {
      formData.append('topicIds', topicId)
    })

    if (imageFile) {
      formData.append('image', imageFile)
    }

    
    formData.append('intent', 'submit')

    await createArticle(formData)
  } catch (error) {
    console.error(
      'Article submission failed:',
      error
    )

    setLoading(false)

    alert(
      'Something went wrong while submitting the article.'
    )
  }
}


  if (authChecking) {
    return (
      <div className='min-h-screen bg-[#F8F9FC] flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-10 h-10 rounded-full border-2 border-gray-200 border-t-[#3d348b] animate-spin mx-auto mb-4' />

          <p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
            Loading editor
          </p>
        </div>
      </div>
    )
  }

  /* ─────────────────────────────────────────────
     AUTH WALL
  ───────────────────────────────────────────── */

  if (!user) {
    return (
      <div className='min-h-screen bg-[#F8F9FC] flex'>
        {/* Desktop visual */}
        <div className='hidden lg:flex lg:w-1/2 bg-[#3d348b] flex-col justify-between p-14 relative overflow-hidden'>
          <div
            className='absolute inset-0 opacity-[0.06]'
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className='absolute -bottom-16 -right-10 text-[20rem] font-serif font-bold leading-none text-white/[0.04] select-none pointer-events-none'>
            E
          </div>

          <div className='relative z-10'>
            <span className='text-[10px] font-black uppercase tracking-[0.4em] text-[#f7b801]'>
              Education With Hamza
            </span>
          </div>

          <div className='relative z-10 space-y-6'>
            <div className='h-px w-12 bg-[#f7b801]' />

            <h2 className='font-serif text-4xl font-bold text-white leading-tight max-w-md'>
              Share what you know.
              <br />
              <span className='italic font-normal text-white/50'>
                Inspire someone else.
              </span>
            </h2>

            <p className='text-xs uppercase tracking-[0.25em] text-white/40'>
              Contributor access required
            </p>
          </div>

          <div />
        </div>

        {/* Auth content */}
        <div className='flex-1 flex items-center justify-center px-6 py-12'>
          <div className='max-w-sm w-full text-center'>
            <div className='w-16 h-16 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-7'>
              <FiLock size={24} className='text-red-400' />
            </div>

            <span className='text-[9px] font-black uppercase tracking-[0.4em] text-red-400 block mb-4'>
              Sign in required
            </span>

            <h2 className='text-3xl font-serif font-bold text-[#1A1A1A] mb-3'>
              Start writing
            </h2>

            <p className='text-gray-400 font-serif italic mb-8'>
              Sign in to publish articles on Education With Hamza.
            </p>

            <div className='space-y-3'>
              <Link
                href='/login'
                className='block w-full py-4 rounded-2xl bg-[#3d348b] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#30286f] transition-colors'
              >
                Sign in
              </Link>

              <Link
                href='/signup'
                className='block w-full py-4 rounded-2xl border border-gray-200 bg-white text-[#3d348b] text-[10px] font-black uppercase tracking-[0.2em] hover:border-[#7678ed] transition-colors'
              >
                Create account
              </Link>

              <Link
                href='/'
                className='flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#3d348b] transition-colors py-3'
              >
                <FiArrowLeft size={12} />
                Return home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <section className='min-h-screen bg-[#F8F9FC] text-[#1A1A1A]'>
      {/* Header */}
      <div className='fixed top-0 left-0 right-0 lg:left-[250px] z-50 bg-[#F8F9FC]/95 backdrop-blur-md border-b border-gray-100'>
        <div className='max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4'>
          <Link
            href='/latest'
            className='group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#3d348b] transition-colors'
          >
            <FiArrowLeft
              size={13}
              className='group-hover:-translate-x-1 transition-transform'
            />
            <span className='hidden sm:inline'>Back to articles</span>
            <span className='sm:hidden'>Back</span>
          </Link>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => setStep(1)}
              className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                step === 1
                  ? 'text-[#3d348b]'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              01 · Details
            </button>

            <span className='h-px w-5 sm:w-8 bg-gray-200' />

            <button
              type='button'
              onClick={() => {
                if (form.title && form.categoryId) {
                  setStep(2)
                }
              }}
              className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                step === 2
                  ? 'text-[#3d348b]'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              02 · Content
            </button>
          </div>

          <div className='flex items-center gap-2 min-w-0'>
            {user.image ? (
              <div className='relative w-7 h-7 rounded-full overflow-hidden border border-gray-200'>
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className='object-cover'
                  sizes='28px'
                />
              </div>
            ) : (
              <div className='w-7 h-7 rounded-full bg-[#3d348b] text-white flex items-center justify-center text-[9px] font-black'>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <span className='hidden md:block text-[10px] font-black uppercase tracking-widest text-gray-400 truncate max-w-[130px]'>
              {user.name}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className='pt-28 pb-20'>
            <div className='max-w-5xl mx-auto px-5 md:px-8 space-y-10'>
              {/* Heading */}
              <div>
                <span className='text-[9px] font-black uppercase tracking-[0.4em] text-[#3d348b] block mb-3'>
                  New article
                </span>

                <h1 className='text-4xl md:text-5xl font-serif font-bold leading-tight'>
                  Compose your{' '}
                  <span className='italic font-normal text-gray-400'>
                    article.
                  </span>
                </h1>

                <p className='mt-3 text-sm text-gray-400 max-w-xl'>
                  Add the essential details first, then write and publish your
                  article.
                </p>
              </div>

              {/* Cover image */}
              <div>
                <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                  Cover image
                </label>

                {imagePreview ? (
                  <div className='relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-lg bg-white'>
                    <Image
                      src={imagePreview}
                      alt='Article cover preview'
                      fill
                      className='object-cover'
                    />

                    <button
                      type='button'
                      onClick={removeImage}
                      className='absolute top-4 right-4 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors'
                      aria-label='Remove image'
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <label className='flex flex-col items-center justify-center w-full aspect-[21/9] rounded-[2rem] border-2 border-dashed border-gray-200 bg-white cursor-pointer hover:border-[#7678ed] hover:bg-[#7678ed]/5 transition-all group'>
                    <div className='w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 group-hover:border-[#7678ed]/30 transition-colors'>
                      <FiImage
                        className='text-gray-300 group-hover:text-[#7678ed] transition-colors'
                        size={22}
                      />
                    </div>

                    <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                      Add cover image
                    </p>

                    <p className='text-[9px] text-gray-300 mt-1'>
                      JPG, PNG or WEBP
                    </p>

                    <input
                      type='file'
                      className='hidden'
                      accept='image/jpeg,image/png,image/webp'
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Title */}
              <div>
                <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                  Title
                </label>

                <input
                  type='text'
                  placeholder='Give your article a clear title...'
                  required
                  maxLength={180}
                  className='w-full bg-white border border-gray-100 rounded-2xl px-7 py-5 text-3xl md:text-4xl font-serif font-bold outline-none focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10 transition-all placeholder:text-gray-200 text-[#1A1A1A]'
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                />

                <p className='text-right text-[9px] text-gray-300 mt-2'>
                  {form.title.length}/180
                </p>
              </div>

              {/* Short description */}
              <div>
                <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                  Short description
                </label>

                <textarea
                  rows={3}
                  maxLength={300}
                  placeholder='Briefly explain what readers will learn...'
                  className='w-full rounded-2xl border border-gray-100 bg-white px-6 py-5 outline-none focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10 transition-all font-serif italic text-lg resize-none placeholder:text-gray-300 text-[#1A1A1A]'
                  value={form.short_desc}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      short_desc: event.target.value,
                    })
                  }
                />

                <p className='text-right text-[9px] text-gray-300 mt-2'>
                  {form.short_desc.length}/300
                </p>
              </div>

              {/* Category + Tags */}
              <div className='grid md:grid-cols-2 gap-6'>
                {/* Category */}
                <div>
                  <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                    Category
                  </label>

                  <div className='relative'>
                    <select
                      required
                      value={form.categoryId}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          categoryId: event.target.value,
                        })
                      }
                      className='w-full rounded-2xl border border-gray-100 bg-white px-6 py-5 appearance-none outline-none focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10 transition-all text-sm text-[#1A1A1A]'
                    >
                      <option value=''>Select category</option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>

                    <FiChevronDown className='absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                    Tags
                  </label>

                  <div className='relative'>
                    <FiHash
                      className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300'
                      size={15}
                    />

                    <input
                      type='text'
                      placeholder='Education, Programming, Study...'
                      className='w-full rounded-2xl border border-gray-100 bg-white pl-12 pr-6 py-5 outline-none focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/10 transition-all text-sm placeholder:text-gray-300 text-[#1A1A1A]'
                      value={form.tags}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          tags: event.target.value,
                        })
                      }
                    />
                  </div>

                  <p className='text-[9px] text-gray-300 mt-2 ml-1'>
                    Separate tags with commas
                  </p>
                </div>
              </div>

              {/* Topics */}
              <div>
                <div className='flex items-center justify-between mb-3 ml-1'>
                  <label className='text-[9px] font-black uppercase tracking-[0.25em] text-gray-400'>
                    Topics
                  </label>

                  <span className='text-[9px] text-gray-300'>
                    {form.topicIds.length} selected
                  </span>
                </div>

                {topics.length === 0 ? (
                  <div className='rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center'>
                    <p className='text-xs text-gray-400'>
                      No topics are available yet.
                    </p>
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {topics.map((topic) => {
                      const selected = form.topicIds.includes(topic.id)

                      return (
                        <button
                          key={topic.id}
                          type='button'
                          onClick={() => toggleTopic(topic.id)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold border transition-all ${
                            selected
                              ? 'bg-[#3d348b] border-[#3d348b] text-white shadow-sm'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-[#7678ed] hover:text-[#3d348b]'
                          }`}
                        >
                          {selected && <FiCheck size={13} />}

                          {topic.name}
                        </button>
                      )
                    })}
                  </div>
                )}

                <p className='text-[9px] text-gray-300 mt-3 ml-1'>
                  Topics help readers discover your article through personalized
                  feeds.
                </p>
              </div>

              {/* Continue */}
              <div className='flex justify-end pt-4'>
                <button
                  type='button'
                  onClick={continueToEditor}
                  className='group relative flex items-center gap-3 rounded-2xl bg-[#3d348b] px-8 md:px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white overflow-hidden transition-all hover:bg-[#30286f] active:scale-[0.98]'
                >
                  <span className='relative z-10'>Continue to content</span>

                  <FiSend size={13} className='relative z-10' />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────── STEP 2 ───────────────────────── */}
        {step === 2 && (
          <div className='pt-28 pb-20'>
            <div className='max-w-5xl mx-auto px-5 md:px-8 space-y-8'>
              {/* Article summary */}
              <div className='pb-8 border-b border-gray-100'>
                <p className='text-[9px] font-black uppercase tracking-[0.4em] text-[#3d348b] mb-2'>
                  Writing article
                </p>

                <h2 className='text-2xl md:text-3xl font-serif font-bold text-[#1A1A1A]'>
                  {form.title || 'Untitled article'}
                </h2>

                {form.short_desc && (
                  <p className='mt-2 text-sm text-gray-400 max-w-2xl'>
                    {form.short_desc}
                  </p>
                )}

                {/* Selected topics */}
                {form.topicIds.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-5'>
                    {form.topicIds.map((topicId) => {
                      const topic = topics.find((item) => item.id === topicId)

                      if (!topic) return null

                      return (
                        <span
                          key={topic.id}
                          className='px-3 py-1.5 rounded-full bg-[#3d348b]/5 text-[#3d348b] text-[10px] font-bold'
                        >
                          {topic.name}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Editor */}
              <div>
                <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                  Article content
                </label>

                <RichTextEditor
                  value={form.long_desc}
                  onChange={(content) =>
                    setForm({
                      ...form,
                      long_desc: content,
                    })
                  }
                />
              </div>

              {/* Actions */}
              <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
                <button
                  type='button'
                  onClick={() => setStep(1)}
                  className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#3d348b] transition-colors'
                >
                  <FiArrowLeft size={13} />
                  Back to details
                </button>

                <button
                  type='submit'
                  disabled={loading}
                  className='flex items-center gap-3 rounded-2xl bg-[#3d348b] px-8 md:px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#30286f] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? (
                    <>
                      <FiLoader size={14} className='animate-spin' />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <span>Publish article</span>
                      <FiSend size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </section>
  )
}
