import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledDashboardGreeting = styled.h2`
  font-size: var(--font-size-1000);
  line-height: var(--line-height-1000);
  font-weight: 700;
  padding-top: 1.5rem;

  ${mq(Breakpoint.mid)} {
    padding-top: 4.5rem;
  }

  ${mq(Breakpoint.ultra)} {
    padding-top: 6rem;
  }
`;

interface DashboardGreetingProps {
  children: React.ReactNode;
}

export const DashbaordGreeting: React.FC<DashboardGreetingProps> = ({
  children,
}: DashboardGreetingProps) => <StyledDashboardGreeting>{children}</StyledDashboardGreeting>;
