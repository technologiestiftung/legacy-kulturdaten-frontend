import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MutableRefObject, useEffect, useRef, useState, useMemo, useCallback } from 'react';

import { Breakpoint } from '../../lib/WindowService';
import { insetBorderColored, mq } from '../globals/Constants';

enum YPosition {
  top = 'top',
  bottom = 'bottom',
}

enum XPosition {
  left = 'left',
  right = 'right',
}

const tooltipWidth = 300;

const tooltipButtonHeight = 24;

const StyledTooltip = styled.div`
  width: ${tooltipButtonHeight}px;
  height: ${tooltipButtonHeight}px;
  display: inline;
  overflow: visible;
  position: relative;
`;

const StyledTooltipButton = styled.button`
  width: 100%;
  height: 100%;
`;

const StyledTooltipOverlay = styled.div<{
  xPosition: XPosition;
  yPosition: YPosition;
  isOpen: boolean;
}>`
  width: calc(var(--parent-width) - 1.5rem);
  height: auto;
  position: absolute;
  display: flex;
  background: var(--grey-350);
  border-radius: 0.75rem;
  box-shadow: ${insetBorderColored('var(--black)', true)};
  padding: 0.75rem;
  margin-left: calc(var(--margin-left) + 0.75rem);
  justify-content: space-between;

  ${({ isOpen }) =>
    !isOpen
      ? css`
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
        `
      : ''}

  ${({ yPosition }) =>
    yPosition === YPosition.bottom
      ? css`
          top: ${tooltipButtonHeight}px;
        `
      : css`
          bottom: ${tooltipButtonHeight}px;
        `}

        

  ${mq(Breakpoint.mid)} {
    width: ${tooltipWidth}px;
    margin-left: 0;

    ${({ xPosition }) =>
      xPosition === XPosition.right
        ? css`
            left: 0;
          `
        : css`
            right: 0;
          `}
  }
`;

const StyledTooltipOverlayContent = styled.div`
  flex-grow: 1;
`;

const StyledTooltipOverlayClose = styled.button`
  flex-grow: 0;
  flex-shrink: 0;
`;

interface TooltipProps {
  children: React.ReactNode;
  parentNodeRef?: MutableRefObject<HTMLDivElement>;
}

export const Tooltip: React.FC<TooltipProps> = ({ parentNodeRef, children }: TooltipProps) => {
  // Holds our user state to show and hide the tooltip overlay
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // The y position ("scroll") from the tooltip button relative to its surrounding container or the window.
  const [yToParent, setYToParent] = useState<number>(0);

  // The x position from the tooltip relative to its surrounding container or the window.
  const [xToParent, setXToParent] = useState<number>(0);

  // The width of the surrounding container or the window.
  const [parentWidth, setParentWidth] = useState<number>(0);

  // The height of the tooltip overlay
  const [tooltipOverlayHeight, setTooltipOverlayHeight] = useState<number>(0);

  // The ref pointing to our tooltip button. Used for calculating the overlay position.
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);

  // The ref pointing to our tooltip overlay. Used for calculating the overlay position.
  const tooltipOverlayRef = useRef<HTMLDivElement>(null);

  /**
   * Helper functions to get size and position information about parent container or window.
   * Wrap functions in useCallback to don't cause update on every render.
   */

  const getWrapperHeight = useCallback(
    () =>
      parentNodeRef ? parentNodeRef.current?.getBoundingClientRect().height : window.innerHeight,
    [parentNodeRef]
  );

  const getWrapperWidth = useCallback(
    () =>
      parentNodeRef ? parentNodeRef.current?.getBoundingClientRect().width : window.innerWidth,
    [parentNodeRef]
  );

  const getWrapperLeft = useCallback(
    () => (parentNodeRef ? parentNodeRef.current?.getBoundingClientRect().left : 0),
    [parentNodeRef]
  );

  const getWrapperTop = useCallback(
    () => (parentNodeRef ? parentNodeRef.current?.getBoundingClientRect().top : 0),
    [parentNodeRef]
  );

  /**
   * Calculate visual distances of the tooltip relative to its parent container.
   * All necessary information comes from a state or directly from the DOM.
   * Wrap values in useMemo to don't cause update on every render.
   */

  const distanceToTop = useMemo<number>(() => yToParent, [yToParent]);

  const distanceToBottom = useMemo<number>(
    () => getWrapperHeight() - tooltipButtonRef.current?.getBoundingClientRect().height - yToParent,
    [yToParent, getWrapperHeight]
  );

  const distanceToLeft = useMemo<number>(() => xToParent, [xToParent]);
  const distanceToRight = useMemo<number>(() => parentWidth - xToParent, [xToParent, parentWidth]);

  /**
   * Calculate how to position the tooltip.
   * All necessary information comes from the distance values calculated before.
   * * Wrap values in useMemo to don't cause update on every render.
   */

  const tooltipYPosition = useMemo<YPosition>(() => {
    if (distanceToBottom >= tooltipOverlayHeight) {
      return YPosition.bottom;
    }

    if (distanceToTop >= tooltipOverlayHeight) {
      return YPosition.top;
    }

    if (distanceToBottom > distanceToTop) {
      return YPosition.bottom;
    }

    return YPosition.top;
  }, [distanceToTop, distanceToBottom, tooltipOverlayHeight]);

  const tooltipXPosition = useMemo<XPosition>(() => {
    if (distanceToRight >= tooltipWidth) {
      return XPosition.right;
    }

    if (distanceToLeft >= tooltipWidth) {
      return XPosition.left;
    }

    if (distanceToRight > distanceToLeft) {
      return XPosition.right;
    }

    return XPosition.left;
  }, [distanceToRight, distanceToLeft]);

  /**
   * Functions to compute our state values containing information about scroll positions and viewport dependant sizes.
   * Wrap functions in useCallback to don't cause update on every render.
   */

  const computeScrollY = useCallback(() => {
    setYToParent(tooltipButtonRef.current.getBoundingClientRect().top - getWrapperTop());
  }, [getWrapperTop]);

  const computeSizes = useCallback(() => {
    setXToParent(tooltipButtonRef.current.getBoundingClientRect().left - getWrapperLeft());
    setParentWidth(getWrapperWidth());
    setTooltipOverlayHeight(tooltipOverlayRef.current.getBoundingClientRect().height);

    tooltipOverlayRef.current.style.setProperty('--parent-width', `${getWrapperWidth()}px`);
    tooltipOverlayRef.current.style.setProperty(
      '--margin-left',
      `${getWrapperLeft() - tooltipButtonRef.current.getBoundingClientRect().left}px`
    );
  }, [tooltipOverlayRef, getWrapperWidth, getWrapperLeft]);

  /**
   * Initially compute the scrollY position.
   * Attach an event handler to the parentNode (container div or window) to update on scroll.
   */

  useEffect(() => {
    const parentNode = parentNodeRef ? parentNodeRef.current : window;
    computeScrollY();

    parentNode.addEventListener('scroll', computeScrollY);

    // Clean up event listener on unmount. React executes functions returned by useEffect on unmount.
    return () => {
      parentNode.removeEventListener('scroll', computeScrollY);
    };
  }, [parentNodeRef, computeScrollY]);

  /**
   * Initially compute the sizes.
   * Attach an event handler to the window to update on resize.
   */

  useEffect(() => {
    computeSizes();

    window.addEventListener('resize', computeSizes);

    // Clean up event listener on unmount. React executes functions returned by useEffect on unmount.
    return () => {
      window.removeEventListener('resize', computeSizes);
    };
  });

  return (
    <StyledTooltip>
      <StyledTooltipButton ref={tooltipButtonRef} onClick={() => setIsOpen(!isOpen)}>
        i
      </StyledTooltipButton>
      <StyledTooltipOverlay
        ref={tooltipOverlayRef}
        xPosition={tooltipXPosition}
        yPosition={tooltipYPosition}
        isOpen={isOpen}
      >
        <StyledTooltipOverlayContent>{children}</StyledTooltipOverlayContent>
        <StyledTooltipOverlayClose onClick={() => setIsOpen(false)}>X</StyledTooltipOverlayClose>
      </StyledTooltipOverlay>
    </StyledTooltip>
  );
};
