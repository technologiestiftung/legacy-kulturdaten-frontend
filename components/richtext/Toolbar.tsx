/* eslint-disable react/display-name */
import styled from '@emotion/styled';
import React, { Ref } from 'react';
import { insetBorder } from '../globals/Constants';
import { Label } from '../label';

export enum ToolbarGroupWidth {
  full = 'full',
  half = 'half',
}

const StyledToolbar = styled.div`
  background: var(--grey-200);
  padding: 0.25rem 0.75rem 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
`;

const StyledToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* grid-template-columns: repeat(4, auto);
  column-gap: 0.75rem; */
`;

const StyledToolbarGroupItems = styled.div`
  display: flex;
`;

const StyledToolbarGroup = styled.div<{ width: ToolbarGroupWidth }>`
  /* grid-column: ${({ width }) => (width === ToolbarGroupWidth.full ? 'span 2' : 'span 1')}; */
  margin-right: 0.75rem;
  position: relative;

  &:last-of-type {
    margin-right: 0;
  }

  &:not(:last-of-type) {
    ${StyledToolbarGroupItems} {
      &:after {
        margin-left: 0.75rem;
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
`;

const StyledToolbarGroupLabel = styled.div``;

const StyledToolbarGroupItem = styled.div`
  margin-right: 0.375rem;

  &:last-of-type {
    margin-right: 0;
  }
`;

interface ToolbarProps {
  groups: {
    width: ToolbarGroupWidth;
    items: React.ReactElement[];
    label?: string;
  }[];
}

export const Toolbar: React.FC<ToolbarProps> = React.forwardRef(
  ({ groups }: ToolbarProps, ref: Ref<HTMLDivElement>) => {
    return (
      <StyledToolbar ref={ref}>
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
