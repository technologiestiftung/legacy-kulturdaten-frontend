import { useEffect, useState } from 'react';
import { NextPage } from 'next';

import { Profile } from '../../../components/user/Profile';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { useT } from '../../../lib/i18n';

const ProfilePage: NextPage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const t = useT();

  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  return <AppWrapper>{loaded ? <Profile /> : <div>...loading</div>}</AppWrapper>;
};

export default ProfilePage;
