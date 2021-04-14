import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import { UserContextProvider } from '../../components/user/UserContext';
import { Profile } from '../../components/user/Profile';
import { routes } from '../../lib/routes';

const ProfilePage: NextPage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return (
    <>
      <div>
        <Link href={routes.index}>
          <a>Home page</a>
        </Link>
      </div>
      <UserContextProvider>{loaded ? <Profile /> : <div>...loading</div>}</UserContextProvider>
    </>
  );
};

export default ProfilePage;
