'use client'

import { useEffect, useState } from 'react'
import TranslateArticle from './TranslateArticle'

type Props = {
  title: string
  content: string
}

export default function TranslatableArticleContent({ title, content }: Props) {
  const [displayTitle, setDisplayTitle] = useState(title)
  const [displayContent, setDisplayContent] = useState(content)

  useEffect(() => {
    const handleTranslation = (event: Event) => {
      const customEvent = event as CustomEvent<{
        title: string
        content: string
      }>

      if (!customEvent.detail) return

      setDisplayTitle(customEvent.detail.title)
      setDisplayContent(customEvent.detail.content)
    }

    window.addEventListener('article-translation', handleTranslation)

    return () => {
      window.removeEventListener('article-translation', handleTranslation)
    }
  }, [])

  return (
    <>
      <h1
        className='
          max-w-4xl
          text-3xl
          font-black
          leading-[1.1]
          tracking-tight
          text-gray-950
          sm:text-5xl
          lg:text-6xl
        '
      >
        {displayTitle}
      </h1>

      <div
        className='
          prose
          prose-lg
          max-w-none
          text-gray-800
          prose-headings:font-black
          prose-headings:tracking-tight
          prose-headings:text-gray-950
          prose-h1:text-4xl
          prose-h2:mt-12
          prose-h2:text-3xl
          prose-h3:mt-10
          prose-h3:text-2xl
          prose-h4:text-xl
          prose-p:leading-8
          prose-p:text-gray-700
          prose-a:font-semibold
          prose-a:text-[#3d348b]
          prose-a:no-underline
          hover:prose-a:underline
          prose-strong:text-gray-950
          prose-blockquote:border-l-4
          prose-blockquote:border-[#7678ed]
          prose-blockquote:bg-[#3d348b]/5
          prose-blockquote:px-6
          prose-blockquote:py-3
          prose-blockquote:rounded-r-xl
          prose-blockquote:text-gray-700
          prose-img:rounded-2xl
          prose-img:border
          prose-img:border-gray-200
          prose-img:shadow-lg
          prose-code:rounded
          prose-code:bg-[#3d348b]/10
          prose-code:px-1.5
          prose-code:py-0.5
          prose-code:text-[#3d348b]
          prose-code:before:content-none
          prose-code:after:content-none
          prose-pre:rounded-2xl
          prose-pre:bg-gray-950
          prose-pre:border
          prose-pre:border-gray-800
          prose-li:marker:text-[#7678ed]
        '
        dangerouslySetInnerHTML={{
          __html: displayContent,
        }}
      />
    </>
  )
}
