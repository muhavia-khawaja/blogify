'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  FiArrowLeft,
  FiLogOut,
  FiBookOpen,
  FiClock,
  FiChevronRight,
  FiEye,
  FiHeart,
  FiBarChart2,
  FiTrash2,
  FiPlus,
  FiActivity,
  FiFileText,
  FiUsers,
  FiTrendingUp,
} from 'react-icons/fi'
import { getCurrentUser, logoutUser } from '@/utils/actions'
import { getUserAnalyticsOverview, deleteUserArticle } from '@/utils/userData'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'articles' | 'analytics'>(
    'articles',
  )

  useEffect(() => {
    async function loadProfileData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          window.location.href = '/login'
          return
        }
        setUser(currentUser)

        const analyticsRes = await getUserAnalyticsOverview(currentUser.id)
        if (analyticsRes.success && analyticsRes.data) {
          setArticles(analyticsRes.data.articles || [])
          setAnalyticsSummary(analyticsRes.data.summary)
        } else {
          setArticles(currentUser.articles || [])
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [])

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this manuscript?')) return
    setDeletingId(articleId)

    const res = await deleteUserArticle(articleId, user.id)
    if (res.success) {
      setArticles((prev) => prev.filter((art) => art.id !== articleId))
    } else {
      alert(res.error || 'Failed to delete article')
    }
    setDeletingId(null)
  }

  const formatStat = (num: number) =>
    num !== undefined && num !== null
      ? num >= 1000
        ? `${(num / 1000).toFixed(1)}k`
        : num.toString().padStart(2, '0')
      : '00'

  const formatReadTime = (totalSeconds: number) => {
    if (!totalSeconds) return '0 mins'
    const mins = Math.floor(totalSeconds / 60)
    return mins > 0 ? `${mins} mins` : `${totalSeconds}s`
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-[#FCFBF9] flex flex-col items-center justify-center gap-3 px-4 text-center'>
        <div className='w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin' />
        <p className='text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-emerald-700 animate-pulse'>
          Retrieving Credentials...
        </p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A] pt-16 sm:pt-24 pb-16 sm:pb-20 selection:bg-emerald-100 selection:text-emerald-900'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6'>
        <div className='mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4'>
          <Link
            href='/'
            className='group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors'
          >
            <FiArrowLeft className='group-hover:-translate-x-1 transition-transform' />
            Back to Library
          </Link>

          <Link
            href='/write'
            className='inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-emerald-900 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-sm hover:shadow-md'
          >
            <FiPlus size={14} />
            New Manuscript
          </Link>
        </div>

        <div className='bg-white border border-gray-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] mb-8 sm:mb-10'>
          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8'>
            <div className='relative shrink-0'>
              <div className='w-20 h-20 sm:w-28 sm:h-28 rounded-[1.8rem] sm:rounded-[2.2rem] bg-[#FAF9F6] border border-gray-200/80 flex items-center justify-center rotate-2 transition-transform hover:rotate-0 duration-500 shadow-inner'>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={112}
                    height={112}
                    className='w-full h-full object-cover rounded-[1.8rem] sm:rounded-[2.2rem]'
                  />
                ) : (
                  <span className='text-[#1A1A1A] text-3xl sm:text-5xl font-serif italic'>
                    {user.name?.charAt(0)}
                  </span>
                )}
              </div>
              <span className='absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-2 sm:border-4 border-white shadow-sm' />
            </div>

            <div className='flex-1 text-center sm:text-left space-y-1.5 sm:space-y-2 w-full min-w-0'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse' />
                <span className='text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-emerald-800'>
                  Verified Author & Archivist
                </span>
              </div>
              <h1 className='text-2xl sm:text-4xl font-serif font-bold tracking-tight text-gray-900 truncate'>
                {user.name}
              </h1>
              <p className='text-gray-400 font-serif italic text-sm sm:text-lg truncate'>
                {user.email}
              </p>
            </div>

            <form
              action={logoutUser}
              className='w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50'
            >
              <button
                type='submit'
                className='w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/30 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all'
              >
                <FiLogOut size={13} /> Terminate Session
              </button>
            </form>
          </div>
        </div>

        <div className='flex gap-6 sm:gap-8 mb-6 sm:mb-8 border-b border-gray-200/70 px-1 overflow-x-auto scrollbar-none'>
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 sm:pb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative flex items-center gap-2 ${
              activeTab === 'articles'
                ? 'text-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FiFileText size={14} />
            My Manuscripts ({articles.length})
            {activeTab === 'articles' && (
              <span className='absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full' />
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 sm:pb-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'text-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FiBarChart2 size={14} />
            Performance & Insights
            {activeTab === 'analytics' && (
              <span className='absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full' />
            )}
          </button>
        </div>

        {activeTab === 'articles' && (
          <div className='space-y-4'>
            {articles.length > 0 ? (
              articles.map((article) => {
                const viewsCount =
                  article._count?.views || article.analytics?.totalViews || 0
                const impressionsCount =
                  article._count?.impressions ||
                  article.analytics?.totalImpressions ||
                  0
                const likesCount = article._count?.likes || 0

                return (
                  <div
                    key={article.id}
                    className='group bg-white border border-gray-100/80 hover:border-emerald-200/80 rounded-[1.8rem] sm:rounded-[2rem] p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center justify-between'
                  >
                    <div className='flex items-center gap-4 sm:gap-5 flex-1 min-w-0 w-full sm:w-auto'>
                      <div className='relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100'>
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className='object-cover group-hover:scale-105 transition-transform duration-500'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-300 bg-[#FAF9F6]'>
                            <FiBookOpen size={20} className='sm:w-6 sm:h-6' />
                          </div>
                        )}
                      </div>

                      <div className='min-w-0 flex-1 space-y-1'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <span
                            className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              article.published ||
                              article.status === 'PUBLISHED'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                                : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                            }`}
                          >
                            {article.status ||
                              (article.published ? 'PUBLISHED' : 'DRAFT')}
                          </span>
                          <span className='text-[8px] sm:text-[9px] text-gray-400 font-bold tracking-wider flex items-center gap-1'>
                            <FiClock size={10} /> {article.readTime || '3 min'}
                          </span>
                        </div>

                        <h3 className='text-base sm:text-lg font-serif font-bold text-gray-900 group-hover:text-emerald-900 transition-colors truncate'>
                          {article.title}
                        </h3>

                        <p className='text-gray-400 text-xs font-serif italic truncate hidden sm:block'>
                          {article.short_desc}
                        </p>

                        <div className='flex items-center gap-3 sm:gap-4 pt-1 text-[9px] sm:text-[10px] font-mono text-gray-400'>
                          <span
                            className='flex items-center gap-1'
                            title='Total Views'
                          >
                            <FiEye size={11} className='text-emerald-600' />{' '}
                            {formatStat(viewsCount)}
                          </span>
                          <span
                            className='flex items-center gap-1'
                            title='Impressions'
                          >
                            <FiActivity size={11} className='text-blue-500' />{' '}
                            {formatStat(impressionsCount)}
                          </span>
                          <span
                            className='flex items-center gap-1'
                            title='Likes'
                          >
                            <FiHeart size={11} className='text-rose-500' />{' '}
                            {formatStat(likesCount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto justify-end'>
                      <Link
                        href={`/blog/${article.slug}`}
                        className='p-2 sm:p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all'
                        title='View Published'
                      >
                        <FiChevronRight size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deletingId === article.id}
                        className='p-2 sm:p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50'
                        title='Delete Article'
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='py-12 sm:py-16 text-center bg-white border border-dashed border-gray-200 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8'>
                <FiBookOpen className='mx-auto text-gray-300 mb-3' size={32} />
                <h3 className='text-base sm:text-lg font-serif font-semibold text-gray-700'>
                  No manuscripts created yet
                </h3>
                <p className='text-gray-400 font-serif italic text-xs max-w-sm mx-auto mt-1'>
                  Share your insights, study notes, or research articles with
                  the community.
                </p>
                <Link
                  href='/write'
                  className='mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-900 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-800 transition-all'
                >
                  <FiPlus size={14} /> Draft First Manuscript
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className='space-y-6 sm:space-y-8'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6'>
              {[
                {
                  label: 'Total Impressions',
                  value: formatStat(analyticsSummary?.totalImpressions || 0),
                  icon: FiActivity,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50/50',
                },
                {
                  label: 'Total Views',
                  value: formatStat(analyticsSummary?.totalViews || 0),
                  icon: FiEye,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50/50',
                },
                {
                  label: 'Guest vs User',
                  value: `${formatStat(analyticsSummary?.guestViews || 0)} / ${formatStat(analyticsSummary?.userViews || 0)}`,
                  icon: FiUsers,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50/50',
                },
                {
                  label: 'Total Read Time',
                  value: formatReadTime(
                    analyticsSummary?.totalReadTimeSec || 0,
                  ),
                  icon: FiClock,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50/50',
                },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className='bg-white border border-gray-100/80 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow'
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${metric.bg} ${metric.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3`}
                  >
                    <metric.icon className='w-4 h-4 sm:w-5 sm:h-5' />
                  </div>
                  <p className='text-xl sm:text-3xl font-serif font-bold text-gray-900 mb-0.5 sm:mb-1 truncate'>
                    {metric.value}
                  </p>
                  <p className='text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-gray-400 truncate'>
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className='bg-white border border-gray-100/80 rounded-[1.8rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-5 sm:space-y-6'>
              <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
                <div>
                  <h3 className='text-base sm:text-lg font-serif font-bold text-gray-900'>
                    Engagement Breakdown
                  </h3>
                  <p className='text-xs text-gray-400 font-serif italic hidden sm:block'>
                    Aggregated reader interactions across all published
                    manuscripts
                  </p>
                </div>
                <FiTrendingUp className='text-emerald-600 shrink-0' size={20} />
              </div>

              <div className='grid grid-cols-3 gap-2 sm:gap-4 text-center divide-x divide-gray-100'>
                <div className='px-1'>
                  <p className='text-[8px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 truncate'>
                    Likes
                  </p>
                  <p className='text-lg sm:text-2xl font-serif font-bold text-rose-600'>
                    {formatStat(analyticsSummary?.totalLikes || 0)}
                  </p>
                </div>
                <div className='px-1'>
                  <p className='text-[8px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 truncate'>
                    Citations
                  </p>
                  <p className='text-lg sm:text-2xl font-serif font-bold text-indigo-600'>
                    {formatStat(analyticsSummary?.totalCitations || 0)}
                  </p>
                </div>
                <div className='px-1'>
                  <p className='text-[8px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 truncate'>
                    Reviews
                  </p>
                  <p className='text-lg sm:text-2xl font-serif font-bold text-emerald-600'>
                    {formatStat(analyticsSummary?.totalReviews || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='mt-8 sm:mt-12 p-5 sm:p-6 bg-[#FAF9F6] rounded-[1.8rem] sm:rounded-[2rem] border border-dashed border-gray-200 text-center'>
          <p className='text-gray-400 font-serif italic text-xs leading-relaxed'>
            The archive flourishes through documented knowledge.{' '}
            <br className='hidden sm:inline' />
            Archivist Reference ID:{' '}
            <span className='font-mono text-[10px] not-italic text-gray-600 font-semibold'>
              {user.id ? user.id.slice(-10).toUpperCase() : 'UNKNOWN'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
