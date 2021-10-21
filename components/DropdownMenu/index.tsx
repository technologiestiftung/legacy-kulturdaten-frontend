import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as feather from 'react-feather';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledDropdownMenu = styled.div``;

const StyledDropdownMenuButton = styled.button<{ visible: boolean }>`
  appearance: none;
  border: none;
  background: var(--black);
  display: block;
  color: var(--white);
  padding: 0.5625rem;
  border-radius: 2rem;
  margin: 0;
  line-height: 0;
  box-shadow: 0.125rem 0.125rem 0.75rem -0.125rem rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transform: translateY(0);
  transition: transform var(--transition-duration);
  position: relative;
  z-index: 2;

  ${({ visible }) =>
    visible
      ? css`
          transform: translateY(0.375rem);

          &:hover {
            transform: translateY(0.375rem);
          }
        `
      : ''}

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const StyledDropdownMenuDropdown = styled.div<{ visible: boolean; animating: boolean }>`
  background: var(--grey-200);
  border-radius: 1.125rem;
  width: calc(var(--app-width) - 1.5rem);
  position: absolute;
  right: 0.75rem;
  transition: opacity var(--transition-duration), transform var(--transition-duration);
  transform: translate(0rem, -1rem);
  opacity: 0;
  box-shadow: 0.125rem 0.125rem 3rem -0.25rem rgba(0, 0, 0, 0.5);
  display: none;
  visibility: hidden;

  ${mq(Breakpoint.mid)} {
    right: 1.5rem;
    width: auto;
    min-width: 18rem;
  }

  ${({ animating }) =>
    animating
      ? css`
          visibility: visible;
          display: block;
        `
      : ''}

  ${({ visible }) =>
    visible
      ? css`
          transform: translate(0, 0);
          opacity: 1;
          display: block;
          visibility: visible;
        `
      : ''}
`;

const StyledDropdownMenuDropdownContent = styled.div`
  padding: 0.75rem;
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);

  b {
    font-weight: 700;
  }
`;

export const DropdownMenuText = styled.div`
  word-break: break-all;
`;

interface DropdownMenuProps {
  children: React.ReactNode;
  icon: string;
  buttonAriaLabels: {
    open: string;
    close: string;
  };
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  icon,
  buttonAriaLabels,
}: DropdownMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const clickHandler = useMemo(
    () => (manualVisible?: boolean) => {
      if (!animating) {
        setAnimating(true);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setVisible(typeof manualVisible !== 'undefined' ? manualVisible : !visible);

            setTimeout(() => setAnimating(false), 100);
          });
        });
      }
    },
    [animating, visible]
  );

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if ((visible || animating) && !dropdownMenuRef.current.contains(e.target as Node)) {
        clickHandler(false);
      }
    };

    document?.body.addEventListener('click', handle);

    return () => {
      document?.body.removeEventListener('click', handle);
    };
  }, [visible, animating, clickHandler]);

  return (
    <StyledDropdownMenu ref={dropdownMenuRef}>
      <StyledDropdownMenuButton
        onClick={() => clickHandler()}
        visible={visible}
        aria-label={visible ? buttonAriaLabels.close : buttonAriaLabels.open}
      >
        {visible ? React.createElement(feather.X) : React.createElement(feather[icon || 'Circle'])}
      </StyledDropdownMenuButton>
      <StyledDropdownMenuDropdown visible={visible} animating={animating}>
        <StyledDropdownMenuDropdownContent>{children}</StyledDropdownMenuDropdownContent>
      </StyledDropdownMenuDropdown>
    </StyledDropdownMenu>
  );
};
