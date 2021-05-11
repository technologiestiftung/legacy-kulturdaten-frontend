import { NextPage } from 'next';
import useSWR from 'swr';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import {
  ApiRoutes,
  getApiUrlString,
  OrganizerList,
  organizerListFactory,
  useApiCall,
} from '../../../lib/api';

const OrganizerListPage: NextPage = () => {
  const call = useApiCall();

  const { data, error } = useSWR(getApiUrlString(ApiRoutes.organizerList), () =>
    call<OrganizerList>(organizerListFactory)
  );
  return (
    <AppWrapper titleBar={<TitleBar title="Organizer List" />}>
      <div>
        <div>Organizer List</div>
        <div>{JSON.stringify({ data })}</div>
        <div>{JSON.stringify({ error })}</div>
      </div>
    </AppWrapper>
  );
};
export default OrganizerListPage;
