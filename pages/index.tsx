import { NextPage } from 'next';
import Link from 'next/link';
import styled from '@emotion/styled';

const StyledUl = styled.ul`
  list-style: disc inside;
  padding: 1rem;
`;

const StyledLi = styled.li`
  padding-bottom: 1rem;
`;

const IndexPage: NextPage = () => {
  return (
    <>
      <h1>Hello Kulturdaten Frontend!</h1>
      <StyledUl>
        <StyledLi>
          <Link href="/auth/login">
            <a>Login</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link href="/auth/register">
            <a>Register</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link href="/user/profile">
            <a>User Profile</a>
          </Link>
        </StyledLi>
      </StyledUl>
    </>
  );
};

export default IndexPage;
