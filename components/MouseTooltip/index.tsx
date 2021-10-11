import styled from '@emotion/styled';
import { useState, useEffect } from 'react';

const StyledMouseTooltip = styled.div<{ x: number; y: number }>`
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  color: var(--white);
  background: var(--black);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.375rem 0.75rem;
  z-index: 10002;
  border-radius: 0.375rem;
  box-shadow: 0.125rem 0.125rem 0.75rem -0.125rem rgba(0, 0, 0, 0.4);
  visibility: ${({ x, y }) => (x !== 0 && y !== 0 ? 'inherited' : 'hidden')};

  transform: ${({ x, y }) =>
    `translate(calc(${x}px + 0.75rem), calc(${y}px - 0.375rem - (var(--line-height-300) / 2)))`};
`;

type MouseTooltipProps = {
  children: React.ReactNode;
  hoverElement: HTMLElement;
};

export const MouseTooltip: React.FC<MouseTooltipProps> = ({
  children,
  hoverElement,
}: MouseTooltipProps) => {
  const [show, setShow] = useState(false);
  const [isTouchEvent, setIsTouchEvent] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const element = hoverElement;

    const mouseEnterHandler = () => {
      setShow(true);
    };

    const mouseLeaveHandler = () => {
      setShow(false);
      setIsTouchEvent(false);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      setMouseX(e.pageX);
      setMouseY(e.pageY);
    };

    // Prevent rendering on touch events
    const touchHandler = () => {
      setIsTouchEvent(true);
    };

    element?.addEventListener('mouseenter', mouseEnterHandler);
    element?.addEventListener('mouseleave', mouseLeaveHandler);
    element?.addEventListener('touchstart', touchHandler);
    window?.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      element?.removeEventListener('mouseenter', mouseEnterHandler);
      element?.removeEventListener('mouseleave', mouseLeaveHandler);
      element?.removeEventListener('touchstart', touchHandler);
      window?.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, [hoverElement, show]);

  return !isTouchEvent && show && mouseX !== 0 && mouseY !== 0 ? (
    <StyledMouseTooltip x={mouseX} y={mouseY}>
      {children}
    </StyledMouseTooltip>
  ) : null;
};
