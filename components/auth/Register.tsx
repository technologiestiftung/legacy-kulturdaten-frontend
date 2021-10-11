import { ChangeEvent, FormEvent, useState } from 'react';

import { AuthRegister, authRegisterFactory, useApiCall } from '../../lib/api';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonSize, ButtonType } from '../button';
import { Input, InputType } from '../input';
import { AuthFormContainer, AuthFormItem } from './AuthWrapper';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [error, setError] = useState<Error>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const t = useT();
  const call = useApiCall();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(undefined);

    try {
      const resp = await call<AuthRegister>(authRegisterFactory, {
        body: {
          email,
          password,
          passwordConfirmation: passwordConfirmation,
        },
      });
      setSubmitted(true);
      console.log(resp);
    } catch (e) {
      setError(e);
      return;
    }
  };

  return (
    <>
      {!submitted || error ? (
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
                hideError
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
                hideError
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
                hideError
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
      {error ? (
        <AuthFormContainer>
          <h3>{error.name}</h3>
          <pre>{error.message}</pre>
        </AuthFormContainer>
      ) : submitted ? (
        <AuthFormContainer>
          Form submitted. Please confirm your email address via the email we just sent you.
        </AuthFormContainer>
      ) : (
        ''
      )}
    </>
  );
};
