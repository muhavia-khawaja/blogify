'use client'

import React, { useEffect, useState } from 'react'
import { getCurrentUser, logoutUser } from '@/utils/actions'
import Link from 'next/link'
import Image from 'next/image'
import {
  FiArrowLeft,
  FiLogOut,
  FiHeart,
  FiEdit3,
  FiBookOpen,
  FiClock,
  FiChevronRight,
} from 'react-icons/fi'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'stats' | 'articles'>('articles')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          window.location.href = '/login'
          return
        }
        setUser(currentUser)
        setArticles(currentUser.articles || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen bg-[#FCFBF9] flex items-center justify-center'>
        <div className='text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 animate-pulse'>
          Retrieving Credentials...
        </div>
      </div>
    )
  }

  if (!user) return null

  const formatStat = (num: number) => num?.toString().padStart(2, '0') || '00'

  return (
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A] pt-24 pb-12'>
      <div className='max-w-3xl mx-auto px-6'>
        <div className='mb-12'>
          <Link
            href='/'
            className='group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all'
          >
            <FiArrowLeft className='group-hover:-translate-x-1 transition-transform' />
            Back to Library
          </Link>
        </div>

        <div className='bg-white border border-gray-100 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] mb-12'>
          <div className='flex flex-col md:flex-row items-center gap-10'>
            <div className='relative'>
              <div className='w-28 h-28 rounded-[2.5rem] bg-[#F9F8F6] border border-gray-100 flex items-center justify-center rotate-3 transition-transform hover:rotate-0 duration-500'>
                <span className='text-[#1A1A1A] text-5xl font-serif italic'>
                  {user.name?.charAt(0)}
                </span>
              </div>
              <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white' />
            </div>

            <div className='flex-1 text-center md:text-left'>
              <span className='text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600 block mb-2'>
                Verified Archivist
              </span>
              <h2 className='text-4xl font-serif font-bold tracking-tight mb-2'>
                {user.name}
              </h2>
              <p className='text-gray-400 font-serif italic text-lg'>
                {user.email}
              </p>
            </div>
          </div>

          <div className='mt-10 pt-10 border-t border-gray-50 flex flex-col md:flex-row gap-4'>
            <Link
              href='/edit-profile'
              className='flex-1 flex items-center justify-center gap-2 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg'
            >
              <FiEdit3 /> Edit Signature
            </Link>

            <form action={logoutUser} className='flex-1'>
              <button
                type='submit'
                className='w-full flex items-center justify-center gap-2 py-4 border-2 border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest transition-all'
              >
                <FiLogOut /> Terminate Session
              </button>
            </form>
          </div>
        </div>

        <div className='flex gap-8 mb-8 border-b border-gray-100 px-4'>
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'articles' ? 'text-black' : 'text-gray-300'}`}
          >
            My Manuscripts
            {activeTab === 'articles' && (
              <span className='absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500' />
            )}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'stats' ? 'text-black' : 'text-gray-300'}`}
          >
            Archive Analytics
            {activeTab === 'stats' && (
              <span className='absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500' />
            )}
          </button>
        </div>

        {activeTab === 'articles' ? (
          <div className='space-y-6'>
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className='group block bg-white border border-gray-100 rounded-[2.5rem] p-6 hover:shadow-xl hover:border-emerald-100 transition-all'
                >
                  <div className='flex items-center gap-6'>
                    <div className='relative w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0'>
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-gray-200'>
                          <FiBookOpen size={24} />
                        </div>
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span
                          className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${article.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                        >
                          {article.status}
                        </span>
                        <span className='text-[8px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1'>
                          <FiClock /> {article.readTime || '3 min'}
                        </span>
                      </div>
                      <h3 className='text-xl font-serif font-bold group-hover:text-emerald-600 transition-colors line-clamp-1'>
                        {article.title}
                      </h3>
                      <p className='text-gray-400 text-xs font-serif italic line-clamp-1 mt-1'>
                        {article.short_desc}
                      </p>
                    </div>
                    <FiChevronRight
                      className='text-gray-200 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all'
                      size={20}
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className='py-20 text-center bg-white border border-dashed border-gray-200 rounded-[3rem]'>
                <FiBookOpen className='mx-auto text-gray-200 mb-4' size={40} />
                <p className='text-gray-400 font-serif italic'>
                  No manuscripts found in your registry.
                </p>
                <Link
                  href='/write'
                  className='text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-4 inline-block hover:underline'
                >
                  Draft your first exhibit
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-6'>
            {[
              {
                label: 'Saved Perspectives',
                icon: FiHeart,
                value: formatStat(user._count?.likes),
              },
              {
                label: 'System Citations',
                icon: FiEdit3,
                value: formatStat(user._count?.citations),
              },
            ].map((stat, i) => (
              <div
                key={i}
                className='bg-white border border-gray-100 rounded-[2rem] p-8 text-center shadow-sm hover:shadow-md transition-shadow'
              >
                <stat.icon
                  className='mx-auto mb-4 text-emerald-500'
                  size={18}
                />
                <p className='text-4xl font-serif font-bold mb-1'>
                  {stat.value}
                </p>
                <p className='text-[9px] font-black uppercase tracking-widest text-gray-400'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className='mt-12 p-8 bg-[#F9F8F6] rounded-[2.5rem] border border-dashed border-gray-200 text-center'>
          <p className='text-gray-400 font-serif italic text-sm leading-relaxed'>
            The archive flourishes when the archivist is complete. <br />
            Member ID:{' '}
            <span className='font-mono text-[10px] not-italic'>
              {user.id.slice(-8).toUpperCase()}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
