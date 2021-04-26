import { useEffect, useState } from 'react';
import { NextPage } from 'next';

import { Profile } from '../../../components/user/Profile';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';

const ProfilePage: NextPage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return <AppWrapper>{loaded ? <Profile /> : <div>...loading</div>}</AppWrapper>;
};

export default ProfilePage;
