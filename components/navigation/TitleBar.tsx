import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { insetBorder, contentGrid, mq } from '../globals/Constants';

const StyledTitleBar = styled.div<{ secondary?: boolean; reversed?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.75rem;
  background: ${({ secondary }) => (secondary ? 'var(--grey-200)' : 'var(--white)')};
  flex-direction: ${({ reversed }) => (reversed ? 'row-reverse' : 'row')};
  box-shadow: ${insetBorder(false, true, true, true)};

  ${mq(Breakpoint.mid)} {
    ${({ secondary }) =>
      !secondary
        ? css`
            box-shadow: ${insetBorder(true, true, true)};
          `
        : css`
            box-shadow: ${insetBorder(false, true, true, true)};
          `}
  }

  ${mq(Breakpoint.wide)} {
    ${({ secondary }) =>
      !secondary
        ? css`
            padding: 0;
            ${contentGrid(10)}
          `
        : css`
            box-shadow: ${insetBorder(true, true, true)};
          `}
  }
`;

const StyledTitle = styled.h1<{ skeleton?: boolean }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.75rem 0;
  order: 1;

  ${mq(Breakpoint.mid)} {
    order: 0;
  }

  ${mq(Breakpoint.wide)} {
    order: 0;
    grid-column: 2 / -2;
  }

  ${({ skeleton }) =>
    skeleton
      ? css`
          &:after {
            content: '';
            display: block;
            position: relative;
            height: var(--line-height-300);
            width: 10rem;
            background: var(--grey-200);
          }
        `
      : ''}
`;

const StyledAction = styled.div``;

export interface TitleBarProps {
  title: string;
  action?: React.ReactElement;
  secondary?: boolean;
  reversed?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  action,
  secondary,
  reversed,
}: TitleBarProps) => (
  <StyledTitleBar secondary={secondary} reversed={reversed}>
    <StyledTitle skeleton={typeof title === 'undefined'}>{title}</StyledTitle>
    {action ? <StyledAction>{action}</StyledAction> : ''}
  </StyledTitleBar>
);
