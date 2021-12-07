import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { LocaleSwitch, LocaleSwitchVariant } from '../../navigation/LocaleSwitch';
import { usePseudoUID } from '../../../lib/uid';
import { DashboardLinkList } from '../../Dasboard/DashboardLinkList';
import { StandardLinkType } from '../../../lib/generalTypes';
import { Input, InputType } from '../../input';
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Button, ButtonColor, ButtonSize, ButtonType } from '../../button';
import { UserContext } from '../../user/UserContext';
import {
  DashboardTile,
  DashboardTileText,
  DashboardTileTextP,
  DashboardTileVariant,
} from '../../Dasboard/DashboardTile';
import { Checkbox } from '../../checkbox';
import { SettingsHeader } from './SettingsHeader';
import { useConfirmScreen } from '../../Confirm/ConfirmScreen';
import { useUser } from '../../user/useUser';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { useApiCall } from '../../../lib/api';
import { UserUpdate, userUpdateFactory } from '../../../lib/api/routes/user/update';
import { useRouter } from 'next/router';
import { useLocale } from '../../../lib/routing';
import { useOrganizerId } from '../../../lib/useOrganizer';
import { routes } from '../../../config/routes';
import { Info, InfoColor } from '../../info';

const TermsComponent: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const uid = usePseudoUID();
  const t = useT();
  const loadingScreen = useLoadingScreen();
  const call = useApiCall();
  const { mutateUserInfo } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const organizerId = useOrganizerId();

  return (
    <EntryFormContainer>
      <FormGrid>
        <DashboardTile
          title={t('settings.terms.title') as string}
          variant={DashboardTileVariant.hint}
        >
          <DashboardTileText>
            <DashboardTileTextP>{t('settings.terms.text')}</DashboardTileTextP>
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <Checkbox
                  id={`${uid}-terms`}
                  label={t('register.confirmationText')}
                  required
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
              </FormItem>
              <FormItem width={FormItemWidth.full}>
                <Button
                  size={ButtonSize.big}
                  color={ButtonColor.black}
                  disabled={!accepted}
                  onClick={() => {
                    if (accepted) {
                      loadingScreen(t('settings.terms.loading'), async () => {
                        try {
                          const resp = await call<UserUpdate>(userUpdateFactory, {
                            user: {
                              attributes: {
                                acceptedTermsAt: new Date().toISOString(),
                              },
                            },
                          });

                          if (resp.status === 200) {
                            mutateUserInfo();
                            setTimeout(() => {
                              router.push(
                                routes.dashboard({
                                  locale,
                                  query: {
                                    organizer: organizerId,
                                  },
                                })
                              );
                            }, 250);
                            return { success: true };
                          }

                          return { success: false, error: t('general.serverProblem') };
                        } catch (e) {
                          console.error(e);
                          return { success: false, error: t('general.serverProblem') };
                        }
                      });
                    }
                  }}
                >
                  {t('settings.terms.button')}
                </Button>
              </FormItem>
            </FormGrid>
          </DashboardTileText>
        </DashboardTile>
      </FormGrid>
    </EntryFormContainer>
  );
};

const UserDeleteComponent: React.FC = () => {
  const { user, mutateUserInfo } = useUser();
  const confirmScreen = useConfirmScreen();
  const loadingScreen = useLoadingScreen();
  const t = useT();
  const call = useApiCall();

  return (
    <EntryFormContainer>
      <EntryFormHead title={t('settings.deletion.title') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>{t('settings.deletion.text')}</FormItem>
        <FormItem width={FormItemWidth.full}>
          <Button
            size={ButtonSize.big}
            onClick={() =>
              confirmScreen({
                title: t('settings.deletion.title') as string,
                message: t('settings.deletion.confirm', { email: user?.attributes?.email }),
                confirmText: t('settings.deletion.confirmButton') as string,
                onConfirm: async () => {
                  loadingScreen(t('settings.deletion.loading'), async () => {
                    try {
                      const resp = await call<UserUpdate>(userUpdateFactory, {
                        user: {
                          attributes: {
                            deletionRequestedAt: new Date().toISOString(),
                          },
                        },
                      });

                      if (resp.status === 200) {
                        mutateUserInfo();
                        return { success: true };
                      }

                      return { success: false, error: t('general.serverProblem') };
                    } catch (e) {
                      return { success: false, error: t('general.serverProblem') };
                    }
                  });
                },
                condition: {
                  label: t('settings.deletion.confirmInputLabel') as string,
                  value: user?.attributes?.email,
                  error: t('settings.deletion.confirmError') as string,
                },
              })
            }
          >
            {t('settings.deletion.button')}
          </Button>
        </FormItem>
      </FormGrid>
    </EntryFormContainer>
  );
};

const passwordErrorId = 0;
const requestErrorId = 1;

const UserPasswordUpdate: React.FC = () => {
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
    <EntryFormContainer>
      <EntryFormHead title={t('settings.password.title') as string} />
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
              loadingScreen(t('settings.password.loading'), async () => {
                try {
                  await call<UserUpdate>(userUpdateFactory, {
                    user: {
                      attributes: {
                        password: newPassword,
                        passwordConfirmation: confirmPassword,
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
                    (error) => error.rule === 'unique' && error.field === 'email'
                  )
                    ? (t('register.uniqueEmailError') as string)
                    : (t('register.requestError') as string);

                  setErrors([
                    { id: requestErrorId, message: visibleError },
                    ...errors.filter(({ id }) => id !== requestErrorId),
                  ]);
                  return { success: false, error: <Info>{visibleError}</Info> };
                }
              });
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
                id="old-password"
                minLength={8}
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
                id="new-password"
                minLength={8}
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
                id="confirm-password"
                minLength={8}
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
    </EntryFormContainer>
  );
};

export const UserSettingsPage: React.FC = () => {
  const t = useT();
  const uid = usePseudoUID();
  const { acceptedTerms } = useContext(UserContext);

  return (
    <>
      <SettingsHeader />
      <div>
        <EntryFormWrapper>
          {!acceptedTerms && <TermsComponent />}
          <UserPasswordUpdate />
          <EntryFormContainer>
            <EntryFormHead
              title={t('menu.localeSwitch.label') as string}
              id={`${uid}-localeswitch`}
            />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <LocaleSwitch
                  switchVariant={LocaleSwitchVariant.settings}
                  labelledBy={`${uid}-localeswitch`}
                />
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
          <EntryFormContainer>
            <EntryFormHead title={t('settings.legal.title') as string} />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <DashboardLinkList
                  links={[
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.legalNotice') as string,
                      href: 'https://kulturdaten.berlin/impressum/',
                    },
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.terms') as string,
                      href: ' https://kulturdaten.berlin/agb/',
                    },
                    {
                      type: StandardLinkType.external,
                      title: t('settings.legal.mediaLicense') as string,
                      href: 'https://kulturdaten.berlin/daten-bereitstellen/#lizenz',
                    },
                  ]}
                />
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
          <UserDeleteComponent />
        </EntryFormWrapper>
      </div>
    </>
  );
};
