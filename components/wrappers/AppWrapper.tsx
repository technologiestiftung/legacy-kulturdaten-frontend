import React, { ReactNode } from 'react';
import { useMenuStructure, useAppTitle } from '../../config/structure';
import { AppLayout } from '../layouts/AppLayout';
import { HeaderLink } from '../navigation/header/HeaderLink';
import { useNavigation } from '../navigation';
import { TitleBarProps } from '../navigation/TitleBar';

import { useUser } from '../user/useUser';

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

  const navigation = useNavigation(NavigationStructure, appTitle, HeaderLink, subMenuKey);

  return (
    <>
      <UseUser />
      <AppLayout navigation={navigation} content={children} />
    </>
  );
};
