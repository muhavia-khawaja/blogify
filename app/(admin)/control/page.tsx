import React from 'react'
import {
  FileText,
  FolderTree,
  MessageSquare,
  Users,
  Plus,
  CheckCircle,
  FileEdit,
  Zap,
  ArrowRight,
  Heart,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'
import { getDashboardStats, getRecentArticles } from '@/utils/actions'

export default async function AdminHomePage() {
  const statsData = await getDashboardStats()
  const { published, drafts } = await getRecentArticles()

  const stats = [
    {
      name: 'Total Articles',
      value: statsData.totalArticles,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Categories',
      value: statsData.totalCategories,
      icon: FolderTree,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      name: 'User Reviews',
      value: statsData.totalReviews,
      icon: MessageSquare,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      name: 'System Admins',
      value: statsData.totalAdmins,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className='p-4 md:p-8 bg-[#FCFBF9] min-h-screen space-y-8 antialiased'>
      <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-4xl font-serif font-bold text-gray-900 tracking-tight'>
            Registry Control
          </h1>
          <p className='text-gray-500 font-serif italic'>
            Overseeing the educational ecosystem.
          </p>
        </div>
        <div className='flex gap-3'>
          <Link
            href='/control/articles/new'
            className='flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl'
          >
            <Plus size={14} /> New Entry
          </Link>
        </div>
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat) => (
          <div
            key={stat.name}
            className='bg-white p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md'
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className='text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]'>
                {stat.name}
              </p>
              <p className='text-3xl font-serif font-bold text-gray-900'>
                {stat.value.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <QuickCard
          title='Departments'
          desc='Manage categories'
          icon={<FolderTree size={20} />}
          href='/control/categories'
          color='bg-emerald-600'
        />
        <QuickCard
          title='Feedback'
          desc='Manage user reviews'
          icon={<MessageSquare size={20} />}
          href='/control/reviews'
          color='bg-blue-600'
        />
        <QuickCard
          title='Inquiries'
          desc='View contact messages'
          icon={<Zap size={20} />}
          href='/control/contacts'
          color='bg-black'
        />
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        <div className='xl:col-span-2 space-y-8'>
          <div className='bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-6 border-b border-gray-50 flex justify-between items-center bg-white'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                <h2 className='font-serif font-bold text-gray-800 text-lg'>
                  Live Manuscripts
                </h2>
              </div>
              <Link
                href='/control/articles'
                className='text-[9px] font-black text-emerald-600 hover:underline uppercase tracking-widest'
              >
                View Full Archive
              </Link>
            </div>
            <ArticleTable list={published} status='live' />
          </div>

          <div className='bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30'>
              <div className='flex items-center gap-3'>
                <FileEdit className='text-amber-500' size={20} />
                <h2 className='font-serif font-bold text-gray-800 text-lg'>
                  Drafting Table
                </h2>
              </div>
              <Link
                href='/control/articles'
                className='text-[9px] font-black text-amber-600 hover:underline uppercase tracking-widest'
              >
                Continue Work
              </Link>
            </div>
            <ArticleTable list={drafts} status='draft' />
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden'>
            <div className='relative z-10'>
              <h3 className='text-2xl font-serif font-bold mb-2'>
                Archivist Tip
              </h3>
              <p className='text-gray-400 text-sm italic font-serif'>
                Regularly review Pending entries from students to keep the
                learning ecosystem fresh and accurate.
              </p>
            </div>
            <div className='absolute -bottom-4 -right-4 text-white/5'>
              <BookOpen size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function QuickCard({ title, desc, icon, href, color }: any) {
  return (
    <Link
      href={href}
      className='group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all'
    >
      <div className='flex items-center justify-between'>
        <div className={`p-3 rounded-2xl text-white ${color} shadow-lg`}>
          {icon}
        </div>
        <ArrowRight className='text-gray-300 group-hover:text-black transition-transform group-hover:translate-x-1' />
      </div>
      <h3 className='mt-4 font-serif font-bold text-gray-900'>{title}</h3>
      <p className='text-xs text-gray-500 font-serif'>{desc}</p>
    </Link>
  )
}

function ArticleTable({
  list,
  status,
}: {
  list: any[]
  status: 'live' | 'draft'
}) {
  if (list.length === 0) {
    return (
      <div className='p-12 text-center'>
        <p className='text-sm text-gray-400 font-serif italic'>
          No entries found in this section.
        </p>
      </div>
    )
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left border-collapse'>
        <thead>
          <tr className='bg-gray-50/50'>
            <th className='px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest'>
              Title
            </th>
            <th className='px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest'>
              Category
            </th>
            <th className='px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest'>
              Date
            </th>
            <th className='px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest'>
              Action
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-50'>
          {list.map((article) => (
            <tr
              key={article.id}
              className='hover:bg-gray-50/80 transition-colors'
            >
              <td className='px-6 py-4'>
                <p className='font-serif font-bold text-gray-900 text-sm line-clamp-1'>
                  {article.title}
                </p>
              </td>
              <td className='px-6 py-4'>
                <span className='px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold'>
                  {article.category?.title || 'General'}
                </span>
              </td>
              <td className='px-6 py-4 text-[11px] text-gray-500 font-serif'>
                {new Date(article.createdAt).toLocaleDateString()}
              </td>
              <td className='px-6 py-4'>
                <Link
                  href={`/control/articles/update/${article.slug}`}
                  className='text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-tighter'
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
