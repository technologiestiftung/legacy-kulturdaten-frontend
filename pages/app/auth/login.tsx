import { NextPage } from 'next';
import Link from 'next/link';

import { LoginForm } from '../../../components/auth/Login';
import { LocaleSwitch } from '../../../components/navigation/LocaleSwitch';
import { routes, useLocale } from '../../../lib/routing';

const LoginPage: NextPage = () => {
  const locale = useLocale();

  return (
    <>
      <div>
        <Link href={routes.index({ locale })}>
          <a>Home page</a>
        </Link>
      </div>
      <LoginForm />
      <LocaleSwitch />
    </>
  );
};

export default LoginPage;
