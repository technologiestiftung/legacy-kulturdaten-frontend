import { AuthWrapper } from '../../auth/AuthWrapper';
import resetPasswordImage from '../../../public/img/heye-jensen-uVIpeJE9X9c-unsplash.jpg';
import { RequestPasswordResetForm } from '../../auth/RequestPasswordReset';
import { ResetPasswordForm } from '../../auth/ResetPassword';

export const ResetPasswordPage: React.FC = () => {
  return (
    <AuthWrapper image={{ src: resetPasswordImage }}>
      <ResetPasswordForm />
    </AuthWrapper>
  );
};

export const RequestPasswordResetPage: React.FC = () => {
  return (
    <AuthWrapper image={{ src: resetPasswordImage }}>
      <RequestPasswordResetForm />
    </AuthWrapper>
  );
};
