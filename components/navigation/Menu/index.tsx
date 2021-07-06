import styled from '@emotion/styled';
import React, { useContext } from 'react';
import { Button, ButtonSize, ButtonVariant, IconPosition } from '../../button';
import { NavigationContext } from '../NavigationContext';
import { MenuFolder } from './MenuFolder';
import { MenuIcon, MenuIconName } from './MenuIcon';
import { MenuLink, MenuLinkProps } from './MenuLink';
import { MenuSection, MenuSectionVariant } from './MenuSection';
import { MenuSectionDivider } from './MenuSectionDivider';

export enum MenuItem {
  link = 'link',
  folder = 'folder',
  button = 'button',
  divider = 'divider',
}

export type MenuItemLink = {
  title: string;
  href: string;
  active?: boolean;
};

export type MenuItemButton = {
  label: string;
  onClick: () => void;
  icon?: string;
  iconPosition?: IconPosition;
};

export type MenuItemFolder = {
  label: string;
  menuKey: string;
};

export type MenuData = {
  key: string;
  expandable: boolean;
  title: string;
  List?: React.FC<{ expanded?: boolean }>;
  sections?: MenuSectionData[];
};

export type MenuSectionData = {
  title: string;
  items: {
    type: MenuItem;
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

const StyledMenuSections = styled.div`
  padding: 1.5rem 0.75rem;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 1.5rem;
`;

const StyledMenu = styled.div``;

interface MenuProps {
  menuData: MenuData;
}

export const Menu: React.FC<MenuProps> = ({ menuData }: MenuProps) => {
  const { setNavigationOpen, menuExpanded } = useContext(NavigationContext);

  const { sections, List } = menuData;

  const renderedSections = sections?.map(
    ({ title, icon, items, headOptions, variant, button }, index) => {
      const renderedItems = items?.map(({ type, action }, actionIndex) => {
        switch (type) {
          case MenuItem.link: {
            return <MenuLink key={actionIndex} {...(action as MenuLinkProps)} />;
          }

          case MenuItem.button: {
            const { label, onClick, icon, iconPosition } = action as MenuItemButton;
            return (
              <Button
                onClick={() => {
                  onClick();
                  setNavigationOpen(false);
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

          case MenuItem.folder: {
            const { label, menuKey } = action as MenuItemFolder;
            return <MenuFolder label={label} menuKey={menuKey} />;
          }

          case MenuItem.divider: {
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
    </StyledMenu>
  );
};
