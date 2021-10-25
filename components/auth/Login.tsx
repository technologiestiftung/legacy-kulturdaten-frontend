import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';

import { AuthLogin, authLoginFactory, useApiCall } from '../../lib/api';
import { Cookie } from '../../lib/cookies';
import { routes, useLocale } from '../../lib/routing';
import { useUser } from '../user/useUser';
import { Locale } from '../../config/locales';
import { useT } from '../../lib/i18n';
import { defaultOrganizerId } from '../../lib/useOrganizer';
import { Anchor } from '../anchor';
import { Input, InputType } from '../input';
import { Checkbox } from '../checkbox';
import { Button, ButtonSize, ButtonColor, ButtonType, ButtonContentPosition } from '../button';
import { AuthFormContainer, AuthFormItem } from './AuthWrapper';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { Info } from '../info';
import { StandardLinkType } from '../../lib/generalTypes';

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
  const loadingScreen = useLoadingScreen();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(routes.dashboard({ locale, query: { organizer: defaultOrganizerId } }));
    }
  }, [isLoggedIn, router, locale]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (formRef.current?.checkValidity()) {
      loadingScreen(t('login.loading'), async () => {
        try {
          const resp = await call<AuthLogin>(authLoginFactory, {
            body: { email, password },
          });

          if (resp.status === 200) {
            const token = resp.body.meta.token.token;

            login(
              authCookie(token, remember, locale),
              routes.dashboard({
                locale,
                query: { organizer: defaultOrganizerId },
              })
            );

            return { success: true };
          }
        } catch (e) {
          setError(e);
          return { success: false, error: <Info>{t('login.error')}</Info> };
        }
      });
    }
  };

  const form = (
    <form onSubmit={submitHandler} ref={formRef}>
      <AuthFormContainer>
        <div>
          <Input
            type={InputType.email}
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
            href={'#'}
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
        {error ? <Info>{t('login.error')}</Info> : ''}
      </AuthFormContainer>
    </form>
  );

  return <div>{form}</div>;
};
