import React from 'react'
import {
  MessageSquare,
  Star,
  Trash2,
  User,
  Mail,
  ArrowUpRight,
} from 'lucide-react'
import { deleteReview, getAllReviews } from '@/utils/actions'
import Link from 'next/link'

export default async function ReviewsPage() {
  const reviews = await getAllReviews()

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0

  const fiveStars = reviews.filter((r) => r.rating === 5).length

  return (
    <div className='min-h-screen bg-[#FCFBF9] antialiased text-[#1A1A1A]'>
      <div className='max-w-5xl mx-auto px-6 py-12 space-y-10'>
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6'>
          <div>
            <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 block mb-3'>
              Control Panel
            </span>
            <h1 className='text-4xl md:text-5xl font-serif font-bold leading-tight'>
              Reader{' '}
              <span className='italic font-normal text-gray-400'>Gallery.</span>
            </h1>
            <p className='text-gray-400 font-serif italic mt-2'>
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} in the
              archive
            </p>
          </div>

          {reviews.length > 0 && (
            <div className='flex gap-4 shrink-0'>
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 text-center'>
                <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1'>
                  Avg Rating
                </p>
                <div className='flex items-center justify-center gap-1.5'>
                  <span className='text-2xl font-serif font-bold text-[#1A1A1A]'>
                    {avgRating.toFixed(1)}
                  </span>
                  <Star
                    size={14}
                    className='text-emerald-500 fill-emerald-500'
                  />
                </div>
              </div>
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 text-center'>
                <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1'>
                  5-Star
                </p>
                <span className='text-2xl font-serif font-bold text-[#1A1A1A]'>
                  {fiveStars}
                </span>
              </div>
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 text-center'>
                <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1'>
                  Total
                </p>
                <span className='text-2xl font-serif font-bold text-[#1A1A1A]'>
                  {reviews.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-32 px-8 rounded-[3rem] border-2 border-dashed border-gray-100 bg-white/50 text-center'>
            <div className='w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6'>
              <MessageSquare size={28} className='text-gray-300' />
            </div>
            <span className='text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 block mb-3'>
              Gallery Empty
            </span>
            <h3 className='text-2xl font-serif font-bold text-[#1A1A1A] mb-2'>
              No reviews yet
            </h3>
            <p className='text-gray-400 font-serif italic max-w-xs leading-relaxed'>
              When readers respond to articles, their perspectives will appear
              here.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {reviews.map((review) => (
              <div
                key={review.id}
                className='group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:shadow-black/5 transition-all duration-300 overflow-hidden'
              >
                <div className='p-7 flex flex-col md:flex-row gap-8'>
                  <div className='md:w-52 shrink-0 space-y-3'>
                    <div className='flex items-center gap-2.5'>
                      <div className='w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0'>
                        <User size={15} className='text-gray-400' />
                      </div>
                      <div>
                        <p className='text-sm font-serif font-bold text-[#1A1A1A] leading-tight'>
                          {review.name}
                        </p>
                        <p className='text-[10px] font-bold text-gray-400 truncate max-w-[140px]'>
                          {review.email}
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-0.5'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < review.rating
                              ? 'text-emerald-500 fill-emerald-500'
                              : 'text-gray-200 fill-gray-200'
                          }
                        />
                      ))}
                    </div>

                    <p className='text-[9px] font-black uppercase tracking-widest text-gray-300'>
                      {new Date(review.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className='flex-1 flex flex-col justify-between gap-5'>
                    <div className='flex items-start justify-between gap-4'>
                      <blockquote className='border-l-2 border-emerald-100 pl-5 group-hover:border-emerald-400 transition-colors duration-500'>
                        <p className='font-serif italic text-gray-600 leading-relaxed text-[1.05rem]'>
                          {review.content}
                        </p>
                      </blockquote>

                      <form action={deleteReview} className='shrink-0'>
                        <input
                          type='hidden'
                          name='reviewId'
                          value={review.id}
                        />
                        <button
                          type='submit'
                          className='w-8 h-8 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-300 hover:text-red-500 flex items-center justify-center transition-colors'
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>

                    {review.article && (
                      <div className='flex items-center justify-between pt-4 border-t border-gray-50'>
                        <p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
                          Article
                        </p>
                        <Link
                          href={`/blog/${review.article.slug}`}
                          target='_blank'
                          className='flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-800 transition-colors'
                        >
                          {review.article.title.length > 40
                            ? review.article.title.slice(0, 40) + '...'
                            : review.article.title}
                          <ArrowUpRight size={11} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
