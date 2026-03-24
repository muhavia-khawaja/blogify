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
} from 'lucide-react'
import Link from 'next/link'
import {
  getDashboardStats,
  getRecentArticles,
  getAllReviews,
} from '@/utils/actions'

export default async function AdminHomePage() {
  const statsData = await getDashboardStats()
  const { published, drafts } = await getRecentArticles()
  const reviews = await getAllReviews()

  const stats = [
    {
      name: 'Total Articles',
      value: statsData.totalArticles,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Categories',
      value: statsData.totalCategories,
      icon: FolderTree,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      name: 'Total Reviews',
      value: statsData.totalReviews,
      icon: MessageSquare,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      name: 'Admins',
      value: statsData.totalAdmins,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className='p-4 md:p-8 bg-gray-50 min-h-screen space-y-8'>
      {/* Header */}
      <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-black text-gray-900 tracking-tight'>
            Dashboard Overview
          </h1>
          <p className='text-gray-500 font-medium'>
            Live updates from your geology blog.
          </p>
        </div>
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat) => (
          <div
            key={stat.name}
            className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]'
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className='text-sm text-gray-400 font-bold uppercase tracking-wider'>
                {stat.name}
              </p>
              <p className='text-3xl font-black text-gray-900'>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <QuickCard
          title='Create Category'
          desc='Organize your topics'
          icon={<FolderTree size={20} />}
          href='/control/categories/new'
          color='bg-purple-600'
        />
        <QuickCard
          title='Create Article'
          desc='Boost your visibility'
          icon={<Zap size={20} />}
          href='/control/articles/new'
          color='bg-amber-500'
        />
        <QuickCard
          title='View Site'
          desc='Check live changes'
          icon={<ArrowRight size={20} />}
          href='/'
          color='bg-gray-800'
        />
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        <div className='xl:col-span-2 space-y-8'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-5 border-b border-gray-100 flex justify-between items-center bg-white'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='text-emerald-500' size={20} />
                <h2 className='font-bold text-gray-800'>Live Articles</h2>
              </div>
              <Link
                href='/control/articles'
                className='text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest'
              >
                View All
              </Link>
            </div>
            <ArticleTable list={published} status='live' />
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50'>
              <div className='flex items-center gap-2'>
                <FileEdit className='text-orange-500' size={20} />
                <h2 className='font-bold text-gray-800'>Drafts & Pending</h2>
              </div>
            </div>
            <ArticleTable list={drafts} status='draft' />
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit'>
          <h2 className='font-bold text-gray-800 mb-6 flex items-center gap-2'>
            <MessageSquare size={20} className='text-blue-600' />
            Recent Reviews
          </h2>
          <div className='space-y-6'>
            {reviews.map((review: any) => (
              <div key={review.id} className='group cursor-pointer'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-sm font-black text-gray-900'>
                    {review.name}
                  </p>
                  <div className='flex text-yellow-400'>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <q className='text-xs text-gray-500 leading-relaxed italic line-clamp-2 group-hover:text-gray-700 transition-colors'>
                  {review.content}
                </q>
                <div className='mt-2 text-[10px] font-bold text-gray-300 uppercase'>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickCard({ title, desc, icon, href, color }: any) {
  return (
    <Link
      href={href}
      className={`${color} p-5 rounded-2xl text-white shadow-lg hover:opacity-90 transition-all flex items-center justify-between group`}
    >
      <div>
        <h3 className='font-bold text-lg'>{title}</h3>
        <p className='text-white/70 text-sm'>{desc}</p>
      </div>
      <div className='p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform'>
        {icon}
      </div>
    </Link>
  )
}

function ArticleTable({ list, status }: any) {
  if (list.length === 0)
    return (
      <p className='p-8 text-center text-gray-400 text-sm italic'>
        No {status} articles found.
      </p>
    )

  return (
    <table className='w-full text-left'>
      <tbody className='divide-y divide-gray-50'>
        {list.map((article: any) => (
          <tr
            key={article.id}
            className='hover:bg-gray-50 transition-colors group'
          >
            <td className='px-6 py-4'>
              <p className='text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                {article.title}
              </p>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5'>
                {article.category?.title || 'Uncategorized'}
              </p>
            </td>
            <td className='px-6 py-4 text-right'>
              <Link
                href={`/control/articles/${article.slug}`}
                className='btn btn-ghost btn-xs rounded-lg'
              >
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className='text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md'>
      ★ {rating.toFixed(1)}
    </span>
  )
}
