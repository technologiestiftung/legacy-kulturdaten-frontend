import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MutableRefObject, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { X } from 'react-feather';

import { InfoIconSvg } from '../assets/InfoIconSvg';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { useT } from '../../lib/i18n';

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

const StyledTooltip = styled.div<{
  yPosition: YPosition;
  isOpen: boolean;
}>`
  display: inline;
  overflow: visible;
  position: relative;
  height: ${tooltipButtonHeight}px;

  &::before {
    content: '';
    display: block;
    width: ${tooltipButtonHeight}px;
    height: calc(${tooltipButtonHeight}px * 2);
    background: var(--black);
    position: absolute;
    left: 0;
    top: 1px;
    border-radius: ${tooltipButtonHeight}px;

    ${({ isOpen }) =>
      !isOpen
        ? css`
            display: none;
          `
        : ''}

    ${({ yPosition }) =>
      yPosition === YPosition.bottom
        ? css`
            top: 1px;
            bottom: auto;
          `
        : css`
            bottom: 1px;
            top: auto;
          `}
  }
`;

const StyledTooltipButton = styled.button`
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: ${tooltipButtonHeight}px;
  width: ${tooltipButtonHeight}px;
  padding: 1px;
  box-sizing: border-box;
  background: var(--black);
  border: none;
  border-radius: ${tooltipButtonHeight}px;
  transition: box-shadow var(--transition-duration), transform var(--transition-duration);
  color: var(--white);
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
  min-height: 2.625rem;
  height: auto;
  position: fixed;
  display: flex;
  left: 0.75rem;
  z-index: 100;
  background: var(--white);
  border-radius: 0.75rem;
  box-shadow: 0.125rem 0.125rem 3rem -0.25rem rgba(0, 0, 0, 0.5);
  padding: 0.75rem;

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
          top: calc(var(--distance-to-top) + ${tooltipButtonHeight}px);
        `
      : css`
          bottom: calc(var(--distance-to-bottom) + ${tooltipButtonHeight}px);
        `}


  ${mq(Breakpoint.mid)} {
    ${({ yPosition }) =>
      yPosition === YPosition.bottom
        ? css`
            top: ${tooltipButtonHeight}px;
          `
        : css`
            bottom: ${tooltipButtonHeight}px;
          `}

    position: absolute;
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
  padding-right: 1.375rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: calc(var(--line-height-400) / 2);
  a {
    color: inherit;
  }
`;

const StyledTooltipOverlayClose = styled.button`
  margin: 0;
  appearance: none;
  position: absolute;
  right: 0.5625rem;
  top: 0.5625rem;
  padding: 0.375rem;
  cursor: pointer;
  border: 0 none;
  background: none;
  line-height: 0;

  svg {
    position: relative;
    height: 1.125rem;
    width: 1.125rem;
    display: block;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity var(--transition-duration-fast);
    background: var(--grey-200);
    border-radius: 0.375rem;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }
`;

interface TooltipProps {
  children: React.ReactNode;
  parentNodeRef?: MutableRefObject<HTMLDivElement>;
  buttonAriaLabel?: string;
  buttonTitle?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  parentNodeRef,
  children,
  buttonAriaLabel,
  buttonTitle,
}: TooltipProps) => {
  const t = useT();

  // Holds our user state to show and hide the tooltip overlay
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // The y position ("scroll") from the tooltip button relative to its surrounding container or the window.
  const [yToParent, setYToParent] = useState<number>(0);

  // The x position from the tooltip relative to its surrounding container or the window.
  const [xToParent, setXToParent] = useState<number>(0);

  // The width and height of the surrounding container or the window.
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [parentHeight, setParentHeight] = useState<number>(0);

  // The height of the tooltip overlay
  const [tooltipOverlayHeight, setTooltipOverlayHeight] = useState<number>(0);

  // The ref pointing to our tooltip button. Used for calculating the overlay position.
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);

  // The ref pointing to our tooltip overlay. Used for calculating the overlay position.
  const tooltipOverlayRef = useRef<HTMLDivElement>(null);

  // The ref pointing to the whole tooltip. Used to determine click outside of tooltip.
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * Helper functions to get size and position information about parent container or window.
   * Wrap functions in useCallback to don't cause update on every render.
   */

  const getWrapperHeight = useCallback(
    () =>
      parentNodeRef ? parentNodeRef.current?.getBoundingClientRect()?.height : window.innerHeight,
    [parentNodeRef]
  );

  const getWrapperWidth = useCallback(
    () =>
      parentNodeRef ? parentNodeRef.current?.getBoundingClientRect()?.width : window.innerWidth,
    [parentNodeRef]
  );

  const getWrapperLeft = useCallback(
    () => (parentNodeRef ? parentNodeRef.current?.getBoundingClientRect()?.left : 0),
    [parentNodeRef]
  );

  const getWrapperTop = useCallback(
    () => (parentNodeRef ? parentNodeRef.current?.getBoundingClientRect()?.top : 0),
    [parentNodeRef]
  );

  /**
   * Calculate visual distances of the tooltip relative to its parent container.
   * All necessary information comes from a state or directly from the DOM.
   * Wrap values in useMemo to don't cause update on every render.
   */

  const distanceToTop = useMemo<number>(() => yToParent, [yToParent]);

  const distanceToBottom = useMemo<number>(
    () => parentHeight - tooltipButtonRef.current?.getBoundingClientRect()?.height - yToParent,
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
    setYToParent(tooltipButtonRef.current?.getBoundingClientRect()?.top - getWrapperTop());
  }, [getWrapperTop]);

  const computeSizes = useCallback(() => {
    setXToParent(tooltipButtonRef.current?.getBoundingClientRect()?.left - getWrapperLeft());
    setParentHeight(getWrapperHeight());
    setParentWidth(getWrapperWidth());
    setTooltipOverlayHeight(tooltipOverlayRef.current?.getBoundingClientRect()?.height);

    tooltipOverlayRef.current?.style.setProperty('--parent-width', `${getWrapperWidth()}px`);
    tooltipOverlayRef.current?.style.setProperty('--distance-to-top', `${distanceToTop}px`);
    tooltipOverlayRef.current?.style.setProperty('--distance-to-bottom', `${distanceToBottom}px`);
    tooltipOverlayRef.current?.style.setProperty(
      '--margin-left',
      `${getWrapperLeft() - tooltipButtonRef.current?.getBoundingClientRect().left}px`
    );
  }, [
    tooltipOverlayRef,
    getWrapperWidth,
    getWrapperHeight,
    getWrapperLeft,
    distanceToTop,
    distanceToBottom,
  ]);

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

  useEffect(() => {
    computeSizes();
  }, [computeSizes]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (isOpen && !tooltipRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document?.body.addEventListener('click', handle);

    return () => {
      document?.body.removeEventListener('click', handle);
    };
  }, [isOpen]);

  return (
    <StyledTooltip yPosition={tooltipYPosition} isOpen={isOpen} ref={tooltipRef}>
      <StyledTooltipButton
        ref={tooltipButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={buttonAriaLabel || buttonTitle || (t('tooltip.open') as string)}
        title={buttonTitle || buttonAriaLabel || (t('tooltip.open') as string)}
      >
        <InfoIconSvg />
      </StyledTooltipButton>

      <StyledTooltipOverlay
        ref={tooltipOverlayRef}
        xPosition={tooltipXPosition}
        yPosition={tooltipYPosition}
        isOpen={isOpen}
      >
        <StyledTooltipOverlayContent>{children}</StyledTooltipOverlayContent>
        <StyledTooltipOverlayClose
          onClick={() => setIsOpen(false)}
          aria-label={t('tooltip.close') as string}
          title={t('tooltip.close') as string}
        >
          <X color="var(--black)" />
        </StyledTooltipOverlayClose>
      </StyledTooltipOverlay>
    </StyledTooltip>
  );
};
