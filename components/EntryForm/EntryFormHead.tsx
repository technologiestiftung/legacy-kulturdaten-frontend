import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo } from 'react';
import { ChevronDown } from 'react-feather';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { AlertSymbol } from '../assets/AlertSymbol';
import { InfoSymbol } from '../assets/InfoSymbol';
import { mq } from '../globals/Constants';

const StyledEntryFormHead = styled.div<{ isExpander?: boolean }>`
  display: flex;
  border: none;
  border-bottom: 1px solid var(--white);
  background: transparent;
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  z-index: 1;

  ${({ isExpander }) =>
    isExpander &&
    css`
      width: 100%;
      cursor: pointer;
      appearance: none;
      transition: background var(--transition-duration-fast);

      &:hover {
        background: var(--grey-200);
        border-radius: 0.375rem 0.375rem 0 0;
      }
    `}
`;

const StyledEntryFormHeadTitle = styled.h2<{ size: EntryFormHeadSize }>`
  font-size: ${({ size }) =>
    size === EntryFormHeadSize.small ? 'var(--font-size-300)' : 'var(--font-size-400)'};
  line-height: ${({ size }) =>
    size === EntryFormHeadSize.small ? 'var(--line-height-300)' : 'var(--line-height-400)'};
  font-weight: 700;
  margin-top: ${({ size }) => (size === EntryFormHeadSize.small ? '0.375rem' : '0.75rem')};
  margin-bottom: ${({ size }) => (size === EntryFormHeadSize.small ? '0.375rem' : '0.75rem')};
  flex-shrink: 0;
  position: relative;
`;

const StyledEntryFormHeadChevron = styled.div<{ isExpanded: boolean }>`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    transition: transform var(--transition-duration);

    transform: rotateX(${({ isExpanded }) => (isExpanded ? '180deg' : '0deg')});
  }
`;

const StyledEntryFormHeadBorder = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -1px;
  border-bottom: 1px solid var(--grey-400);
`;

const StyledEntryFormHeadAlert = styled.div<{ showInline?: boolean }>`
  position: relative;
  margin: 0 0.75rem 0 0;
  width: 1.5rem;
  height: 1.5rem;

  ${({ showInline }) =>
    showInline
      ? css``
      : css`
          ${mq(Breakpoint.widish)} {
            position: absolute;
            top: 0.75rem;
            left: -2.25rem;
            margin: 0;
          }
        `}
`;

export enum EntryFormHeadSize {
  default = 'default',
  small = 'small',
}

interface EntryFormHeadProps {
  title: string;
  id?: string;
  valid?: boolean;
  hint?: boolean;
  showHintInline?: boolean;
  expander?: {
    onClick: () => void;
    isExpanded: boolean;
  };
  size?: EntryFormHeadSize;
}

export const EntryFormHead: React.FC<EntryFormHeadProps> = ({
  title,
  id,
  valid = true,
  hint = false,
  showHintInline = false,
  expander,
  size,
}: EntryFormHeadProps) => {
  const t = useT();
  const isExpander = useMemo(() => typeof expander !== 'undefined', [expander]);
  const ariaLabel = isExpander
    ? (t(expander.isExpanded ? 'general.hide' : 'general.show', {
        name: 'Vergangene Termine',
      }) as string)
    : undefined;

  return (
    <StyledEntryFormHead
      onClick={isExpander ? expander.onClick : undefined}
      isExpander={isExpander}
      as={isExpander ? 'button' : 'div'}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {valid === false ? (
        <StyledEntryFormHeadAlert showInline={showHintInline}>
          <AlertSymbol />
        </StyledEntryFormHeadAlert>
      ) : hint ? (
        <StyledEntryFormHeadAlert showInline={showHintInline}>
          <InfoSymbol />
        </StyledEntryFormHeadAlert>
      ) : (
        ''
      )}
      <StyledEntryFormHeadBorder />
      <StyledEntryFormHeadTitle id={id} size={size}>
        {title}
      </StyledEntryFormHeadTitle>
      {isExpander && (
        <StyledEntryFormHeadChevron isExpanded={expander.isExpanded}>
          <ChevronDown />
        </StyledEntryFormHeadChevron>
      )}
    </StyledEntryFormHead>
  );
};
