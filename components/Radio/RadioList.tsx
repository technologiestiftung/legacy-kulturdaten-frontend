import styled from '@emotion/styled';
import { Radio } from '.';
import { useT } from '../../lib/i18n';
import { Label } from '../label';

const StyledRadioList = styled.div``;

const StyedRadioListLabel = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledRadioListItems = styled.ul`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
`;

const StyledRadioListItem = styled.li``;

export interface RadioListProps {
  options: {
    label: string;
    value: string;
    id?: string;
  }[];
  name: string;
  id: string;
  label?: string;
  ariaLabel?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioList: React.FC<RadioListProps> = ({
  options,
  name,
  id,
  label,
  ariaLabel,
  value,
  onChange,
  required,
}: RadioListProps) => {
  const t = useT();

  return (
    <StyledRadioList>
      {label && (
        <StyedRadioListLabel>
          <Label>
            {label} {required ? ` (${t('forms.required')})` : ''}
          </Label>
        </StyedRadioListLabel>
      )}
      <StyledRadioListItems aria-label={ariaLabel}>
        {options?.map((option, index) => (
          <StyledRadioListItem key={index}>
            <Radio
              name={name}
              id={option.id || `${id}-${index}`}
              label={option.label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
            />
          </StyledRadioListItem>
        ))}
      </StyledRadioListItems>
    </StyledRadioList>
  );
};
