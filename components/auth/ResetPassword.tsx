import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import { useApiCall } from '../../lib/api';
import { routes, useLocale } from '../../lib/routing';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonContentPosition, ButtonSize, ButtonType } from '../button';
import { Info } from '../info';
import { Input, InputType } from '../input';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { AuthContent, AuthFormContainer, AuthHead, AuthHeadline, AuthSubline } from './AuthWrapper';
import { useRouter } from 'next/router';
import {
  AuthResetPassword,
  authResetPasswordFactory,
} from '../../lib/api/routes/auth/resetPassword';
import { ButtonLink } from '../button/ButtonLink';
import Link from 'next/link';

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
  const [linkExpired, setLinkExpired] = useState(false);
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
                  code: string;
                }[])
              : undefined;

            const visibleError = requestErrors?.find((error) => error.code === 'E_UNAUTHORIZED')
              ? (t('resetPassword.expiredLinkError') as string)
              : (t('resetPassword.requestError') as string);

            if (requestErrors?.find((error) => error.code === 'E_UNAUTHORIZED')) {
              setLinkExpired(true);
            }

            setErrors([
              { id: requestErrorId, message: visibleError },
              ...errors.filter(({ id }) => id !== requestErrorId),
            ]);
            return { success: false, error: <Info>{visibleError}</Info> };
          }
    }
  };

  return (
    <AuthContent>
      <AuthHead>
        <AuthHeadline>
          <legend>
            {t(
              success
                ? 'resetPassword.successHeadline'
                : linkExpired
                ? 'resetPassword.expiredLinkHeadline'
                : 'resetPassword.headline'
            )}
          </legend>
        </AuthHeadline>
        {!linkExpired && (
          <AuthSubline>
            {t(success ? 'resetPassword.successSubline' : 'resetPassword.subline', { email })}
          </AuthSubline>
        )}
      </AuthHead>

      {!linkExpired && (
        <>
          {!success ? (
            <form onSubmit={submitHandler}>
              <AuthFormContainer>
                <div>
                  <Input
                    value={password}
                    autoComplete="new-password"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    label={t('register.password') as string}
                    placeholder={t('register.passwordPlaceholder') as string}
                    type={InputType.password}
                    id="reset-password"
                    minLength={passwordMinLength}
                    required
                    valid={Boolean(passwordsMatch || !passwordConfirmationBlurred)}
                  />
                </div>
                <div>
                  <Input
                    value={passwordConfirmation}
                    autoComplete="new-password"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPasswordConfirmation(e.target.value)
                    }
                    label={t('register.confirmPassword') as string}
                    placeholder={t('register.passwordPlaceholder') as string}
                    type={InputType.password}
                    id="reset-password-confirmation"
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
            <AuthFormContainer>
              <Link href={routes.login({ locale })} passHref>
                <ButtonLink
                  color={ButtonColor.black}
                  size={ButtonSize.big}
                  contentPosition={ButtonContentPosition.center}
                >
                  {t('resetPassword.goToLogin')}
                </ButtonLink>
              </Link>
            </AuthFormContainer>
          )}
        </>
      )}
      {errors?.length > 0 && (
        <AuthFormContainer>
          {errors.map(({ message }, index) => (
            <Info key={index}>{message}</Info>
          ))}
        </AuthFormContainer>
      )}
      {linkExpired && (
        <AuthFormContainer>
          <Link href={routes.resetPassword({ locale })} passHref>
            <ButtonLink
              color={ButtonColor.black}
              size={ButtonSize.big}
              contentPosition={ButtonContentPosition.center}
            >
              {t('requestPasswordReset.headline')}
            </ButtonLink>
          </Link>
        </AuthFormContainer>
      )}
    </AuthContent>
  );
};
