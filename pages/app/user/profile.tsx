import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import { Profile } from '../../../components/user/Profile';
import { routes } from '../../../config/routes';

const ProfilePage: NextPage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return (
    <>
      <div>
        <Link href={routes.dashboard()}>
          <a>Dashboard</a>
        </Link>
      </div>
      {loaded ? <Profile /> : <div>...loading</div>}
    </>
  );
};

export default ProfilePage;
