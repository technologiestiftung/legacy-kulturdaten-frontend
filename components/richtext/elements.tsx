import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const RichTextP = styled.p`
  font-family: var(--font-family-mono);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);

  padding-bottom: var(--line-height-300);
`;

export const RichTextH1 = styled.h1`
  font-family: var(--font-family-mono);
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);
  font-weight: 700;

  padding-bottom: var(--line-height-600);
`;

export const RichTextH2 = styled.h2`
  font-family: var(--font-family-mono);
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;

  padding-bottom: var(--line-height-400);
`;

export const RichTextH3 = styled.h3`
  font-family: var(--font-family-mono);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;

  padding-bottom: var(--line-height-300);
`;

export const RichTextStrong = styled.strong`
  font-weight: 700;
`;

export const RichTextEm = styled.em`
  font-style: italic;
`;

export const RichTextU = styled.u`
  text-decoration: underline;
`;

const listStyles = css`
  list-style-position: inside;
  padding-bottom: var(--line-height-300);
`;

export const RichTextUl = styled.ul`
  ${listStyles}

  list-style-type: disc;
`;

export const RichTextOl = styled.ol`
  ${listStyles}

  list-style-type: decimal;
`;

export const RichTextLi = styled.li`
  padding-left: 1.5rem;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);

  p {
    display: inline;
  }

  &::marker {
  }
`;
