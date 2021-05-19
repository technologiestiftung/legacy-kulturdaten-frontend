import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useContext, useEffect, useRef } from 'react';
import 'wicg-inert';

import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../lib/WindowService';
import { insetBorder, mq } from '../globals/Constants';
import { MainMenuProps, useMainMenuOverlayVisible } from '../navigation/mainMenu/MainMenu';
import { NavigationContext } from '../navigation/NavigationContext';
import { TitleBarProps } from '../navigation/TitleBar';
import { useUser } from '../user/useUser';

const Container = styled.div<{ hasSecondaryMenu?: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto 1fr;
  width: 100%;
  height: var(--app-height);
  overflow: hidden;
  align-content: flex-start;
  justify-items: stretch;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: repeat(11, 1fr);
  }

  ${mq(Breakpoint.wide)} {
    grid-template-rows: auto;
    align-content: flex-start;
    grid-template-columns: repeat(12, 1fr);
  }

  ${mq(Breakpoint.ultra)} {
    grid-template-columns: repeat(2, 133px) repeat(10, 1fr);
  }

  ${({ hasSecondaryMenu }) =>
    hasSecondaryMenu
      ? css`
          ${mq(Breakpoint.ultra)} {
            grid-template-columns: repeat(4, 133px) repeat(8, 1fr);
          }
        `
      : ''}
`;

const MenuSlot = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 3rem;
  max-height: 3rem;
  z-index: 1000;
  grid-column: 1 / span 4;
  align-self: flex-start;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / span 3;
  }

  ${mq(Breakpoint.wide)} {
    grid-column: 1 / span 2;
    height: unset;
    max-height: unset;
  }
`;

const TitleBarSlot = styled.div<{ disabled?: boolean; hasSecondaryMenu?: boolean }>`
  position: relative;
  grid-column: 1 / span 4;
  align-self: flex-start;
  grid-row: 2 / span 1;

  ${mq(Breakpoint.mid)} {
    grid-row: 1 / span 1;
    grid-column: 4 / -1;
  }

  ${mq(Breakpoint.wide)} {
    align-self: stretch;
    grid-column: 3 / -1;
  }

  ${({ hasSecondaryMenu }) =>
    hasSecondaryMenu
      ? css`
          /* ${mq(Breakpoint.mid)} {
            grid-column: 7 / -1;
          } */

          ${mq(Breakpoint.wide)} {
            grid-column: 6 / -1;
          }
        `
      : ''}
`;

const ContentSlot = styled.div<{ disabled?: boolean; hasSecondaryMenu?: boolean }>`
  position: relative;
  grid-column: 1 / span 4;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: ${insetBorder(false, true, true, true)};

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
    grid-row: 2 / -1;
  }

  ${mq(Breakpoint.wide)} {
    flex-grow: 1;
    box-shadow: ${insetBorder(false, true, true)};
    grid-column: 3 / -1;
    grid-row: auto;
  }

  ${({ hasSecondaryMenu }) =>
    hasSecondaryMenu
      ? css`
          ${mq(Breakpoint.mid)} {
            grid-column: 4 / -1;
            box-shadow: ${insetBorder(false, true, true)};
          }

          ${mq(Breakpoint.wide)} {
            grid-column: 6 / -1;
          }
        `
      : ''}
`;

const SecondarySlot = styled.div`
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  grid-column: 3 / span 2;
  grid-row: 1 / -1;
  justify-content: flex-start;
`;

const SecondaryTitleSlot = styled.div`
  position: relative;
  background: var(--grey-200);
  flex-grow: 0;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / span 3;
    grid-row: 2 / span 1;
    box-shadow: ${insetBorder(true, true, false)};
  }

  ${mq(Breakpoint.wide)} {
    box-shadow: ${insetBorder(false, true, false)};
  }
`;

const SecondaryMenuSlot = styled.div`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--grey-200);
  box-shadow: ${insetBorder(false, true, false, true)};
  border-bottom: 1px solid var(--grey-400);
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / span 3;
    grid-row: 3 / -1;
  }

  ${mq(Breakpoint.wide)} {
    box-shadow: ${insetBorder(false, true, false)};
  }
`;

const TitleAndContentContainer = styled.div<{ hasSecondaryMenu?: boolean }>`
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  ${mq(Breakpoint.wide)} {
    grid-column: 3 / -1;
    grid-row: 1 / -1;
  }

  ${({ hasSecondaryMenu }) =>
    hasSecondaryMenu
      ? css`
          ${mq(Breakpoint.wide)} {
            grid-column: 5 / -1;
          }
        `
      : ''}
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
  titleBar: React.ReactElement<TitleBarProps>;
  secondaryMenu?: {
    titleBar: React.ReactElement<TitleBarProps>;
    content: React.ReactNode;
  };
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  mainMenu,
  titleBar,
  content,
  secondaryMenu,
}: AppLayoutProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);
  const isMainMenuOverlayVisible = useMainMenuOverlayVisible();
  const { setMainMenuOpen } = useContext(NavigationContext);
  const { rendered } = useContext(WindowContext);
  const titleBarRef = useRef<HTMLDivElement>();
  const contentSlotRef = useRef<HTMLDivElement>();
  useUser();

  const hasSecondaryMenu = typeof secondaryMenu !== 'undefined';

  // Add "inert" attribute to elements behind MainMenuOverlay.
  // Inert is a new web standard which marks elements as not interactive while keeping them visible.
  // Think of "visiblity: hidden" but still visible.
  // Used for preventing not/partially visible elements from being focusable via tabbing.
  useEffect(() => {
    if (isMainMenuOverlayVisible) {
      titleBarRef.current?.setAttribute('inert', '');
      contentSlotRef.current?.setAttribute('inert', '');
    } else {
      titleBarRef.current?.removeAttribute('inert');
      contentSlotRef.current?.removeAttribute('inert');
    }
  }, [isMainMenuOverlayVisible]);

  const renderedTitleBar = titleBar ? (
    <TitleBarSlot ref={titleBarRef} hasSecondaryMenu={hasSecondaryMenu}>
      {titleBar}
    </TitleBarSlot>
  ) : (
    ''
  );

  const renderedContentSlot = (
    <ContentSlot hasSecondaryMenu={hasSecondaryMenu} ref={contentSlotRef}>
      {content}
    </ContentSlot>
  );

  const titleAndContent = isWideOrWider ? (
    <TitleAndContentContainer hasSecondaryMenu={hasSecondaryMenu}>
      {renderedTitleBar}
      {renderedContentSlot}
    </TitleAndContentContainer>
  ) : (
    <>
      {renderedTitleBar}
      {renderedContentSlot}
    </>
  );

  const renderedSecondaryMenu = secondaryMenu ? (
    isWideOrWider ? (
      <SecondarySlot>
        <SecondaryTitleSlot>{secondaryMenu.titleBar}</SecondaryTitleSlot>
        <SecondaryMenuSlot>{secondaryMenu.content}</SecondaryMenuSlot>
      </SecondarySlot>
    ) : isMidOrWider ? (
      <>
        <SecondaryTitleSlot>{secondaryMenu.titleBar}</SecondaryTitleSlot>
        <SecondaryMenuSlot>{secondaryMenu.content}</SecondaryMenuSlot>
      </>
    ) : null
  ) : null;

  return (
    <Container hasSecondaryMenu={hasSecondaryMenu}>
      <MenuSlot>{mainMenu}</MenuSlot>
      {rendered && renderedSecondaryMenu}
      {rendered && titleAndContent}
      {isMainMenuOverlayVisible && <MainMenuOverlay onClick={() => setMainMenuOpen(false)} />}
    </Container>
  );
};
