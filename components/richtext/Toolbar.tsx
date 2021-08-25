import styled from '@emotion/styled';
import React, { RefObject } from 'react';
import { Breakpoint } from '../../lib/WindowService';
import { insetBorder, mq } from '../globals/Constants';
import { Label } from '../label';

export enum ToolbarGroupWidth {
  full = 'full',
  half = 'half',
}

const StyledToolbar = styled.div`
  top: 0;
  left: 0;
  position: sticky;
  z-index: 1;
  transition: transform var(--transition-duration);

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 25%;
    bottom: 0;
    left: 0;
    box-shadow: 0px 1px 6px var(--black-o25);
    pointer-events: none;
  }
`;

const StyledToolbarContainer = styled.div`
  background: var(--grey-200);
  padding: 0.25rem 0.75rem 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

const StyledToolbarGroupItems = styled.div`
  display: flex;
`;

const StyledToolbarGroup = styled.div<{ width: ToolbarGroupWidth }>`
  margin-right: 0.375rem;
  position: relative;

  &:last-of-type {
    margin-right: 0;
  }

  &:not(:last-of-type) {
    ${StyledToolbarGroupItems} {
      &:after {
        margin-left: 0.375rem;
        border-top: 0.375rem solid var(--grey-200);
        border-bottom: 0.375rem solid var(--grey-200);
        padding: 3px 0;
        content: '';
        display: block;
        position: relative;
        width: 1px;
        align-self: stretch;
        background: var(--grey-400);
      }
    }
  }

  ${mq(Breakpoint.mid)} {
    margin-right: 0.75rem;

    &:not(:last-of-type) {
      ${StyledToolbarGroupItems} {
        &:after {
          margin-left: 0.75rem;
        }
      }
    }
  }
`;

const StyledToolbarGroupLabel = styled.div``;

const StyledToolbarGroupItem = styled.div`
  margin-right: 0.1875rem;

  &:last-of-type {
    margin-right: 0;
  }

  ${mq(Breakpoint.mid)} {
    margin-right: 0.375rem;
  }
`;

interface ToolbarProps {
  groups: {
    width: ToolbarGroupWidth;
    items: React.ReactElement[];
    label?: string;
  }[];
}

// eslint-disable-next-line react/display-name
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ groups }: ToolbarProps, ref: RefObject<HTMLDivElement>) => {
    return (
      <StyledToolbar ref={ref} role="toolbar">
        <StyledToolbarContainer>
          {groups.map(({ width, label, items }, index) => (
            <StyledToolbarGroup key={index} width={width}>
              {label && (
                <StyledToolbarGroupLabel>
                  <Label>{label}</Label>
                </StyledToolbarGroupLabel>
              )}
              <StyledToolbarGroupItems>
                {items.map((item, itemsIndex) => (
                  <StyledToolbarGroupItem key={itemsIndex}>{item}</StyledToolbarGroupItem>
                ))}
              </StyledToolbarGroupItems>
            </StyledToolbarGroup>
          ))}
        </StyledToolbarContainer>
      </StyledToolbar>
    );
  }
);
