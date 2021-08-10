import { CategoryPage } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { AppWrapper } from '../../wrappers/AppWrapper';
import { CreateEntryForm } from '../helpers/form/CreateEntry';

export const OrganizerCreatePage: React.FC<CategoryPage> = ({ category }: CategoryPage) => {
  const t = useT();

  return (
    <AppWrapper>
      <CreateEntryForm
        category={category}
        title={t('categories.organizer.form.create') as string}
      />
    </AppWrapper>
  );
};
