'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2, Plus } from 'lucide-react'
import { toggleFollowTopic } from '@/utils/actions'

export default function FollowTopicButton({
  topicId,
  initialFollowing,
}: {
  topicId: string
  initialFollowing: boolean
}) {
  const [following, setFollowing] = useState(initialFollowing)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleFollowTopic(topicId)

      if (result?.success) {
        setFollowing(Boolean(result.following))
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: result.following
              ? 'You are now following this topic.'
              : 'Topic unfollowed.',
          }),
        )
      } else if (result?.error || result?.message) {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: result.error || result.message,
          }),
        )
      }
    })
  }

  return (
    <button
      type='button'
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        following
          ? 'border border-gray-300 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-500'
          : 'bg-[#3d348b] text-white shadow-sm hover:bg-[#342d78] hover:shadow-md'
      }`}
    >
      {isPending ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : following ? (
        <Check className='h-4 w-4' />
      ) : (
        <Plus className='h-4 w-4' />
      )}
      {isPending ? 'Updating...' : following ? 'Following' : 'Follow topic'}
    </button>
  )
}
