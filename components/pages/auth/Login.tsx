import { AuthContent, AuthHeadline, AuthWrapper } from '../../auth/AuthWrapper';
import { LoginForm } from '../../auth/Login';
import loginImage from '../../../public/img/tiago-aleixo-UnE4TwJOF04-unsplash.jpg';
import { useT } from '../../../lib/i18n';

export const LoginPage: React.FC = () => {
  const t = useT();

  return (
    <AuthWrapper image={{ src: loginImage }}>
      <AuthContent>
        <AuthHeadline>{t('login.headline')}</AuthHeadline>
        <LoginForm />
      </AuthContent>
    </AuthWrapper>
  );
};
