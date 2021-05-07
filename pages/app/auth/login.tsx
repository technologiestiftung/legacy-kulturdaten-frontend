import { NextPage } from 'next';
import Link from 'next/link';
import { StyledTestContainer } from '../..';

import { LoginForm } from '../../../components/auth/Login';
import { LocaleSwitch } from '../../../components/navigation/LocaleSwitch';
import { routes, useLocale } from '../../../lib/routing';

const LoginPage: NextPage = () => {
  const locale = useLocale();

  return (
    <StyledTestContainer>
      <div>
        <Link href={routes.index({ locale })}>
          <a>Kulturdaten.Berlin</a>
        </Link>
      </div>
      <LoginForm />
      <LocaleSwitch />
    </StyledTestContainer>
  );
};

export default LoginPage;
