import React from 'react'
import {
  MessageSquare,
  Star,
  Trash2,
  User,
  Mail,
  Link as LinkIcon,
} from 'lucide-react'
import { deleteReview, getAllReviews } from '@/utils/actions'

export default async function ReviewsPage() {
  const reviews = await getAllReviews()

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        ).toFixed(1)
      : 0

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>User Reviews</h1>
          <p className='text-gray-500 text-sm'>
            Manage feedback left by readers on your articles.
          </p>
        </div>

        <div className='flex gap-4'>
          <div className='bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm'>
            <p className='text-xs text-gray-500 font-medium'>Average Rating</p>
            <p className='text-xl font-bold text-yellow-500 flex items-center gap-1'>
              {avgRating} <Star size={16} fill='currentColor' />
            </p>
          </div>
          <div className='bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm'>
            <p className='text-xs text-gray-500 font-medium'>Total Reviews</p>
            <p className='text-xl font-bold text-gray-900'>{reviews.length}</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className='bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center'>
          <MessageSquare size={48} className='text-gray-200 mb-4' />
          <h3 className='text-lg font-medium text-gray-900'>No reviews yet</h3>
          <p className='text-gray-500 mt-1'>
            When users comment on your blog, they will appear here.
          </p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {reviews.map((review) => (
            <div
              key={review.id}
              className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group'
            >
              <div className='p-5 flex flex-col md:flex-row gap-6'>
                <div className='md:w-1/4 space-y-2'>
                  <div className='flex items-center gap-2 text-gray-900 font-bold'>
                    <User size={16} className='text-gray-400' />
                    {review.name}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <Mail size={14} />
                    {review.email}
                  </div>
                  <div className='flex gap-1 mt-2'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-200'
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className='flex-1 space-y-3'>
                  <div className='flex items-start justify-between gap-4'>
                    <p className='text-gray-700 leading-relaxed'>
                      {review.content}
                    </p>
                    <form action={deleteReview}>
                      <input type='hidden' name='reviewId' value={review.id} />
                      <button className='text-gray-300 hover:text-red-600 transition-colors p-1'>
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>

                  {review.article && (
                    <div className='pt-3 border-t border-gray-50 flex items-center gap-2 text-xs'>
                      <span className='text-gray-400 uppercase font-semibold'>
                        Article:
                      </span>
                      <a
                        href={`/blog/${review.article.slug}`}
                        className='text-blue-600 hover:underline flex items-center gap-1'
                      >
                        <LinkIcon size={12} />
                        {review.article.title}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
