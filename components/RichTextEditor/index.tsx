import styled from '@emotion/styled'
import CharacterCount from '@tiptap/extension-character-count'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'
import { useRef, Ref } from 'react'
import { htmlToMarkdown, markdownToSlate, } from '../richtext/parser'

import { Toolbar } from './Toolbar'
import { CustomDescendant, CustomElement, ElementType, Element, CustomText } from '../richtext/Element';


const RTEWrapper = styled.div`
  grid-column: 2/-2;
  width: 100%;
  min-height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;

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

type RichTextEditorProps = {
  value?: CustomDescendant[];
  onChange?: (value: CustomDescendant[]) => void;
  placeholder?: string;
  contentRef?: Ref<HTMLDivElement>;
  intValue: CustomDescendant[];
  setIntValue: (value: CustomDescendant[]) => void;
  required?: boolean;
  softRequired?: boolean;
  valid: boolean;
  textLength: number;
  maxLength?: number;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onChange,
  placeholder,
  contentRef,
  intValue,
  setIntValue,
  required,
  valid,
  maxLength,
}: RichTextEditorProps) => {
  const editorRef = useRef(null)
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    onUpdate: ({ editor }) => {
      setIntValue(markdownToSlate(editor.getHTML()))
      // send the content to an API here
    },
    autofocus: true,
    content: <p></p>,
  })

  if (!editor) {
    return null
  }

  return (
    <>
    <FocusButton onClick={() => editorRef.current.focus()}>focus</FocusButton>
    <RTEWrapper aria-label="this is an RT-Editor" ref={editorRef} tabIndex={0} role="group">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />

        {maxLength && <StyledCharacterCount>
          {editor.storage.characterCount.characters()}/{maxLength} characters
        </StyledCharacterCount>}
      </RTEWrapper>
    </>
  )
}

