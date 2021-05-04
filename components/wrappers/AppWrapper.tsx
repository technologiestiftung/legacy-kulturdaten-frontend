import { ReactNode } from 'react';
import { Navigation } from '../navigation';
import { LocaleSwitch } from '../navigation/LocaleSwitch';

import { useUser } from '../user/useUser';

interface AppWrapperProps {
  children: ReactNode;
}

const UseUser: React.FC = () => {
  useUser();
  return null;
};

export const AppWrapper: React.FC = ({ children }: AppWrapperProps) => {
  return (
    <>
      <UseUser />
      <Navigation />
      {children}
      <div>
        <LocaleSwitch />
      </div>
    </>
  );
};
