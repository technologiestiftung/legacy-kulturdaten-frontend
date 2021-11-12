import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Categories } from '../../../config/categories';
import { routes } from '../../../config/routes';
import { useAppTitle } from '../../../config/structure';
import { useT } from '../../../lib/i18n';
import { useLocale } from '../../../lib/routing';
import { useOrganizerId, useSetOrganizerId } from '../../../lib/useOrganizer';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { useAdminMode } from '../../Admin/AdminContext';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { EntryHeader } from '../../EntryHeader';
import { EntryListContextProvider } from '../../EntryList/EntryListContext';
import { OrganizerList } from '../../EntryList/OrganizerList';
import { useUser } from '../../user/useUser';

export const AdminOrganizersPage: React.FC = () => {
  const t = useT();
  const { user, isSuperuser } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const organizerId = useOrganizerId();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const setOrganizerId = useSetOrganizerId();
  const appTitle = useAppTitle();
  const { start } = useAdminMode();

  // Redirect non superuser users to dashboard
  useEffect(() => {
    if (user?.id && !isSuperuser) {
      router.replace(routes.dashboard({ locale, query: { organizer: organizerId } }));
    }
  }, [isSuperuser, locale, organizerId, router, user?.id]);

  return (
    <>
      <Head>
        <title>{`${t('admin.title')} – ${t('admin.organizers.subtitle')} – ${appTitle}`}</title>
      </Head>
      <EntryHeader
        title={t('admin.title') as string}
        subTitle={t('admin.organizers.subtitle') as string}
        minimalVariant
      />
      <EntryFormWrapper>
        <EntryFormContainer>
          <EntryListContextProvider listNames={[Categories.organizer]}>
            <OrganizerList
              expandable={false}
              expanded={isMidOrWider}
              customEntryOnClick={(categoryName, id) => start(id)}
            />
          </EntryListContextProvider>
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};
