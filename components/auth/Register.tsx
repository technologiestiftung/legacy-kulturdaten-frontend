import { ChangeEvent, FormEvent, useState } from 'react';

import { call, AuthRegister, authRegisterRequest } from '../../lib/api';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [error, setError] = useState<Error>();
  const [submitted, setSubmitted] = useState<boolean>(false);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(undefined);

    try {
      const resp = await call<AuthRegister>(
        authRegisterRequest({
          email,
          password,
          password_confirmation: passwordConfirmation,
        })
      );
      setSubmitted(true);
      console.log(resp);
    } catch (e) {
      setError(e);
      return;
    }
  };

  return (
    <div>
      {!submitted || error ? (
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="register-email">email</label>
            <br />
            <input
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              type="email"
              id="register-email"
              required
            />
          </div>
          <div>
            <label htmlFor="register-password">password</label>
            <br />
            <input
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              type="password"
              id="register-password"
              required
            />
          </div>
          <div>
            <label htmlFor="register-password-confirmation">confirm password</label>
            <br />
            <input
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
            <input type="submit" value="register" />
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
    </div>
  );
};
