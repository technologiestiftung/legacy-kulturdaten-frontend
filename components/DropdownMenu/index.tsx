import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as feather from 'react-feather';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledDropdownMenu = styled.div`
  position: relative;
`;

const StyledDropdownMenuButton = styled.button<{ visible: boolean; form?: DropdownMenuForm }>`
  appearance: none;
  border: none;
  background: var(--black);
  display: flex;
  color: var(--white);
  column-gap: 0.75rem;
  border-radius: ${({ form }) => (form === DropdownMenuForm.round ? '2rem' : '0.75rem')};
  margin: 0;
  line-height: 0;
  box-shadow: 0.125rem 0.125rem 0.75rem -0.125rem rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transform: translateY(0);
  transition: transform var(--transition-duration);
  position: relative;
  z-index: 2;
  padding: 0;

  ${({ visible }) =>
    visible
      ? css`
          transform: translateY(0.375rem);

          &:hover {
            transform: translateY(0.375rem);
          }
        `
      : ''}
`;

const StyledDropdownMenuButtonText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.375rem 0 0.375rem 1.125rem;
`;

const StyledDropdownMenuButtonIcon = styled.div<{ hasText?: boolean }>`
  line-height: 0;
  padding: ${({ hasText }) => (hasText ? '0.5625rem 1.125rem 0.5625rem 0' : '0.5625rem')};

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const StyledDropdownMenuDropdown = styled.div<{
  visible: boolean;
  animating: boolean;
}>`
  background: var(--grey-200);
  border-radius: 1.125rem;
  border-radius: 1.125rem;
  width: calc(var(--app-width) - 1.5rem);
  position: absolute;
  right: 0;
  transition: opacity var(--transition-duration), transform var(--transition-duration);
  transform: translate(0rem, -1rem);
  opacity: 0;
  box-shadow: 0.125rem 0.125rem 3rem -0.25rem rgba(0, 0, 0, 0.5);
  display: none;
  visibility: hidden;
  z-index: 1;

  ${mq(Breakpoint.mid)} {
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

export enum DropdownMenuForm {
  round = 'round',
  rounded = 'rounded',
}

interface DropdownMenuProps {
  children: React.ReactNode;
  icon: string;
  buttonAriaLabels: {
    open: string;
    close: string;
  };
  text?: string;
  form?: DropdownMenuForm;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  icon,
  text,
  buttonAriaLabels,
  form = DropdownMenuForm.round,
}: DropdownMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const hasText = typeof text !== 'undefined';

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
        form={form}
      >
        {text && <StyledDropdownMenuButtonText>{text}</StyledDropdownMenuButtonText>}
        <StyledDropdownMenuButtonIcon hasText={hasText}>
          {visible
            ? React.createElement(feather.X)
            : React.createElement(feather[icon || 'Circle'])}
        </StyledDropdownMenuButtonIcon>
      </StyledDropdownMenuButton>
      <StyledDropdownMenuDropdown visible={visible} animating={animating}>
        <StyledDropdownMenuDropdownContent>{children}</StyledDropdownMenuDropdownContent>
      </StyledDropdownMenuDropdown>
    </StyledDropdownMenu>
  );
};
