import React, { ReactNode, useContext } from 'react';
import { useMenuStructure, useAppTitle } from '../../config/structure';
import { AppLayout } from '../layouts/AppLayout';
import { HeaderLink } from '../navigation/header/HeaderLink';
import { useNavigation } from '../navigation';

import { useUser } from '../user/useUser';
import { WindowContext } from '../../lib/WindowService';

const UseUser: React.FC = () => {
  useUser();
  return null;
};

interface AppWrapperProps {
  children: ReactNode;
  subMenuKey?: string;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({
  children,
  subMenuKey,
}: AppWrapperProps) => {
  const NavigationStructure = useMenuStructure();
  const appTitle = useAppTitle();
  const { rendered } = useContext(WindowContext);

  const { header, sidebar } = useNavigation(NavigationStructure, appTitle, HeaderLink, subMenuKey);

  return (
    <>
      <UseUser />
      {rendered && <AppLayout header={header} sidebar={sidebar} content={children} />}
    </>
  );
};
