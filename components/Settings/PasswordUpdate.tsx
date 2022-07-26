import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useApiCall } from '../../lib/api';
import { UserUpdate, userUpdateFactory } from '../../lib/api/routes/user/update';
import { useT } from '../../lib/i18n';
import { passwordMinLength } from '../auth/Register';
import { ButtonType, ButtonSize, ButtonColor, Button } from '../button';
import { EntryFormHead } from '../EntryForm/EntryFormHead';
import { StyledEntryFormContainer, StyledRequiredInfoText } from '../EntryForm/wrappers';
import { Info, InfoColor } from '../info';
import { Input, InputType } from '../input';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';

const passwordErrorId = 0;
const requestErrorId = 1;

export const UserPasswordUpdate: React.FC = () => {
  const t = useT();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const call = useApiCall();
  const loadingScreen = useLoadingScreen();

  const passwordsMatch = useMemo(
    () => newPassword === confirmPassword,
    [confirmPassword, newPassword]
  );

  const [passwordConfirmationBlurred, setPasswordConfirmationBlurred] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ id: number; message: string }[]>([]);

  const valid = useMemo(
    () =>
      oldPassword?.length > 0 &&
      newPassword?.length > 0 &&
      confirmPassword?.length > 0 &&
      passwordsMatch,
    [confirmPassword?.length, newPassword?.length, oldPassword?.length, passwordsMatch]
  );

  useEffect(() => {
    if (newPassword.length > 0 && confirmPassword.length > 0) {
      const filteredErrors = errors.filter(({ id }) => id !== passwordErrorId);
      const passwordError = {
        id: passwordErrorId,
        message: t('register.passwordError') as string,
      };
      const passwordErrorPresent = errors.length !== filteredErrors.length;

      if (passwordErrorPresent && passwordsMatch) {
        setErrors(filteredErrors);
      } else if (!passwordsMatch && !passwordErrorPresent && passwordConfirmationBlurred) {
        setErrors([passwordError, ...filteredErrors]);
      }
    }
  }, [
    confirmPassword.length,
    errors,
    newPassword.length,
    passwordConfirmationBlurred,
    passwordsMatch,
    t,
  ]);

  return (
    <StyledEntryFormContainer>
      <EntryFormHead title={t('settings.password.title') as string} />
      <StyledRequiredInfoText/>
      {success ? (
        <FormGrid>
          <FormItem width={FormItemWidth.full}>
            <Info color={InfoColor.grey}>{t('settings.password.success')}</Info>
          </FormItem>
        </FormGrid>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setErrors([]);

            if (valid) {
                try {
                  call<UserUpdate>(userUpdateFactory, {
                    user: {
                      attributes: {
                        password: oldPassword,
                        newPassword,
                        newPasswordConfirmation: confirmPassword,
                      },
                    },
                  });
                  setSuccess(true);

                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordConfirmationBlurred(false);

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
                    (error) => error.message === 'Invalid user credentials'
                  )
                    ? (t('settings.password.oldPasswordError') as string)
                    : (t('register.requestError') as string);

                  setErrors([
                    { id: requestErrorId, message: visibleError },
                    ...errors.filter(({ id }) => id !== requestErrorId),
                  ]);
                  return { success: false, error: <Info>{visibleError}</Info> };
                }
            }
          }}
        >
          <FormGrid>
            <FormItem width={FormItemWidth.full}>
              <Input
                value={oldPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                label={t('settings.password.oldLabel') as string}
                placeholder={t('register.passwordPlaceholder') as string}
                type={InputType.password}
                autoComplete="current-password"
                id="old-password"
                minLength={passwordMinLength}
                required
              />
            </FormItem>
            <FormItem width={FormItemWidth.full}>
              <Input
                value={newPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                label={t('settings.password.newLabel') as string}
                placeholder={t('register.passwordPlaceholder') as string}
                type={InputType.password}
                autoComplete="new-password"
                id="new-password"
                minLength={passwordMinLength}
                required
                valid={Boolean(passwordsMatch || !passwordConfirmationBlurred)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.full}>
              <Input
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                label={t('settings.password.newConfirmLabel') as string}
                placeholder={t('register.passwordPlaceholder') as string}
                type={InputType.password}
                autoComplete="new-password"
                id="confirm-password"
                minLength={passwordMinLength}
                required
                valid={Boolean(passwordsMatch || !passwordConfirmationBlurred)}
                onBlur={() => setPasswordConfirmationBlurred(true)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.full}>
              <Button
                type={ButtonType.submit}
                size={ButtonSize.big}
                color={ButtonColor.black}
                disabled={!valid}
              >
                {t('settings.password.button')}
              </Button>
            </FormItem>
            {errors?.length > 0 && (
              <FormItem width={FormItemWidth.full}>
                {errors.map(({ message }, index) => (
                  <Info key={index}>{message}</Info>
                ))}
              </FormItem>
            )}
          </FormGrid>
        </form>
      )}
    </StyledEntryFormContainer>
  );
};
