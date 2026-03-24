import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserPlus, Edit, Trash2, Mail, User } from 'lucide-react'
import { getAllAuthors } from '@/utils/actions'

export default async function AuthorsPage() {
  const authors = await getAllAuthors()

  return (
    <div className='max-w-6xl mx-auto py-10 px-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12'>
        <div>
          <h1 className='text-3xl font-bold text-[#111827]'>Authors</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Manage the writers and contributors for your blog.
          </p>
        </div>

        <Link
          href='/control/authors/new'
          className='flex items-center justify-center gap-2 bg-[#111827] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-gray-200 active:scale-95'
        >
          <UserPlus size={18} />
          Add New Author
        </Link>
      </div>

      <div className='bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50/50 border-b border-gray-100'>
                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-400'>
                  Author
                </th>
                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-400'>
                  Biography
                </th>
                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-center'>
                  Articles
                </th>
                <th className='px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-right'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {authors.map((author) => (
                <tr
                  key={author.id}
                  className='hover:bg-gray-50/30 transition-colors group'
                >
                  <td className='px-8 py-6'>
                    <div className='flex items-center gap-4'>
                      <div className='relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100 shadow-sm'>
                        {author.image ? (
                          <Image
                            src={author.image}
                            alt={author.name}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <User size={20} className='absolute top-3 left-3' />
                        )}
                      </div>
                      <span className='font-bold text-[#111827] group-hover:text-blue-600 transition-colors'>
                        {author.name}
                      </span>
                    </div>
                  </td>
                  <td className='px-8 py-6 max-w-md'>
                    <p className='text-sm text-gray-500 line-clamp-2 leading-relaxed'>
                      {author.bio || 'No biography provided.'}
                    </p>
                  </td>
                  <td className='px-8 py-6 text-center'>
                    <span className='inline-flex items-center justify-center bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full'>
                      {author._count?.articles || 0}
                    </span>
                  </td>
                  <td className='px-8 py-6'>
                    <div className='flex items-center justify-end gap-3'>
                      <Link
                        href={`/control/author/${author.id}`}
                        className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'
                        title='Edit Author'
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all'
                        title='Delete Author'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {authors.length === 0 && (
                <tr>
                  <td colSpan={4} className='px-8 py-20 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='p-4 bg-gray-50 rounded-full text-gray-300'>
                        <Mail size={40} />
                      </div>
                      <p className='text-gray-400 font-medium text-lg'>
                        No authors found yet.
                      </p>
                      <Link
                        href='/control/authors/new'
                        className='text-blue-600 font-bold hover:underline'
                      >
                        Create the first one
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
