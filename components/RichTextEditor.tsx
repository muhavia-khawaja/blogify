'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Type,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
} from 'lucide-react'

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const btnClass = (active: boolean) =>
    `p-2 rounded-lg transition-colors ${active ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:bg-gray-100'}`

  return (
    <div className='flex flex-wrap gap-2 mb-4 p-2 border-b border-gray-100'>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
      >
        <Bold size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
      >
        <Italic size={18} />
      </button>
      <div className='w-px h-6 bg-gray-200 mx-1' />
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive('heading', { level: 1 }))}
      >
        <Heading1 size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
      >
        <Heading2 size={18} />
      </button>
      <div className='w-px h-6 bg-gray-200 mx-1' />
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
      >
        <List size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
      >
        <ListOrdered size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
      >
        <Quote size={18} />
      </button>
    </div>
  )
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-emerald max-w-none focus:outline-none min-h-[400px] font-serif text-lg leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className='w-full rounded-[2.5rem] border border-gray-100 bg-white px-8 py-4 transition-all focus-within:border-emerald-400'>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
