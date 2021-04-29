import { NextPage } from 'next';
import Link from 'next/link';
import styled from '@emotion/styled';
import { routes, useLocale } from '../lib/routing';
import { LocaleSwitch } from '../components/Navigation/LocaleSwitch';
import { useT } from '../lib/i18n';

const StyledUl = styled.ul`
  list-style: disc inside;
  padding: 1rem;
`;

const StyledLi = styled.li`
  padding-bottom: 1rem;
`;

const IndexPage: NextPage = () => {
  const locale = useLocale();
  const t = useT();

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
        <h2>Localized test content</h2>
        <p>fun: {t('foo.bar')}</p>
        <p>param: {t('foo.coo', { x: 2 })}</p>
      </div>
      <div>
        <LocaleSwitch />
      </div>
    </>
  );
};

export default IndexPage;
