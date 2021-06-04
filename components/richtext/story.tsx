import { Story } from '@storybook/react';
import unified from 'unified';
import markdown from 'remark-parse';
import slate, { defaultNodeTypes, serialize } from 'remark-slate';

import { CustomDescendant, RichText } from '.';
import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';

export default {
  title: 'RichText',
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

  const serializeMarkdown = async () => {
    const ser = await unified().use(markdown).use(slate).process(md);
    setValue((ser.result as unknown) as CustomDescendant[]);
  };

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
    serializeMarkdown();
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
