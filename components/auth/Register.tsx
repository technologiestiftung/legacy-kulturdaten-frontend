import styled from '@emotion/styled';
import { ChangeEvent, FormEvent, useState } from 'react';

import { AuthRegister, authRegisterFactory, useApiCall } from '../../lib/api';
import { useT } from '../../lib/i18n';

const StyledTestInput = styled.input`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  margin-bottom: 0.75rem;
  width: 100%;
`;

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
    <StyledTestFormContainer>
      {!submitted || error ? (
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="register-email">{t('register.email')}</label>
            <br />
            <StyledTestInput
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              type="email"
              id="register-email"
              required
            />
          </div>
          <div>
            <label htmlFor="register-password">{t('register.password')}</label>
            <br />
            <StyledTestInput
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              type="password"
              id="register-password"
              required
            />
          </div>
          <div>
            <label htmlFor="register-password-confirmation">{t('register.confirmPassword')}</label>
            <br />
            <StyledTestInput
              value={passwordConfirmation}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordConfirmation(e.target.value)
              }
              type="password"
              id="register-password-confirmation"
              required
            />
          </div>
          <div>
            <input type="submit" value={t('register.submit') as string} />
          </div>
        </form>
      ) : (
        ''
      )}
      {error ? (
        <div>
          <h3>{error.name}</h3>
          <pre>{error.message}</pre>
        </div>
      ) : submitted ? (
        <div>Form submitted. Please confirm your email address via the email we just sent you.</div>
      ) : (
        ''
      )}
    </StyledTestFormContainer>
  );
};
