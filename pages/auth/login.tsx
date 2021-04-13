import { NextPage } from 'next';
import Link from 'next/link';

import { UserContextProvider } from '../../components/user/UserContext';
import { LoginForm } from '../../components/auth/Login';

const LoginPage: NextPage = () => (
  <>
    <div>
      <Link href="/">
        <a>Home page</a>
      </Link>
    </div>
    <UserContextProvider>
      <LoginForm />
    </UserContextProvider>
  </>
);

export default LoginPage;
