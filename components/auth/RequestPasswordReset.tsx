import { ChangeEvent, FormEvent, useState } from 'react';

import { useApiCall } from '../../lib/api';
import { routes, useLocale } from '../../lib/routing';
import { useT } from '../../lib/i18n';
import { Anchor } from '../anchor';
import { Button, ButtonColor, ButtonContentPosition, ButtonSize, ButtonType } from '../button';
import { Info } from '../info';
import { Input, InputType } from '../input';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import {
  AuthContent,
  AuthFormContainer,
  AuthFormItem,
  AuthHead,
  AuthHeadline,
  AuthSubline,
} from './AuthWrapper';
import { StandardLinkType } from '../../lib/generalTypes';
import {
  AuthRequestPasswordReset,
  authRequestPasswordResetFactory,
} from '../../lib/api/routes/auth/requestPasswordReset';

const requestErrorId = 1;

export const passwordMinLength = 8;

export const RequestPasswordResetForm: React.FC = () => {
  const locale = useLocale();
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<{ id: number; message: string }[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const t = useT();
  const call = useApiCall();
  const loadingScreen = useLoadingScreen();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrors([]);

    loadingScreen(
      t('requestPasswordReset.loading'),
      async () => {
        try {
          await call<AuthRequestPasswordReset>(authRequestPasswordResetFactory, {
            body: {
              email,
            },
          });
          setSuccess(true);
          return { success: true };
        } catch (e) {
          const requestErrors = e.message
            ? (JSON.parse(e.message)?.errors as {
                rule: string;
                field: string;
                message: string;
              }[])
            : undefined;

          const visibleError = requestErrors?.find(
            (error) => error.rule === 'exists' && error.field === 'email'
          )
            ? (t('requestPasswordReset.nonExistantEmailError') as string)
            : (t('requestPasswordReset.requestError') as string);

          setErrors([
            { id: requestErrorId, message: visibleError },
            ...errors.filter(({ id }) => id !== requestErrorId),
          ]);
          return { success: false, error: <Info>{visibleError}</Info> };
        }
      },
      t('general.takeAFewSeconds')
    );
  };

  return (
    <AuthContent>
      <AuthHead>
        <AuthHeadline>
          {t(success ? 'requestPasswordReset.successHeadline' : 'requestPasswordReset.headline')}
        </AuthHeadline>
        <AuthSubline>
          {t(success ? 'requestPasswordReset.successSubline' : 'requestPasswordReset.subline')}
        </AuthSubline>
      </AuthHead>

      {!success ? (
        <form onSubmit={submitHandler}>
          <AuthFormContainer>
            <div>
              <Input
                value={email}
                autoComplete="email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                label={t('register.email') as string}
                placeholder={t('login.emailPlaceholder') as string}
                type={InputType.email}
                id="register-email"
                required
              />
            </div>
            <Button
              type={ButtonType.submit}
              size={ButtonSize.big}
              color={ButtonColor.black}
              contentPosition={ButtonContentPosition.center}
            >
              {t('requestPasswordReset.submit')}
            </Button>
            <AuthFormItem justifyContent="center">
              <span>
                {t('requestPasswordReset.loginReference')}{' '}
                <Anchor
                  href={routes.login({ locale })}
                  title={t('requestPasswordReset.loginReferenceLinkText') as string}
                  type={StandardLinkType.internal}
                />
              </span>
            </AuthFormItem>
          </AuthFormContainer>
        </form>
      ) : (
        ''
      )}
      {errors?.length > 0 && (
        <AuthFormContainer>
          {errors.map(({ message }, index) => (
            <Info key={index}>{message}</Info>
          ))}
        </AuthFormContainer>
      )}
    </AuthContent>
  );
};
