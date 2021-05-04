import styled from '@emotion/styled';
import { useContext } from 'react';
import {
  Breakpoint,
  useBreakpoint,
  useBreakpointOrWider,
  WindowContext,
} from '../../lib/WindowService';
import { mq } from '../globals/Constants';

import { MainMenuProps } from '../navigation/mainMenu/MainMenu';
import { NavigationContext } from '../navigation/NavigationContext';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: var(--app-height);
  overflow: hidden;
  align-content: flex-start;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: repeat(11, 1fr);
  }

  ${mq(Breakpoint.wide)} {
    grid-template-columns: repeat(12, 1fr);
  }
`;

const MenuSlot = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 3rem;
  max-height: 3rem;
  z-index: 1000;
  grid-column: 1 / span 4;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / span 3;
  }

  ${mq(Breakpoint.wide)} {
    grid-column: 1 / span 2;
    height: unset;
    max-height: unset;
  }
`;

const TitleBarSlot = styled.div`
  position: relative;
  grid-column: 1 / span 4;

  ${mq(Breakpoint.mid)} {
    grid-column: 4 / -1;
  }

  ${mq(Breakpoint.wide)} {
    grid-column: 3 / -1;
  }
`;

const ContentSlot = styled.div`
  position: relative;
  grid-column: 1 / span 4;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.wide)} {
    grid-column: 3 / -1;
  }
`;

const TitleAndContentContainer = styled.div`
  max-height: 100%;
  overflow: hidden;

  ${mq(Breakpoint.wide)} {
    grid-column: 3 / -1;
  }
`;

const MainMenuOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--black);
  opacity: 0.7;
  z-index: 999;
  cursor: pointer;
`;

interface AppLayoutProps {
  mainMenu: React.ReactElement<MainMenuProps>;
  content: React.ReactNode;
  titleBar?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  mainMenu,
  titleBar,
  content,
}: AppLayoutProps) => {
  const currentBreakpoint = useBreakpoint();
  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);
  const { mainMenuOpen, setMainMenuOpen } = useContext(NavigationContext);
  const { rendered } = useContext(WindowContext);

  const isMidBreakpoint = currentBreakpoint === Breakpoint.mid;
  const showMenuOverlay = mainMenuOpen && isMidBreakpoint;

  const titleAndContent = isWideOrWider ? (
    <TitleAndContentContainer>
      {titleBar ? <TitleBarSlot>{titleBar}</TitleBarSlot> : ''}
      <ContentSlot>{content}</ContentSlot>
    </TitleAndContentContainer>
  ) : (
    <>
      {titleBar ? <TitleBarSlot>{titleBar}</TitleBarSlot> : ''}
      <ContentSlot>{content}</ContentSlot>
    </>
  );

  return (
    <Container>
      <MenuSlot>{mainMenu}</MenuSlot>
      {rendered ? titleAndContent : ''}
      {showMenuOverlay ? <MainMenuOverlay onClick={() => setMainMenuOpen(false)} /> : ''}
    </Container>
  );
};
