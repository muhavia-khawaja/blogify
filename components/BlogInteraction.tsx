'use client'

import { useState, useEffect } from 'react'
import {
  toggleLike,
  getArticleLikes,
  isArticleLikedByUser,
  getCitationFormat,
  addCitation,
} from '@/utils/actions'
import { FiHeart, FiShare2, FiFileText, FiCheck } from 'react-icons/fi'

interface BlogInteractionProps {
  articleId: string
  articleSlug: string
}

export default function BlogInteraction({
  articleId,
  articleSlug,
}: BlogInteractionProps) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCitationMenu, setShowCitationMenu] = useState(false)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [likesCount, isLikedByUser] = await Promise.all([
          getArticleLikes(articleId),
          isArticleLikedByUser(articleId),
        ])
        setLikes(likesCount)
        setIsLiked(isLikedByUser)
      } catch (error) {
        console.error('Archive retrieval error:', error)
      }
    }
    fetchData()
  }, [articleId])

  const handleLike = async () => {
    if (loading) return
    setLoading(true)
    try {
      const result = await toggleLike(articleId)
      if (result?.error) {
        alert(result.error)
        return
      }
      setIsLiked(!isLiked)
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
    } catch (error) {
      console.error('System log error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCitation = async (format: string) => {
    try {
      const citation = await getCitationFormat(articleId, format)

      await addCitation(articleId, format)

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(citation)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = citation
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      setCopiedFormat(format)
      setTimeout(() => {
        setCopiedFormat(null)
        setShowCitationMenu(false)
      }, 2000)
    } catch (error) {
      console.error('Citation registry error:', error)
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/blog/${articleSlug}`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Journal Exhibit', url: shareUrl })
      } catch (err) {
        console.error(err)
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      alert('Archive link copied.')
    }
  }

  return (
    <div className='flex items-center gap-3 py-10 border-t border-gray-100'>
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500 group ${
          isLiked
            ? 'bg-red-50 border-red-100 text-red-500'
            : 'bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black'
        }`}
      >
        <FiHeart
          className={`${isLiked ? 'fill-current' : ''} transition-transform group-active:scale-125`}
          size={18}
        />
        <span className='text-[10px] font-black uppercase tracking-widest'>
          {likes.toString().padStart(2, '0')}
        </span>
      </button>

      <div className='relative z-40'>
        {/* <button
          onClick={() => setShowCitationMenu(!showCitationMenu)}
          className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 z-[10] ${
            showCitationMenu
              ? 'bg-black text-white border-black'
              : 'bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black'
          }`}
        >
          <FiFileText size={18} />
          <span className='text-[10px] font-black uppercase tracking-widest'>
            Cite Exhibit
          </span>
        </button> */}

        {showCitationMenu && (
          <div className='absolute bottom-full mb-4 left-0 w-48 bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden  p-2 animate-in fade-in slide-in-from-bottom-2'>
            {['APA', 'MLA', 'Chicago', 'Harvard'].map((format) => (
              <button
                key={format}
                onClick={() => handleCitation(format)}
                className='w-full px-5 py-3 text-left hover:bg-[#F9F8F6] rounded-2xl transition-all flex justify-between items-center group'
              >
                <span className='text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black'>
                  {format}
                </span>
                {copiedFormat === format && (
                  <FiCheck className='text-emerald-500' />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleShare}
        className='flex items-center gap-3 px-6 py-3 rounded-full border border-gray-100 bg-white text-gray-400 hover:border-black hover:text-black transition-all group'
      >
        <FiShare2
          size={18}
          className='group-hover:rotate-12 transition-transform'
        />
        <span className='text-[10px] font-black uppercase tracking-widest'>
          Share
        </span>
      </button>
    </div>
  )
}
