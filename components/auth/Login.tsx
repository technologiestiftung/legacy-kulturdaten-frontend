import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import getConfig from 'next/config';
import styled from '@emotion/styled';

import { AuthLogin, authLoginFactory, useApiCall } from '../../lib/api';
import { Cookie } from '../../lib/cookies';
import { routes, useLocale } from '../../lib/routing';
import { useUser } from '../user/useUser';
import { Locale } from '../../config/locales';
import { useT } from '../../lib/i18n';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

const authCookie = (value: string, remember: boolean, locale: Locale): Cookie => ({
  'name': authTokenCookieName,
  'value': value,
  'path': routes.index({ locale }),
  'max-age': remember ? 1209600 : undefined,
});

export const StyledTestFormContainer = styled.div`
  margin: 1.5rem 0;
`;

export const StyledTestInput = styled.input`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  margin-bottom: 0.75rem;
  width: 100%;
`;

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<Error>();
  const [remember, setRemember] = useState<boolean>(false);
  const { isLoggedIn, login } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const call = useApiCall();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(routes.dashboard({ locale }));
    }
  }, [isLoggedIn, router, locale]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const resp = await call<AuthLogin>(authLoginFactory, { body: { email, password } });

      if (resp.status === 200) {
        const token = resp.body.meta.token.token;

        login(authCookie(token, remember, locale), routes.dashboard({ locale }));
      }
    } catch (e) {
      setError(e);
    }
  };

  const form = (
    <StyledTestFormContainer>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="login-email">{t('login.email')}</label>
          <br />
          <StyledTestInput
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            id="login-email"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password">{t('login.password')}</label>
          <br />
          <StyledTestInput
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
          <label htmlFor="login-remember">{t('login.remember')}</label>
        </div>
        <div>
          <input type="submit" value={t('login.submit') as string} />
        </div>
      </form>
      {error ? <div>{error.message}</div> : ''}
    </StyledTestFormContainer>
  );

  return <div>{form}</div>;
};
