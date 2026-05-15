'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiSend, FiImage, FiLock, FiX, FiChevronDown } from 'react-icons/fi'
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

  if (authChecking)
    return (
      <div className='min-h-screen flex items-center justify-center font-serif italic'>
        Verifying...
      </div>
    )

  if (!user) {
    return (
      <div className='min-h-screen bg-[#FCFBF9] flex items-center justify-center p-6'>
        <div className='max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center border border-gray-100'>
          <FiLock size={32} className='mx-auto text-red-500 mb-6' />

          <h2 className='text-3xl font-serif font-bold mb-4'>Archival Lock</h2>
          <p className='text-gray-500 mb-8'>
            Sign in to contribute to the archive.
          </p>
          <Link
            href='/login'
            className='block w-full py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all'
          >
            Identify Yourself
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className='min-h-screen bg-[#FCFBF9] pt-32 pb-20 text-[#1A1A1A]'>
      <div className='max-w-4xl mx-auto px-6'>
        <form onSubmit={handleSubmit} className='space-y-12'>
          {/* IMAGE UPLOAD */}
          <div className='relative group'>
            {imagePreview ? (
              <div className='relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl'>
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
                  className='absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full'
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <label className='flex flex-col items-center justify-center w-full aspect-[21/9] rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-white cursor-pointer hover:border-emerald-500 transition-all'>
                <FiImage className='text-gray-300 mb-4' size={40} />
                <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                  Attach Thumbnail
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

          <input
            type='text'
            placeholder='The Title...'
            required
            className='w-full bg-transparent text-5xl font-serif font-bold border-none focus:ring-0 outline-none'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div className='grid md:grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase text-gray-400 ml-2'>
                Department
              </label>
              <div className='relative'>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className='w-full rounded-2xl border border-gray-100 bg-white px-6 py-4 appearance-none outline-none focus:border-emerald-400'
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

            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase text-gray-400 ml-2'>
                Keywords
              </label>
              <input
                type='text'
                placeholder='Python, SEO...'
                className='w-full rounded-2xl border border-gray-100 bg-white px-6 py-4 outline-none focus:border-emerald-400'
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
          </div>

          <textarea
            rows={2}
            placeholder='Abstract...'
            className='w-full rounded-2xl border border-gray-100 bg-white px-6 py-4 outline-none focus:border-emerald-400 font-serif italic'
            value={form.short_desc}
            onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
          />

          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase text-gray-400 ml-2'>
              The Manuscript
            </label>
            <RichTextEditor
              value={form.long_desc}
              onChange={(content) => setForm({ ...form, long_desc: content })}
            />
          </div>

          <div className='flex justify-end pt-10'>
            <button
              type='submit'
              disabled={loading}
              className='flex items-center gap-4 rounded-full bg-black px-14 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl hover:bg-emerald-600 disabled:opacity-50'
            >
              {loading ? 'Transmitting...' : 'Dispatch Manuscript'}
              <FiSend />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
