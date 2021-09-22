import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledOverlayTitleBar = styled.div<{ sticky?: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* border-bottom: 1px solid var(--grey-400); */
  padding: 0.375rem 0.75rem;
  background: var(--white);
  box-shadow: 0 0.125rem 0.625rem -0.125rem rgba(0, 0, 0, 0.125);
  border-radius: 0.75rem 0.75rem 0 0;
  flex-wrap: wrap;
  flex-grow: 0;
  z-index: 2;

  ${({ sticky }) =>
    sticky
      ? css`
          position: sticky;
          top: 0;
          left: 0;
        `
      : ''}

  ${mq(Breakpoint.wide)} {
    padding: 0.375rem 1.5rem;
  }
`;

const StyledOverlayTitleBarTitle = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  padding: 0.75rem 0;
`;

const StyledOverlayTitleBarActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  flex-grow: 1;
  flex-wrap: wrap;
`;

const StyledOverlayTitleBarAction = styled.div`
  margin-left: 0.75rem;
  padding: 0.375rem 0;
`;

interface OverlayTitleBarProps {
  title: string;
  sticky?: boolean;
  actions?: React.ReactElement[];
}

export const OverlayTitleBar: React.FC<OverlayTitleBarProps> = ({
  title,
  sticky,
  actions,
}: OverlayTitleBarProps) => (
  <StyledOverlayTitleBar sticky={sticky}>
    <StyledOverlayTitleBarTitle>{title}</StyledOverlayTitleBarTitle>
    {actions && (
      <StyledOverlayTitleBarActions>
        {actions.map((action, index) => (
          <StyledOverlayTitleBarAction key={index}>{action}</StyledOverlayTitleBarAction>
        ))}
      </StyledOverlayTitleBarActions>
    )}
  </StyledOverlayTitleBar>
);
