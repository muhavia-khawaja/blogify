'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2, UserPlus } from 'lucide-react'
import { toggleFollowUser } from '@/utils/actions'

interface FollowButtonClientProps {
  authorId: string
  initialFollowing: boolean
}

export default function FollowButtonClient({
  authorId,
  initialFollowing,
}: FollowButtonClientProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [isPending, startTransition] = useTransition()

  function handleFollow() {
    startTransition(async () => {
      const result = await toggleFollowUser(authorId)

      if (result?.success) {
        setFollowing(result.following)
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: result.following
              ? 'You are now following this author.'
              : 'Author unfollowed.',
          }),
        )
      }
    })
  }

  return (
    <button
      type='button'
      onClick={handleFollow}
      disabled={isPending}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
        following
          ? 'border border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
          : 'bg-[#3d348b] text-white shadow-md shadow-[#3d348b]/20 hover:bg-[#30286f]'
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isPending ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : following ? (
        <Check className='h-4 w-4' />
      ) : (
        <UserPlus className='h-4 w-4' />
      )}

      {isPending ? 'Updating...' : following ? 'Following' : 'Follow'}
    </button>
  )
}
