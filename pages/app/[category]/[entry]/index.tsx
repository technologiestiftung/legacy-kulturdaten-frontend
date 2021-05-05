import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TitleBar } from '../../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';

const EntryIndexPage: NextPage = () => {
  const router = useRouter();

  return (
    <AppWrapper titleBar={<TitleBar title={`${router?.query?.category?.toString()} entry`} />}>
      Entry Overview
    </AppWrapper>
  );
};

export default EntryIndexPage;
