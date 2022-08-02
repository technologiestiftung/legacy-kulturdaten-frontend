import styled from '@emotion/styled'
import CharacterCount from '@tiptap/extension-character-count'
import Highlight from '@tiptap/extension-highlight'
import History from '@tiptap/extension-history'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { useRef } from 'react'

const limit = 280

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        undo
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        redo
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
        h1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
        h2
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
        h3
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        toggleBulletList
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        toggleOrderedList
      </button>

      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
        bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
        italic
      </button>
    </>
  )
}

const RTEWrapper = styled.div`
  grid-column: 2/-2;
  width: 100%;

  &:focus{
    outline: solid 2px blue;
  };

  .ProseMirror {
    > * + * {
      margin-top: 0.75em;
    };
  
    ul {
      padding: 0 1rem;
      list-style: inherit;
    };

    ol {
      padding: 0 1rem;
      list-style: decimal;
    };

    p {
      font-size: var(--font-size-300);
      line-height: var(--line-height-300);
      padding-bottom: var(--line-height-300);
    };

    h1 {
      font-size: var(--font-size-600);
      line-height: var(--line-height-600);
      font-weight: 700;
      padding-bottom: var(--line-height-600);
    },
    h2 {
      font-size: var(--font-size-400);
      line-height: var(--line-height-400);
      font-weight: 700;
      padding-bottom: var(--line-height-400);
    },
    h3 {
      font-size: var(--font-size-300);
      line-height: var(--line-height-300);
      font-weight: 700;
      padding-bottom: var(--line-height-300);
    },
    strong {
      font-weight: 700;
    },
    em {font-style: italic;},
  }  

`;

const StyledCharacterCount = styled.div`
  color: #868e96;
  margin-top: 1rem;
`;

const FocusButton = styled.button`
  grid-column: 2/-2;
`;

export const RichTextEditor = () => {
  const editorRef = useRef(null)
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit,
      }),
    ],
    content: `
    <p>
      I like lists. Let’s add one:
      <ol>
        <li>This is a bullet list.</li>
        <li>And it has three list items.</li>
        <li>Here is the third one.</li>
      </ol>
      <p>
        Do you want to see one more? I bet! Here is another one:
      </p>
      <ul>
        <li>That’s a different list, actually it’s an ordered list.</li>
        <li>It also has three list items.</li>
        <li>And all of them are numbered.</li>
      </ul>
    </p>
      `,
  })

  if (!editor) {
    return null
  }

  return (
    <>
    <FocusButton onClick={() => editorRef.current.focus()}>focus</FocusButton>
    <RTEWrapper aria-label="this is an RT-Editor" ref={editorRef} tabIndex={0}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      <StyledCharacterCount>
        {editor.storage.characterCount.characters()}/{limit} characters
      </StyledCharacterCount>
    </RTEWrapper>
    </>
  )
}

