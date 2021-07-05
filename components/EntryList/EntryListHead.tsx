import styled from '@emotion/styled';

const StyledEntryListHead = styled.div<{ accentColor?: string }>`
  border-top: 0.75rem solid ${({ accentColor }) => (accentColor ? accentColor : 'transparent')};
  padding: 0 0 0.75rem;
  border-bottom: 1px solid var(--grey-400);
  box-shadow: 0 0.125rem 0.625rem -0.25rem rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;
`;

const StyledEntryListHeadTop = styled.div``;

const StyledEntryListHeadTitle = styled.div`
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);
  font-weight: 600;
  padding: 0.75rem;
`;

const StyledEntryListHeadActions = styled.div``;
const StyledEntryListHeadAction = styled.div``;

const StyledEntryListHeadContent = styled.div`
  padding: 0.75rem;
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
