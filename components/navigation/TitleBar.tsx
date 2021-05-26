import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { insetBorder, contentGrid, mq } from '../globals/Constants';

const StyledTitleBarContainer = styled.div<{ reversed?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: ${({ reversed }) => (reversed ? 'row-reverse' : 'row')};
  grid-column: 1 / -1;

  ${mq(Breakpoint.ultra)} {
    grid-column: 2 / -2;
  }
`;

const StyledTitleBar = styled.div<{ secondary?: boolean; secondaryPresent?: boolean }>`
  background: ${({ secondary }) => (secondary ? 'var(--grey-200)' : 'var(--white)')};
  box-shadow: ${insetBorder(false, true, true, true)};
  padding: 0 0.75rem;

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
    ${({ secondary, secondaryPresent }) =>
      !secondary && secondaryPresent
        ? css`
            ${contentGrid(8)}
          `
        : !secondary
        ? css`
            ${contentGrid(10)}
          `
        : css`
            box-shadow: ${insetBorder(true, true, true)};
          `}
  }

  ${mq(Breakpoint.ultra)} {
    ${({ secondary }) =>
      !secondary
        ? css`
            padding: 0;
          `
        : ''}
  }
`;

const StyledTitle = styled.h1<{ skeleton?: boolean; reversed?: boolean; hasAction?: boolean }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: ${({ reversed, hasAction }) =>
    reversed || hasAction ? '0.75rem 0 0.75rem 0.75rem' : '0.75rem 0.75rem 0.75rem 0'};
  order: 1;
  text-align: ${({ reversed, hasAction }) => (reversed || hasAction ? 'right' : 'inherit')};

  ${mq(Breakpoint.mid)} {
    order: 0;

    padding: ${({ reversed }) =>
      reversed ? '0.75rem 0 0.75rem 0.75rem' : '0.75rem 0.75rem 0.75rem 0'};
  }

  ${mq(Breakpoint.ultra)} {
    order: 0;
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

const StyledAction = styled.div`
  height: 2.25rem;
  margin-top: 0.375rem;
  display: flex;
  align-items: center;
`;

export interface TitleBarProps {
  title: string;
  action?: React.ReactElement;
  secondary?: boolean;
  secondaryPresent?: boolean;
  reversed?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  action,
  secondary,
  secondaryPresent,
  reversed,
}: TitleBarProps) => (
  <StyledTitleBar secondary={secondary} secondaryPresent={secondaryPresent}>
    <StyledTitleBarContainer reversed={reversed}>
      <StyledTitle
        reversed={reversed}
        skeleton={typeof title === 'undefined'}
        hasAction={typeof action !== 'undefined'}
      >
        {title}
      </StyledTitle>
      {action ? <StyledAction>{action}</StyledAction> : ''}
    </StyledTitleBarContainer>
  </StyledTitleBar>
);
