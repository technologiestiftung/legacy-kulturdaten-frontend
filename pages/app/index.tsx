import { NextPage } from 'next';
import Link from 'next/link';
import styled from '@emotion/styled';

import { routes, useLocale } from '../../lib/routing';
import { useUser } from '../../components/user/useUser';
import { AppWrapper } from '../../components/wrappers/AppWrapper';

const StyledUl = styled.ul`
  list-style: disc inside;
  padding: 1rem;
`;

const StyledLi = styled.li`
  padding-bottom: 1rem;
`;

const DashboardPage: NextPage = () => {
  useUser();
  const locale = useLocale();

  return (
    <AppWrapper>
      <h1>App Index/Dashboard</h1>
      <StyledUl>
        <StyledLi>
          <Link href={routes.userProfile({ locale })}>
            <a>User profile</a>
          </Link>
        </StyledLi>
      </StyledUl>
    </AppWrapper>
  );
};

export default DashboardPage;
