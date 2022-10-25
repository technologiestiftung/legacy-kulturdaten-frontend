import { AuthContent, AuthHeadline, AuthWrapper } from '../../auth/AuthWrapper';
import { LoginForm } from '../../auth/Login';
import loginImage from '../../../public/img/tiago-aleixo-UnE4TwJOF04-unsplash.jpg';
import { useT } from '../../../lib/i18n';
import { Info, InfoProps } from '../../info';

interface LoginPageProps {
  info?: InfoProps;
}

export const LoginPage: React.FC<LoginPageProps> = ({ info }) => {
  const t = useT();

  return (
    <AuthWrapper image={{ src: loginImage }}>
      <AuthContent>
        {info && <Info {...info}>{t('login.headlineSuccess')}</Info>}
        <AuthHeadline>
          <legend>
            {t('login.headline')}
          </legend>
        </AuthHeadline>
        <LoginForm />
      </AuthContent>
    </AuthWrapper>
  );
};
