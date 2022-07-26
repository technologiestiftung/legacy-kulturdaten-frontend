import styled from '@emotion/styled';

import { StyledEntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { useContext, useEffect, useMemo } from 'react';
import { UserContext } from '../../user/UserContext';
import { useRouter } from 'next/router';
import { useLocale } from '../../../lib/routing';
import { routes } from '../../../config/routes';
import { FormGrid } from '../helpers/formComponents';
import {
  DashboardTile,
  DashboardTileText,
  DashboardTileVariant,
} from '../../Dasboard/DashboardTile';
import { Button, ButtonColor, ButtonSize } from '../../button';
import { useUser } from '../../user/useUser';
import { add } from 'date-fns';
import { DateFormat, useDate } from '../../../lib/date';
import { useApiCall } from '../../../lib/api';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { UserUpdate, userUpdateFactory } from '../../../lib/api/routes/user/update';
import { useOrganizerId } from '../../../lib/useOrganizer';

const StyledButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  justify-content: space-between;
`;

const CancelDeletionComponent: React.FC = () => {
  const t = useT();
  const { user, logout, mutateUserInfo } = useUser();
  const formatDate = useDate();
  const call = useApiCall();
  const loadingScreen = useLoadingScreen();
  const router = useRouter();
  const locale = useLocale();
  const organizerId = useOrganizerId();

  const dateOfDeletion = useMemo(
    () =>
      add(
        user?.attributes?.deletionRequestedAt
          ? new Date(user?.attributes?.deletionRequestedAt)
          : new Date(),
        { weeks: 2 }
      ),
    [user?.attributes?.deletionRequestedAt]
  );

  return (
    <StyledEntryFormContainer>
      <FormGrid>
        <DashboardTile
          title={t('settings.requestedDeletion.title') as string}
          variant={DashboardTileVariant.hint}
        >
          {t('settings.requestedDeletion.text', {
            date: dateOfDeletion ? formatDate(dateOfDeletion, DateFormat.date) : undefined,
            email: user?.attributes?.email,
          })}
          <DashboardTileText>
            <StyledButtonWrapper>
              <Button
                size={ButtonSize.big}
                color={ButtonColor.black}
                onClick={async() =>  {
                    try {
                      const resp = await call<UserUpdate>(userUpdateFactory, {
                        user: {
                          attributes: {},
                          meta: {
                            abortDeletionRequest: true,
                          },
                        },
                      });

                      if (resp.status === 200) {
                        mutateUserInfo();
                        setTimeout(() => {
                          setTimeout(() => {
                            router.replace(
                              routes.dashboard({
                                locale,
                                query: {
                                  organizer: organizerId,
                                },
                              })
                            );
                          }, 250);
                        }, 250);
                        return { success: true };
                      }

                      return { success: false, error: t('general.serverProblem') };
                    } catch (e) {
                      console.error(e);

                      return { success: false, error: t('general.serverProblem') };
                    }
                }}
              >
                {t('settings.requestedDeletion.button')}
              </Button>
            </StyledButtonWrapper>
          </DashboardTileText>
        </DashboardTile>
      </FormGrid>
      <FormGrid>
        <div>
          <Button size={ButtonSize.big} color={ButtonColor.default} onClick={logout} icon="LogOut">
            {t('userMenu.logOut')}
          </Button>
        </div>
      </FormGrid>
    </StyledEntryFormContainer>
  );
};

export const UserDeletionPage: React.FC = () => {
  const { requestedDeletion } = useContext(UserContext);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (requestedDeletion === false) {
      router.replace(routes.dashboard({ locale }));
    }
  }, [locale, requestedDeletion, router]);

  return (
    <>
      <EntryFormWrapper>
        <CancelDeletionComponent />
      </EntryFormWrapper>
    </>
  );
};
