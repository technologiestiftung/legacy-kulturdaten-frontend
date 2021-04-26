import { NextPage } from 'next';
import Link from 'next/link';

import { LoginForm } from '../../../components/auth/Login';
import { routes } from '../../../lib/routing';

const LoginPage: NextPage = () => (
  <>
    <div>
      <Link href={routes.index()}>
        <a>Home page</a>
      </Link>
    </div>
    <LoginForm />
  </>
);

export default LoginPage;
