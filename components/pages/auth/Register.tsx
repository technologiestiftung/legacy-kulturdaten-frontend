import {
  AuthHead,
  AuthContent,
  AuthHeadline,
  AuthSubline,
  AuthWrapper,
} from '../../auth/AuthWrapper';
import registerImage from '../../../public/img/chris-curry-WU1DEBbWz5I-unsplash.jpg';
import { useT } from '../../../lib/i18n';
import { RegisterForm } from '../../auth/Register';

export const RegisterPage: React.FC = () => {
  const t = useT();

  return (
    <AuthWrapper image={{ src: registerImage }}>
      <AuthContent>
        <AuthHead>
          <AuthHeadline>{t('register.headline')}</AuthHeadline>
          <AuthSubline>{t('register.subline')}</AuthSubline>
        </AuthHead>
        <RegisterForm />
      </AuthContent>
    </AuthWrapper>
  );
};
