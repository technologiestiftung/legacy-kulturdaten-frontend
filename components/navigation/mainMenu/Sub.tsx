import styled from '@emotion/styled';

export const StyledSub = styled.div<{ variant: SubVariant }>`
  width: 100%;
  background: var(--grey-200);
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  border-radius: 0.75rem;
  /* border: 1px solid var(--grey-400); */
  overflow: hidden;

  ${({ variant }) =>
    variant === SubVariant.default ? 'box-shadow: 0 0 0.75rem -0.125rem rgba(0, 0, 0, 0.25);' : ''}
`;

const StyledSubHead = styled.div<{
  background?: string;
  color?: string;
  uppercase?: boolean;
}>`
  display: flex;
  flex-direction: row;
  padding: 0.75rem;
  box-shadow: 0px 1px 0px var(--grey-400);

  ${({ background }) => (background ? `background: ${background};` : '')}
  ${({ color }) => (color ? `color: ${color};` : '')}
  ${({ uppercase }) => (uppercase ? `text-transform: uppercase;` : '')}
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

export enum SubVariant {
  default = 'default',
  minimal = 'minimal',
}

export interface SubProps {
  items: React.ReactElement[];
  title?: string;
  icon?: React.ReactElement;
  headOptions?: {
    background?: string;
    color?: string;
    uppercase?: boolean;
  };
  variant?: SubVariant;
}

export const Sub: React.FC<SubProps> = ({
  title,
  icon,
  items,
  headOptions,
  variant = SubVariant.default,
}: SubProps) => {
  return (
    <StyledSub variant={variant}>
      {title && (
        <StyledSubHead {...headOptions}>
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
