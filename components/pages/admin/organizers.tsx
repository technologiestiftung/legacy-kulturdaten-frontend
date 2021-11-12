import { useT } from '../../../lib/i18n';
import { EntryHeader } from '../../EntryHeader';

export const AdminOrganizersPage: React.FC = () => {
  const t = useT();

  return (
    <>
      <EntryHeader title={t('settings.title') as string} subTitle={'organizers'} minimalVariant />
    </>
  );
};
