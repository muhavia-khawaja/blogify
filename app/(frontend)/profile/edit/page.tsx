import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Camera, Save, User } from 'lucide-react'
import { getCurrentUser, updateProfile } from '@/utils/actions'
import ImageUpload from '@/components/ImageUpload'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Profile | Education With Hamza',
  description: 'Update your Education With Hamza author profile.',
  robots: { index: false, follow: false },
}

export default async function EditProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <main className='min-h-screen bg-[#f8f9fc] px-5 py-10 sm:px-8 lg:px-10'>
      <div className='mx-auto max-w-4xl'>
        <Link
          href='/profile'
          className='inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#3d348b]'
        >
          <ArrowLeft className='h-4 w-4' /> Back to profile
        </Link>
        <div className='mb-8 mt-8'>
          <p className='text-xs font-bold uppercase tracking-widest text-[#7678ed]'>
            Account
          </p>
          <h1 className='mt-2 text-3xl font-black tracking-tight text-gray-950'>
            Edit your profile
          </h1>
          <p className='mt-2 text-sm text-gray-500'>
            Keep your author profile current for readers.
          </p>
        </div>
        <form
          action={updateProfile}
          encType='multipart/form-data'
          className='grid gap-8 lg:grid-cols-[1fr_280px]'
        >
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8'>
            <label htmlFor='name' className='text-sm font-bold text-gray-700'>
              Display name
            </label>
            <input
              id='name'
              name='name'
              defaultValue={user.name}
              required
              className='mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-lg outline-none transition focus:border-[#7678ed] focus:ring-2 focus:ring-[#7678ed]/15'
            />
            <p className='mt-2 text-xs text-gray-400'>
              This name appears beside your articles and on your author page.
            </p>
          </div>
          <aside className='space-y-5'>
            <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='flex items-center gap-2 text-sm font-bold text-gray-700'>
                <Camera className='h-4 w-4 text-[#7678ed]' /> Profile photo
              </div>
              <div className='relative mx-auto my-5 h-28 w-28 overflow-hidden rounded-full bg-gray-100 ring-4 ring-white shadow-md'>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center text-gray-400'>
                    <User className='h-9 w-9' />
                  </div>
                )}
              </div>
              <ImageUpload name='image' />
            </div>
            <button
              type='submit'
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3d348b]/20 transition hover:bg-[#30286f]'
            >
              <Save className='h-4 w-4' /> Save changes
            </button>
          </aside>
        </form>
      </div>
    </main>
  )
}
