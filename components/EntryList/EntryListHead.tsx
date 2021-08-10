import styled from '@emotion/styled';
import { Maximize2, Minimize2 } from 'react-feather';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledEntryListHead = styled.div`
  border-bottom: 1px solid var(--grey-400);
  position: relative;
  z-index: 1;
  background: var(--grey-200);
`;

const StyledEntryListHeadTop = styled.div``;

const StyledEntryListHeadTitleRow = styled.div`
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);
  font-weight: 600;
  padding: 1.5rem 0 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${mq(Breakpoint.wide)} {
    padding: 1.875rem 0 0.75rem;
  }
`;

const StyledEntryListHeadTitle = styled.div`
  padding: 0 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: 0 1.5rem;
  }
`;

const StyledEntryListHeadActions = styled.div``;
const StyledEntryListHeadAction = styled.div``;

const StyledEntryListHeadContent = styled.div`
  padding: 0.75rem 0.75rem 1.875rem;
  display: flex;
  flex-direction: column;

  ${mq(Breakpoint.wide)} {
    padding: 1.125rem 1.5rem 2.25rem;
  }
`;

const StyledExpandableButton = styled.button`
  appearance: none;
  border: none;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--black);
  align-self: stretch;
  cursor: pointer;
  color: var(--white);
  padding: calc(0.75rem - 1px);

  border: 1px solid var(--grey-400);
  border-right: none;
  border-radius: 0.75rem 0 0 0.75rem;

  &:hover {
    background: var(--grey-600);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

interface EntryListHeadProps {
  title: string;
  expanded: boolean;
  setExpanded?: (expanded: boolean) => void;
  expandable?: boolean;
  children?: React.ReactNode;
  actions?: React.ReactElement[];
}

export const EntryListHead: React.FC<EntryListHeadProps> = ({
  title,
  children,
  actions,
  expanded,
  setExpanded,
  expandable,
}: EntryListHeadProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  return (
    <StyledEntryListHead>
      <StyledEntryListHeadTop>
        <StyledEntryListHeadTitleRow>
          <StyledEntryListHeadTitle>{title}</StyledEntryListHeadTitle>
          {isMidOrWider && expandable && (
            <div>
              <StyledExpandableButton
                onClick={() => (setExpanded ? setExpanded(!expanded) : undefined)}
              >
                {expanded ? <Minimize2 /> : <Maximize2 />}
              </StyledExpandableButton>
            </div>
          )}
        </StyledEntryListHeadTitleRow>
        {expanded && actions && (
          <StyledEntryListHeadActions>
            {actions.map((action, index) => (
              <StyledEntryListHeadAction key={index}>{action}</StyledEntryListHeadAction>
            ))}
          </StyledEntryListHeadActions>
        )}
      </StyledEntryListHeadTop>
      {children && <StyledEntryListHeadContent>{children}</StyledEntryListHeadContent>}
    </StyledEntryListHead>
  );
};
