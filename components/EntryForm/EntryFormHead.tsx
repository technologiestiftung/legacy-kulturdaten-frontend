import styled from '@emotion/styled';

const StyledEntryFormHead = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--grey-400);
  background: var(--white);
  position: sticky;
  top: 0;
  left: 0;
  align-items: flex-end;
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
`;

const StyledEntryFormHeadActions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
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
