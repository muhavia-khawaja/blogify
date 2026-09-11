'use client'
import { createTopic, deleteTopic, updateTopic } from '@/utils/admin/action'
import { Plus, Hash, Pencil, Trash2 } from 'lucide-react'

import React from 'react'

interface TopicItem {
  id: string
  name: string
  slug: string
  createdAt: string | Date
  _count?: {
    articles: number
    followers: number
  }
}

export default function TopicsUI({
  initialTopics,
}: {
  initialTopics: TopicItem[]
}) {
  const [topics, setTopics] = React.useState<TopicItem[]>(initialTopics)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingTopic, setEditingTopic] = React.useState<TopicItem | null>(null)
  const [name, setName] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleOpenCreate = () => {
    setEditingTopic(null)
    setName('')
    setSlug('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (topic: TopicItem) => {
    setEditingTopic(topic)
    setName(topic.name)
    setSlug(topic.slug)
    setIsModalOpen(true)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (!editingTopic) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-'),
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingTopic) {
        const updated = await updateTopic(editingTopic.id, { name, slug })
        setTopics((prev) =>
          prev.map((item) =>
            item.id === editingTopic.id ? { ...item, ...updated } : item,
          ),
        )
      } else {
        const created = await createTopic({ name, slug })
        if (created) setTopics((prev) => [created, ...prev])
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to save topic:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return
    await deleteTopic(id)
    setTopics((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className='p-4 sm:p-6 md:p-10 space-y-6 bg-[#F8F6F0] min-h-screen text-[#1A1A18]'>
      <div className='flex justify-between items-center bg-white p-6 rounded-3xl border border-[#E0DCD5] shadow-xs'>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-amber-50 text-amber-600 rounded-2xl'>
            <Hash size={22} />
          </div>
          <div>
            <h1 className='text-xl sm:text-2xl font-serif font-bold text-[#1A1A18]'>
              Topics
            </h1>
            <p className='text-xs text-[#6B6860] font-serif italic mt-0.5'>
              Manage post tags, subject areas, and user interests
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A18] hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors'
        >
          <Plus size={16} /> Add Topic
        </button>
      </div>

      <div className='bg-white rounded-3xl border border-[#E0DCD5] shadow-xs overflow-hidden'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b border-[#E0DCD5] bg-[#FAF8F5] text-xs font-semibold text-[#6B6860]'>
              <th className='p-4 pl-6'>Topic Name</th>
              <th className='p-4'>Slug</th>
              <th className='p-4 text-center'>Articles</th>
              <th className='p-4 text-center'>Followers</th>
              <th className='p-4 pr-6 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#E0DCD5] text-sm'>
            {topics.map((topic) => (
              <tr
                key={topic.id}
                className='hover:bg-[#FAF8F5] transition-colors'
              >
                <td className='p-4 pl-6 font-medium text-[#1A1A18] flex items-center gap-2'>
                  <span className='text-[#8C887B] font-mono'>#</span>
                  {topic.name}
                </td>
                <td className='p-4 text-xs font-mono text-[#8C887B]'>
                  {topic.slug}
                </td>
                <td className='p-4 text-center'>
                  <span className='px-2.5 py-1 bg-[#FAF8F5] border border-[#E0DCD5] rounded-lg text-xs font-semibold'>
                    {topic._count?.articles ?? 0}
                  </span>
                </td>
                <td className='p-4 text-center'>
                  <span className='px-2.5 py-1 bg-[#FAF8F5] border border-[#E0DCD5] rounded-lg text-xs font-semibold'>
                    {topic._count?.followers ?? 0}
                  </span>
                </td>
                <td className='p-4 pr-6 text-right space-x-2'>
                  <button
                    onClick={() => handleOpenEdit(topic)}
                    className='p-2 text-[#6B6860] hover:text-[#1A1A18] hover:bg-gray-100 rounded-xl transition-colors'
                    title='Edit Topic'
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(topic.id)}
                    className='p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors'
                    title='Delete Topic'
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {topics.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className='p-8 text-center text-xs text-[#8C887B]'
                >
                  No topics found. Click &quot;Add Topic&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs'>
          <div className='bg-white rounded-3xl p-6 max-w-md w-full border border-[#E0DCD5] shadow-xl space-y-4'>
            <h2 className='text-lg font-serif font-bold text-[#1A1A18] border-b border-[#E0DCD5] pb-3'>
              {editingTopic ? 'Edit Topic' : 'Create New Topic'}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-[#6B6860] mb-1.5'>
                  Topic Name
                </label>
                <input
                  type='text'
                  value={name}
                  onChange={handleNameChange}
                  required
                  placeholder='e.g. Next.js'
                  className='w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E0DCD5] rounded-xl text-sm focus:outline-none focus:border-amber-500'
                />
              </div>

              <div>
                <label className='block text-xs font-semibold text-[#6B6860] mb-1.5'>
                  Slug
                </label>
                <input
                  type='text'
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder='e.g. next-js'
                  className='w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E0DCD5] rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500'
                />
              </div>

              <div className='flex justify-end gap-2 pt-2'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='px-5 py-2.5 bg-[#1A1A18] hover:bg-black text-white rounded-xl text-xs font-semibold disabled:opacity-50'
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingTopic
                      ? 'Update Topic'
                      : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
