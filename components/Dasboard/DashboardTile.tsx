import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { DashboardTileLinkProps } from './DashboardTileLink';

const StyledDashboardTile = styled.div`
  box-shadow: 0.75rem 0.75rem 3rem rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  grid-column: 1 / -1;

  ${mq(Breakpoint.mid)} {
    border-radius: 1.5rem;
    grid-column: span 6;
  }
`;

const StyledDashboardTileContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  overflow: hidden;

  ${mq(Breakpoint.mid)} {
    border-radius: 1.5rem;
  }
`;

const StyledDashboardTileTitle = styled.h3`
  background: var(--black);
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;
  padding: 1.125rem 1.5rem;
  color: var(--white);

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem;
  }
`;

const StyledDashboardTileContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DashboardTileText = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--line-height-400) / 2);
  padding: 1.125rem 1.5rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem;
  }
`;

export const DashboardTileTextP = styled.p`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 400;
`;

interface DashboardTileProps {
  title: string;
  children: React.ReactNode;
  link?: React.ReactElement<DashboardTileLinkProps>;
}

export const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  children,
  link,
}: DashboardTileProps) => {
  return (
    <StyledDashboardTile>
      <StyledDashboardTileContainer>
        <StyledDashboardTileTitle>{title}</StyledDashboardTileTitle>
        <StyledDashboardTileContent>{children}</StyledDashboardTileContent>
        {link}
      </StyledDashboardTileContainer>
    </StyledDashboardTile>
  );
};
