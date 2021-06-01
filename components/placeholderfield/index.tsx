import styled from '@emotion/styled';
import { Label } from '../label';

const StyledPlaceholderField = styled.div``;

const StyledPlaceholderFieldLabel = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledPlaceholderFieldText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

interface PlaceholderFieldProps {
  label: string;
  text: string;
}

export const PlaceholderField: React.FC<PlaceholderFieldProps> = ({
  label,
  text,
}: PlaceholderFieldProps) => (
  <StyledPlaceholderField>
    <StyledPlaceholderFieldLabel>
      <Label>{label}</Label>
    </StyledPlaceholderFieldLabel>
    <StyledPlaceholderFieldText>{text}</StyledPlaceholderFieldText>
  </StyledPlaceholderField>
);
