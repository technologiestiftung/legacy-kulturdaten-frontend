import { ChangeEvent, FormEvent, useContext, useState } from 'react';

import { login } from '../../lib/api';
import { UserContext } from '../user/UserContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { user, setUser, isAuthenticated, authenticateUser } = useContext(UserContext);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const resp = await login(email, password);

    if (resp.status === 200) {
      // authenticateUser(true);

      const token = resp.token.token;

      document.cookie = `AUTH_TOKEN=${token}; path=/; max-age=1209600; samesite=strict`;
      authenticateUser();
    }
  };

  const form = (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="login-email">email</label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          id="login-email"
          required
        />
      </div>
      <div>
        <label htmlFor="login-password">password</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          id="login-password"
          required
        />
      </div>
      <div>
        <input type="submit" value="login" />
      </div>
    </form>
  );

  return <div>{isAuthenticated ? <div>logged in</div> : form}</div>;
};
