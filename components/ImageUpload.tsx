'use client'

import React, { useState, ChangeEvent, useRef } from 'react'
import { ImageIcon, X, UploadCloud } from 'lucide-react'

export default function ImageUpload({ name }: { name: string }) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className='space-y-2'>
      <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
        <ImageIcon size={16} /> Cover Image
      </label>

      <div className='relative'>
        <input
          ref={fileInputRef}
          type='file'
          name={name}
          accept='image/*'
          onChange={handleImageChange}
          className={`absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer ${preview ? 'hidden' : 'block'}`}
        />

        {!preview ? (
          <div className='relative group border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-center'>
            <div className='space-y-2'>
              <div className='mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors'>
                <UploadCloud size={24} />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-700'>
                  Click to upload
                </p>
                <p className='text-xs text-gray-400'>PNG, JPG or WebP</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='relative rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video bg-gray-50'>
            <img
              src={preview}
              alt='Preview'
              className='w-full h-full object-cover'
            />
            <button
              type='button'
              onClick={removeImage}
              className='absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-30'
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
