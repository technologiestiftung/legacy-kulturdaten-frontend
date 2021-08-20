import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { ExclamationMarkSvg } from '../assets/ExclamationMarkSvg';
import { mq } from '../globals/Constants';

const StyledEntryFormHead = styled.div`
  display: flex;
  border-bottom: 1px solid var(--white);
  background: var(--white);
  position: relative;

  align-items: center;
  flex-wrap: wrap;
  z-index: 1;

  /* ${mq(Breakpoint.mid)} {
    top: var(--header-height);
  } */
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

const StyledEntryFormHeadAlert = styled.div`
  position: relative;
  background: #f19203;
  color: var(--white);
  border-radius: 0.375rem;
  line-height: 0;
  margin: 0 0.75rem 0 0;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  ${mq(Breakpoint.widish)} {
    position: absolute;
    top: 0.375rem;
    left: -3rem;
    margin: 0;

    svg {
      width: 2.25rem;
      height: 2.25rem;
    }
  }
`;

interface EntryFormHeadProps {
  title: string;
  valid?: boolean;
}

export const EntryFormHead: React.FC<EntryFormHeadProps> = ({
  title,
  valid,
}: EntryFormHeadProps) => (
  <StyledEntryFormHead>
    {valid === false ? (
      <StyledEntryFormHeadAlert>
        <ExclamationMarkSvg />
      </StyledEntryFormHeadAlert>
    ) : (
      ''
    )}
    <StyledEntryFormHeadBorder />
    <StyledEntryFormHeadTitle>{title}</StyledEntryFormHeadTitle>
  </StyledEntryFormHead>
);
