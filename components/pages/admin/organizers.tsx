import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { routes } from '../../../config/routes';
import { useT } from '../../../lib/i18n';
import { useLocale } from '../../../lib/routing';
import { useOrganizerId } from '../../../lib/useOrganizer';
import { EntryHeader } from '../../EntryHeader';
import { useUser } from '../../user/useUser';

export const AdminOrganizersPage: React.FC = () => {
  const t = useT();
  const { user, isSuperuser } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const organizerId = useOrganizerId();

  // Redirect non superuser users to dashboard
  useEffect(() => {
    if (user?.id && !isSuperuser) {
      router.replace(routes.dashboard({ locale, query: { organizer: organizerId } }));
    }
  }, [isSuperuser, locale, organizerId, router, user?.id]);

  return (
    <>
      <EntryHeader title={t('settings.title') as string} subTitle={'organizers'} minimalVariant />
    </>
  );
};
