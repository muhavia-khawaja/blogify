import React from 'react'
import {
  PlusCircle,
  Newspaper,
  Pencil,
  Trash2,
  Star,
  Eye,
  Calendar,
  Tag,
  User as UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { deleteArticle, getAllCategories, getArticles } from '@/utils/actions'
import MagicGenerateButton from '@/components/MagicGenerateButton'

export default async function ArticlesPage() {
  const articles = await getArticles()
  const categories = await getAllCategories()

  return (
    <div className='flex flex-col gap-8 max-w-7xl mx-auto py-6 px-4 antialiased'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200'>
            <Newspaper size={28} />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>
              Archive Registry
            </h1>
            <p className='text-gray-500 text-sm italic font-serif'>
              Review submitted content, manage featured journals, and curate the
              feed.
            </p>
          </div>
        </div>

        <Link
          href='/control/articles/new'
          className='bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg font-black uppercase text-[10px] tracking-widest active:scale-95'
        >
          <PlusCircle size={16} /> New Entry
        </Link>
      </div>

      <div>
        <MagicGenerateButton categories={categories} />
      </div>

      <div className='bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden'>
        {!articles || articles.length === 0 ? (
          <div className='p-20 text-center flex flex-col items-center'>
            <div className='bg-gray-50 p-6 rounded-full mb-4'>
              <Newspaper size={48} className='text-gray-200' />
            </div>
            <h3 className='text-xl font-bold text-gray-900 font-serif'>
              No entries cataloged
            </h3>
            <p className='text-gray-500 mt-2 max-w-xs text-sm italic'>
              The archive is currently empty. Create a new article to begin.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead className='bg-gray-50/50 border-b border-gray-50'>
                <tr>
                  <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>
                    Article
                  </th>
                  <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>
                    Contributor
                  </th>
                  <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>
                    Status
                  </th>
                  <th className='px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right'>
                    Management
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className='group hover:bg-gray-50/50 transition-colors'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-4'>
                        <div className='w-16 h-12 rounded-xl bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-100'>
                          {article.image ? (
                            <img
                              src={article.image}
                              alt=''
                              className='w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all'
                            />
                          ) : (
                            <Newspaper
                              size={16}
                              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300'
                            />
                          )}
                        </div>
                        <div className='flex flex-col min-w-0'>
                          <div className='flex items-center gap-2'>
                            <span className='font-bold text-gray-900 truncate max-w-[200px] md:max-w-md font-serif'>
                              {article.title}
                            </span>
                            {article.featured && (
                              <Star
                                size={12}
                                className='text-yellow-500 fill-yellow-500'
                              />
                            )}
                          </div>
                          <div className='flex items-center gap-3 mt-1'>
                            {article.category && (
                              <span className='flex items-center gap-1 text-[10px] text-blue-600 font-black uppercase tracking-tighter'>
                                <Tag size={10} /> {article.category.title}
                              </span>
                            )}
                            <span className='flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase'>
                              <Calendar size={10} />{' '}
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2 text-sm text-gray-600 font-serif'>
                        <UserIcon size={14} className='text-gray-400' />

                        <span className='font-medium'>
                          {article.user?.name || 'System Admin'}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      {article.status === 'PUBLISHED' ? (
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 font-black text-[9px] uppercase tracking-widest rounded-full'>
                          <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></div>
                          Live
                        </div>
                      ) : (
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-500 font-black text-[9px] uppercase tracking-widest rounded-full'>
                          <div className='w-1.5 h-1.5 rounded-full bg-amber-400'></div>
                          {article.status || 'Draft'}
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex justify-end items-center gap-1'>
                        <Link
                          href={`/blog/${article.slug}`}
                          target='_blank'
                          className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'
                          title='View Live'
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/control/articles/${article.slug}`}
                          className='p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all'
                          title='Edit Entry'
                        >
                          <Pencil size={18} />
                        </Link>

                        <form action={deleteArticle} className='inline'>
                          <input type='hidden' name='id' value={article.id} />
                          <button
                            type='submit'
                            className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all'
                            title='Delete'
                          >
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
