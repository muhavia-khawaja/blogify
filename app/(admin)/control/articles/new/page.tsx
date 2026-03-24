import React from 'react'
import {
  Type,
  Link as LinkIcon,
  Tag,
  FileText,
  Send,
  Newspaper,
  Star,
  Save,
  User,
  Layout,
  Clock,
} from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
// Add getAllAuthors to your actions
import { createArticle, getAllCategories, getAllAuthors } from '@/utils/actions'

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    getAllCategories(),
    getAllAuthors(),
  ])

  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      <div className='flex items-center gap-4 mb-8'>
        <div className='p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200'>
          <Newspaper size={28} />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>New Article</h1>
          <p className='text-gray-500 text-sm'>
            Fill in the details to publish your next story.
          </p>
        </div>
      </div>

      <form
        action={createArticle}
        className='grid grid-cols-1 lg:grid-cols-3 gap-8'
      >
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6'>
            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <Type size={16} className='text-blue-500' /> Article Title
              </label>
              <input
                name='title'
                type='text'
                placeholder='Enter title here...'
                required
                className='w-full px-0 py-2 text-2xl font-bold border-b-2 border-gray-100 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-300'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <FileText size={16} className='text-blue-500' /> Excerpt (Short
                Description)
              </label>
              <textarea
                name='short_desc'
                rows={3}
                required
                placeholder='A short summary that appears on the homepage...'
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                <FileText size={16} className='text-blue-500' /> Main Content
              </label>
              <textarea
                name='long_desc'
                rows={15}
                required
                placeholder='Start writing your masterpiece...'
                className='w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-serif text-lg leading-relaxed'
              />
            </div>
          </div>
        </div>

        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6'>
            <ImageUpload name='image' />

            <hr className='border-gray-50' />

            <div className='space-y-3'>
              <div className='flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100'>
                <div className='flex items-center gap-2'>
                  <Layout size={18} className='text-blue-600' />
                  <span className='text-sm font-bold text-blue-900'>
                    Main Post
                  </span>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    name='mainPost'
                    type='checkbox'
                    className='sr-only peer'
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className='flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100'>
                <div className='flex items-center gap-2'>
                  <Star size={18} className='text-yellow-600 fill-yellow-200' />
                  <span className='text-sm font-bold text-yellow-900'>
                    Featured
                  </span>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    name='featured'
                    type='checkbox'
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
                required
                className='w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer'
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
                className='w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer'
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
                <LinkIcon size={16} className='text-blue-500' /> Tags (comma
                separated)
              </label>
              <input
                name='tags'
                type='text'
                placeholder='design, tech, ux...'
                className='w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm'
              />
            </div>

            <div className='flex items-center gap-2 text-xs text-gray-400'>
              <Clock size={14} />
              <span>Read time is calculated automatically</span>
            </div>

            <div className='pt-4 space-y-3'>
              <button
                type='submit'
                name='intent'
                value='publish'
                className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]'
              >
                <Send size={18} />
                Publish Now
              </button>

              <button
                type='submit'
                name='intent'
                value='draft'
                className='w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl border border-gray-100 transition-all'
              >
                <Save size={18} />
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
