import styled from '@emotion/styled';

export const StyledSection = styled.div<{ variant: MenuSectionVariant }>`
  width: 100%;
  background: var(--grey-200);
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  border-radius: 0.75rem;
  /* border: 1px solid var(--grey-400); */
  overflow: hidden;

  ${({ variant }) =>
    variant === MenuSectionVariant.default
      ? 'box-shadow: 0 0 0.75rem -0.125rem rgba(0, 0, 0, 0.25);'
      : ''}
`;

const StyledSectionHead = styled.div<{
  background?: string;
  color?: string;
  uppercase?: boolean;
}>`
  display: flex;
  flex-direction: row;
  padding: 0 0 0 0.75rem;
  box-shadow: 0px 1px 0px var(--grey-400);

  ${({ background }) => (background ? `background: ${background};` : '')}
  ${({ color }) => (color ? `color: ${color};` : '')}
  ${({ uppercase }) => (uppercase ? `text-transform: uppercase;` : '')}
`;

const StyledSectionHeadButton = styled.div`
  padding: 0.375rem;
`;

const StyledSectionTitle = styled.div`
  padding: 0.75rem 0.375rem 0.75rem 0;
  flex-grow: 1;
`;

const StyledSectionIcon = styled.div`
  padding: 0.75rem 0;
  margin-right: 0.75rem;
`;

const StyledSectionContent = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const StyledSectionItem = styled.div``;

export enum MenuSectionVariant {
  default = 'default',
  minimal = 'minimal',
}

export interface SectionProps {
  items: React.ReactElement[];
  title?: string;
  icon?: React.ReactElement;
  headOptions?: {
    background?: string;
    color?: string;
    uppercase?: boolean;
  };
  variant?: MenuSectionVariant;
  button?: React.ReactElement;
}

export const MenuSection: React.FC<SectionProps> = ({
  title,
  icon,
  items,
  headOptions,
  variant = MenuSectionVariant.default,
  button,
}: SectionProps) => {
  return (
    <StyledSection variant={variant}>
      {title && (
        <StyledSectionHead {...headOptions}>
          {icon && <StyledSectionIcon>{icon}</StyledSectionIcon>}
          <StyledSectionTitle>{title}</StyledSectionTitle>
          {button && <StyledSectionHeadButton>{button}</StyledSectionHeadButton>}
        </StyledSectionHead>
      )}
      <StyledSectionContent>
        {items.map((item, index) => (
          <StyledSectionItem key={index}>{item}</StyledSectionItem>
        ))}
      </StyledSectionContent>
    </StyledSection>
  );
};
