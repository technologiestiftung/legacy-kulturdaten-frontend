import { ChangeEvent, FormEvent, useState } from 'react';

import { register } from '../../lib/api';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log({
      email,
      password,
      passwordConfirmation,
    });

    const resp = await register(email, password, passwordConfirmation);
    console.log(resp);
  };

  return (
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
          type="password"
          id="register-password-confirmation"
          required
        />
      </div>
      <div>
        <input type="submit" value="register" />
      </div>
    </form>
  );
};
