import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import getConfig from 'next/config';

import { AuthLogin, authLoginFactory, useApiCall } from '../../lib/api';
import { Cookie } from '../../lib/cookies';
import { routes, useLocale } from '../../lib/routing';
import { useUser } from '../user/useUser';
import { Locale } from '../../config/locales';
import { useT } from '../../lib/i18n';
import { useOrganizerId } from '../../lib/useOrganizer';
import { Input, InputType } from '../input';
import { Checkbox } from '../checkbox';
import { Button, ButtonSize, ButtonColor, ButtonType } from '../button';
import { AuthFormContainer, AuthFormItem } from './AuthWrapper';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

const authCookie = (value: string, remember: boolean, locale: Locale): Cookie => ({
  'name': authTokenCookieName,
  'value': value,
  'path': routes.index({ locale }),
  'max-age': remember ? 1209600 : undefined,
});

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<Error>();
  const [remember, setRemember] = useState<boolean>(true);
  const { isLoggedIn, login } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const call = useApiCall();
  const organizerId = useOrganizerId();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(routes.dashboard({ locale, query: { organizer: organizerId } }));
    }
  }, [isLoggedIn, router, locale, organizerId]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const resp = await call<AuthLogin>(authLoginFactory, { body: { email, password } });

      if (resp.status === 200) {
        const token = resp.body.meta.token.token;

        login(
          authCookie(token, remember, locale),
          routes.dashboard({ locale, query: { organizer: organizerId } })
        );
      }
    } catch (e) {
      setError(e);
    }
  };

  const form = (
    <form onSubmit={submitHandler}>
      <AuthFormContainer>
        <div>
          <Input
            type={InputType.text}
            value={email}
            label={t('login.email') as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            id="login-email"
            required
            hideError
          />
        </div>
        <div>
          <Input
            type={InputType.password}
            value={password}
            label={t('login.password') as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            id="login-password"
            required
            hideError
          />
        </div>
        <AuthFormItem>
          <Checkbox
            id="login-remember"
            checked={remember}
            label={t('login.remember') as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
          />
          <Button size={ButtonSize.big} color={ButtonColor.black} type={ButtonType.submit}>
            {t('login.submit')}
          </Button>
        </AuthFormItem>
        {error ? <div>{error.message}</div> : ''}
      </AuthFormContainer>
    </form>
  );

  return <div>{form}</div>;
};
