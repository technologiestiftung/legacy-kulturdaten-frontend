import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { AlertSymbol } from '../assets/AlertSymbol';
import { InfoSymbol } from '../assets/InfoSymbol';
import { mq } from '../globals/Constants';

const StyledEntryFormHead = styled.div`
  display: flex;
  border-bottom: 1px solid var(--white);
  background: var(--white);
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  z-index: 1;
`;

const StyledEntryFormHeadTitle = styled.h2`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  flex-shrink: 0;
  position: relative;
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

interface EntryFormHeadProps {
  title: string;
  id?: string;
  valid?: boolean;
  hint?: boolean;
  showHintInline?: boolean;
}

export const EntryFormHead: React.FC<EntryFormHeadProps> = ({
  title,
  id,
  valid = true,
  hint = false,
  showHintInline = false,
}: EntryFormHeadProps) => (
  <StyledEntryFormHead>
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
    <StyledEntryFormHeadTitle id={id}>{title}</StyledEntryFormHeadTitle>
  </StyledEntryFormHead>
);
