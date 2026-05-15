import React from 'react'
import {
  Type,
  Link as LinkIcon,
  Tag,
  FileText,
  Send,
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

  if (!article) {
    notFound()
  }

  return (
    <div className='max-w-6xl mx-auto py-10 px-6 antialiased'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
        <div className='flex items-center gap-5'>
          <Link
            href='/control/articles'
            className='p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-400 hover:text-blue-600 border border-transparent hover:border-gray-100'
          >
            <ArrowLeft size={24} />
          </Link>
          <div className='h-12 w-[1px] bg-gray-200 hidden md:block' />
          <div>
            <h1 className='text-3xl font-black text-gray-900 tracking-tight font-serif'>
              Archive Editor
            </h1>
            <p className='text-gray-500 text-sm flex items-center gap-2'>
              <span className='px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase'>
                Editing
              </span>
              <span className='italic'>{article.title}</span>
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              article.status === 'PUBLISHED'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}
          >
            Status: {article.status}
          </div>
        </div>
      </div>

      <form
        action={updateArticle}
        className='grid grid-cols-1 lg:grid-cols-12 gap-10'
      >
        <input type='hidden' name='id' value={article.id} />

        <div className='lg:col-span-8 space-y-8'>
          <div className='bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md'>
            <div className='space-y-8'>
              <div className='group'>
                <label className='flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-blue-600 transition-colors'>
                  <Type size={14} /> Headline
                </label>
                <input
                  name='title'
                  type='text'
                  defaultValue={article.title}
                  required
                  placeholder='Enter a compelling title...'
                  className='w-full px-0 py-2 text-4xl font-black text-gray-900 border-b-2 border-gray-50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-200 font-serif'
                />
              </div>

              <div>
                <label className='flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3'>
                  <FileText size={14} /> Brief Abstract
                </label>
                <textarea
                  name='short_desc'
                  rows={3}
                  defaultValue={article.short_desc}
                  required
                  className='w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 outline-none resize-none transition-all text-gray-600 leading-relaxed'
                />
              </div>

              <div>
                <label className='flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3'>
                  <Newspaper size={14} /> Article Manuscript
                </label>
                <textarea
                  name='long_desc'
                  rows={20}
                  defaultValue={article.long_desc}
                  required
                  className='w-full px-6 py-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 outline-none font-serif text-lg leading-loose transition-all'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='lg:col-span-4 space-y-6'>
          <div className='bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm'>
            <h3 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6'>
              Visual Assets
            </h3>
            <div className='space-y-5'>
              <div className='relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group'>
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center text-gray-300 italic text-sm'>
                    No image set
                  </div>
                )}
              </div>
              <ImageUpload name='image' />
            </div>
          </div>

          <div className='bg-black p-6 rounded-[2rem] shadow-xl shadow-gray-200 space-y-4'>
            <div className='flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors'>
              <div className='flex items-center gap-3'>
                <Layout size={18} className='text-blue-400' />
                <span className='text-xs font-bold text-white uppercase tracking-tight'>
                  Hero Section
                </span>
              </div>
              <input
                name='mainPost'
                type='checkbox'
                defaultChecked={article.mainPost}
                className='w-5 h-5 rounded border-none bg-white/20 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer'
              />
            </div>

            <div className='flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors'>
              <div className='flex items-center gap-3'>
                <Star size={18} className='text-yellow-400' />
                <span className='text-xs font-bold text-white uppercase tracking-tight'>
                  Featured
                </span>
              </div>
              <input
                name='featured'
                type='checkbox'
                defaultChecked={article.featured}
                className='w-5 h-5 rounded border-none bg-white/20 text-yellow-400 focus:ring-0 focus:ring-offset-0 cursor-pointer'
              />
            </div>
          </div>

          <div className='bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6'>
            <div>
              <label className='flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3'>
                <UserIcon size={14} /> Author
              </label>
              <select
                name='userId'
                defaultValue={article.userId || ''}
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold text-gray-700'
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
              <label className='flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3'>
                <Tag size={14} /> Category
              </label>
              <select
                name='categoryId'
                defaultValue={article.categoryId || ''}
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold text-gray-700'
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
              <label className='flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3'>
                <LinkIcon size={14} /> Metadata Tags
              </label>
              <input
                name='tags'
                type='text'
                defaultValue={article.tags?.join(', ')}
                placeholder='Comma separated...'
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium'
              />
            </div>
          </div>

          <div className='sticky bottom-6 space-y-3'>
            <button
              type='submit'
              name='intent'
              value='publish'
              className='w-full group flex items-center justify-center gap-3 bg-blue-600 hover:bg-black text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-100 transition-all active:scale-[0.98]'
            >
              <Globe size={20} className='group-hover:animate-pulse' />
              <span className='uppercase tracking-widest text-xs'>
                Commit to Live
              </span>
            </button>

            <button
              type='submit'
              name='intent'
              value='draft'
              className='w-full flex items-center justify-center gap-2 py-4 text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.2em] transition-all bg-white/50 backdrop-blur hover:bg-white rounded-[2rem] border border-gray-100'
            >
              <Save size={14} /> Save to Registry (Draft)
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
