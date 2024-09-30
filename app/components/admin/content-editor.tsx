// app/components/admin/content-editor.tsx

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

type ContentEditorProps = {
  content?: string
  onChange: (content: string) => void
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ content = '', onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return <EditorContent editor={editor} />
}