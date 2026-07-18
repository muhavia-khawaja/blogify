import React from 'react'
import {
  BookOpen,
  FolderTree,
  MessageSquare,
  Users,
  Plus,
  FileEdit,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { getDashboardStats, getRecentArticles } from '@/utils/actions'

export const revalidate = 0

export default async function AdminHomePage() {
  const statsData = await getDashboardStats()
  const { published, drafts } = await getRecentArticles()

  const stats = [
    {
      name: 'Total Articles',
      value: statsData.totalArticles,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
    },
    {
      name: 'Categories',
      value: statsData.totalCategories,
      icon: FolderTree,
      color: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
    },
    {
      name: 'User Reviews',
      value: statsData.totalReviews,
      icon: MessageSquare,
      color: 'from-pink-500 to-pink-600',
      lightBg: 'bg-pink-50',
    },
    {
      name: 'System Admins',
      value: statsData.totalAdmins,
      icon: Users,
      color: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#F9F8F6] via-[#F5F3F0] to-[#F1EEEB]'>
      <header className='sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-[#E8E4DC]'>
        <div className='px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-serif font-bold text-[#1A1A18] tracking-tight'>
                Control Center
              </h1>
              <p className='text-sm text-[#6B6860] font-serif italic mt-1'>
                Manage your content ecosystem
              </p>
            </div>
            <Link
              href='/control/articles/new'
              className='inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 active:scale-95'
            >
              <Plus size={16} /> New Entry
            </Link>
          </div>
        </div>
      </header>

      <main className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto space-y-10 sm:space-y-14'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className='group bg-white rounded-2xl p-6 border border-[#E0DCD5] shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div
                    className={`p-3 rounded-xl ${stat.lightBg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      className={`text-transparent bg-clip-text bg-gradient-to-r text-black`}
                      size={22}
                    />
                  </div>
                  <div className='text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <TrendingUp size={12} />
                  </div>
                </div>
                <p className='text-[11px] font-black uppercase tracking-[0.2em] text-[#9B9890] mb-1.5'>
                  {stat.name}
                </p>
                <p className='text-4xl sm:text-3xl font-serif font-bold text-[#1A1A18]'>
                  {stat.value.toString().padStart(2, '0')}
                </p>
              </div>
            )
          })}
        </div>

        <div>
          <h2 className='text-[10px] font-black uppercase tracking-[0.3em] text-[#9B9890] mb-4'>
            Quick Access
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
            <QuickCard
              title='Departments'
              desc='Manage & organize categories'
              icon={FolderTree}
              href='/control/categories'
              accent='emerald'
            />
            <QuickCard
              title='Feedback'
              desc='Review user submissions'
              icon={MessageSquare}
              href='/control/reviews'
              accent='blue'
            />
            <QuickCard
              title='Inquiries'
              desc='Check contact messages'
              icon={Zap}
              href='/control/contacts'
              accent='amber'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <div className='bg-white rounded-3xl shadow-sm border border-[#E0DCD5] overflow-hidden'>
              <div className='px-6 sm:px-8 py-5 sm:py-6 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FEFDFB]'>
                <div className='flex items-center gap-3'>
                  <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                  <h2 className='font-serif font-bold text-[#1A1A18] text-lg'>
                    Live Manuscripts
                  </h2>
                </div>
                <Link
                  href='/control/articles'
                  className='text-[9px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors'
                >
                  View All →
                </Link>
              </div>
              <ArticleTable list={published} status='live' />
            </div>

            <div className='bg-white rounded-3xl shadow-sm border border-[#E0DCD5] overflow-hidden'>
              <div className='px-6 sm:px-8 py-5 sm:py-6 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FEFDFB]'>
                <div className='flex items-center gap-3'>
                  <FileEdit className='text-amber-500' size={20} />
                  <h2 className='font-serif font-bold text-[#1A1A18] text-lg'>
                    Drafting Table
                  </h2>
                </div>
                <Link
                  href='/control/articles'
                  className='text-[9px] font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-colors'
                >
                  Continue →
                </Link>
              </div>
              <ArticleTable list={drafts} status='draft' />
            </div>
          </div>

          <div className='space-y-6'>
            <div className='relative bg-gradient-to-br from-[#1A1A18] to-[#2A2A24] text-white p-6 sm:p-8 rounded-3xl shadow-xl overflow-hidden border border-white/10'>
              <div className='relative z-10'>
                <h3 className='text-xl sm:text-2xl font-serif font-bold mb-2'>
                  Pro Tip
                </h3>
                <p className='text-white/70 text-sm italic leading-relaxed'>
                  Reviewing pending entries regularly keeps your ecosystem
                  fresh. Engage with community submissions to build trust.
                </p>
              </div>
              <div className='absolute -bottom-6 -right-6 opacity-5 text-white'>
                <BookOpen size={140} />
              </div>
            </div>

            <div className='space-y-3'>
              <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-[#9B9890]'>
                At a Glance
              </h3>
              <div className='grid grid-cols-2 gap-3'>
                <StatMini
                  label='Published'
                  value={published.length}
                  accent='emerald'
                />
                <StatMini
                  label='In Draft'
                  value={drafts.length}
                  accent='amber'
                />
                <StatMini
                  label='Total Views'
                  value={statsData.totalArticles * 10}
                  accent='blue'
                />
                <StatMini
                  label='Active Users'
                  value={statsData.totalAdmins}
                  accent='pink'
                />
              </div>
            </div>

            <div className='bg-white rounded-2xl p-5 border border-[#E0DCD5] text-center'>
              <p className='text-xs text-[#6B6860] mb-3 font-serif'>
                Need help managing your content?
              </p>
              <Link
                href='/'
                className='inline-flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors'
              >
                View Site <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function QuickCard({
  title,
  desc,
  icon: Icon,
  href,
  accent,
}: {
  title: string
  desc: string
  icon: LucideIcon
  href: string
  accent: 'emerald' | 'blue' | 'amber' | 'pink'
}) {
  const accentClass = {
    emerald:
      'from-emerald-500 to-emerald-600 group-hover:shadow-emerald-500/20',
    blue: 'from-blue-500 to-blue-600 group-hover:shadow-blue-500/20',
    amber: 'from-amber-500 to-amber-600 group-hover:shadow-amber-500/20',
    pink: 'from-pink-500 to-pink-600 group-hover:shadow-pink-500/20',
  }[accent as 'emerald' | 'blue' | 'amber']

  return (
    <Link href={href} className='group'>
      <div className='bg-white rounded-2xl p-6 border border-[#E0DCD5] shadow-sm hover:shadow-lg transition-all duration-300 h-full'>
        <div className='flex items-start justify-between mb-5'>
          <div
            className={`p-3.5 rounded-xl bg-gradient-to-r ${accentClass} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
          >
            <Icon size={22} strokeWidth={1.5} />
          </div>
          <div className='w-8 h-8 rounded-full border border-[#E0DCD5] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[#1A1A18] transition-all duration-300'>
            <ArrowRight
              size={14}
              className='text-[#1A1A18] group-hover:translate-x-0.5 transition-transform'
            />
          </div>
        </div>
        <h3 className='font-serif font-bold text-[#1A1A18] text-base mb-1'>
          {title}
        </h3>
        <p className='text-xs text-[#9B9890] font-serif'>{desc}</p>
      </div>
    </Link>
  )
}

function StatMini({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: 'emerald' | 'blue' | 'amber' | 'pink'
}) {
  const accentColor = {
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    pink: 'bg-pink-50 text-pink-700',
  }[accent as 'emerald' | 'blue' | 'amber' | 'pink']

  return (
    <div className={`${accentColor} rounded-xl p-3 text-center`}>
      <p className='text-[9px] font-bold uppercase tracking-widest mb-1 opacity-70'>
        {label}
      </p>
      <p className='text-2xl font-serif font-bold'>
        {value.toString().padStart(2, '0')}
      </p>
    </div>
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
        <div className='w-12 h-12 rounded-full bg-[#F1EEEB] flex items-center justify-center mx-auto mb-3'>
          <BookOpen size={20} className='text-[#9B9890]' />
        </div>
        <p className='text-sm text-[#6B6860] font-serif italic'>
          No entries yet. Start creating!
        </p>
      </div>
    )
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left'>
        <thead>
          <tr className='bg-gradient-to-r from-[#FEFDFB] to-transparent border-b border-[#E8E4DC]'>
            <th className='px-6 sm:px-8 py-3 text-[10px] font-black text-[#9B9890] uppercase tracking-widest'>
              Title
            </th>
            <th className='px-6 sm:px-8 py-3 text-[10px] font-black text-[#9B9890] uppercase tracking-widest hidden sm:table-cell'>
              Category
            </th>
            <th className='px-6 sm:px-8 py-3 text-[10px] font-black text-[#9B9890] uppercase tracking-widest hidden md:table-cell'>
              Date
            </th>
            <th className='px-6 sm:px-8 py-3 text-[10px] font-black text-[#9B9890] uppercase tracking-widest text-right'>
              Action
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-[#E8E4DC]'>
          {list.map((article) => (
            <tr
              key={article.id}
              className='hover:bg-[#FEFDFB] transition-colors duration-200 group'
            >
              <td className='px-6 sm:px-8 py-4'>
                <p className='font-serif font-semibold text-[#1A1A18] text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors'>
                  {article.title}
                </p>
              </td>
              <td className='px-6 sm:px-8 py-4 hidden sm:table-cell'>
                <span className='inline-flex items-center px-2.5 py-1 bg-[#F1EEEB] text-[#6B6860] rounded-full text-[10px] font-bold uppercase tracking-tighter'>
                  {article.category?.title || 'General'}
                </span>
              </td>
              <td className='px-6 sm:px-8 py-4 hidden md:table-cell text-[11px] text-[#9B9890] font-serif'>
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className='px-6 sm:px-8 py-4 text-right'>
                <Link
                  href={`/control/articles/${article.slug}`}
                  className='inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-tighter transition-colors opacity-0 group-hover:opacity-100'
                >
                  Edit <ArrowRight size={12} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
