import { useRouter } from 'next/router';
import { useState } from 'react';
import { useApiCall } from '../../lib/api';
import { UserUpdate, userUpdateFactory } from '../../lib/api/routes/user/update';
import { useT } from '../../lib/i18n';
import { useLocale } from '../../lib/routing';
import { usePseudoUID } from '../../lib/uid';
import { useOrganizerId } from '../../lib/useOrganizer';
import { Button, ButtonColor, ButtonSize } from '../button';
import { Checkbox } from '../checkbox';
import {
  DashboardTile,
  DashboardTileText,
  DashboardTileTextP,
  DashboardTileVariant,
} from '../Dasboard/DashboardTile';
import { StyledEntryFormContainer } from '../EntryForm/wrappers';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import { useUser } from '../user/useUser';
import { routes } from '../../config/routes';

export const Terms: React.FC = () => {
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
    <StyledEntryFormContainer>
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
                  onClick={async() => {
                    if (accepted) {
                        try {
                          const resp = await call<UserUpdate>(userUpdateFactory, {
                            attributes: {
                              user: {
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
    </StyledEntryFormContainer>
  );
};
