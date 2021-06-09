import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MutableRefObject, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { X } from 'react-feather';

import { InfoIconSvg } from '../assets/InfoIconSvg';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

enum YPosition {
  top = 'top',
  bottom = 'bottom',
}

enum XPosition {
  left = 'left',
  right = 'right',
  middle = 'middle',
}

const tooltipWidth = 300;
const tooltipButtonHeight = 24;
const tooltipButtonHeightWithoutBorder = 23;
const arrowOffset = 13;

const StyledTooltip = styled.div`
  width: ${tooltipButtonHeight}px;
  height: ${tooltipButtonHeight}px;
  display: inline;
  overflow: visible;
  position: relative;
`;

const StyledTooltipButton = styled.button`
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: var(--line-height-200);
  width: var(--line-height-200);
  box-sizing: border-box;
  background: var(--green-kelly);
  border-radius: var(--line-height-600);
  border: 1px solid var(--black);
  transition: box-shadow var(--transition-duration), transform var(--transition-duration);

  box-shadow: var(--shadow-light);

  &:hover {
    box-shadow: var(--shadow-hover), inset 0px 0px 0px 1px var(--black);
  }

  &:active {
    box-shadow: var(--shadow-active), inset 0px 0px 0px 1px var(--black);
    transform: translateY(0.125rem);
  }

  &:disabled {
    box-shadow: var(--shadow);
    transform: none;
  }
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
  border: 1px solid var(--black);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-light);
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

  :: after {
    content: '';
    position: absolute;
    width: 48px;
    height: 24px;
    background: no-repeat
      url(/images/${({ xPosition }) =>
        xPosition === XPosition.middle ? 'arrowMiddle' : 'arrowEdge'}.svg);
  }

  ${({ yPosition, xPosition }) =>
    (xPosition === XPosition.left || xPosition === XPosition.middle) && yPosition === YPosition.top
      ? css`
          border-bottom-right-radius: 0px;
          bottom: ${tooltipButtonHeight}px;
          :: after {
            bottom: -${tooltipButtonHeightWithoutBorder}px;
            right: calc(var(--tooltip-right) - var(--button-right) - ${arrowOffset}px);
            transform: rotate(180deg) scaleX(-1);
          }
        `
      : css``}

  ${({ yPosition, xPosition }) =>
    (xPosition === XPosition.left || xPosition === XPosition.middle) &&
    yPosition === YPosition.bottom
      ? css`
          border-top-right-radius: 0px;
          top: ${tooltipButtonHeight}px;
          :: after {
            top: -${tooltipButtonHeightWithoutBorder}px;
            right: calc(var(--tooltip-right) - var(--button-right) - ${arrowOffset}px);
            transform: rotate(0deg);
          }
        `
      : css``}

  ${({ yPosition, xPosition }) =>
    xPosition === XPosition.right && yPosition === YPosition.bottom
      ? css`
          border-top-left-radius: 0px;
          top: ${tooltipButtonHeight}px;
          :: after {
            top: -${tooltipButtonHeightWithoutBorder}px;
            left: calc(var(--button-left) - var(--tooltip-left) - ${arrowOffset}px);
            transform: rotate(0deg) scaleX(-1);
          }
        `
      : css``}

  ${({ yPosition, xPosition }) =>
    xPosition === XPosition.right && yPosition === YPosition.top
      ? css`
          border-bottom-left-radius: 0px;
          bottom: ${tooltipButtonHeight}px;
          :: after {
            bottom: -${tooltipButtonHeightWithoutBorder}px;
            left: calc(var(--button-left) - var(--tooltip-left) - ${arrowOffset}px);
            transform: rotate(180deg);
          }
        `
      : css``}

  ${({ xPosition }) =>
    xPosition === XPosition.middle
      ? css`
          border-radius: 0.75rem;
        `
      : css``}

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
  margin: 0;
  appearance: none;
  position: absolute;
  right: 12px;
  top: 12px;
  padding: 0;
  cursor: pointer;
  border: 0 none;
  background: none;

  svg {
    height: 1.125rem;
    width: 1.125rem;
  }
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

  // The width and height of the surrounding container or the window.
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [parentHeight, setParentHeight] = useState<number>(0);

  const [tooltipLeft, setTooltipLeft] = useState<number>(0);
  const [tooltipRight, setTooltipRight] = useState<number>(0);
  const [buttonLeft, setButtonLeft] = useState<number>(0);
  const [buttonRight, setButtonRight] = useState<number>(0);

  // The height of the tooltip overlay
  const [tooltipOverlayHeight, setTooltipOverlayHeight] = useState<number>(0);

  // The ref pointing to our tooltip button. Used for calculating the overlay position.
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);

  // The ref pointing to our tooltip overlay. Used for calculating the overlay position.
  const tooltipOverlayRef = useRef<HTMLDivElement>(null);

  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);

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
    () => parentHeight - tooltipButtonRef.current?.getBoundingClientRect().height - yToParent,
    [yToParent, parentHeight]
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
    const switchArrowThreshold = 20;
    if (isWideOrWider) {
      if (distanceToRight >= tooltipWidth || distanceToRight > distanceToLeft) {
        return XPosition.right;
      }
      return XPosition.left;
    }
    if (tooltipRight <= buttonRight + switchArrowThreshold) {
      return XPosition.left;
    }
    if (tooltipLeft >= buttonLeft - switchArrowThreshold) {
      return XPosition.right;
    }
    return XPosition.middle;
  }, [distanceToRight, distanceToLeft, tooltipLeft, tooltipRight, buttonLeft, buttonRight]);

  /**
   * Functions to compute our state values containing information about scroll positions and viewport dependant sizes.
   * Wrap functions in useCallback to don't cause update on every render.
   */

  const computeScrollY = useCallback(() => {
    setYToParent(tooltipButtonRef.current.getBoundingClientRect().top - getWrapperTop());
  }, [getWrapperTop]);

  const computeSizes = useCallback(() => {
    setXToParent(tooltipButtonRef.current.getBoundingClientRect().left - getWrapperLeft());
    setParentHeight(getWrapperHeight());
    setParentWidth(getWrapperWidth());
    setTooltipOverlayHeight(tooltipOverlayRef.current.getBoundingClientRect().height);

    tooltipOverlayRef.current.style.setProperty('--parent-width', `${getWrapperWidth()}px`);
    tooltipOverlayRef.current.style.setProperty(
      '--margin-left',
      `${getWrapperLeft() - tooltipButtonRef.current.getBoundingClientRect().left}px`
    );

    setTooltipLeft(tooltipOverlayRef.current?.getBoundingClientRect().left);
    setTooltipRight(tooltipOverlayRef.current?.getBoundingClientRect().right);
    setButtonLeft(tooltipButtonRef.current?.getBoundingClientRect().left);
    setButtonRight(tooltipButtonRef.current?.getBoundingClientRect().right);

    tooltipOverlayRef.current?.style.setProperty(
      '--tooltip-left',
      `${tooltipOverlayRef.current.getBoundingClientRect().left}px`
    );
    tooltipOverlayRef.current?.style.setProperty(
      '--button-left',
      `${tooltipButtonRef.current.getBoundingClientRect().left}px`
    );
    tooltipOverlayRef.current.style.setProperty(
      '--tooltip-right',
      `${tooltipOverlayRef.current.getBoundingClientRect().right}px`
    );
    tooltipOverlayRef.current.style.setProperty(
      '--button-right',
      `${tooltipButtonRef.current.getBoundingClientRect().right}px`
    );
  }, [tooltipOverlayRef, getWrapperWidth, getWrapperHeight, getWrapperLeft]);

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
        <InfoIconSvg />
      </StyledTooltipButton>
      <StyledTooltipOverlay
        ref={tooltipOverlayRef}
        xPosition={tooltipXPosition}
        yPosition={tooltipYPosition}
        isOpen={isOpen}
      >
        <StyledTooltipOverlayContent>{children}</StyledTooltipOverlayContent>
        <StyledTooltipOverlayClose onClick={() => setIsOpen(false)}>
          <X color="var(--black)" />
        </StyledTooltipOverlayClose>
      </StyledTooltipOverlay>
    </StyledTooltip>
  );
};
