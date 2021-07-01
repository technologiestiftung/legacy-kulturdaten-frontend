import Link from 'next/link';
import styled from '@emotion/styled';

import { ArrowRightSvg } from '../../assets/ArrowRightSvg';
import { useIsRouteStringActive } from '../../../lib/routing';
import { useContext } from 'react';
import { NavigationContext } from '../NavigationContext';
import { insetBorder } from '../../globals/Constants';
import { ChevronRight, Folder } from 'react-feather';

const StyledMenuFolder = styled.button`
  color: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  margin: 0;
  border: none;
  box-shadow: ${insetBorder(true, false, false)};
  background: var(--white);
  cursor: pointer;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;

  &:hover {
    background: var(--grey-350);
  }

  span {
    display: block;
    padding: 0 0.75rem;
    flex-grow: 1;
    text-align: left;
  }

  svg {
    flex-grow: 0;
    display: block;
    margin: 0;
    padding: 0;
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    color: var(--black);
  }
`;

export enum MenuFolderType {
  internal = 'internal',
  external = 'external',
}

export interface MenuFolderProps {
  label: string;
  menuKey: string;
}

export const MenuFolder: React.FC<MenuFolderProps> = ({ menuKey, label }: MenuFolderProps) => {
  const { setActiveMenuKey } = useContext(NavigationContext);

  return (
    <StyledMenuFolder onClick={() => setActiveMenuKey(menuKey)}>
      <Folder />
      <span>{label}</span>
      <ChevronRight />
    </StyledMenuFolder>
  );
};
