import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

export const EntryFormWrapper = styled.div<{
  fullWidth?: boolean;
  reducedVerticalpadding?: boolean;
}>`
  padding: ${({ reducedVerticalpadding }) => (reducedVerticalpadding ? '0.75rem' : '1.5rem')}
    0.75rem;
  ${contentGrid(1)}
  row-gap: 1.5rem;

  ${mq(Breakpoint.mid)} {
    padding: ${({ reducedVerticalpadding }) => (reducedVerticalpadding ? '1.5rem' : '3rem')} 1.5rem;
    row-gap: ${({ reducedVerticalpadding }) => (reducedVerticalpadding ? '1.5rem' : '3rem')};
    ${contentGrid(8)}
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

export const EntryFormContainer = styled.div<{ fullWidth?: boolean }>`
  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${({ fullWidth }) =>
    fullWidth
      ? ''
      : css`
          ${mq(Breakpoint.widish)} {
            grid-column: 2 / -2;
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
