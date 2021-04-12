import { NextPage } from 'next';
import { UserContextProvider } from '../../components/user/UserContext';

import { LoginForm } from '../../components/auth/Login';

const LoginPage: NextPage = () => (
  <UserContextProvider>
    <LoginForm />
  </UserContextProvider>
);

export default LoginPage;
