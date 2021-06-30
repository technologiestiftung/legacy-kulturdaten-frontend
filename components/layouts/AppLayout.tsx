import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useContext, useEffect, useRef } from 'react';
import 'wicg-inert';

import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../lib/WindowService';
import { insetBorder, mq, overlayStyles } from '../globals/Constants';
import { MainMenuProps, useMainMenuOverlayVisible } from '../navigation/mainMenu/MainMenu';
import { NavigationContext } from '../navigation/NavigationContext';
import { TitleBarProps } from '../navigation/TitleBar';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  position: relative;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: repeat(3, 5.5625rem) repeat(11, 1fr);
  }

  @media screen and (min-width: 61.1875rem) {
    grid-template-columns: repeat(11, 1fr);
  }

  ${mq(Breakpoint.ultra)} {
    grid-template-columns: repeat(3, 9.125rem) repeat(8, 1fr);
  }
`;

const MenuSlot = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  grid-column: 1 / -1;
  box-shadow: 0 0.125rem 0.625rem -0.25rem rgba(0, 0, 0, 0.4);

  ${mq(Breakpoint.mid)} {
    border-right: 1px solid var(--grey-400);
    box-shadow: 0.125rem 0 0.625rem -0.25rem rgba(0, 0, 0, 0.4);
    grid-column: 1 / span 3;

    height: var(--app-height);
  }
`;

const ContentSlot = styled.div`
  position: relative;
  grid-column: 1 / -1;

  ${mq(Breakpoint.mid)} {
    grid-column: 4 / -1;
  }
`;

const MainMenuOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  cursor: pointer;

  ${overlayStyles}
`;

interface AppLayoutProps {
  mainMenu: React.ReactElement<MainMenuProps>;
  content: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ mainMenu, content }: AppLayoutProps) => {
  const isMainMenuOverlayVisible = useMainMenuOverlayVisible();
  const { setMainMenuOpen } = useContext(NavigationContext);
  const { rendered } = useContext(WindowContext);
  const contentSlotRef = useRef<HTMLDivElement>();

  // Add "inert" attribute to elements behind MainMenuOverlay.
  // Inert is a new web standard which marks elements as not interactive while keeping them visible.
  // Think of "visiblity: hidden" but still visible.
  // Used for preventing not/partially visible elements from being focusable via tabbing.
  useEffect(() => {
    if (isMainMenuOverlayVisible) {
      // titleBarRef.current?.setAttribute('inert', '');
      contentSlotRef.current?.setAttribute('inert', '');
    } else {
      // titleBarRef.current?.removeAttribute('inert');
      contentSlotRef.current?.removeAttribute('inert');
    }
  }, [isMainMenuOverlayVisible]);

  const renderedContentSlot = <ContentSlot ref={contentSlotRef}>{content}</ContentSlot>;

  return (
    <Container>
      <MenuSlot>{mainMenu}</MenuSlot>
      {rendered && renderedContentSlot}
      {isMainMenuOverlayVisible && <MainMenuOverlay onClick={() => setMainMenuOpen(false)} />}
    </Container>
  );
};
