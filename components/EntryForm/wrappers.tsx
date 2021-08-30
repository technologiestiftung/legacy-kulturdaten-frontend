import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

export const EntryFormWrapper = styled.div`
  padding: 1.5rem 0.75rem;
  ${contentGrid(1)}
  row-gap: 1.5rem;

  ${mq(Breakpoint.mid)} {
    padding: 3rem 1.5rem;
    row-gap: 3rem;
    ${contentGrid(8)}
  }

  ${mq(Breakpoint.widish)} {
    padding: 3rem 0;
  }
`;

export const EntryFormContainer = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
  }
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
