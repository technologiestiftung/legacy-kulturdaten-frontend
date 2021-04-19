import { NextPage } from 'next';
import Link from 'next/link';
import styled from '@emotion/styled';

import { routes } from '../../lib/routes';
import { useUser } from '../../components/user/useUser';

const StyledUl = styled.ul`
  list-style: disc inside;
  padding: 1rem;
`;

const StyledLi = styled.li`
  padding-bottom: 1rem;
`;

const DashboardPage: NextPage = () => {
  useUser();
  return (
    <>
      <h1>App Index/Dashboard</h1>
      <StyledUl>
        <StyledLi>
          <Link href={routes.userProfile()}>
            <a>User profile</a>
          </Link>
        </StyledLi>
      </StyledUl>
    </>
  );
};

export default DashboardPage;
