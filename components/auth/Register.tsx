import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import { AuthRegister, authRegisterFactory, useApiCall } from '../../lib/api';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonSize, ButtonType } from '../button';
import { Info } from '../info';
import { Input, InputType } from '../input';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import {
  AuthContent,
  AuthFormContainer,
  AuthFormItem,
  AuthHead,
  AuthHeadline,
  AuthSubline,
} from './AuthWrapper';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const passwordsMatch = useMemo(
    () => password === passwordConfirmation,
    [password, passwordConfirmation]
  );
  const [passwordConfirmationBlurred, setPasswordConfirmationBlurred] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);
  const t = useT();
  const call = useApiCall();
  const loadingScreen = useLoadingScreen();

  useEffect(() => {
    if (passwordsMatch) {
      setError(undefined);
    } else if (passwordConfirmationBlurred) {
      setError(t('register.passwordError') as string);
    }
  }, [passwordsMatch, passwordConfirmationBlurred, t]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(undefined);

    if (passwordsMatch) {
      loadingScreen(
        t('register.loading'),
        async () => {
          try {
            const resp = await call<AuthRegister>(authRegisterFactory, {
              body: {
                email,
                password,
                passwordConfirmation: passwordConfirmation,
              },
            });
            setSuccess(true);
            console.log(resp);
            return { success: true };
          } catch (e) {
            setError(e);
            return { success: false, error: <Info>{t('register.error')}</Info> };
          }
        },
        t('general.takeAFewSeconds')
      );
    } else {
      setError(t('register.passwordError') as string);
    }
  };

  return (
    <AuthContent>
      <AuthHead>
        <AuthHeadline>{t(success ? 'register.successHeadline' : 'register.headline')}</AuthHeadline>
        <AuthSubline>{t(success ? 'register.successSubline' : 'register.subline')}</AuthSubline>
      </AuthHead>

      {!success ? (
        <form onSubmit={submitHandler}>
          <AuthFormContainer>
            <div>
              <Input
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                label={t('register.email') as string}
                type={InputType.email}
                id="register-email"
                required
              />
            </div>
            <div>
              <Input
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                label={t('register.password') as string}
                type={InputType.password}
                id="register-password"
                required
                valid={Boolean(passwordsMatch || !error)}
              />
            </div>
            <div>
              <Input
                value={passwordConfirmation}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPasswordConfirmation(e.target.value)
                }
                label={t('register.confirmPassword') as string}
                type={InputType.password}
                id="register-password-confirmation"
                required
                valid={Boolean(passwordsMatch || !error)}
                onBlur={() => setPasswordConfirmationBlurred(true)}
              />
            </div>
            <AuthFormItem justifyContent="flex-end">
              <Button type={ButtonType.submit} size={ButtonSize.big} color={ButtonColor.black}>
                {t('register.submit')}
              </Button>
            </AuthFormItem>
          </AuthFormContainer>
        </form>
      ) : (
        ''
      )}
      {error && (
        <AuthFormContainer>
          <Info>{error}</Info>
        </AuthFormContainer>
      )}
    </AuthContent>
  );
};
