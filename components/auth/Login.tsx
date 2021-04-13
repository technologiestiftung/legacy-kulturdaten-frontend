import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';

import { login } from '../../lib/api';
import { setCookie } from '../../lib/cookies';
import { UserContext } from '../user/UserContext';
import { useUser } from '../user/useUser';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { isAuthenticated, authenticateUser } = useContext(UserContext);
  const router = useRouter();
  useUser();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/user/profile');
    }
  }, [isAuthenticated, router]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const resp = await login(email, password);

    if (resp.status === 200) {
      const token = resp.token.token;

      setCookie({ name: 'AUTH_TOKEN', value: token, path: '/', maxAgeInS: 1209600 });
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

  return <div>{form}</div>;
};
