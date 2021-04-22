import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import getConfig from 'next/config';

import { call, AuthLogin, authLoginRequest } from '../../lib/api';
import { Cookie } from '../../lib/cookies';
import { routes } from '../../lib/routing';
import { useUser } from '../user/useUser';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

const authCookie = (value: string, remember: boolean): Cookie => ({
  'name': authTokenCookieName,
  'value': value,
  'path': routes.index(),
  'max-age': remember ? 1209600 : undefined,
});

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<Error>();
  const [remember, setRemember] = useState<boolean>(false);
  const { isLoggedIn, login } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(routes.dashboard());
    }
  }, [isLoggedIn, router]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const resp = await call<AuthLogin>(authLoginRequest({ email, password }));

      if (resp.status === 200) {
        const token = resp.token.token;

        login(authCookie(token, remember), routes.dashboard());
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
          <input
            id="login-remember"
            type="checkbox"
            checked={remember}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
          />
          <label htmlFor="login-remember">keep me logged in</label>
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
