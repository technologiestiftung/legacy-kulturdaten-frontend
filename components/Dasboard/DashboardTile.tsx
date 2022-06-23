import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { StandardLink } from '../../lib/generalTypes';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { Check, Info } from 'react-feather';

import { useT } from '../../lib/i18n';

const StyledDashboardTile = styled.div<{
  gridColumn?: string;
  disabled?: boolean;
  isDone?: boolean;
}>`
  box-shadow: 0.75rem 0.75rem 3rem rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  grid-column: 1 / -1;
  display: flex;

  ${mq(Breakpoint.mid)} {
    border-radius: 1.5rem;
    grid-column: ${({ gridColumn }) => gridColumn || 'span 6'};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.75;
    `}

  ${({ isDone }) =>
    isDone &&
    css`
      pointer-events: none;
    `}
`;

const StyledDashboardTileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-grow: 1;
  position: relative;
  mask-image: -webkit-radial-gradient(white, black);

  ${mq(Breakpoint.mid)} {
    border-radius: 1.5rem;
  }
`;

const StyledDashboardTileDone = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  color: var(--white);
  display: flex;
  z-index: 2;
`;

const StyledDashboardTileDoneCheck = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  box-sizing: content-box;
  padding: 1.125rem 0.75rem;

  svg {
    width: 100%;
    height: 100%;
  }

  ${mq(Breakpoint.mid)} {
    width: 3rem;
    height: 3rem;
  }
`;

const StyledDashboardTileDoneText = styled.div`
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);
  font-weight: 700;
  padding: 1.5rem 0.75rem;
`;

const StyledDashboardTileDigit = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  background: var(--grey-200);
  font-size: 2.25rem;
  line-height: 2.25rem;
  min-width: 2.25rem;
  font-weight: 700;
  padding: 1.125rem 0.75rem;
  box-sizing: content-box;
  text-align: center;

  ${mq(Breakpoint.wide)} {
    font-size: 3rem;
    line-height: 3rem;
    min-width: 3rem;
  }
`;

const StyledDashboardTileContainerChildren = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 1;
  background: var(--white);

  ${mq(Breakpoint.mid)} {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StyledDashboardTileTitle = styled.h3<{ hasDigit?: boolean; variant: DashboardTileVariant }>`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  padding: 0.75rem 1.125rem;
  color: var(--black);
  display: flex;

  > svg {
    margin-right: 0.75rem;
    flex-shrink: 0;
  }

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-500);
    line-height: var(--line-height-500);
    padding: 1.125rem 1.5rem;

    > span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  ${({ hasDigit, variant }) =>
    hasDigit
      ? css`
          background: var(--white);
          font-size: var(--font-size-600);
          line-height: var(--line-height-600);
          padding: 1.125rem 1.125rem 0;

          > span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          ${mq(Breakpoint.mid)} {
            font-size: var(--font-size-600);
            line-height: var(--line-height-600);
            padding: 1.125rem 1.5rem 0;
          }
        `
      : css`
          background: ${variant === DashboardTileVariant.hint
            ? 'var(--yellow-light)'
            : 'var(--grey-200)'};
        `}
`;

const StyledDashboardTileContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  white-space: normal;
`;

export const DashboardTileText = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--line-height-400) / 2);
  padding: 0.75rem 1.125rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 1.5rem;
  }
`;

export const DashboardTileTextP = styled.p`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 400;

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-400);
    line-height: var(--line-height-400);
  }

  b {
    font-weight: 700;
  }
`;

export enum DashboardTileVariant {
  default = 'default',
  hint = 'hint',
}

interface DashboardTileProps {
  title: string;
  children: React.ReactNode;
  link?: React.ReactElement<StandardLink>;
  gridColumn?: string;
  digit?: number;
  disabled?: boolean;
  variant?: DashboardTileVariant;
  done?: {
    text: string;
  };
}

export const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  children,
  link,
  gridColumn,
  digit,
  disabled,
  done,
  variant = DashboardTileVariant.default,
}: DashboardTileProps) => {
  const isDone = typeof done !== 'undefined';
  const t = useT();

  return (
    <StyledDashboardTile gridColumn={gridColumn} disabled={disabled} isDone={isDone}>
      <StyledDashboardTileContainer>
        {digit && <StyledDashboardTileDigit>{digit}</StyledDashboardTileDigit>}
        <StyledDashboardTileContainerChildren>
          <StyledDashboardTileTitle hasDigit={typeof digit !== 'undefined'} variant={variant}>
            {variant === DashboardTileVariant.hint && <Info aria-label={t('dashboard.info.hint.altText') as string}/>}
            <span>{title}</span>
          </StyledDashboardTileTitle>
          <StyledDashboardTileContent>{children}</StyledDashboardTileContent>
          {link}
        </StyledDashboardTileContainerChildren>
        {isDone && (
          <StyledDashboardTileDone>
            <StyledDashboardTileDoneCheck>
              <Check />
            </StyledDashboardTileDoneCheck>
            <StyledDashboardTileDoneText>{done.text}</StyledDashboardTileDoneText>
          </StyledDashboardTileDone>
        )}
      </StyledDashboardTileContainer>
    </StyledDashboardTile>
  );
};
