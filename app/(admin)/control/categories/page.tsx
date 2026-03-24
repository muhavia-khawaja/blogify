import React from 'react'
import {
  Plus,
  FolderTree,
  Pencil,
  Trash2,
  Layers,
  Calendar,
  Hash,
} from 'lucide-react'
import { deleteCategory, getAllCategories } from '@/utils/actions'
import Link from 'next/link'

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto space-y-10'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-primary/10 text-primary rounded-xl'>
            <Layers size={32} />
          </div>
          <div>
            <h1 className='text-3xl font-black tracking-tight text-base-content'>
              Categories
            </h1>
            <p className='text-base-content/60 text-sm font-medium'>
              Manage and organize your content topics
            </p>
          </div>
        </div>

        <Link
          href='/control/categories/new'
          className='btn btn-primary btn-md md:btn-lg shadow-lg shadow-primary/20 gap-2 normal-case rounded-xl hover:scale-105 transition-transform'
        >
          <Plus size={20} strokeWidth={3} />
          New Category
        </Link>
      </div>

      <div>
        {categories.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 px-4 bg-base-200/30 border-2 border-dashed border-base-300 rounded-3xl'>
            <div className='bg-base-100 p-6 rounded-full shadow-inner mb-6'>
              <FolderTree size={64} className='text-base-content/20' />
            </div>
            <h3 className='text-2xl font-bold text-base-content'>
              No categories yet
            </h3>
            <p className='text-base-content/50 max-w-sm text-center mt-2 mb-8'>
              Create your first category to start organizing your blog articles
              effectively.
            </p>
            <Link
              href='/control/categories/new'
              className='btn btn-outline btn-wide rounded-xl'
            >
              Add First Category
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className='card bg-base-100 border border-base-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group'
              >
                <figure className='h-48 relative overflow-hidden bg-base-300'>
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                  ) : (
                    <div className='flex flex-col items-center justify-center opacity-20'>
                      <Layers size={48} />
                    </div>
                  )}

                  <div className='absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0'>
                    <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Link
                        href={`/control/categories/${cat.slug}`}
                        className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      >
                        <Pencil size={18} />
                      </Link>

                      <form action={deleteCategory}>
                        <input type='hidden' name='id' value={cat.id} />
                        <button
                          type='submit'
                          className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </div>
                </figure>

                <div className='card-body p-6'>
                  <div className='flex justify-between items-start'>
                    <h2 className='card-title text-xl font-bold truncate pr-4 text-base-content'>
                      {cat.title}
                    </h2>
                  </div>

                  <p className='text-sm text-base-content/60 line-clamp-2 mt-1 min-h-[40px]'>
                    {cat.short_desc ||
                      'No description provided for this category.'}
                  </p>

                  <div className='divider my-2'></div>

                  <div className='flex flex-wrap items-center justify-between gap-3 mt-auto'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-base-content/40'>
                        <Hash size={12} />
                        {cat.id.slice(-6)}
                      </div>
                      <div className='flex items-center gap-1.5 text-xs font-medium text-base-content/60'>
                        <Calendar size={12} />
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className='badge badge-primary badge-outline font-bold'>
                      Active
                    </div>
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
