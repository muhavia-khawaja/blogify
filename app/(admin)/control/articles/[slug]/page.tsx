import React from 'react'
import {
  Type,
  Link as LinkIcon,
  Tag,
  FileText,
  Newspaper,
  Star,
  ArrowLeft,
  User as UserIcon,
  Layout,
  Save,
  Globe,
} from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import {
  getArticleBySlug,
  getAllCategories,
  getAllUsers,
  updateArticle,
} from '@/utils/actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface Props {
  params: { slug: string }
}

export default async function UpdateArticlePage({ params }: Props) {
  const { slug } = params

  const [article, categories, users] = await Promise.all([
    getArticleBySlug(slug),
    getAllCategories(),
    getAllUsers(),
  ])

  if (!article) notFound()

  return (
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A]'>
      <div className='max-w-6xl mx-auto py-12 px-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-12'>
          <div className='flex items-center gap-4'>
            <Link
              href='/control/articles'
              className='group w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center hover:border-gray-300 transition-all shadow-sm'
            >
              <ArrowLeft
                size={16}
                className='text-gray-400 group-hover:-translate-x-0.5 transition-transform'
              />
            </Link>
            <div className='h-8 w-px bg-gray-100 hidden sm:block' />
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-[9px] font-black uppercase tracking-[0.35em] text-emerald-600'>
                  Archive Editor
                </span>
                <span className='h-3 w-px bg-gray-200' />
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    article.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {article.status}
                </span>
              </div>
              <h1 className='text-2xl font-serif font-bold text-[#1A1A1A] leading-tight truncate max-w-xs sm:max-w-md'>
                {article.title}
              </h1>
            </div>
          </div>
        </div>

        <form
          action={updateArticle}
          className='grid grid-cols-1 lg:grid-cols-12 gap-8'
        >
          <input type='hidden' name='id' value={article.id} />

          <div className='lg:col-span-8 space-y-6'>
            <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm px-8 py-8 space-y-8'>
              <div>
                <label className='flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3'>
                  <Type size={12} /> Headline
                </label>
                <input
                  name='title'
                  type='text'
                  defaultValue={article.title}
                  required
                  placeholder='Enter a compelling title...'
                  className='w-full bg-transparent text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] border-b-2 border-gray-100 focus:border-emerald-400 outline-none py-2 transition-colors placeholder:text-gray-200'
                />
              </div>

              <div>
                <label className='flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3'>
                  <FileText size={12} /> Abstract
                </label>
                <textarea
                  name='short_desc'
                  rows={3}
                  defaultValue={article.short_desc}
                  required
                  className='w-full px-5 py-4 bg-[#FAFAF8] border border-gray-100 rounded-2xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none resize-none transition-all text-[#1A1A1A] font-serif italic leading-relaxed'
                />
              </div>
            </div>

            <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm px-8 py-8'>
              <label className='flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4'>
                <Newspaper size={12} /> Manuscript
              </label>
              <textarea
                name='long_desc'
                rows={24}
                defaultValue={article.long_desc}
                required
                className='w-full px-5 py-5 bg-[#FAFAF8] border border-gray-100 rounded-2xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none font-serif text-[1.05rem] leading-[1.9] text-[#1A1A1A] resize-none transition-all'
              />
              <p className='text-[9px] font-black uppercase tracking-widest text-gray-300 mt-3 text-right'>
                HTML supported
              </p>
            </div>
          </div>

          <div className='lg:col-span-4 space-y-5'>
            <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4'>
              <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
                Cover Image
              </p>
              <div className='relative aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50'>
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className='object-cover hover:scale-105 transition-transform duration-500'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center text-gray-300 font-serif italic text-sm'>
                    No image set
                  </div>
                )}
              </div>
              <ImageUpload name='image' />
            </div>

            <div className='bg-[#0F0F0F] rounded-[2rem] p-6 space-y-3'>
              <p className='text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-4'>
                Visibility
              </p>

              {[
                {
                  name: 'mainPost',
                  label: 'Hero Section',
                  icon: <Layout size={15} className='text-emerald-400' />,
                  checked: article.mainPost,
                },
                {
                  name: 'featured',
                  label: 'Featured',
                  icon: <Star size={15} className='text-yellow-400' />,
                  checked: article.featured,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className='flex items-center justify-between px-4 py-3.5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/8 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    {item.icon}
                    <span className='text-[10px] font-black text-white uppercase tracking-widest'>
                      {item.label}
                    </span>
                  </div>
                  <input
                    name={item.name}
                    type='checkbox'
                    defaultChecked={item.checked}
                    className='w-4 h-4 rounded bg-white/20 border-none text-emerald-500 focus:ring-0 cursor-pointer'
                  />
                </div>
              ))}
            </div>

            <div className='bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-5'>
              <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
                Metadata
              </p>

              <div>
                <label className='flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2'>
                  <UserIcon size={11} /> Author
                </label>
                <select
                  name='userId'
                  defaultValue={article.userId || ''}
                  className='w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none appearance-none text-sm font-serif text-[#1A1A1A] transition-all'
                >
                  <option value=''>System Admin</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2'>
                  <Tag size={11} /> Category
                </label>
                <select
                  name='categoryId'
                  defaultValue={article.categoryId || ''}
                  className='w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none appearance-none text-sm font-serif text-[#1A1A1A] transition-all'
                >
                  <option value=''>Uncategorized</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2'>
                  <LinkIcon size={11} /> Tags
                </label>
                <input
                  name='tags'
                  type='text'
                  defaultValue={article.tags?.join(', ')}
                  placeholder='Python, Design, SEO...'
                  className='w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none text-sm text-[#1A1A1A] transition-all'
                />
              </div>
            </div>

            <div className='sticky bottom-6 space-y-3'>
              <button
                type='submit'
                name='intent'
                value='publish'
                className='group relative w-full flex items-center justify-center gap-3 bg-[#0F0F0F] text-white font-black py-5 rounded-2xl overflow-hidden transition-all active:scale-[0.98] shadow-lg shadow-black/10'
              >
                <Globe size={16} className='relative z-10' />
                <span className='relative z-10 text-[10px] uppercase tracking-[0.2em]'>
                  Commit to Live
                </span>
                <div className='absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500' />
              </button>

              <button
                type='submit'
                name='intent'
                value='draft'
                className='w-full flex items-center justify-center gap-2 py-4 text-[10px] font-black text-gray-400 hover:text-[#1A1A1A] uppercase tracking-[0.2em] transition-all bg-white rounded-2xl border border-gray-100 hover:border-gray-300'
              >
                <Save size={13} />
                Save as Draft
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
