/* eslint-disable react/display-name */
import styled from '@emotion/styled';
import React, { Ref } from 'react';

export enum ToolbarGroupWidth {
  full = 'full',
  half = 'half',
}

const StyledToolbar = styled.div``;

const StyledToolbarContainer = styled.div``;

const StyledToolbarGroup = styled.div<{ width: ToolbarGroupWidth }>``;
const StyledToolbarGroupLabel = styled.div``;
const StyledToolbarGroupItems = styled.div``;
const StyledToolbarGroupItem = styled.div``;

interface ToolbarProps {
  groups: {
    width: ToolbarGroupWidth;
    items: React.ReactElement[];
    label?: string;
  }[];
}

export const Toolbar: React.FC<ToolbarProps> = React.forwardRef(
  ({ groups }: ToolbarProps, ref: Ref<HTMLDivElement>) => (
    <StyledToolbar ref={ref}>
      <StyledToolbarContainer>
        {groups.map(({ width, label, items }, index) => (
          <StyledToolbarGroup key={index} width={width}>
            {label && <StyledToolbarGroupLabel>{label}</StyledToolbarGroupLabel>}
            <StyledToolbarGroupItems>
              {items.map((item, itemsIndex) => (
                <StyledToolbarGroupItem key={itemsIndex}>{item}</StyledToolbarGroupItem>
              ))}
            </StyledToolbarGroupItems>
          </StyledToolbarGroup>
        ))}
      </StyledToolbarContainer>
    </StyledToolbar>
  )
);
