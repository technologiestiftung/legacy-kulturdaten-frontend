import styled from '@emotion/styled';
import { MenuLinkProps } from '../MenuLink';

const StyledSub = styled.div<{ active?: boolean }>`
  border: 1px solid var(--grey-400);
  border-top: none;
  width: 100%;
  background: ${({ active }) => (active ? 'var(--white)' : 'var(--grey-200)')};
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
`;

const StyledSubHead = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.375rem 0.75rem;
  border-bottom: 1px solid var(--grey-400);
`;

const StyledSubTitle = styled.div``;
const StyledSubIcon = styled.div``;

const StyledSubContent = styled.div`
  padding: 1.125rem 0.75rem;
  display: grid;
  grid-row-gap: 0.75rem;
`;

const StyledSubItem = styled.div``;

export interface SubProps {
  title: string;
  icon: React.ReactElement;
  links: React.ReactElement<MenuLinkProps>[];
  active?: boolean;
}

export const Sub: React.FC<SubProps> = ({ title, icon, links, active }: SubProps) => (
  <StyledSub active={active}>
    <StyledSubHead>
      <StyledSubIcon>{icon}</StyledSubIcon>
      <StyledSubTitle>{title}</StyledSubTitle>
    </StyledSubHead>
    <StyledSubContent>
      {links.map((item, index) => (
        <StyledSubItem key={index}>{item}</StyledSubItem>
      ))}
    </StyledSubContent>
  </StyledSub>
);
