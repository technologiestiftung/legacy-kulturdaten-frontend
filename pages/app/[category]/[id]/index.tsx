import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TitleBar } from '../../../../components/navigation/TitleBar';
import { OrganizerShowPage } from '../../../../components/pages/organizer/show';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';
import { useCategory, useEntry } from '../../../../lib/categories';

const EntryIndexPage: NextPage = () => {
  const router = useRouter();
  const category = useCategory();

  return <OrganizerShowPage category={category} query={router?.query} />;
};

export default EntryIndexPage;
