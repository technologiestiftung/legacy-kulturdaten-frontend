import { NextPage } from 'next';
import Link from 'next/link';

import { RegisterForm } from '../../components/auth/Register';

const RegisterPage: NextPage = () => (
  <>
    <div>
      <Link href="/">
        <a>Home page</a>
      </Link>
    </div>
    <RegisterForm />
  </>
);

export default RegisterPage;
