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

const StyledTooltipButton = styled.button``;

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [yToParent, setYToParent] = useState<number>(0);
  const [xToParent, setXToParent] = useState<number>(0);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [tooltipHeight, setTooltipHeight] = useState<number>(0);

  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const tooltipOverlayRef = useRef<HTMLDivElement>(null);

  const distanceToTop = useMemo<number>(() => yToParent, [yToParent]);
  const distanceToBottom = useMemo<number>(
    () =>
      parentNodeRef.current?.getBoundingClientRect().height -
      tooltipButtonRef.current?.getBoundingClientRect().height -
      yToParent,
    [yToParent, parentNodeRef]
  );
  const distanceToLeft = useMemo<number>(() => xToParent, [xToParent]);
  const distanceToRight = useMemo<number>(() => parentWidth - xToParent, [xToParent, parentWidth]);

  const toolTipYPosition = useMemo<YPosition>(() => {
    if (distanceToBottom >= tooltipHeight) {
      return YPosition.bottom;
    }

    if (distanceToTop >= tooltipHeight) {
      return YPosition.top;
    }

    if (distanceToBottom > distanceToTop) {
      return YPosition.bottom;
    }

    return YPosition.top;
  }, [distanceToTop, distanceToBottom, tooltipHeight]);

  const toolTipXPosition = useMemo<XPosition>(() => {
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

  const computeScrollY = useCallback(() => {
    setYToParent(
      tooltipButtonRef.current.getBoundingClientRect().top -
        parentNodeRef.current.getBoundingClientRect().top
    );
  }, [parentNodeRef]);

  const computeSizes = useCallback(() => {
    setXToParent(
      tooltipButtonRef.current.getBoundingClientRect().left -
        parentNodeRef.current.getBoundingClientRect().left
    );
    setParentWidth(parentNodeRef.current.getBoundingClientRect().width);
    setTooltipHeight(tooltipOverlayRef.current.getBoundingClientRect().height);

    tooltipOverlayRef.current.style.setProperty(
      '--parent-width',
      `${parentNodeRef.current.getBoundingClientRect().width}px`
    );
    tooltipOverlayRef.current.style.setProperty(
      '--margin-left',
      `${
        parentNodeRef.current.getBoundingClientRect().left -
        tooltipButtonRef.current.getBoundingClientRect().left
      }px`
    );
  }, [parentNodeRef, tooltipOverlayRef]);

  useEffect(() => {
    const parentNode = parentNodeRef.current;
    computeScrollY();

    parentNode.addEventListener('scroll', computeScrollY);

    return () => {
      parentNode.removeEventListener('scroll', computeScrollY);
    };
  }, [parentNodeRef, computeScrollY]);

  useEffect(() => {
    computeSizes();

    window.addEventListener('resize', computeSizes);

    return () => {
      window.removeEventListener('resize', computeSizes);
    };
  });

  return (
    <StyledTooltip>
      <StyledTooltipButton ref={tooltipButtonRef} onClick={() => setIsOpen(!isOpen)}>
        T
      </StyledTooltipButton>
      <StyledTooltipOverlay
        ref={tooltipOverlayRef}
        xPosition={toolTipXPosition}
        yPosition={toolTipYPosition}
        isOpen={isOpen}
      >
        <StyledTooltipOverlayContent>{children}</StyledTooltipOverlayContent>
        <StyledTooltipOverlayClose onClick={() => setIsOpen(false)}>X</StyledTooltipOverlayClose>
      </StyledTooltipOverlay>
    </StyledTooltip>
  );
};
