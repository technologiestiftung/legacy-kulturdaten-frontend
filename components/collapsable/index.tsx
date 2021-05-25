import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';

const StyledCollapsable = styled.div``;

const StyledCollapsableContainer = styled.div<{ isCollapsed: boolean }>`
  ${({ isCollapsed }) =>
    isCollapsed
      ? css`
          height: 0;
          visibility: hidden;
          display: none;
        `
      : css`
          height: auto;
          visibility: inherit;
          display: inherit;
        `}
`;

interface WrappedCollapsableProps {
  children: React.ReactNode;
}

interface CollapsableProps extends WrappedCollapsableProps {
  isCollapsed: boolean;
}

export const Collapsable: React.FC<CollapsableProps> = ({
  children,
  isCollapsed,
}: CollapsableProps) => {
  return (
    <StyledCollapsable>
      <StyledCollapsableContainer isCollapsed={isCollapsed}>{children}</StyledCollapsableContainer>
    </StyledCollapsable>
  );
};

export const useCollapsable = (
  initiallyCollapsed: boolean
): {
  Collapsable: React.FC<WrappedCollapsableProps>;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
} => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(initiallyCollapsed);

  const WrappedCollapsable: React.FC<WrappedCollapsableProps> = ({
    children,
  }: WrappedCollapsableProps) => <Collapsable isCollapsed={isCollapsed}>{children}</Collapsable>;

  return { Collapsable: WrappedCollapsable, isCollapsed, setIsCollapsed };
};
