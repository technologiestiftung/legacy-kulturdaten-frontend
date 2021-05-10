import { NextPage } from 'next';
import useSWR from 'swr';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import {
  ApiRoutes,
  call,
  getApiUrlString,
  OrganizerList,
  organizerListBlueprint,
} from '../../../lib/api';
import { useUser } from '../../../components/user/useUser';

const OrganizerListPage: NextPage = () => {
  const { authToken } = useUser();

  const { data, error } = useSWR(getApiUrlString(ApiRoutes.organizerList), () =>
    call<OrganizerList>(organizerListBlueprint(authToken))
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
