import React from 'react'
import {
  Plus,
  BookOpen,
  Pencil,
  Trash2,
  Star,
  Eye,
  Calendar,
  Tag,
  User as UserIcon,
  Search,
  MoreVertical,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { deleteArticle, getAllCategories, getArticles } from '@/utils/actions'
import MagicGenerateButton from '@/components/MagicGenerateButton'

export const revalidate = 0

export default async function ArticlesPage() {
  const articles = await getArticles()
  const categories = await getAllCategories()

  const stats = {
    total: articles?.length || 0,
    published: articles?.filter((a) => a.status === 'PUBLISHED').length || 0,
    drafts: articles?.filter((a) => a.status !== 'PUBLISHED').length || 0,
  }

  return (
    <div className='space-y-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6'>
        <div>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/30'>
              <BookOpen size={24} />
            </div>
            <h1 className='text-3xl sm:text-4xl font-serif font-bold text-[#1A1A18] tracking-tight'>
              Articles
            </h1>
          </div>
          <p className='text-[#6B6860] text-sm sm:text-base font-serif italic max-w-xl'>
            Manage your content library, review submissions, and curate featured
            pieces.
          </p>
        </div>
      </div>

      <MagicGenerateButton categories={categories} />

      <div className='grid grid-cols-3 gap-3 sm:gap-4'>
        <div className='bg-white rounded-2xl p-4 sm:p-5 border border-[#E0DCD5] text-center'>
          <p className='text-[10px] font-black uppercase tracking-[0.2em] text-[#9B9890] mb-2'>
            Total
          </p>
          <p className='text-3xl sm:text-4xl font-serif font-bold text-[#1A1A18]'>
            {stats.total.toString().padStart(2, '0')}
          </p>
        </div>
        <div className='bg-white rounded-2xl p-4 sm:p-5 border border-[#E0DCD5] text-center'>
          <p className='text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2'>
            Published
          </p>
          <p className='text-3xl sm:text-4xl font-serif font-bold text-emerald-700'>
            {stats.published.toString().padStart(2, '0')}
          </p>
        </div>
        <div className='bg-white rounded-2xl p-4 sm:p-5 border border-[#E0DCD5] text-center'>
          <p className='text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2'>
            Drafts
          </p>
          <p className='text-3xl sm:text-4xl font-serif font-bold text-amber-700'>
            {stats.drafts.toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className='bg-white rounded-3xl shadow-sm border border-[#E0DCD5] overflow-hidden'>
        {!articles || articles.length === 0 ? (
          /* Empty State */
          <div className='py-20 px-4 text-center flex flex-col items-center'>
            <div className='w-16 h-16 rounded-2xl bg-[#F1EEEB] flex items-center justify-center mb-4'>
              <BookOpen size={32} className='text-[#B0ADA6]' />
            </div>
            <h3 className='text-xl sm:text-2xl font-serif font-bold text-[#1A1A18] mb-2'>
              No articles yet
            </h3>
            <p className='text-[#6B6860] max-w-sm text-sm sm:text-base font-serif italic mb-6'>
              Your article library is empty. Create your first piece to get
              started.
            </p>
            <Link
              href='/control/articles/new'
              className='inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors'
            >
              <Plus size={16} /> Create Article
            </Link>
          </div>
        ) : (
          /* Table */
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-gradient-to-r from-[#FEFDFB] to-transparent border-b border-[#E8E4DC]'>
                  <th className='px-6 py-4 text-[10px] font-black text-[#9B9890] uppercase tracking-[0.2em]'>
                    Article
                  </th>
                  <th className='px-6 py-4 text-[10px] font-black text-[#9B9890] uppercase tracking-[0.2em] hidden sm:table-cell'>
                    Author
                  </th>
                  <th className='px-6 py-4 text-[10px] font-black text-[#9B9890] uppercase tracking-[0.2em] hidden md:table-cell'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-[10px] font-black text-[#9B9890] uppercase tracking-[0.2em] text-right'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#E8E4DC]'>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className='group hover:bg-[#FEFDFB] transition-colors duration-200'
                  >
                    <td className='px-6 py-5'>
                      <div className='flex items-start gap-4'>
                        <div className='w-16 h-12 rounded-lg bg-[#EAE7E0] overflow-hidden flex-shrink-0 border border-[#E0DCD5] flex items-center justify-center'>
                          {article.image ? (
                            <img
                              src={article.image}
                              alt={article.title}
                              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 grayscale-[10%] group-hover:grayscale-0'
                            />
                          ) : (
                            <BookOpen size={18} className='text-[#B0ADA6]' />
                          )}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-2'>
                            <h3 className='font-serif font-bold text-[#1A1A18] text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors'>
                              {article.title}
                            </h3>
                            {article.featured && (
                              <Star
                                size={14}
                                className='text-amber-500 fill-amber-500 flex-shrink-0'
                              />
                            )}
                          </div>
                          <div className='flex flex-wrap items-center gap-3'>
                            {article.category && (
                              <span className='inline-flex items-center gap-1 text-[9px] text-emerald-600 font-black uppercase tracking-tighter'>
                                <Tag size={10} />
                                {article.category.title}
                              </span>
                            )}
                            <span className='inline-flex items-center gap-1 text-[9px] text-[#9B9890] font-bold uppercase tracking-tighter'>
                              <Calendar size={10} />
                              {new Date(article.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='px-6 py-5 hidden sm:table-cell'>
                      <div className='flex items-center gap-2 text-sm'>
                        <div className='w-6 h-6 rounded-full bg-[#EAE7E0] flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#9B9890]'>
                          {article.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className='font-serif text-[#6B6860] truncate'>
                          {article.user?.name || 'System'}
                        </span>
                      </div>
                    </td>

                    <td className='px-6 py-5 hidden md:table-cell'>
                      {article.status === 'PUBLISHED' ? (
                        <div className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-black text-[9px] uppercase tracking-widest rounded-full border border-emerald-200/50'>
                          <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                          Live
                        </div>
                      ) : (
                        <div className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 font-black text-[9px] uppercase tracking-widest rounded-full border border-amber-200/50'>
                          <div className='w-1.5 h-1.5 rounded-full bg-amber-500' />
                          Draft
                        </div>
                      )}
                    </td>

                    <td className='px-6 py-5'>
                      <div className='flex items-center justify-end gap-1'>
                        <Link
                          href={`/blog/${article.slug}`}
                          target='_blank'
                          className='p-2.5 text-[#9B9890] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200'
                          title='View on site'
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          href={`/control/articles/${article.slug}`}
                          className='p-2.5 text-[#9B9890] hover:text-[#1A1A18] hover:bg-[#F7F5F0] rounded-lg transition-all duration-200'
                          title='Edit article'
                        >
                          <Pencil size={18} />
                        </Link>

                        <form action={deleteArticle} className='inline'>
                          <input type='hidden' name='id' value={article.id} />
                          <button
                            type='submit'
                            className='p-2.5 text-[#9B9890] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200'
                            title='Delete article'
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

      {articles && articles.length > 0 && (
        <div className='text-center'>
          <p className='text-[10px] font-black uppercase tracking-[0.2em] text-[#9B9890]'>
            Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
