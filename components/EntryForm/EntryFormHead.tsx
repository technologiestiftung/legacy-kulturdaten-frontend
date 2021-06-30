import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledEntryFormHead = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--white);
  background: var(--white);
  position: sticky;
  top: var(--header-height);
  left: 0;
  align-items: flex-end;
  flex-wrap: wrap;
  z-index: 1;

  ${mq(Breakpoint.mid)} {
    top: 0;
  }
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

const StyledEntryFormHeadBackground = styled.div`
  position: absolute;
  width: calc(100% + 1.5rem);
  height: calc(100% + 1px);
  left: -0.75rem;
  top: 0;
  background: var(--white);

  ${mq(Breakpoint.mid)} {
    border-left: none;
  }

  ${mq(Breakpoint.widish)} {
    border-right: none;
  }
`;

const StyledEntryFormHeadBorder = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -1px;
  border-bottom: 1px solid var(--grey-400);
`;

const StyledEntryFormHeadActions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  position: relative;
`;
const StyledEntryFormHeadAction = styled.div`
  margin: 0.375rem 0 0.375rem 0.75rem;
`;

interface EntryFormHeadProps {
  title: string;
  actions?: React.ReactElement[];
}

export const EntryFormHead: React.FC<EntryFormHeadProps> = ({
  title,
  actions,
}: EntryFormHeadProps) => (
  <StyledEntryFormHead>
    <StyledEntryFormHeadBackground />
    <StyledEntryFormHeadBorder />
    <StyledEntryFormHeadTitle>{title}</StyledEntryFormHeadTitle>
    {actions && (
      <StyledEntryFormHeadActions>
        {actions.map((action, index) => (
          <StyledEntryFormHeadAction key={index}>{action}</StyledEntryFormHeadAction>
        ))}
      </StyledEntryFormHeadActions>
    )}
  </StyledEntryFormHead>
);
