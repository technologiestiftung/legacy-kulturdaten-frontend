import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

export const ContentWrapper = styled.div`
  ${contentGrid(11)}

  justify-items: center;
`;

export const ContentContainer = styled.div`
  width: 100%;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 0.75rem;
  row-gap: 5.25rem;

  ${mq(Breakpoint.mid)} {
    row-gap: 8.25rem;
    grid-column: 2 / -2;
    padding: 0;
  }

  ${mq(Breakpoint.ultra)} {
    row-gap: 10.5rem;
    grid-column: 3 / -3;

    max-width: var(--max-content-width);
  }
`;
