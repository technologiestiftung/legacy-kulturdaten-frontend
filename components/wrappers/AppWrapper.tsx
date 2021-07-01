import React, { ReactNode } from 'react';
import { useMenuStructure, useAppTitle } from '../../config/structure';
import { AppLayout } from '../layouts/AppLayout';
import { HeaderLink } from '../navigation/header/HeaderLink';
import { useMainMenu } from '../navigation/mainMenu/MainMenu';
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
  const menuStructure = useMenuStructure();
  const appTitle = useAppTitle();

  const mainMenu = useMainMenu(menuStructure, appTitle, HeaderLink, subMenuKey);

  return (
    <>
      <UseUser />
      <AppLayout mainMenu={mainMenu} content={children} />
    </>
  );
};
