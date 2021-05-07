import { NextPage } from 'next';
import Link from 'next/link';
import { StyledTestContainer } from '../..';

import { RegisterForm } from '../../../components/auth/Register';
import { LocaleSwitch } from '../../../components/navigation/LocaleSwitch';
import { routes, useLocale } from '../../../lib/routing';

const RegisterPage: NextPage = () => {
  const locale = useLocale();

  return (
    <StyledTestContainer>
      <div>
        <Link href={routes.index({ locale })}>
          <a>Kulturdaten.Berlin</a>
        </Link>
      </div>
      <RegisterForm />
      <LocaleSwitch />
    </StyledTestContainer>
  );
};

export default RegisterPage;
