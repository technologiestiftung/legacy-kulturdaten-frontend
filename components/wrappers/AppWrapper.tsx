import { ReactNode } from 'react';

import { useUser } from '../user/useUser';

const UseUser: React.FC = () => {
  useUser();
  return null;
};

interface AppWrapperProps {
  children: ReactNode;
  subMenuKey?: string;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }: AppWrapperProps) => {
  return (
    <>
      <UseUser />
      {children}
    </>
  );
};
