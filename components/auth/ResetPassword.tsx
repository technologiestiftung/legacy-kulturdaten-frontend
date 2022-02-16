import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import { AuthRegister, authRegisterFactory, useApiCall } from '../../lib/api';
import { routes, useLocale } from '../../lib/routing';
import { useT } from '../../lib/i18n';
import { Anchor } from '../anchor';
import { Button, ButtonColor, ButtonContentPosition, ButtonSize, ButtonType } from '../button';
import { Checkbox } from '../checkbox';
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
import { StandardLinkType } from '../../lib/generalTypes';
import { useRouter } from 'next/router';
import {
  AuthResetPassword,
  authResetPasswordFactory,
} from '../../lib/api/routes/auth/resetPassword';

const passwordErrorId = 0;
const requestErrorId = 1;

export const passwordMinLength = 8;

export const ResetPasswordForm: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();

  const email = useMemo(() => router?.query?.email as string, [router?.query?.email]);
  const signature = useMemo(() => router?.query?.signature as string, [router?.query?.signature]);

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
      const passwordError = {
        id: passwordErrorId,
        message: t('register.passwordError') as string,
      };
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

    if (passwordsMatch && email && signature) {
      loadingScreen(
        t('resetPassword.loading'),
        async () => {
          try {
            await call<AuthResetPassword>(authResetPasswordFactory, {
              body: {
                email,
                password,
                passwordConfirmation: passwordConfirmation,
              },
              signature,
            });
            setSuccess(true);
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
              ? (t('resetPassword.expiredLinkError') as string)
              : (t('resetPassword.requestError') as string);

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
        <AuthHeadline>
          {t(success ? 'resetPassword.successHeadline' : 'resetPassword.headline')}
        </AuthHeadline>
        <AuthSubline>
          {t(success ? 'resetPassword.successSubline' : 'resetPassword.subline', { email })}
        </AuthSubline>
      </AuthHead>

      {!success ? (
        <form onSubmit={submitHandler}>
          <AuthFormContainer>
            <div>
              <Input
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                label={t('register.password') as string}
                placeholder={t('register.passwordPlaceholder') as string}
                type={InputType.password}
                id="register-password"
                minLength={passwordMinLength}
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
                placeholder={t('register.passwordPlaceholder') as string}
                type={InputType.password}
                id="register-password-confirmation"
                minLength={passwordMinLength}
                required
                valid={Boolean(passwordsMatch || !passwordConfirmationBlurred)}
                onBlur={() => setPasswordConfirmationBlurred(true)}
              />
            </div>
            <Button
              type={ButtonType.submit}
              size={ButtonSize.big}
              color={ButtonColor.black}
              contentPosition={ButtonContentPosition.center}
            >
              {t('resetPassword.submit')}
            </Button>
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
