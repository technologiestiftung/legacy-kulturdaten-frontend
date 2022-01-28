import { NextPage } from 'next';
import { InfoColor } from '../../components/info';

import { LoginPage as LoginPageComponent } from '../../components/pages/auth/Login';
import { useT } from '../../lib/i18n';

const LoginPage: NextPage = () => {
  const t = useT();
  return (
    <LoginPageComponent
      info={{
        children: t('login.headlineSuccess'),
        color: InfoColor.green,
      }}
    />
  );
};

export default LoginPage;
