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

const passwordErrorId = 0;
const requestErrorId = 1;

export const passwordMinLength = 8;

export const RegisterForm: React.FC = () => {
  const locale = useLocale();
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

    if (passwordsMatch) {
          try {
            await call<AuthRegister>(authRegisterFactory, {
              body: {
                email,
                password,
                passwordConfirmation: passwordConfirmation,
              },
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
              ? (t('register.uniqueEmailError') as string)
              : (t('register.requestError') as string);

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
        <AuthHeadline><legend>{t(success ? 'register.successHeadline' : 'register.headline')}</legend></AuthHeadline>
        <AuthSubline>{t(success ? 'register.successSubline' : 'register.subline')}</AuthSubline>
      </AuthHead>

      {!success ? (
        <form onSubmit={submitHandler}>
          <AuthFormContainer>
            <div>
              <Input
                value={email}
                autoComplete="email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                label={t('register.email') as string}
                placeholder={t('login.emailPlaceholder') as string}
                type={InputType.email}
                id="register-email"
                required
              />
            </div>
            <div>
              <Input
                value={password}
                autoComplete="new-password"
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
                autoComplete="new-password"
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
            <AuthFormItem>
              <Checkbox
                id="register-confirmation"
                label={t('register.confirmationText')}
                required
              />
            </AuthFormItem>
            <Button
              type={ButtonType.submit}
              size={ButtonSize.big}
              color={ButtonColor.black}
              contentPosition={ButtonContentPosition.center}
            >
              {t('register.submit')}
            </Button>
            <AuthFormItem justifyContent="center">
              <span>
                {t('register.loginReference')}{' '}
                <Anchor
                  href={routes.login({ locale })}
                  title={t('register.loginReferenceLinkText') as string}
                  type={StandardLinkType.internal}
                />
              </span>
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
