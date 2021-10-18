import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledDashboardRow = styled.div`
  display: grid;
  grid-column: 1 / -1;
  row-gap: 2.25rem;

  ${mq(Breakpoint.mid)} {
    row-gap: 2.25rem;
  }
`;

const StyledDashboardRowTitle = styled.h2`
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);
  font-weight: 700;
`;

const StyledDashboardRowContent = styled.div`
  display: grid;
  grid-template-columns: 100%;
  row-gap: 2.25rem;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: 1.5rem;
  }
`;

interface DashboardRowProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardRow: React.FC<DashboardRowProps> = ({
  children,
  title,
}: DashboardRowProps) => (
  <StyledDashboardRow>
    {title && <StyledDashboardRowTitle>{title}</StyledDashboardRowTitle>}
    <StyledDashboardRowContent>{children}</StyledDashboardRowContent>
  </StyledDashboardRow>
);
