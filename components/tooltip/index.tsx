import keyframes from '@emotion/css';
import styled from '@emotion/styled';
import { InfoIconSvg } from '../assets/InfoIconSvg';
import { TooltipArrowEdgeSvg } from '../assets/TooltipArrowEdgeSvg';
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'react-feather';
import { usePopper } from 'react-popper';
import useDelayed from 'use-delayed';
import { AddToBody } from '../../lib/WindowService';

const fadeIn = keyframes`
  from {
    opacity: 0;
    margin-top: 0px;
  }
  to {
    opacity: 1;
    margin-top: 6px;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    margin-top: 6px;
  }
  to {
    opacity: 0;
    margin-top: 0px;
  }
`;

const StyledTooltip = styled.div``;
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
const StyledTooltipButtonIcon = styled.div``;

const StyledTooltipContent = styled.div`
  opacity: 1;
  z-index: 9999;

  width: 350px;
  padding: 12px 36px 12px 12px;

  background: var(--grey-350);
  border: 1px solid var(--black);
  box-sizing: border-box;
  box-shadow: var(--shadow-light);
  border-radius: 12px;

  /* top left */
  border-top-left-radius: 0;

  > svg {
    /* top left */
    top: -24px;
    left: -1px;
    position: absolute;
    transform: rotate(180deg) scaleX(-1);
    filter: drop-shadow(-1px 1px 0px var(--black));
  }
`;

const StyledTooltipContentContainer = styled.div``;
const StyledTooltipClose = styled.button`
  margin: 0;
  appearance: none;
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  border: 0 none;
  background: none;

  svg {
    height: 1.125rem;
    width: 1.125rem;
  }
`;

const StyledTooltipArrow = styled.div``;

export const TooltipText = styled.p``;

interface TooltipProps {
  label: string;
  position: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ label, children }: TooltipProps) => {
  const buttonElement = useRef<HTMLButtonElement>(null);
  const tooltipElement = useRef<HTMLDivElement>(null);
  const [arrowElement, setArrowElement] = useState(null) as any;

  const { styles, attributes } = usePopper(buttonElement.current, tooltipElement.current, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isVisible = useDelayed(isOpen, 500, [true]);
  const setIslose = useCallback(() => setIsOpen(false), [setIsOpen]);

  const buttonClickHandler = useCallback(() => setIsOpen(!isOpen), [setIsOpen]);

  const TooltipButton: React.FC<TooltipButtonProps> = ({ onClick }: TooltipButtonProps) => (
    <StyledTooltipButton onClick={onClick} ref={buttonElement} data-popover-anchor>
      <StyledTooltipButtonIcon>
        <InfoIconSvg />
      </StyledTooltipButtonIcon>
    </StyledTooltipButton>
  );

  interface TooltipButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
  }

  interface TooltipArrowProps {}

  const TooltipArrow: React.FC<TooltipArrowProps> = ({}: TooltipArrowProps) => (
    <StyledTooltipArrow>
      <TooltipArrowEdgeSvg />
    </StyledTooltipArrow>
  );

  return (
    <StyledTooltip>
      <TooltipButton onClick={buttonClickHandler}></TooltipButton>
      {isVisible && (
        <AddToBody>
          <StyledTooltipContent ref={tooltipElement} style={styles.popper} {...attributes.popper}>
            <div ref={arrowElement} style={styles.arrow}>
              <TooltipArrow></TooltipArrow>
            </div>
            <StyledTooltipClose onClick={setIslose}>
              <X color="var(--black)" />
            </StyledTooltipClose>
            <StyledTooltipContentContainer
              style={{
                animation: `${isOpen ? fadeIn : fadeOut} 0.2s ease-in-out forwards`,
              }}
            >
              {children}
            </StyledTooltipContentContainer>
          </StyledTooltipContent>
        </AddToBody>
      )}
    </StyledTooltip>
  );
};
