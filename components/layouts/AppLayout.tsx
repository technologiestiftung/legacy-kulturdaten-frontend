import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useContext, useEffect, useRef } from 'react';

import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { NavigationProps } from '../navigation';
import { NavigationContext } from '../navigation/NavigationContext';

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

const HeaderSlot = styled.div`
  position: fixed;
  width: 100%;
  z-index: 1001;
  box-shadow: 0 -0.125rem 0.625rem -0.125rem rgba(0, 0, 0, 0.25);
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  bottom: 0;
  left: 0;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--white);

  ${mq(Breakpoint.mid)} {
    padding-bottom: 0;
    box-shadow: 0 0.125rem 0.625rem -0.125rem rgba(0, 0, 0, 0.25);
    position: sticky;
    top: 0;
  }
`;

const HeaderSlotSecondary = styled.div`
  border-bottom: 1px solid var(--grey-400);
`;

const MenuSlot = styled.div<{ expanded?: boolean }>`
  position: fixed;
  top: 3rem;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  width: 100%;

  filter: grayscale(1);
  transform: filter 0.1s;

  &:hover {
    filter: grayscale(0);
  }

  ${mq(Breakpoint.mid)} {
    top: 3.75rem;
    border-right: 1px solid var(--grey-400);
    grid-row: 1;
    height: calc(var(--app-height) - 3.75rem);
    min-height: calc(var(--app-height) - 3.75rem);
    overflow-y: auto;

    width: 16.6875rem;

    transition: width 0.083333s, filter 0.2s;

    @media screen and (min-width: 61.1875rem) {
      width: calc(100% / 11 * 3);
    }

    ${mq(Breakpoint.ultra)} {
      width: 27.375rem;
    }
  }

  ${({ expanded }) =>
    expanded
      ? css`
          ${mq(Breakpoint.mid)} {
            width: 100%;
          }

          ${mq(Breakpoint.widish)} {
            width: calc(100% / 11 * 10);
          }

          ${mq(Breakpoint.ultra)} {
            width: calc(100% / 11 * 9);
          }
        `
      : ''}
`;

const ContentSlot = styled.div`
  position: relative;
  grid-column: 1 / -1;
  min-height: calc(var(--app-height) - var(--header-height));
  margin-bottom: calc(var(--header-height) + env(safe-area-inset-bottom));

  ${mq(Breakpoint.mid)} {
    min-height: var(--app-height);
    margin-top: var(--header-height);
    margin-bottom: 0;
    margin-top: 0;
    grid-column: 4 / -1;
    grid-row: 1;
  }
`;

interface AppLayoutProps {
  header: { main: React.ReactElement<NavigationProps>; secondary: React.ReactElement };
  sidebar: React.ReactElement;
  content: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  header,
  sidebar,
  content,
}: AppLayoutProps) => {
  const headerMain = header?.main;
  const headerSecondary = header?.secondary;
  const { setMenuExpanded } = useContext(NavigationContext);
  const { rendered } = useContext(WindowContext);
  const contentSlotRef = useRef<HTMLDivElement>();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  useEffect(() => {
    if (!isMidOrWider) {
      setMenuExpanded(false);
    }
  }, [isMidOrWider, setMenuExpanded]);

  const renderedContentSlot = <ContentSlot ref={contentSlotRef}>{content}</ContentSlot>;

  return (
    <div>
      {headerMain && <HeaderSlot>{headerMain}</HeaderSlot>}
      {headerSecondary && <HeaderSlotSecondary>{headerSecondary}</HeaderSlotSecondary>}
      {isMidOrWider && sidebar && <MenuSlot>{sidebar}</MenuSlot>}
      <Container>{rendered && renderedContentSlot}</Container>
    </div>
  );
};
