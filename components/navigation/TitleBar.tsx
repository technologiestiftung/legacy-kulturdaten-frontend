import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

const StyledTitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.75rem;
  background: var(--white);
  border: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    border-left: none;
  }

  ${mq(Breakpoint.wide)} {
    padding: 0;
    ${contentGrid(10)}
  }
`;

const StyledTitle = styled.h1<{ skeleton?: boolean }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.75rem 0;
  order: 1;
  text-transform: capitalize;

  ${mq(Breakpoint.mid)} {
    order: 0;
  }

  ${mq(Breakpoint.wide)} {
    order: 0;
    grid-column: 2 / -2;
  }

  ${({ skeleton }) =>
    skeleton
      ? css`
          &:after {
            content: '';
            display: block;
            position: relative;
            height: var(--line-height-300);
            width: 10rem;
            background: var(--grey-200);
          }
        `
      : ''}
`;

const StyledAction = styled.div``;

export interface TitleBarProps {
  title: string;
  action?: React.ReactElement;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title, action }: TitleBarProps) => (
  <StyledTitleBar>
    <StyledTitle skeleton={typeof title === 'undefined'}>{title}</StyledTitle>
    {action ? <StyledAction>{action}</StyledAction> : ''}
  </StyledTitleBar>
);
