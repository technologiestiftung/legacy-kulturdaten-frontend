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

const passwordErrorId = 0;
const requestErrorId = 1;

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const passwordsMatch = useMemo(
    () => password === passwordConfirmation,
    [password, passwordConfirmation]
  );
  const [passwordConfirmationBlurred, setPasswordConfirmationBlurred] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ id: number; message: string }[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const t = useT();
  const call = useApiCall();
  const loadingScreen = useLoadingScreen();

  useEffect(() => {
    if (password.length > 0 && passwordConfirmation.length > 0) {
      const filteredErrors = errors.filter(({ id }) => id !== passwordErrorId);
      const passwordError = { id: passwordErrorId, message: t('register.passwordError') as string };
      const passwordErrorPresent = errors.length !== filteredErrors.length;

      if (passwordErrorPresent && passwordsMatch) {
        setErrors(filteredErrors);
      } else if (!passwordsMatch && !passwordErrorPresent && passwordConfirmationBlurred) {
        setErrors([passwordError, ...filteredErrors]);
      }
    }
  }, [
    passwordsMatch,
    passwordConfirmationBlurred,
    t,
    errors,
    password.length,
    passwordConfirmation.length,
  ]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrors([]);

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
            const requestErrors = e.message
              ? (JSON.parse(e.message)?.errors as {
                  rule: string;
                  field: string;
                  message: string;
                }[])
              : undefined;

            const visibleError = requestErrors?.find(
              (error) => error.rule === 'unique' && error.field === 'email'
            )
              ? (t('register.uniqueEmailError') as string)
              : (t('register.requestError') as string);

            setErrors([
              { id: requestErrorId, message: visibleError },
              ...errors.filter(({ id }) => id !== requestErrorId),
            ]);
            return { success: false, error: <Info>{visibleError}</Info> };
          }
        },
        t('general.takeAFewSeconds')
      );
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
                valid={Boolean(passwordsMatch || !passwordConfirmationBlurred)}
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
                valid={Boolean(passwordsMatch || !passwordConfirmationBlurred)}
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
      {errors?.length > 0 && (
        <AuthFormContainer>
          {errors.map(({ message }, index) => (
            <Info key={index}>{message}</Info>
          ))}
        </AuthFormContainer>
      )}
    </AuthContent>
  );
};
