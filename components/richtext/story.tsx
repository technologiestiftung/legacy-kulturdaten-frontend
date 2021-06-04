import { Story } from '@storybook/react';
import { defaultNodeTypes, serialize } from 'remark-slate';
import { jsx } from 'slate-hyperscript';
import { CustomDescendant, RichText } from '.';
import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import marked from 'marked';

export default {
  title: 'RichText',
};

const ELEMENT_TAGS = {
  H1: () => ({ type: 'heading_one' }),
  H2: () => ({ type: 'heading_two' }),
  H3: () => ({ type: 'heading_three' }),
  LI: () => ({ type: 'list_item' }),
  OL: () => ({ type: 'ol_list' }),
  UL: () => ({ type: 'ul_list' }),
  P: () => ({ type: 'paragraph' }),
};

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
  EM: () => ({ italic: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

const deserialize = (el: ChildNode) => {
  if (el.nodeType === 3) {
    return el.textContent !== '\n' ? el.textContent : null;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;
  const parent = el;

  const children = Array.from(parent.childNodes)
    .map((ch) => deserialize(ch))
    .flat();

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx('element', attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map((child) => jsx('text', attrs, child));
  }

  return children;
};

const md = `
# Headline 1

Text

**bold**

*italic*

## Headline 2

text

1. list
1. items

- list
- items
`;

const StyledRichTextStoryWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  min-height: var(--app-height);
`;

const StyledRichTextContainer = styled.div`
  grid-column: 1 / span 1;
  padding: 1.5rem;
`;

const StyledPre = styled.pre`
  grid-column: 2 / span 1;
  min-height: 100%;
  background: var(--grey-200);
  padding: 1.5rem;
`;

const X: React.FC = () => {
  const [value, setValue] = useState<CustomDescendant[]>();

  const parseSlateToMarkdown = useMemo(
    () =>
      value && Array.isArray(value)
        ? value
            .map((v) => serialize(v, { nodeTypes: { ...defaultNodeTypes, listItem: 'list_item' } }))
            .join('')
        : '',
    [value]
  );

  useEffect(() => {
    const parsedMarkdown = marked(md);
    const document = new DOMParser().parseFromString(parsedMarkdown, 'text/html');
    const slateStructure = deserialize(document.children[0]);

    setValue(slateStructure);
  }, []);

  return (
    <StyledRichTextStoryWrapper>
      <StyledRichTextContainer>
        {Array.isArray(value) && <RichText value={value} onChange={(val) => setValue(val)} />}
      </StyledRichTextContainer>
      <StyledPre>{parseSlateToMarkdown}</StyledPre>
    </StyledRichTextStoryWrapper>
  );
};

export const RichTextDefaultStory: Story = () => <X />;
RichTextDefaultStory.storyName = 'RichText Default';
