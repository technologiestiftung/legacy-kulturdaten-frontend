import { NextPage } from 'next';
import Link from 'next/link';
import styled from '@emotion/styled';
import { routes, useLocale } from '../lib/routing';
import { LocaleSwitch } from '../components/Navigation/LocaleSwitch';

const StyledUl = styled.ul`
  list-style: disc inside;
  padding: 1rem;
`;

const StyledLi = styled.li`
  padding-bottom: 1rem;
`;

const IndexPage: NextPage = () => {
  const locale = useLocale();

  return (
    <>
      <h1>Hello Kulturdaten Frontend!</h1>
      <StyledUl>
        <StyledLi>
          <Link href={routes.login({ locale })}>
            <a>Login</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link href={routes.register({ locale })}>
            <a>Register</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link href={routes.dashboard({ locale })}>
            <a>Dashboard</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link href={routes.imprint({ locale })}>
            <a>Impressum/Imprint</a>
          </Link>
        </StyledLi>
      </StyledUl>
      <div>
        <LocaleSwitch />
      </div>
    </>
  );
};

export default IndexPage;
