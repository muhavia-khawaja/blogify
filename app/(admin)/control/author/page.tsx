'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Users,
  Search,
  Trash2,
  Mail,
  Calendar,
  FileText,
  Bookmark,
  UserCheck,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { getUsers, deleteUser } from '@/utils/admin/action'

interface UserItem {
  id: string
  name: string
  email: string
  image?: string | null
  createdAt: string | Date
  _count?: {
    articles: number
    savedArticles: number
    followers: number
    following: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadUsers = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setError('')

      const result = await getUsers()

      setUsers(result ?? [])
    } catch (error) {
      console.error('Failed to load users:', error)

      setError(error instanceof Error ? error.message : 'Failed to load users.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return users
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      )
    })
  }, [users, searchQuery])

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${name}"? This action cannot be undone.`,
    )

    if (!confirmed) return

    setIsDeleting(id)
    setError('')
    setSuccess('')

    try {
      await deleteUser(id)

      setUsers((prev) => prev.filter((user) => user.id !== id))

      setSuccess('User deleted successfully.')

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (error) {
      console.error('Failed to delete user:', error)

      setError(
        error instanceof Error ? error.message : 'Failed to delete user.',
      )
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return 'Unknown date'
    }
  }

  const totalArticles = users.reduce(
    (total, user) => total + (user._count?.articles ?? 0),
    0,
  )

  const totalSaved = users.reduce(
    (total, user) => total + (user._count?.savedArticles ?? 0),
    0,
  )

  const totalFollowers = users.reduce(
    (total, user) => total + (user._count?.followers ?? 0),
    0,
  )

  return (
    <div className='min-h-screen bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
      <div className='mx-auto max-w-[1600px] space-y-6'>
        {/* -----------------------------------------
            Header
        ----------------------------------------- */}
        <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
          <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
            {/* Title */}
            <div className='flex items-start gap-3'>
              <div className='shrink-0 rounded-2xl bg-amber-50 p-3 text-amber-600'>
                <Users size={22} />
              </div>

              <div>
                <h1 className='font-serif text-xl font-bold text-[#1A1A18] sm:text-2xl'>
                  Users
                </h1>

                <p className='mt-0.5 text-xs italic text-[#6B6860]'>
                  Manage registered accounts, author contributions, and activity
                </p>
              </div>
            </div>

            {/* Search + Refresh */}
            <div className='flex w-full flex-col gap-3 sm:flex-row xl:w-auto'>
              {/* Search */}
              <div className='relative w-full sm:w-72'>
                <Search
                  size={16}
                  className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]'
                />

                <input
                  type='text'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder='Search by name or email...'
                  className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-xs text-[#1A1A18] outline-none transition placeholder:text-[#8C887B] focus:border-amber-500'
                />
              </div>

              {/* Refresh */}
              <button
                type='button'
                onClick={() => loadUsers(true)}
                disabled={isRefreshing || isLoading}
                className='inline-flex items-center justify-center gap-2 rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] px-4 py-2.5 text-xs font-semibold text-[#4A4843] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50'
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* -----------------------------------------
            Alerts
        ----------------------------------------- */}
        {error && (
          <div className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
            {error}
          </div>
        )}

        {success && (
          <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
            {success}
          </div>
        )}

        {/* -----------------------------------------
            Stats
        ----------------------------------------- */}
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Total Users</p>

            <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
              {users.length}
            </p>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Articles</p>

            <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
              {totalArticles}
            </p>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Saved Articles</p>

            <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
              {totalSaved}
            </p>
          </div>

          <div className='rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm'>
            <p className='text-xs font-medium text-[#8C887B]'>Followers</p>

            <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
              {totalFollowers}
            </p>
          </div>
        </div>

        {/* -----------------------------------------
            Users Table
        ----------------------------------------- */}
        <div className='overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-sm'>
          {/* Mobile heading */}
          <div className='flex items-center justify-between border-b border-[#E0DCD5] bg-[#FAF8F5] px-5 py-4 lg:hidden'>
            <div>
              <h2 className='text-sm font-bold text-[#1A1A18]'>Users</h2>

              <p className='mt-0.5 text-xs text-[#8C887B]'>
                {filteredUsers.length} user
                {filteredUsers.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className='flex min-h-[320px] items-center justify-center'>
              <div className='flex flex-col items-center gap-3'>
                <Loader2 size={28} className='animate-spin text-amber-600' />

                <p className='text-sm text-[#8C887B]'>Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty */
            <div className='flex min-h-[320px] items-center justify-center px-6'>
              <div className='text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#8C887B]'>
                  {searchQuery ? <Search size={22} /> : <Users size={22} />}
                </div>

                <h3 className='text-sm font-semibold text-[#1A1A18]'>
                  {searchQuery ? 'No users found' : 'No users available'}
                </h3>

                <p className='mt-1 text-xs text-[#8C887B]'>
                  {searchQuery
                    ? 'Try changing your search criteria.'
                    : 'There are currently no registered users.'}
                </p>
              </div>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[1050px] border-collapse text-left'>
                <thead>
                  <tr className='border-b border-[#E0DCD5] bg-[#FAF8F5] text-xs font-semibold text-[#6B6860]'>
                    <th className='p-4 pl-6'>User</th>

                    <th className='p-4 text-center'>Articles</th>

                    <th className='p-4 text-center'>Saved</th>

                    <th className='p-4 text-center'>Followers</th>

                    <th className='p-4 text-center'>Following</th>

                    <th className='p-4'>Joined Date</th>

                    <th className='p-4 pr-6 text-right'>Action</th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-[#E0DCD5] text-sm'>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className='transition-colors hover:bg-[#FAF8F5]'
                    >
                      {/* User */}
                      <td className='p-4 pl-6'>
                        <div className='flex items-center gap-3'>
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className='h-9 w-9 shrink-0 rounded-full border border-[#E0DCD5] object-cover'
                            />
                          ) : (
                            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-xs font-bold text-amber-800'>
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}

                          <div className='min-w-0'>
                            <div className='flex items-center gap-1.5 font-medium text-[#1A1A18]'>
                              <span className='max-w-[200px] truncate'>
                                {user.name}
                              </span>
                            </div>

                            <div className='mt-0.5 flex max-w-[240px] items-center gap-1 truncate font-mono text-xs text-[#8C887B]'>
                              <Mail size={12} className='shrink-0' />

                              <span className='truncate'>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Articles */}
                      <td className='p-4 text-center whitespace-nowrap'>
                        <span className='inline-flex items-center gap-1 rounded-lg border border-[#E0DCD5] bg-[#FAF8F5] px-2.5 py-1 text-xs font-semibold text-[#1A1A18]'>
                          <FileText size={12} className='text-[#8C887B]' />

                          {user._count?.articles ?? 0}
                        </span>
                      </td>

                      {/* Saved */}
                      <td className='p-4 text-center whitespace-nowrap'>
                        <span className='inline-flex items-center gap-1 rounded-lg border border-[#E0DCD5] bg-[#FAF8F5] px-2.5 py-1 text-xs font-semibold text-[#1A1A18]'>
                          <Bookmark size={12} className='text-[#8C887B]' />

                          {user._count?.savedArticles ?? 0}
                        </span>
                      </td>

                      {/* Followers */}
                      <td className='p-4 text-center whitespace-nowrap'>
                        <span className='inline-flex items-center gap-1 rounded-lg border border-[#E0DCD5] bg-[#FAF8F5] px-2.5 py-1 text-xs font-semibold text-[#1A1A18]'>
                          <UserCheck size={12} className='text-[#8C887B]' />

                          {user._count?.followers ?? 0}
                        </span>
                      </td>

                      {/* Following */}
                      <td className='p-4 text-center whitespace-nowrap'>
                        <span className='inline-flex items-center gap-1 rounded-lg border border-[#E0DCD5] bg-[#FAF8F5] px-2.5 py-1 text-xs font-semibold text-[#1A1A18]'>
                          {user._count?.following ?? 0}
                        </span>
                      </td>

                      {/* Date */}
                      <td className='p-4 whitespace-nowrap text-xs text-[#8C887B]'>
                        <div className='flex items-center gap-1'>
                          <Calendar size={13} />

                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      {/* Delete */}
                      <td className='p-4 pr-6 text-right whitespace-nowrap'>
                        <button
                          type='button'
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={isDeleting === user.id}
                          className='inline-flex items-center justify-center rounded-xl p-2 text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50'
                          title='Delete User'
                        >
                          {isDeleting === user.id ? (
                            <Loader2 size={16} className='animate-spin' />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer count */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className='text-center text-xs text-[#8C887B]'>
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  )
}
