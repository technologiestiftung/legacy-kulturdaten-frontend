import styled from '@emotion/styled';

export const StyledLabel = styled.label`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  color: inherit;
  display: inline-flex;
`;

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor }: LabelProps) => (
  <StyledLabel htmlFor={htmlFor}>{children}</StyledLabel>
);
