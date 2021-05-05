import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

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
`;

const StyledTitle = styled.h1`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.75rem 0;
  order: 1;

  ${mq(Breakpoint.mid)} {
    order: 0;
  }
`;

const StyledAction = styled.div``;

export interface TitleBarProps {
  title: string;
  action?: React.ReactElement;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title, action }: TitleBarProps) => (
  <StyledTitleBar>
    <StyledTitle>{title}</StyledTitle>
    {action ? <StyledAction>{action}</StyledAction> : ''}
  </StyledTitleBar>
);
