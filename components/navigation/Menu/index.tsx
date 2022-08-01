import styled from '@emotion/styled';
import React, { useContext } from 'react';
import { Button, ButtonSize, ButtonVariant, IconPosition } from '../../button';
import { MenuLinkType } from '../header/HeaderMenuLink';
import { NavigationContext } from '../NavigationContext';
import { MenuIcon, MenuIconName } from './MenuIcon';
import { MenuLink, MenuLinkProps } from './MenuLink';
import { MenuSection, MenuSectionVariant } from './MenuSection';
import { MenuSectionDivider } from './MenuSectionDivider';

export enum MenuItemType {
  link = 'link',
  folder = 'folder',
  button = 'button',
  divider = 'divider',
}

export type MenuItemLink = {
  title: string;
  href: string;
  type?: MenuLinkType;
  active?: boolean;
};

export type MenuItemButton = {
  label: string;
  onClick: () => void;
  icon?: string;
  iconPosition?: IconPosition;
  active?: boolean;
};

export type MenuItemFolder = {
  label: string;
  menuKey: string;
  active?: boolean;
};

export type MenuData = {
  key: string;
  expandable: boolean;
  title: string;
  List?: React.FC<{ expanded?: boolean }>;
  AdditionalContent?: React.FC;
  sections?: MenuSectionData[];
};

export type MenuSectionData = {
  title: string;
  items: {
    type: MenuItemType;
    action?: MenuItemLink | MenuItemButton | MenuItemFolder;
  }[];
  button?: React.ReactElement;
  icon?: MenuIconName;
  headOptions?: {
    background?: string;
    color?: string;
    uppercase?: boolean;
  };
  variant?: MenuSectionVariant;
};

export type MenuItem = {
  type: MenuItemType;
  disabled?: boolean;
  action?: MenuItemLink | MenuItemButton | MenuItemFolder;
  active?: boolean;
};

const StyledMenuSections = styled.div`
  padding: 2.25rem 1.5rem;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 2.25rem;
  width: 100%;
`;

const StyledMenu = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--white);
`;

interface MenuProps {
  menuData: MenuData;
}

export const Menu: React.FC<MenuProps> = ({ menuData }: MenuProps) => {
  const { menuExpanded } = useContext(NavigationContext);

  const { sections, List, AdditionalContent } = menuData;

  const renderedSections = sections?.map(
    ({ title, icon, items, headOptions, variant, button }, index) => {
      const renderedItems = items?.map(({ type, action }, actionIndex) => {
        switch (type) {
          case MenuItemType.link: {
            return <MenuLink key={actionIndex} {...(action as MenuLinkProps)} />;
          }

          case MenuItemType.button: {
            const { label, onClick, icon, iconPosition } = action as MenuItemButton;
            return (
              <Button
                onClick={() => {
                  onClick();
                }}
                variant={ButtonVariant.minimal}
                size={ButtonSize.small}
                icon={icon}
                iconPosition={iconPosition}
              >
                {label}
              </Button>
            );
          }

          case MenuItemType.divider: {
            return <MenuSectionDivider />;
          }

          default: {
            break;
          }
        }
      });

      return (
        <MenuSection
          title={title}
          icon={icon ? <MenuIcon type={icon} /> : undefined}
          items={renderedItems}
          key={index}
          headOptions={headOptions}
          variant={variant}
          button={button}
        />
      );
    }
  );

  return (
    <StyledMenu>
      {List && React.createElement(List, { expanded: menuExpanded })}
      {renderedSections && <StyledMenuSections>{renderedSections}</StyledMenuSections>}
      {AdditionalContent && React.createElement(AdditionalContent)}
    </StyledMenu>
  );
};
