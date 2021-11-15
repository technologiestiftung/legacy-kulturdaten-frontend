import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

export const EntryFormWrapper = styled.div<{
  fullWidth?: boolean;
  reducedVerticalPadding?: boolean;
}>`
  padding: ${({ reducedVerticalPadding }) => (reducedVerticalPadding ? '0.75rem' : '1.5rem')} 0;
  ${contentGrid(1)}
  row-gap: 1.5rem;

  ${mq(Breakpoint.mid)} {
    padding: ${({ reducedVerticalPadding }) => (reducedVerticalPadding ? '1.5rem' : '3rem')} 0;
    row-gap: 3rem;
    ${contentGrid(8)}
    justify-items: center;
  }

  ${({ fullWidth }) =>
    fullWidth
      ? ''
      : css`
          ${mq(Breakpoint.widish)} {
            padding: 3rem 0;
          }
        `}
`;

export const EntryFormContainer = styled.div<{ fullWidth?: boolean; noPadding?: boolean }>`
  width: 100%;
  max-width: var(--max-content-width);
  padding: 0 ${({ noPadding }) => (noPadding ? '0' : '0.75rem')};

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
    padding: 0 ${({ noPadding }) => (noPadding ? '0' : '1.5rem')};
  }

  ${({ fullWidth }) =>
    fullWidth
      ? ''
      : css`
          ${mq(Breakpoint.widish)} {
            grid-column: 2 / -2;
            padding: 0;
          }
        `}
`;

export const EntryFormContainerColumns = styled.div`
  display: grid;
  grid-template-columns: 100%;
  column-gap: 1.5rem;
  row-gap: 1.5rem;
  align-items: flex-start;
  justify-items: stretch;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 1fr;
    row-gap: 3rem;
  }
`;
