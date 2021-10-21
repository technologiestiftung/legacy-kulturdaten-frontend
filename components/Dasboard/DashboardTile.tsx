import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { StandardLink } from '../../lib/generalTypes';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledDashboardTile = styled.div<{ gridColumn?: string }>`
  box-shadow: 0.75rem 0.75rem 3rem rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  grid-column: 1 / -1;
  display: flex;

  ${mq(Breakpoint.mid)} {
    border-radius: 1.5rem;
    grid-column: ${({ gridColumn }) => gridColumn || 'span 6'};
  }
`;

const StyledDashboardTileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    border-radius: 1.5rem;
  }
`;

const StyledDashboardTileDigit = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  background: var(--grey-200);
  font-size: 2.25rem;
  line-height: 2.25rem;
  min-width: 2.25rem;
  font-weight: 700;
  padding: 1.125rem 0.75rem;
  box-sizing: content-box;
  text-align: center;

  ${mq(Breakpoint.wide)} {
    font-size: 3rem;
    line-height: 3rem;
    min-width: 3rem;
  }
`;

const StyledDashboardTileContainerChildren = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const StyledDashboardTileTitle = styled.h3<{ hasDigit?: boolean }>`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  padding: 0.75rem 1.125rem;
  color: var(--black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-500);
    line-height: var(--line-height-500);
    padding: 1.125rem 1.5rem;
  }

  ${({ hasDigit }) =>
    hasDigit
      ? css`
          background: var(--white);
          font-size: var(--font-size-600);
          line-height: var(--line-height-600);
          white-space: inherit;
          overflow: inherit;
          text-overflow: inherit;
          padding: 0.75rem 1.125rem 0;

          ${mq(Breakpoint.mid)} {
            font-size: var(--font-size-600);
            line-height: var(--line-height-600);
            padding: 1.125rem 1.5rem 0;
          }
        `
      : css`
          background: var(--grey-200);
        `}
`;

const StyledDashboardTileContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const DashboardTileText = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--line-height-400) / 2);
  padding: 0.75rem 1.125rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 1.5rem;
  }
`;

export const DashboardTileTextP = styled.p`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 400;

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-400);
    line-height: var(--line-height-400);
  }
`;

interface DashboardTileProps {
  title: string;
  children: React.ReactNode;
  link?: React.ReactElement<StandardLink>;
  gridColumn?: string;
  digit?: number;
}

export const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  children,
  link,
  gridColumn,
  digit,
}: DashboardTileProps) => {
  return (
    <StyledDashboardTile gridColumn={gridColumn}>
      <StyledDashboardTileContainer>
        {digit && <StyledDashboardTileDigit>{digit}</StyledDashboardTileDigit>}
        <StyledDashboardTileContainerChildren>
          <StyledDashboardTileTitle hasDigit={typeof digit !== 'undefined'}>
            {title}
          </StyledDashboardTileTitle>
          <StyledDashboardTileContent>{children}</StyledDashboardTileContent>
          {link}
        </StyledDashboardTileContainerChildren>
      </StyledDashboardTileContainer>
    </StyledDashboardTile>
  );
};
