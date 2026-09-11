'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Mail,
  Search,
  Trash2,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { getContacts, deleteSingleContact } from '@/utils/admin/action'

interface ContactItem {
  id: string
  name: string
  email: string
  message: string
  createdAt: string | Date
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadContacts = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setError('')

      const result = await getContacts()

      setContacts(result ?? [])
    } catch (error) {
      console.error('Failed to load contacts:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load contact messages.',
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    if (!q) return contacts

    return contacts.filter((contact) => {
      return (
        contact.name?.toLowerCase().includes(q) ||
        contact.email?.toLowerCase().includes(q) ||
        contact.message?.toLowerCase().includes(q)
      )
    })
  }, [contacts, searchQuery])

  const handleDelete = async (id: string) => {
    const contact = contacts.find((item) => item.id === id)

    const confirmed = window.confirm(
      `Are you sure you want to delete the message from "${
        contact?.name || 'this contact'
      }"? This action cannot be undone.`,
    )

    if (!confirmed) return

    try {
      setIsDeleting(id)
      setError('')
      setSuccess('')

      await deleteSingleContact(id)

      setContacts((prev) => prev.filter((item) => item.id !== id))

      setSuccess('Contact message deleted successfully.')

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (error) {
      console.error('Failed to delete contact:', error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete contact message.',
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

  const totalContacts = contacts.length

  const todayContacts = contacts.filter((contact) => {
    const date = new Date(contact.createdAt)
    const today = new Date()

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }).length

  const thisMonthContacts = contacts.filter((contact) => {
    const date = new Date(contact.createdAt)
    const today = new Date()

    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }).length

  return (
    <div className='min-h-screen space-y-6 bg-[#F8F6F0] p-4 text-[#1A1A18] sm:p-6 md:p-10'>
      {/* Header */}
      <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm sm:p-6'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex items-center gap-3'>
            <div className='rounded-2xl bg-amber-50 p-3 text-amber-600'>
              <Mail size={22} />
            </div>

            <div>
              <h1 className='font-serif text-xl font-bold text-[#1A1A18] sm:text-2xl'>
                Contact Messages
              </h1>

              <p className='mt-0.5 text-xs italic text-[#6B6860]'>
                Inquiries and messages sent via the contact form
              </p>
            </div>
          </div>

          <div className='flex w-full flex-col gap-3 sm:flex-row lg:w-auto'>
            {/* Search */}
            <div className='relative w-full sm:w-72'>
              <Search
                size={16}
                className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C887B]'
              />

              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search messages...'
                className='w-full rounded-xl border border-[#E0DCD5] bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-xs text-[#1A1A18] placeholder-[#8C887B] focus:border-amber-500 focus:outline-none'
              />
            </div>

            {/* Refresh */}
            <button
              type='button'
              onClick={() => loadContacts(true)}
              disabled={isRefreshing}
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-[#E0DCD5] bg-white px-4 py-2.5 text-xs font-medium text-[#4A4843] transition hover:bg-[#FAF8F5] disabled:cursor-not-allowed disabled:opacity-60'
            >
              <RefreshCw
                size={15}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700'>
          <div className='mt-0.5 shrink-0'>
            <MessageSquare size={17} />
          </div>

          <div className='flex-1'>
            <p className='font-semibold'>Something went wrong</p>
            <p className='mt-0.5 text-xs'>{error}</p>
          </div>

          <button
            type='button'
            onClick={() => setError('')}
            className='text-xs font-medium hover:underline'
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className='flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700'>
          <CheckCircle size={18} />
          <span className='text-xs font-medium'>{success}</span>
        </div>
      )}

      {/* Stats */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {/* Total */}
        <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-[#8C887B]'>
                Total Messages
              </p>

              <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
                {totalContacts}
              </p>
            </div>

            <div className='rounded-2xl bg-amber-50 p-3 text-amber-600'>
              <MessageSquare size={20} />
            </div>
          </div>
        </div>

        {/* Today */}
        <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-[#8C887B]'>
                Received Today
              </p>

              <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
                {todayContacts}
              </p>
            </div>

            <div className='rounded-2xl bg-emerald-50 p-3 text-emerald-600'>
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Month */}
        <div className='rounded-3xl border border-[#E0DCD5] bg-white p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-[#8C887B]'>This Month</p>

              <p className='mt-1 text-2xl font-bold text-[#1A1A18]'>
                {thisMonthContacts}
              </p>
            </div>

            <div className='rounded-2xl bg-blue-50 p-3 text-blue-600'>
              <Calendar size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-sm'>
        <div className='flex flex-col gap-3 border-b border-[#E0DCD5] bg-[#FAF8F5] p-5 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-sm font-bold text-[#1A1A18]'>
              Contact Messages
            </h2>

            <p className='mt-1 text-xs text-[#8C887B]'>
              {isLoading
                ? 'Loading messages...'
                : `${filteredContacts.length} message${
                    filteredContacts.length === 1 ? '' : 's'
                  } found`}
            </p>
          </div>

          {searchQuery && !isLoading && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='self-start text-xs font-medium text-amber-600 hover:underline sm:self-auto'
            >
              Clear search
            </button>
          )}
        </div>

        {isLoading ? (
          <div className='flex min-h-[300px] items-center justify-center'>
            <div className='flex flex-col items-center gap-3 text-[#8C887B]'>
              <Loader2 size={28} className='animate-spin text-amber-600' />
              <p className='text-xs'>Loading contact messages...</p>
            </div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className='flex min-h-[300px] flex-col items-center justify-center px-6 text-center'>
            <div className='rounded-2xl bg-[#FAF8F5] p-4 text-[#8C887B]'>
              {searchQuery ? <Search size={24} /> : <MessageSquare size={24} />}
            </div>

            <h3 className='mt-4 text-sm font-semibold text-[#4A4843]'>
              {searchQuery ? 'No messages found' : 'No contact messages yet'}
            </h3>

            <p className='mt-1 max-w-sm text-xs leading-relaxed text-[#8C887B]'>
              {searchQuery
                ? 'Try changing your search keywords.'
                : 'Messages submitted through your contact form will appear here.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop / Tablet Table */}
            <div className='hidden overflow-x-auto md:block'>
              <table className='w-full border-collapse text-left'>
                <thead>
                  <tr className='border-b border-[#E0DCD5] bg-[#FAF8F5] text-xs font-semibold text-[#6B6860]'>
                    <th className='whitespace-nowrap p-4 pl-6'>Sender</th>

                    <th className='min-w-[300px] p-4'>Message</th>

                    <th className='whitespace-nowrap p-4'>Received</th>

                    <th className='p-4 pr-6 text-right'>Action</th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-[#E0DCD5] text-sm'>
                  {filteredContacts.map((item) => (
                    <tr
                      key={item.id}
                      className='transition-colors hover:bg-[#FAF8F5]'
                    >
                      <td className='p-4 pl-6 align-top'>
                        <div className='min-w-[180px]'>
                          <div className='font-medium text-[#1A1A18]'>
                            {item.name}
                          </div>

                          <div className='mt-1 flex items-center gap-1.5 text-xs text-[#8C887B]'>
                            <Mail size={12} />
                            <span className='break-all font-mono'>
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className='p-4 align-top'>
                        <div className='max-w-2xl'>
                          <p className='line-clamp-3 text-xs leading-relaxed text-[#4A4843]'>
                            {item.message}
                          </p>
                        </div>
                      </td>

                      <td className='p-4 align-top text-xs text-[#8C887B]'>
                        <div className='flex items-center gap-1.5 whitespace-nowrap'>
                          <Calendar size={13} />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>

                      <td className='p-4 pr-6 text-right align-top'>
                        <button
                          type='button'
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting === item.id}
                          className='rounded-xl p-2 text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50'
                          title='Delete Message'
                        >
                          {isDeleting === item.id ? (
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

            {/* Mobile Cards */}
            <div className='divide-y divide-[#E0DCD5] md:hidden'>
              {filteredContacts.map((item) => (
                <div
                  key={item.id}
                  className='p-5 transition-colors hover:bg-[#FAF8F5]'
                >
                  {/* Sender */}
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate text-sm font-semibold text-[#1A1A18]'>
                        {item.name}
                      </h3>

                      <div className='mt-1 flex items-start gap-1.5 text-xs text-[#8C887B]'>
                        <Mail size={12} className='mt-0.5 shrink-0' />

                        <span className='break-all font-mono'>
                          {item.email}
                        </span>
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                      className='shrink-0 rounded-xl p-2 text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50'
                      title='Delete Message'
                    >
                      {isDeleting === item.id ? (
                        <Loader2 size={16} className='animate-spin' />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>

                  {/* Message */}
                  <div className='mt-4 rounded-2xl border border-[#E0DCD5] bg-[#FAF8F5] p-4'>
                    <div className='mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8C887B]'>
                      <MessageSquare size={12} />
                      Message
                    </div>

                    <p className='text-xs leading-relaxed text-[#4A4843]'>
                      {item.message}
                    </p>
                  </div>

                  {/* Date */}
                  <div className='mt-3 flex items-center gap-1.5 text-xs text-[#8C887B]'>
                    <Calendar size={13} />
                    Received {formatDate(item.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
