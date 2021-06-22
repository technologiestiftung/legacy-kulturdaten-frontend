import styled from '@emotion/styled';
import React, { useContext, useEffect, useState } from 'react';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonSize, ButtonVariant } from '../button';
import { contentGrid, mq, overlayStyles } from '../globals/Constants';
import { NavigationContext } from '../navigation/NavigationContext';

const StyledOverlay = styled.div`
  position: fixed;
  width: 100%;
  height: var(--app-height);
  overflow: hidden;
  top: 0;
  left: 0;
  display: flex;
  z-index: 1000;

  ${mq(Breakpoint.mid)} {
    ${contentGrid(11)}
  }

  ${mq(Breakpoint.wide)} {
    ${contentGrid(12)}
  }
`;

const StyledOverlayContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${mq(Breakpoint.mid)} {
    grid-column: 2 / -2;
  }

  ${mq(Breakpoint.wide)} {
    grid-column: 3 / -3;
  }

  max-width: 62.5rem;
  justify-self: center;
`;

const StyledOverlayContent = styled.div`
  position: relative;
  background: var(--white);
  border-radius: 0.75rem 0.75rem 0 0;
  mask-image: -webkit-radial-gradient(white, black);
  border: 1px solid var(--grey-400);
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;

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
  cursor: pointer;

  ${overlayStyles}
`;

const StyledOverlayCloseButton = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  padding: 0.75rem;
  color: var(--white);
  cursor: pointer;
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;

  ${mq(Breakpoint.mid)} {
    text-align: right;
    padding: 0.75rem 0;
  }
`;

interface OverlayProps {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const Overlay: React.FC<OverlayProps> = ({ children, isOpen, setIsOpen }: OverlayProps) => {
  const t = useT();

  return (
    <>
      {isOpen && (
        <StyledOverlay>
          <StyledOverlayBackground onClick={() => setIsOpen(false)} />
          <StyledOverlayContentWrapper>
            <StyledOverlayCloseButton onClick={() => setIsOpen(false)}>
              <Button
                onClick={() => setIsOpen(false)}
                variant={ButtonVariant.borderless}
                icon="X"
                color={ButtonColor.black}
                size={ButtonSize.big}
                ariaLabel={t('overlay.ariaClose') as string}
              >
                {t('general.close')}
              </Button>
            </StyledOverlayCloseButton>
            <StyledOverlayContent>{children}</StyledOverlayContent>
          </StyledOverlayContentWrapper>
        </StyledOverlay>
      )}
    </>
  );
};

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
