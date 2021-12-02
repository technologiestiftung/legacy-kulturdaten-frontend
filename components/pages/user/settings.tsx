import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { LocaleSwitch, LocaleSwitchVariant } from '../../navigation/LocaleSwitch';
import { usePseudoUID } from '../../../lib/uid';
import { DashboardLinkList } from '../../Dasboard/DashboardLinkList';
import { StandardLinkType } from '../../../lib/generalTypes';
import { Input, InputType } from '../../input';
import { useContext, useState } from 'react';
import { Button, ButtonColor, ButtonSize } from '../../button';
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
                confirmButtonText: t('settings.deletion.confirmButton') as string,
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
          <EntryFormContainer>
            <EntryFormHead
              title={`${t('settings.personal.title')} (${t('forms.optional')})`}
              tooltip={t('settings.personal.tooltip')}
            />
            <FormGrid>
              <FormItem width={FormItemWidth.half}>
                <Input type={InputType.text} label={t('settings.personal.firstname') as string} />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input type={InputType.text} label={t('settings.personal.lastname') as string} />
              </FormItem>
              <FormItem width={FormItemWidth.full}>
                <Button color={ButtonColor.black} size={ButtonSize.big}>
                  {t('forms.save') as string}
                </Button>
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
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
