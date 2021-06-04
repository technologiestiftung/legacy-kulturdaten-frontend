import styled from '@emotion/styled';
import React, { useContext, useEffect, useState } from 'react';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';
import { NavigationContext } from '../navigation/NavigationContext';

const StyledOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: var(--app-height);
  overflow: hidden;
  top: 0;
  left: 0;
  display: flex;

  ${mq(Breakpoint.mid)} {
    ${contentGrid(11)}
  }

  ${mq(Breakpoint.wide)} {
    ${contentGrid(12)}
  }
`;

const StyledOverlayContentWrapper = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  ${mq(Breakpoint.mid)} {
    grid-column: 2 / -2;
  }

  ${mq(Breakpoint.wide)} {
    grid-column: 3 / -3;
  }
`;

const StyledOverlayContent = styled.div`
  position: relative;
  background: var(--grey-200);
  border-radius: 0.75rem 0.75rem 0 0;
  border: 1px solid var(--grey-400);
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    grid-column: 2 / -2;
  }

  ${mq(Breakpoint.wide)} {
    grid-column: 3 / -3;
  }
`;

const StyledOverlayBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--black);
  opacity: 0.8;
  cursor: pointer;
`;

const StyledOverlayCloseButton = styled.div`
  position: relative;
  width: 100%;
  text-align: right;
  padding: 0.75rem 0;
  color: var(--white);
  cursor: pointer;
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;
`;

interface OverlayProps {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const Overlay: React.FC<OverlayProps> = ({ children, isOpen, setIsOpen }: OverlayProps) => (
  <>
    {isOpen && (
      <StyledOverlay>
        <StyledOverlayBackground onClick={() => setIsOpen(false)} />
        <StyledOverlayContentWrapper>
          <StyledOverlayCloseButton onClick={() => setIsOpen(false)}>
            schließen x
          </StyledOverlayCloseButton>
          <StyledOverlayContent>{children}</StyledOverlayContent>
        </StyledOverlayContentWrapper>
      </StyledOverlay>
    )}
  </>
);

export const useOverlay = (
  children: React.ReactNode,
  initialIsOpen?: boolean
): {
  renderedOverlay: React.ReactElement;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} => {
  const [overlayId, setOverlayId] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(initialIsOpen || false);
  const { registerOverlay, setOverlayOpen } = useContext(NavigationContext);

  useEffect(() => {
    const { id } = registerOverlay();
    setOverlayId(id);
  }, [registerOverlay]);

  useEffect(() => {
    if (overlayId) {
      setOverlayOpen(overlayId, isOpen);
    }
  }, [overlayId, isOpen, setOverlayOpen]);

  return {
    renderedOverlay: (
      <Overlay isOpen={isOpen} setIsOpen={setIsOpen}>
        {children}
      </Overlay>
    ),
    isOpen,
    setIsOpen,
  };
};
