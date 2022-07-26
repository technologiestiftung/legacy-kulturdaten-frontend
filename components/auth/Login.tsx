import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import getConfig from 'next/config';

import { AuthLogin, authLoginFactory, useApiCall } from '../../lib/api';
import { Cookie } from '../../lib/cookies';
import { routes, useLocale } from '../../lib/routing';
import { useUser } from '../user/useUser';
import { Locale } from '../../config/locales';
import { useT } from '../../lib/i18n';
import { Anchor } from '../anchor';
import { Input, InputType } from '../input';
import { Checkbox } from '../checkbox';
import { Button, ButtonSize, ButtonColor, ButtonType, ButtonContentPosition } from '../button';
import { AuthFormContainer, AuthFormItem } from './AuthWrapper';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { Info } from '../info';
import { StandardLinkType } from '../../lib/generalTypes';
import { defaultOrganizerId } from '../navigation/NavigationContext';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

const verificationErrorCode = 'E_UNVERIFIED_USER';

const authCookie = (value: string, remember: boolean, locale: Locale): Cookie => ({
  'name': authTokenCookieName,
  'value': value,
  'path': routes.index({ locale }),
  'max-age': remember ? 1209600 : undefined,
});

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>();
  const [remember, setRemember] = useState<boolean>(true);
  const { isLoggedIn, login } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const call = useApiCall();
  const loadingScreen = useLoadingScreen();
  const formRef = useRef<HTMLFormElement>(null);

  const redirect = useMemo(() => router?.query?.redirect, [router?.query?.redirect]);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(routes.dashboard({ locale, query: { organizer: defaultOrganizerId } }));
    }
  }, [isLoggedIn, router, locale]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (formRef.current?.checkValidity()) {
        try {
          const resp = await call<AuthLogin>(authLoginFactory, {
            body: { email, password },
          });

          if (resp.status === 200) {
            const token = resp.body.meta.token.token;

            login(
              authCookie(token, remember, locale),
              (redirect as string) ||
                routes.dashboard({
                  locale,
                  query: { organizer: defaultOrganizerId },
                })
            );

            return { success: true };
          }
          return { success: false, error: <Info>{t('login.error')}</Info> };
        } catch (e) {
          const requestErrors = e.message
            ? (JSON.parse(e.message)?.errors as {
                title: string;
                code: string;
                status: string;
              }[])
            : undefined;

          console.log(requestErrors);

          const visibleError = requestErrors?.find((error) => error.code === verificationErrorCode)
            ? (t('login.verificationError') as string)
            : (t('login.error') as string);

          setError(visibleError);
          return { success: false, error: <Info>{visibleError}</Info> };
        }
    }
  };

  const form = (
    <form onSubmit={submitHandler} ref={formRef}>
      <AuthFormContainer>
        <div>
          <Input
            type={InputType.email}
            autoComplete="email"
            value={email}
            label={t('login.email') as string}
            placeholder={t('login.emailPlaceholder') as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            id="login-email"
            required
          />
        </div>
        <div>
          <Input
            type={InputType.password}
            autoComplete="password"
            value={password}
            label={t('login.password') as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            id="login-password"
            required
          />
        </div>
        <AuthFormItem>
          <Checkbox
            id="login-remember"
            checked={remember}
            label={t('login.remember') as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
          />
          <Anchor
            href={routes.resetPassword({ locale })}
            type={StandardLinkType.internal}
            title={t('login.passwordReset') as string}
          />
        </AuthFormItem>
        <Button
          size={ButtonSize.big}
          color={ButtonColor.black}
          type={ButtonType.submit}
          contentPosition={ButtonContentPosition.center}
        >
          {t('login.submit')}
        </Button>
        <AuthFormItem justifyContent="center">
          <span>
            {t('login.registerReference')}{' '}
            <Anchor
              href={routes.register({ locale })}
              title={t('login.registerReferenceLinkText') as string}
              type={StandardLinkType.internal}
            />
          </span>
        </AuthFormItem>
        {error ? <Info>{error}</Info> : ''}
      </AuthFormContainer>
    </form>
  );

  return <div>{form}</div>;
};
