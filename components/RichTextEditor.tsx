'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Minus,
  Undo,
  Redo,
} from 'lucide-react'

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const btn = (active: boolean) =>
    `w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
      active
        ? 'bg-emerald-100 text-emerald-700'
        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
    }`

  const divider = <div className='w-px h-5 bg-gray-100 mx-1 self-center' />

  return (
    <div className='flex flex-wrap items-center gap-1 px-4 py-3 border-b border-gray-100 bg-[#FAFAF9] rounded-t-2xl'>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive('bold'))}
        title='Bold'
      >
        <Bold size={15} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive('italic'))}
        title='Italic'
      >
        <Italic size={15} />
      </button>

      {divider}

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btn(editor.isActive('heading', { level: 1 }))}
        title='Heading 1'
      >
        <Heading1 size={15} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btn(editor.isActive('heading', { level: 2 }))}
        title='Heading 2'
      >
        <Heading2 size={15} />
      </button>

      {divider}

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive('bulletList'))}
        title='Bullet list'
      >
        <List size={15} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive('orderedList'))}
        title='Ordered list'
      >
        <ListOrdered size={15} />
      </button>

      {divider}

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive('blockquote'))}
        title='Blockquote'
      >
        <Quote size={15} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btn(false)}
        title='Divider'
      >
        <Minus size={15} />
      </button>

      {divider}

      <button
        type='button'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`${btn(false)} disabled:opacity-30`}
        title='Undo'
      >
        <Undo size={15} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`${btn(false)} disabled:opacity-30`}
        title='Redo'
      >
        <Redo size={15} />
      </button>

      <div className='ml-auto text-[9px] font-black uppercase tracking-widest text-gray-300'>
        {editor.getText().trim().split(/\s+/).filter(Boolean).length} words
      </div>
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
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Begin your manuscript here...',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'rich-editor-content focus:outline-none min-h-[480px] px-8 py-6',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <>
      <style>{`
        /* ── Base text — force black, defeat DaisyUI ── */
        .rich-editor-content,
        .rich-editor-content * {
          color: #1A1A1A !important;
        }

        /* Placeholder */
        .rich-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #C4C4C4;
          font-style: italic;
          font-family: Georgia, serif;
          pointer-events: none;
          float: left;
          height: 0;
        }

        /* Paragraphs */
        .rich-editor-content p {
          font-family: Georgia, serif;
          font-size: 1.125rem;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          color: #1A1A1A !important;
        }

        /* Headings */
        .rich-editor-content h1 {
          font-family: Georgia, serif;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #0F0F0F !important;
        }
        .rich-editor-content h2 {
          font-family: Georgia, serif;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #0F0F0F !important;
        }
        .rich-editor-content h3 {
          font-family: Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #0F0F0F !important;
        }

        /* Bold & Italic */
        .rich-editor-content strong {
          font-weight: 700;
          color: #0F0F0F !important;
        }
        .rich-editor-content em {
          font-style: italic;
          color: #1A1A1A !important;
        }

        /* Lists */
        .rich-editor-content ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin-bottom: 1.5rem;
        }
        .rich-editor-content ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin-bottom: 1.5rem;
        }
        .rich-editor-content li {
          font-family: Georgia, serif;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 0.4rem;
          color: #1A1A1A !important;
        }

        /* Blockquote */
        .rich-editor-content blockquote {
          border-left: 3px solid #10b981;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #4B5563 !important;
          font-size: 1.15rem;
          line-height: 1.85;
        }
        .rich-editor-content blockquote * {
          color: #4B5563 !important;
        }

        /* Horizontal rule */
        .rich-editor-content hr {
          border: none;
          border-top: 1px solid #E5E7EB;
          margin: 2.5rem 0;
        }

        /* Code */
        .rich-editor-content code {
          background: #F3F4F6;
          border-radius: 4px;
          padding: 0.15em 0.4em;
          font-size: 0.9em;
          color: #059669 !important;
          font-family: monospace;
        }
        .rich-editor-content pre {
          background: #0F0F0F;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
          overflow-x: auto;
        }
        .rich-editor-content pre code {
          background: transparent;
          color: #D1FAE5 !important;
          font-size: 0.9rem;
          padding: 0;
        }
      `}</style>

      <div className='w-full rounded-2xl border border-gray-100 bg-white transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50 overflow-hidden'>
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </>
  )
}
