'use client'
import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import HardBreak from '@tiptap/extension-hard-break'
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { Editor as TipTapCoreEditor } from '@tiptap/core'
import { useGetIsMounted } from '@hooks/use-get-is-mounted'
import { useBoxedCallback } from '@hooks/use-boxed-callback'
import { pastedHTMLToHTML } from './pasted-html-to-html'
import { plainTextToHtml } from './plain-text-to-html'
import { proseMirrorToPlainText } from './prose-mirror-to-plain-text'
import styles from './style.module.scss'

/*
    ContentEditable checker

    1. paste
      - paste
      - paste within selection
      - paste contents from html, plaintext, vscode, etc.
    2. undo
      - paste -> undo
      - paste within selection -> undo
    3. cjk composition
      - ios safari
      - android chrome
      - various keyboards
      - composition state -> erase -> complete
      - composition state -> newline -> complete
*/

export const ContentEditable = ({
  onChange,
  defaultValue,
  onFocus,
  onBlur,
  placeholder,
  editorRef,
  className,
}: {
  onChange: (value: string) => void
  defaultValue?: string
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  editorRef?: React.MutableRefObject<TipTapCoreEditor | null>
  className?: string
}) => {
  /*
    defaultValue and placeholder
    */

  const getIsMounted = useGetIsMounted()

  // debounced onChange
  const debounceCounter = React.useRef(0)
  const onChangeWrapper = useBoxedCallback(
    ({ editor }: { editor: TipTapCoreEditor }) => {
      debounceCounter.current += 1
      const myCounter = debounceCounter.current

      window.setTimeout(() => {
        if (debounceCounter.current === myCounter) {
          if (getIsMounted() && editor) {
            const plainText = proseMirrorToPlainText(editor.state.doc)
            onChange(plainText)
          }
        }
      }, 100)
    },
    [onChange, getIsMounted],
  )

  const onFocusWrapper = useBoxedCallback(() => {
    onFocus?.()
  }, [onFocus])

  const onBlurWrapper = useBoxedCallback(() => {
    onBlur?.()
  }, [onBlur])

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      HardBreak,
      Text,
      History,
      Placeholder.configure({ placeholder }),
    ],
    parseOptions: {
      preserveWhitespace: `full`,
    },
    editorProps: {
      transformPastedHTML: pastedHTMLToHTML,
    },
    content: ``,
    onUpdate: onChangeWrapper,
    onFocus: onFocusWrapper,
    onBlur: onBlurWrapper,
  })

  React.useMemo(() => {
    if (editorRef) {
      /* eslint-disable-next-line no-param-reassign */
      editorRef.current = editor
    }
  }, [editorRef, editor])

  React.useEffect(() => {
    if (editor) {
      const html = plainTextToHtml(defaultValue || ``)
      editor.chain().clearContent().setContent(html).run()
    }
  }, [editor, defaultValue])

  return (
    <EditorContent
      className={`${styles.editorWrapper} ${className || ``}`}
      editor={editor}
    />
  )
}
