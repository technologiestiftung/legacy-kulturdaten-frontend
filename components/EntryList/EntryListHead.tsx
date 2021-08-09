import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledEntryListHead = styled.div<{ accentColor?: string }>`
  border-bottom: 1px solid var(--grey-400);
  position: relative;
  z-index: 1;
  background: var(--grey-200);
`;

const StyledEntryListHeadTop = styled.div``;

const StyledEntryListHeadTitle = styled.div`
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);
  font-weight: 600;
  padding: 1.5rem 0.75rem 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: 2.25rem 1.5rem 1.125rem;
  }
`;

const StyledEntryListHeadActions = styled.div``;
const StyledEntryListHeadAction = styled.div``;

const StyledEntryListHeadContent = styled.div`
  padding: 0.75rem 0.75rem 1.5rem;
  display: flex;
  flex-direction: column;

  ${mq(Breakpoint.wide)} {
    padding: 1.125rem 1.5rem 2.25rem;
  }
`;

interface EntryListHeadProps {
  title: string;
  expanded: boolean;
  children?: React.ReactNode;
  actions?: React.ReactElement[];
  accentColor?: string;
}

export const EntryListHead: React.FC<EntryListHeadProps> = ({
  title,
  children,
  actions,
  expanded,
  accentColor,
}: EntryListHeadProps) => {
  return (
    <StyledEntryListHead accentColor={accentColor}>
      <StyledEntryListHeadTop>
        <StyledEntryListHeadTitle>{title}</StyledEntryListHeadTitle>
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
