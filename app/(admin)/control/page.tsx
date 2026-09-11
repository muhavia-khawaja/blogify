import React from 'react'
import Link from 'next/link'
import {
  FileText,
  Users,
  Eye,
  Mail,
  Clock,
  TrendingUp,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import {
  getDashboardStats,
  getRecentArticles,
  getRecentContacts,
  toggleArticlePublish,
  deleteContact,
} from '@/utils/admin/action'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  const recentArticles = await getRecentArticles(5)
  const recentContacts = await getRecentContacts(4)

  return (
    <div className='p-6 sm:p-10 space-y-8 bg-[#F8F6F0] min-h-screen text-[#1A1A18]'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0DCD5] shadow-xs'>
        <div>
          <h1 className='text-3xl font-serif font-bold text-[#1A1A18]'>
            Dashboard Overview
          </h1>
          <p className='text-sm text-[#6B6860] font-serif italic mt-1'>
            Welcome back! Here is what is happening across your platform today.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        <div className='bg-white border border-[#E0DCD5] shadow-xs p-5 rounded-2xl'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#8C887B]'>
              Total Views
            </span>
            <div className='p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100'>
              <Eye size={20} />
            </div>
          </div>
          <div className='mt-3'>
            <div className='text-3xl font-black text-[#1A1A18]'>
              {stats.totalViews.toLocaleString()}
            </div>
            <p className='text-xs text-[#6B6860] mt-1 flex items-center gap-1 font-medium'>
              <TrendingUp size={14} className='text-emerald-600' />
              <span>{stats.totalImpressions.toLocaleString()} impressions</span>
            </p>
          </div>
        </div>

        <div className='bg-white border border-[#E0DCD5] shadow-xs p-5 rounded-2xl'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#8C887B]'>
              Articles
            </span>
            <div className='p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100'>
              <FileText size={20} />
            </div>
          </div>
          <div className='mt-3'>
            <div className='text-3xl font-black text-[#1A1A18]'>
              {stats.totalArticles}
            </div>
            <p className='text-xs text-[#6B6860] mt-1 font-medium'>
              <span className='text-emerald-700 font-bold'>
                {stats.publishedArticles} published
              </span>
              {' · '}
              <span className='text-amber-700 font-bold'>
                {stats.draftArticles} drafts
              </span>
            </p>
          </div>
        </div>

        <div className='bg-white border border-[#E0DCD5] shadow-xs p-5 rounded-2xl'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#8C887B]'>
              Users & Audience
            </span>
            <div className='p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100'>
              <Users size={20} />
            </div>
          </div>
          <div className='mt-3'>
            <div className='text-3xl font-black text-[#1A1A18]'>
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className='text-xs text-[#6B6860] mt-1 font-medium'>
              <span className='font-bold text-[#1A1A18]'>
                {stats.totalSubscribers}
              </span>{' '}
              newsletter subscribers
            </p>
          </div>
        </div>

        <div className='bg-white border border-[#E0DCD5] shadow-xs p-5 rounded-2xl'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#8C887B]'>
              Total Read Time
            </span>
            <div className='p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100'>
              <Clock size={20} />
            </div>
          </div>
          <div className='mt-3'>
            <div className='text-3xl font-black text-[#1A1A18]'>
              {stats.totalReadTimeHours}{' '}
              <span className='text-lg font-normal text-[#6B6860]'>hrs</span>
            </div>
            <p className='text-xs text-[#6B6860] mt-1'>
              Total engagement time across all reader sessions
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 bg-white border border-[#E0DCD5] shadow-xs rounded-3xl overflow-hidden'>
          <div className='p-6 border-b border-[#E0DCD5] flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-serif font-bold text-[#1A1A18]'>
                Recent Articles
              </h2>
              <p className='text-xs text-[#6B6860]'>
                Latest editorial entries and publishing states
              </p>
            </div>
            <Link
              href='/admin/articles'
              className='text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1'
            >
              View All <ExternalLink size={14} />
            </Link>
          </div>

          <div className='overflow-x-auto'>
            <table className='table w-full text-left'>
              <thead>
                <tr className='bg-[#FAF8F5] border-b border-[#E0DCD5] text-xs font-bold text-[#8C887B] uppercase'>
                  <th className='py-3 px-4'>Article</th>
                  <th className='py-3 px-4'>Category</th>
                  <th className='py-3 px-4'>Author</th>
                  <th className='py-3 px-4'>Status</th>
                  <th className='py-3 px-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#E0DCD5]'>
                {recentArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='text-center py-8 text-[#6B6860] text-sm'
                    >
                      No articles found. Create your first post!
                    </td>
                  </tr>
                ) : (
                  recentArticles.map((article) => (
                    <tr key={article.id} className='hover:bg-[#FAF8F5]'>
                      <td className='py-4 px-4 font-semibold text-[#1A1A18] max-w-xs truncate text-sm'>
                        {article.title}
                      </td>
                      <td className='py-4 px-4'>
                        <span className='inline-block bg-[#F0ECE1] text-[#4A473F] text-xs font-medium px-2.5 py-1 rounded-md'>
                          {article.category?.title || 'Uncategorized'}
                        </span>
                      </td>
                      <td className='py-4 px-4 text-xs font-medium text-[#4A473F]'>
                        {article.user?.name || 'Admin'}
                      </td>
                      <td className='py-4 px-4'>
                        {article.published ? (
                          <span className='inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full'>
                            <CheckCircle size={12} /> Published
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full'>
                            <XCircle size={12} /> Draft
                          </span>
                        )}
                      </td>
                      <td className='py-4 px-4 text-right space-x-2'>
                        <form
                          action={toggleArticlePublish.bind(
                            null,
                            article.id,
                            article.published,
                          )}
                          className='inline-block'
                        >
                          <button
                            type='submit'
                            className='text-xs font-medium text-[#6B6860] hover:text-[#1A1A18] px-2 py-1'
                          >
                            {article.published ? 'Unpublish' : 'Publish'}
                          </button>
                        </form>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className='text-xs font-bold text-amber-600 hover:text-amber-700 px-2 py-1'
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className='bg-white border border-[#E0DCD5] shadow-xs rounded-3xl p-6'>
          <div className='flex items-center justify-between pb-4 border-b border-[#E0DCD5]'>
            <div>
              <h2 className='text-xl font-serif font-bold text-[#1A1A18]'>
                Inquiries
              </h2>
              <p className='text-xs text-[#6B6860]'>
                Recent contact submissions
              </p>
            </div>
            <Link
              href='/admin/contacts'
              className='text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1'
            >
              View All <ExternalLink size={14} />
            </Link>
          </div>

          <div className='mt-4 space-y-4'>
            {recentContacts.length === 0 ? (
              <p className='text-center text-sm text-[#6B6860] py-8'>
                No new messages received.
              </p>
            ) : (
              recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className='p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0DCD5] hover:border-amber-300 transition-colors'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-bold text-sm text-[#1A1A18]'>
                        {contact.name}
                      </h3>
                      <a
                        href={`mailto:${contact.email}`}
                        className='text-xs text-amber-600 hover:underline flex items-center gap-1 mt-0.5'
                      >
                        <Mail size={12} /> {contact.email}
                      </a>
                    </div>

                    <form action={deleteContact.bind(null, contact.id)}>
                      <button
                        type='submit'
                        className='text-[#8C887B] hover:text-rose-600 transition-colors p-1'
                        title='Delete Inquiry'
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>

                  <p className='text-xs text-[#4A473F] mt-2 line-clamp-2 italic font-serif'>
                    {contact.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
