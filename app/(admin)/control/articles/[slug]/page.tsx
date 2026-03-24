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
  User,
  Layout,
} from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import {
  getArticleBySlug,
  getAllCategories,
  getAllAuthors, // Added
  updateArticle,
} from '@/utils/actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface Props {
  params: { slug: string }
}

export default async function UpdateArticlePage({ params }: Props) {
  const { slug } = params

  // Fetch all necessary data in parallel
  const [article, categories, authors] = await Promise.all([
    getArticleBySlug(slug),
    getAllCategories(),
    getAllAuthors(),
  ])

  if (!article) {
    notFound()
  }

  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      <div className='flex items-center gap-4 mb-8'>
        <Link
          href='/control/articles'
          className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600'
        >
          <ArrowLeft size={20} />
        </Link>
        <div className='p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200'>
          <Newspaper size={28} />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Edit Article</h1>
          <p className='text-gray-500 text-sm'>
            Updating:{' '}
            <span className='font-semibold text-blue-600'>{article.title}</span>
          </p>
        </div>
      </div>

      <form
        action={updateArticle}
        encType='multipart/form-data'
        className='grid grid-cols-1 lg:grid-cols-3 gap-8'
      >
        <input type='hidden' name='id' value={article.id} />

        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6'>
            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <Type size={16} className='text-blue-500' /> Article Title
              </label>
              <input
                name='title'
                type='text'
                defaultValue={article.title}
                required
                className='w-full px-0 py-2 text-2xl font-bold border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-colors'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <FileText size={16} className='text-blue-500' /> Excerpt
              </label>
              <textarea
                name='short_desc'
                rows={3}
                defaultValue={article.short_desc}
                required
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <FileText size={16} className='text-blue-500' /> Main Content
              </label>
              <textarea
                name='long_desc'
                rows={15}
                defaultValue={article.long_desc}
                required
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-serif text-lg leading-relaxed'
              />
            </div>
          </div>
        </div>

        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6'>
            <div className='space-y-4'>
              <label className='text-sm font-bold text-gray-700'>
                Cover Image
              </label>
              {article.image && (
                <div className='relative aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50'>
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <ImageUpload name='image' />
              <p className='text-[10px] text-gray-400'>
                Leave empty to keep current image
              </p>
            </div>

            <hr className='border-gray-50' />

            <div className='space-y-3'>
              <div className='flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100'>
                <div className='flex items-center gap-2'>
                  <Layout size={18} className='text-blue-600' />
                  <span className='text-sm font-bold text-blue-900'>
                    Main Hero Post
                  </span>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    name='mainPost'
                    type='checkbox'
                    defaultChecked={article.mainPost}
                    className='sr-only peer'
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className='flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100'>
                <div className='flex items-center gap-2'>
                  <Star
                    size={18}
                    className={`text-yellow-600 ${article.featured ? 'fill-yellow-200' : ''}`}
                  />
                  <span className='text-sm font-bold text-yellow-900'>
                    Featured
                  </span>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    name='featured'
                    type='checkbox'
                    defaultChecked={article.featured}
                    className='sr-only peer'
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-yellow-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <User size={16} className='text-blue-500' /> Author
              </label>
              <select
                name='authorId'
                defaultValue={article.authorId || ''}
                className='w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none'
              >
                <option value=''>Select Author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <Tag size={16} className='text-blue-500' /> Category
              </label>
              <select
                name='categoryId'
                defaultValue={article.categoryId || ''}
                className='w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none'
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
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <LinkIcon size={16} className='text-blue-500' /> Tags
              </label>
              <input
                name='tags'
                type='text'
                defaultValue={article.tags?.join(', ')}
                placeholder='coding, lifestyle...'
                className='w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm'
              />
            </div>

            <div className='pt-4 space-y-3'>
              <button
                type='submit'
                name='intent'
                value='publish'
                className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]'
              >
                <Send size={18} />
                Save Changes
              </button>

              <button
                type='submit'
                name='intent'
                value='draft'
                className='w-full py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl border border-gray-100 transition-all'
              >
                Move to Drafts
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
