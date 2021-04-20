import { ReactNode } from 'react';
import { Navigation } from '../Navigation';

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
    </>
  );
};
