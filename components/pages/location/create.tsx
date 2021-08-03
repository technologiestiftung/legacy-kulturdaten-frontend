import { CategoryPage } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { AppWrapper } from '../../wrappers/AppWrapper';
import { CreateEntryForm } from '../helpers/form/CreateEntry';

export const LocationCreatePage: React.FC<CategoryPage> = ({ category }: CategoryPage) => {
  const t = useT();

  return (
    <AppWrapper>
      <CreateEntryForm category={category} title={t('categories.location.form.create') as string} />
    </AppWrapper>
  );
};
