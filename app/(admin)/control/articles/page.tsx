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
} from 'lucide-react'
import Link from 'next/link'
import { getAllArticles, deleteArticle } from '@/utils/actions'

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  return (
    <div className='flex flex-col gap-8 max-w-7xl mx-auto py-6 px-4'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200'>
            <Newspaper size={28} />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Articles</h1>
            <p className='text-gray-500 text-sm'>
              Manage your stories, drafts, and featured content.
            </p>
          </div>
        </div>

        <Link
          href='/control/articles/new'
          className='bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold active:scale-95'
        >
          <PlusCircle size={20} /> New Article
        </Link>
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        {!articles || articles.length === 0 ? (
          <div className='p-20 text-center flex flex-col items-center'>
            <div className='bg-gray-50 p-6 rounded-full mb-4'>
              <Newspaper size={48} className='text-gray-200' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900'>
              No articles yet
            </h3>
            <p className='text-gray-500 mt-2 max-w-xs'>
              Start writing your first masterpiece to see it listed here.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='table table-zebra w-full text-left border-collapse'>
              <thead className='bg-gray-50/50 border-b border-gray-100'>
                <tr>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                    Article
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                    Category
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className='group hover:bg-blue-50/30 transition-colors'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-4'>
                        <div className='w-16 h-12 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-100'>
                          {article.image ? (
                            <img
                              src={article.image}
                              alt=''
                              className='w-full h-full object-cover'
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
                            <span className='font-bold text-gray-900 truncate max-w-[200px] md:max-w-md'>
                              {article.title}
                            </span>
                            {article.featured && (
                              <Star
                                size={14}
                                className='text-yellow-500 fill-yellow-500'
                              />
                            )}
                          </div>
                          <div className='flex items-center gap-3 mt-1'>
                            <span className='flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase tracking-tighter'>
                              <Calendar size={10} />{' '}
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      {article.category ? (
                        <span className='flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full w-fit'>
                          <Tag size={12} /> {article.category.title}
                        </span>
                      ) : (
                        <span className='text-xs text-gray-400'>
                          Uncategorized
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {article.published ? (
                        <div className='flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-widest'>
                          <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></div>
                          Published
                        </div>
                      ) : (
                        <div className='flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-widest'>
                          <div className='w-1.5 h-1.5 rounded-full bg-gray-300'></div>
                          Draft
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex justify-end items-center gap-2'>
                        <Link
                          href={`/blog/${article.slug}`}
                          target='_blank'
                          className='p-2 text-gray-400 hover:text-blue-600 transition-colors'
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/control/articles/${article.slug}`}
                          className='p-2 text-gray-400 hover:text-blue-600 transition-colors'
                        >
                          <Pencil size={18} />
                        </Link>

                        <form action={deleteArticle} className='inline'>
                          <input type='hidden' name='id' value={article.id} />
                          <button
                            type='submit'
                            className='p-2 text-gray-400 hover:text-red-500 transition-colors'
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
