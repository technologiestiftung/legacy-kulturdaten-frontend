import { useEffect, useState } from 'react';
import { NextPage } from 'next';

import { Profile } from '../../../components/user/Profile';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { TitleBar } from '../../../components/navigation/TitleBar';

const ProfilePage: NextPage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return (
    <AppWrapper titleBar={<TitleBar title="User Profile" />}>
      {loaded ? <Profile /> : <div>...loading</div>}
    </AppWrapper>
  );
};

export default ProfilePage;
