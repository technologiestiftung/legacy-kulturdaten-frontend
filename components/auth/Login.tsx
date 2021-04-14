import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import getConfig from 'next/config';

import { call, AuthLogin, authLoginRequest } from '../../lib/api';
import { Cookie, setCookie } from '../../lib/cookies';
import { routes } from '../../lib/routes';
import { UserContext } from '../user/UserContext';
import { useUser } from '../user/useUser';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

const authCookie = (value: string): Cookie => ({
  'name': authTokenCookieName,
  'value': value,
  'path': routes.index,
  'max-age': 1209600,
});

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<Error>();
  const { isAuthenticated, authenticateUser } = useContext(UserContext);
  const router = useRouter();
  useUser();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(routes.userProfile);
    }
  }, [isAuthenticated, router]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const resp = await call<AuthLogin>(authLoginRequest({ email, password }));

      if (resp.status === 200) {
        const token = resp.token.token;

        setCookie(authCookie(token));
        authenticateUser();
      }
    } catch (e) {
      setError(e);
    }
  };

  const form = (
    <div>
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
      {error ? <div>{error.message}</div> : ''}
    </div>
  );

  return <div>{form}</div>;
};
