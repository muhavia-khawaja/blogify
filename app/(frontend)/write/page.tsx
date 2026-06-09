'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FiSend,
  FiImage,
  FiLock,
  FiX,
  FiChevronDown,
  FiArrowLeft,
} from 'react-icons/fi'
import {
  createArticle,
  getAllCategories,
  getCurrentUser,
} from '@/utils/actions'
import Link from 'next/link'
import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'

export default function WritePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
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
  })

  useEffect(() => {
    const initPage = async () => {
      try {
        const [currentUser, allCats] = await Promise.all([
          getCurrentUser(),
          getAllCategories(),
        ])
        if (currentUser) {
          setUser(currentUser)
          setCategories(allCats)
        }
      } catch (err) {
        console.error('Init failed:', err)
      } finally {
        setAuthChecking(false)
      }
    }
    initPage()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) return alert('Select a department.')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('short_desc', form.short_desc)
      formData.append('long_desc', form.long_desc)
      formData.append('tags', form.tags)
      formData.append('categoryId', form.categoryId)
      if (imageFile) formData.append('image', imageFile)
      await createArticle(formData)
    } catch (err) {
      console.error('Submission failed:', err)
      setLoading(false)
    }
  }

  /* ── Loading state ── */
  if (authChecking) {
    return (
      <div className='min-h-screen bg-[#FCFBF9] flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-8 h-8 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto' />
          <p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
            Verifying Access
          </p>
        </div>
      </div>
    )
  }

  /* ── Auth wall ── */
  if (!user) {
    return (
      <div className='min-h-screen bg-[#FCFBF9] flex'>
        <div className='hidden lg:flex lg:w-1/2 bg-[#0F0F0F] flex-col justify-between p-14 relative overflow-hidden'>
          <div
            className='absolute inset-0 opacity-[0.04]'
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className='absolute bottom-0 right-0 text-[20rem] font-serif font-bold leading-none text-white/[0.03] select-none pointer-events-none'>
            W
          </div>
          <span className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 relative z-10'>
            The Journal
          </span>
          <div className='space-y-6 relative z-10'>
            <div className='h-px w-12 bg-emerald-500' />
            <p className='font-serif text-3xl font-bold text-white leading-snug max-w-xs'>
              Every voice deserves a place in the archive.
            </p>
            <p className='text-[11px] font-black uppercase tracking-[0.3em] text-white/30'>
              Contributor Access Required
            </p>
          </div>
          <div />
        </div>

        <div className='flex-1 flex items-center justify-center px-6'>
          <div className='max-w-sm w-full text-center space-y-8'>
            <div className='w-16 h-16 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto'>
              <FiLock size={24} className='text-red-400' />
            </div>
            <div>
              <span className='text-[9px] font-black uppercase tracking-[0.4em] text-red-400 block mb-4'>
                Archival Lock
              </span>
              <h2 className='text-3xl font-serif font-bold mb-3'>
                Access Restricted
              </h2>
              <p className='text-gray-400 font-serif italic'>
                Sign in to contribute to the archive.
              </p>
            </div>
            <div className='space-y-3'>
              <Link
                href='/login'
                className='group relative block w-full py-5 bg-[#0F0F0F] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all'
              >
                <span className='relative z-10'>Identify Yourself</span>
                <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
              </Link>
              <Link
                href='/'
                className='flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors py-3'
              >
                <FiArrowLeft size={12} />
                Return to Archive
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Write page ── */
  return (
    <section className='min-h-screen bg-[#FCFBF9] text-[#1A1A1A]'>
      <div className='fixed top-0 left-0 right-0 z-50 bg-[#FCFBF9]/90 backdrop-blur-md border-b border-gray-100'>
        <div className='max-w-4xl mx-auto px-6 h-16 flex items-center justify-between'>
          <Link
            href='/blog'
            className='group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors'
          >
            <FiArrowLeft
              size={13}
              className='group-hover:-translate-x-1 transition-transform'
            />
            Archive
          </Link>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => setStep(1)}
              className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                step === 1
                  ? 'text-emerald-600'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              01 · Details
            </button>
            <span className='h-px w-6 bg-gray-200' />
            <button
              type='button'
              onClick={() => {
                if (form.title && form.categoryId) setStep(2)
              }}
              className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                step === 2
                  ? 'text-emerald-600'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              02 · Manuscript
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
              {user.name}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className='pt-28 pb-20'>
            <div className='max-w-4xl mx-auto px-6 space-y-10'>
              <div className='mb-4'>
                <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 block mb-3'>
                  New Submission
                </span>
                <h1 className='text-4xl md:text-5xl font-serif font-bold leading-tight'>
                  Compose your{' '}
                  <span className='italic font-normal text-gray-400'>
                    manuscript.
                  </span>
                </h1>
              </div>

              <div>
                <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                  Cover Image
                </label>
                {imagePreview ? (
                  <div className='relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-lg'>
                    <Image
                      src={imagePreview}
                      alt='Preview'
                      fill
                      className='object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                      }}
                      className='absolute top-4 right-4 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors'
                    >
                      <FiX size={15} />
                    </button>
                  </div>
                ) : (
                  <label className='flex flex-col items-center justify-center w-full aspect-[21/9] rounded-[2rem] border-2 border-dashed border-gray-200 bg-white cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group'>
                    <div className='w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 group-hover:border-emerald-200 transition-colors'>
                      <FiImage
                        className='text-gray-300 group-hover:text-emerald-400 transition-colors'
                        size={22}
                      />
                    </div>
                    <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                      Attach Thumbnail
                    </p>
                    <p className='text-[9px] text-gray-300 mt-1'>
                      JPG, PNG, WEBP
                    </p>
                    <input
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                  Title
                </label>
                <input
                  type='text'
                  placeholder='The Title...'
                  required
                  className='w-full bg-white border border-gray-100 rounded-2xl px-7 py-5 text-3xl md:text-4xl font-serif font-bold outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder:text-gray-200 text-[#1A1A1A]'
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                  Abstract
                </label>
                <textarea
                  rows={3}
                  placeholder='A brief description of what this piece is about...'
                  className='w-full rounded-2xl border border-gray-100 bg-white px-6 py-5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all font-serif italic text-lg resize-none placeholder:text-gray-300 text-[#1A1A1A]'
                  value={form.short_desc}
                  onChange={(e) =>
                    setForm({ ...form, short_desc: e.target.value })
                  }
                />
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                    Department
                  </label>
                  <div className='relative'>
                    <select
                      required
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({ ...form, categoryId: e.target.value })
                      }
                      className='w-full rounded-2xl border border-gray-100 bg-white px-6 py-5 appearance-none outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all text-sm text-[#1A1A1A]'
                    >
                      <option value=''>Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className='absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                  </div>
                </div>

                <div>
                  <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                    Keywords
                  </label>
                  <input
                    type='text'
                    placeholder='Python, SEO, Design...'
                    className='w-full rounded-2xl border border-gray-100 bg-white px-6 py-5 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all text-sm placeholder:text-gray-300 text-[#1A1A1A]'
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>
              </div>

              <div className='flex justify-end pt-4'>
                <button
                  type='button'
                  onClick={() => {
                    if (!form.title) return alert('Add a title first.')
                    if (!form.categoryId) return alert('Select a department.')
                    setStep(2)
                  }}
                  className='group relative flex items-center gap-3 rounded-2xl bg-[#0F0F0F] px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white overflow-hidden transition-all active:scale-[0.98]'
                >
                  <span className='relative z-10'>Continue to Manuscript</span>
                  <FiSend size={13} className='relative z-10' />
                  <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className='pt-28 pb-20'>
            <div className='max-w-4xl mx-auto px-6 space-y-8'>
              <div className='pb-8 border-b border-gray-100'>
                <p className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-2'>
                  Writing
                </p>
                <h2 className='text-2xl font-serif font-bold text-[#1A1A1A] truncate'>
                  {form.title || 'Untitled Manuscript'}
                </h2>
              </div>

              <div>
                <label className='block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3 ml-1'>
                  The Manuscript
                </label>
                <RichTextEditor
                  value={form.long_desc}
                  onChange={(content) =>
                    setForm({ ...form, long_desc: content })
                  }
                />
              </div>

              <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
                <button
                  type='button'
                  onClick={() => setStep(1)}
                  className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors'
                >
                  <FiArrowLeft size={13} />
                  Back to Details
                </button>

                <button
                  type='submit'
                  disabled={loading}
                  className='group relative flex items-center gap-3 rounded-2xl bg-[#0F0F0F] px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50'
                >
                  <span className='relative z-10'>
                    {loading ? 'Transmitting...' : 'Dispatch Manuscript'}
                  </span>
                  <FiSend size={13} className='relative z-10' />
                  <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </section>
  )
}
