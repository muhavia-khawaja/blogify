import ReplyModal from '@/components/ReplyModal'
import { getContacts, deleteContact } from '@/utils/actions'
import { Mail, Trash2, User, Calendar, MessageSquare } from 'lucide-react'

export default async function ContactPage() {
  const contacts = await getContacts()

  return (
    <div className='max-w-6xl mx-auto py-10 px-6'>
      <div className='flex items-center gap-4 mb-10'>
        <div className='p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-100'>
          <Mail size={28} />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Inbox</h1>
          <p className='text-gray-500 text-sm'>
            Manage user inquiries and feedback
          </p>
        </div>
      </div>

      <div className='grid gap-6'>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow'
          >
            <div className='flex flex-col md:flex-row justify-between gap-4'>
              <div className='space-y-4 flex-1'>
                <div className='flex flex-wrap items-center gap-4'>
                  <div className='flex items-center gap-2 text-sm font-bold text-gray-800'>
                    <User size={16} className='text-amber-500' /> {contact.name}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <Mail size={16} /> {contact.email}
                  </div>
                  <div className='flex items-center gap-2 text-xs text-gray-400 font-medium'>
                    <Calendar size={14} />{' '}
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className='bg-gray-50 p-4 rounded-2xl border border-gray-50'>
                  <p className='text-gray-600 leading-relaxed italic'>
                    {contact.message}
                  </p>
                </div>
              </div>

              <div className='flex md:flex-col items-center gap-2'>
                <ReplyModal
                  targetEmail={contact.email}
                  targetName={contact.name}
                />

                <form action={deleteContact}>
                  <input type='hidden' name='id' value={contact.id} />
                  <button className='p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors'>
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className='text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed'>
            <MessageSquare size={48} className='mx-auto text-gray-200 mb-4' />
            <p className='text-gray-400'>No messages found in your inbox.</p>
          </div>
        )}
      </div>
    </div>
  )
}
