import { useEffect, useState } from 'react';
import { NextPage } from 'next';

import { UserContextProvider } from '../../components/user/UserContext';
import { Profile } from '../../components/user/Profile';

const ProfilePage: NextPage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return <UserContextProvider>{loaded ? <Profile /> : <div>...loading</div>}</UserContextProvider>;
};

export default ProfilePage;
