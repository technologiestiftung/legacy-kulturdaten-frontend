import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

export const DashboardGrid = styled.div`
  ${contentGrid(1)}

  row-gap: 3.75rem;

  ${mq(Breakpoint.mid)} {
    row-gap: 5.25rem;
  }

  ${mq(Breakpoint.wide)} {
    row-gap: 7.5rem;
  }

  ${mq(Breakpoint.ultra)} {
    row-gap: 11.25rem;
  }
`;
