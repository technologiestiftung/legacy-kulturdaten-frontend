import styled from '@emotion/styled'
import CharacterCount from '@tiptap/extension-character-count'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import { Ref, useState, useMemo, useEffect } from 'react'
import { useDebounce } from '../../lib/useDebounce';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import showdown from 'showdown';
import { Toolbar } from './Toolbar'
import { focusStyles } from '../globals/Constants'

const RTEWrapper = styled.div`
  grid-column: 2/-2;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  .ProseMirror {

    padding: 2rem 0.75rem;
    height: 180px;
    overflow: auto;
    margin: 0 auto;

    ${focusStyles}

    ${mq(Breakpoint.mid)} {
      padding: 2rem 2rem;
    }

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
    };

    h1 {
      font-size: var(--font-size-600);
      line-height: var(--line-height-600);
      font-weight: 700;
    },
    h2 {
      font-size: var(--font-size-400);
      line-height: var(--line-height-400);
      font-weight: 700;
    },
    h3 {
      font-size: var(--font-size-300);
      line-height: var(--line-height-300);
      font-weight: 700;
    },
    strong {
      font-weight: 700;
    },
    em {font-style: italic;},

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #adb5bd;
      pointer-events: none;
      height: 0;
    }
  }  

`;

const StyledCharacterCount = styled.div`
  padding: 0.375rem 0.75rem;
  height: 28px;
  font-size: var(--font-size-200);
  text-align: end;
`;

type RichTextEditorProps = {
  value?: string;
  ariaLabel: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  contentRef?: Ref<HTMLDivElement>;
  intValue: string;
  setIntValue: (value: string) => void;
  required?: boolean;
  softRequired?: boolean;
  valid: boolean;
  maxLength?: number;
  setTextLength: (value: number) => void;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onChange,
  placeholder,
  contentRef,
  intValue,
  required,
  valid,
  maxLength,
  ariaLabel,
  setTextLength
}: RichTextEditorProps) => {
  const debouncer = useDebounce();
  const [count, setCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({
        limit: maxLength,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'hello 123'
      }),
    ],
    onUpdate: ({editor}) => {
      const parsedValue = editor.getHTML()
      updateCount()
      debouncer(() => {
        onChange(parsedValue);
      });
    },
    autofocus: true,
    content: intValue,
  },[intValue])

  const updateCount = () => {
    const currentCount = editor?.storage?.characterCount.characters()
    setTextLength(currentCount)
    setCount(currentCount)
  }

  useEffect(() => {
    updateCount()
  });

  if (!editor) {
    return null
  }

  return (
    <>
    <RTEWrapper 
      aria-label={ariaLabel} 
      ref={contentRef} 
      tabIndex={0} 
      role="group"
    >
      <Toolbar editor={editor} />
      <EditorContent 
        editor={editor}
        aria-invalid={!valid}
        aria-required={required}
      />

      {maxLength && <StyledCharacterCount>
        {count} / {maxLength}
      </StyledCharacterCount>}
    </RTEWrapper>
    </>
  )
}
export const emptyRichTextValue = 'hello';

export const useRichText = (
  props: Pick<
    RichTextEditorProps,
    'value' | 'placeholder' | 'onChange' | 'contentRef' | 'required' | 'softRequired' | 'maxLength' | 'ariaLabel'
  >
): {
  renderedRichText: React.ReactElement<RichTextEditorProps>;
  init: (value: RichTextEditorProps['value']) => void;
  valid: boolean;
  textLength: number;
} => {
  const [intValue, setIntValue] = useState<string>();

  const hasText = intValue ? true : false


  const [textLength, setTextLength] = useState(intValue ? intValue.length : 0)

  const valid = useMemo(() => props.required !== true || hasText, [hasText, props?.required]);


  const converter = new showdown.Converter();

  return {
    renderedRichText: (
      <RichTextEditor
        {...props}
        intValue={intValue}
        setIntValue={setIntValue}
        valid={valid}
        setTextLength={setTextLength}
        ariaLabel={props.ariaLabel}
      />
    ),
    init: (value) => {
      setIntValue(converter.makeHtml(value));
    },
    valid,
    textLength,
  };
};