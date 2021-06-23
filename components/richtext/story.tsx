import { Story } from '@storybook/react';
import { CustomDescendant, useRichText } from '.';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useOverlay } from '../overlay';
import { Button } from '../button';
import { OverlayTitleBar } from '../overlay/OverlayTitleBar';
import { OverlayContainer } from '../overlay/OverlayContainer';
import { htmlToMarkdown, markdownToSlate } from './parser';

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

const StyledRichTextWrapper = styled.div`
  grid-column: 1 / span 1;
  padding: 1.5rem;
`;
const StyledRichTextContainer = styled.div`
  border: 1px solid var(--black);
`;

const StyledPre = styled.pre`
  grid-column: 2 / span 1;
  min-height: 100%;
  background: var(--grey-200);
  padding: 1.5rem;
  word-break: break-all;
  overflow-x: auto;
`;

const X: React.FC = () => {
  const [value, setValue] = useState<CustomDescendant[]>();

  useEffect(() => {
    const slateStructure = markdownToSlate(md);

    setValue(slateStructure);
  }, []);

  const { renderedRichText } = useRichText({ value, onChange: (val) => setValue(val) });

  return (
    <StyledRichTextWrapper>
      <StyledRichTextContainer>{Array.isArray(value) && renderedRichText}</StyledRichTextContainer>
    </StyledRichTextWrapper>
  );
};

export const RichTextDefaultStory: Story = () => <X />;
RichTextDefaultStory.storyName = 'RichText Default';

const RichTextInOverlayComponent: React.FC = () => {
  const [value, setValue] = useState<CustomDescendant[]>();

  useEffect(() => {
    const slateStructure = markdownToSlate(md);

    setValue(slateStructure);
  }, []);

  const { renderedRichText } = useRichText({ value, onChange: (val) => setValue(val) });

  const { renderedOverlay, setIsOpen } = useOverlay(
    <OverlayContainer>
      <OverlayTitleBar title="Example RichText overlay" />
      {Array.isArray(value) && renderedRichText}
    </OverlayContainer>,
    true
  );

  return (
    <div>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Overlay öffnen
      </Button>
      {renderedOverlay}
    </div>
  );
};

export const RichTextInOverlayStory: Story = () => <RichTextInOverlayComponent />;
RichTextInOverlayStory.storyName = 'RichText in Overlay';

const Y: React.FC = () => {
  const [value, setValue] = useState<CustomDescendant[]>();
  const [serializedMarkdown, setSerializedMarkdown] = useState('');

  const richTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slateStructure = markdownToSlate(md);

    setValue(slateStructure);
  }, []);

  const { renderedRichText } = useRichText({
    value,
    onChange: (val) => {
      setValue(val);
      setSerializedMarkdown(richTextRef.current ? htmlToMarkdown(richTextRef.current) : '');
    },
    contentRef: richTextRef,
  });

  return (
    <StyledRichTextStoryWrapper>
      <StyledRichTextWrapper>
        <StyledRichTextContainer>
          {Array.isArray(value) && renderedRichText}
        </StyledRichTextContainer>
      </StyledRichTextWrapper>
      <StyledPre>{serializedMarkdown}</StyledPre>
    </StyledRichTextStoryWrapper>
  );
};

export const RichTextWithMarkdownPreview: Story = () => <Y />;
RichTextDefaultStory.storyName = 'RichText with Markdown Preview';
