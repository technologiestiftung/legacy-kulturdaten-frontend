import styled from '@emotion/styled';

export const StyledSub = styled.div`
  width: 100%;
  background: var(--grey-200);
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  border-radius: 0.75rem;
  border: 1px solid var(--grey-400);
  overflow: hidden;
`;

const StyledSubHead = styled.div<{ background?: string }>`
  display: flex;
  flex-direction: row;
  padding: 0.75rem;
  box-shadow: 0px 1px 0px var(--grey-400);

  ${({ background }) => (background ? `background: ${background};` : '')}
`;

const StyledSubTitle = styled.div``;
const StyledSubIcon = styled.div`
  margin-right: 0.75rem;
`;

const StyledSubContent = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const StyledSubItem = styled.div``;

export interface SubProps {
  items: React.ReactElement[];
  title?: string;
  icon?: React.ReactElement;
  headBackground?: string;
}

export const Sub: React.FC<SubProps> = ({ title, icon, items, headBackground }: SubProps) => {
  return (
    <StyledSub>
      {title && (
        <StyledSubHead background={headBackground}>
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
