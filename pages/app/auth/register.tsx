import { NextPage } from 'next';
import Link from 'next/link';

import { RegisterForm } from '../../../components/auth/Register';
import { routes } from '../../../config/routes';

const RegisterPage: NextPage = () => (
  <>
    <div>
      <Link href={routes.index()}>
        <a>Home page</a>
      </Link>
    </div>
    <RegisterForm />
  </>
);

export default RegisterPage;
