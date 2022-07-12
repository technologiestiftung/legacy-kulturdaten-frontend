import styled from '@emotion/styled';

export const StyledLabel = styled.label`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  color: inherit;
  display: inline-flex;
  flex-direction: row;
`;

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  ariaLabel?: string;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor, ariaLabel }: LabelProps) => (
  <StyledLabel htmlFor={htmlFor} aria-label={ariaLabel}>{children}</StyledLabel>
);
