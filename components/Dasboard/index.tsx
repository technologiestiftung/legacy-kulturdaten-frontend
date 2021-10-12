import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledDashboardGreeting = styled.h1`
  font-size: var(--font-size-1000);
  line-height: var(--line-height-1000);
  font-weight: 700;
  padding: 1.5rem 0;

  ${mq(Breakpoint.mid)} {
    padding: 4.5rem 0;
  }

  ${mq(Breakpoint.ultra)} {
    padding: 6rem 0;
  }
`;

interface DashboardGreetingProps {
  children: React.ReactNode;
}

export const DashbaordGreeting: React.FC<DashboardGreetingProps> = ({
  children,
}: DashboardGreetingProps) => <StyledDashboardGreeting>{children}</StyledDashboardGreeting>;
