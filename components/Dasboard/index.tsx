import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledDashboardGreeting = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 3rem 0;

  ${mq(Breakpoint.mid)} {
    row-gap: 1.5rem;
    padding: 4.5rem 0;
  }

  ${mq(Breakpoint.ultra)} {
    padding: 6.75rem 0;
  }
`;

const StyledDashboardGreetingHeadline = styled.h1`
  font-size: var(--font-size-1000);
  line-height: var(--line-height-1000);
  font-weight: 700;
`;

const StyledDashboardGreetingSubline = styled.p`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;
`;

interface DashboardGreetingProps {
  children: React.ReactNode;
  subline?: string;
}

export const DashbaordGreeting: React.FC<DashboardGreetingProps> = ({
  children,
  subline,
}: DashboardGreetingProps) => (
  <StyledDashboardGreeting>
    <StyledDashboardGreetingHeadline>{children}</StyledDashboardGreetingHeadline>
    {subline && <StyledDashboardGreetingSubline>{subline}</StyledDashboardGreetingSubline>}
  </StyledDashboardGreeting>
);

export const DashboardWrapper = styled.div`
  padding-bottom: 3.75rem;

  ${mq(Breakpoint.mid)} {
    padding-bottom: 8.25rem;
  }

  ${mq(Breakpoint.ultra)} {
    padding-bottom: 11.25rem;
  }
`;
