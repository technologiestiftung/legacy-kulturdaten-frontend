import styled from '@emotion/styled';

export const StyledSub = styled.div<{ active?: boolean }>`
  width: 100%;
  background: ${({ active }) => (active ? 'var(--white)' : 'var(--grey-200)')};
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  box-shadow: 0px -1px 0px var(--grey-400), inset 1px 0px 0px var(--grey-400),
    inset -1px 0px 0px var(--grey-400);
`;

const StyledSubHead = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.375rem 0.75rem;
  box-shadow: 0px 1px 0px var(--grey-400);
`;

const StyledSubTitle = styled.div``;
const StyledSubIcon = styled.div``;

const StyledSubContent = styled.div`
  padding: 1.125rem 0.75rem;
  display: grid;
  grid-row-gap: 0.75rem;
  box-shadow: 0px 1px 0px var(--grey-400);
`;

const StyledSubItem = styled.div``;

export interface SubProps {
  title?: string;
  icon?: React.ReactElement;
  items: React.ReactElement[];
  isActive?: boolean;
}

export const Sub: React.FC<SubProps> = ({ title, icon, items, isActive }: SubProps) => {
  return (
    <StyledSub active={isActive}>
      {title && (
        <StyledSubHead>
          {icon && <StyledSubIcon>{icon}</StyledSubIcon>}
          <StyledSubTitle>{title}</StyledSubTitle>
        </StyledSubHead>
      )}
      <StyledSubContent>
        {items.map((item, index) => (
          <StyledSubItem key={index}>{item}</StyledSubItem>
        ))}
      </StyledSubContent>
    </StyledSub>
  );
};
