import { NextPage } from 'next';
import Link from 'next/link';

import { UserContextProvider } from '../../components/user/UserContext';
import { LoginForm } from '../../components/auth/Login';
import { routes } from '../../lib/routes';

const LoginPage: NextPage = () => (
  <>
    <div>
      <Link href={routes.index}>
        <a>Home page</a>
      </Link>
    </div>
    <UserContextProvider>
      <LoginForm />
    </UserContextProvider>
  </>
);

export default LoginPage;
