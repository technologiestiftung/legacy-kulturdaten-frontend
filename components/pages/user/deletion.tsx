import styled from '@emotion/styled';

import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useT } from '../../../lib/i18n';
import { usePseudoUID } from '../../../lib/uid';
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

const StyledButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  justify-content: space-between;
`;

const CancelDeletionComponent: React.FC = () => {
  const t = useT();
  const { user, logout } = useUser();
  const formatDate = useDate();

  const dateOfDeletion = useMemo(
    () =>
      add(
        user?.attributes?.requestedDeletionAt
          ? new Date(user?.attributes?.requestedDeletionAt)
          : new Date(),
        { weeks: 2 }
      ),
    [user?.attributes?.requestedDeletionAt]
  );

  return (
    <EntryFormContainer>
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
              <Button size={ButtonSize.big} color={ButtonColor.black}>
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
    </EntryFormContainer>
  );
};

export const UserDeletionPage: React.FC = () => {
  const t = useT();
  const uid = usePseudoUID();
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
