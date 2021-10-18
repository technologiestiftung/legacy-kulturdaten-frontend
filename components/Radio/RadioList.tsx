import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Radio } from '.';
import { ComponentVariant, ComponentVariants, ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { Label } from '../label';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';

const StyledRadioList = styled.div<{ variant?: ComponentVariant }>`
  ${({ variant }) =>
    variant === ComponentVariants.formList &&
    css`
      padding: 0.75rem;

      ${mq(Breakpoint.mid)} {
        padding: 0.75rem 1.125rem;
      }
    `}
`;

const StyedRadioListLabel = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledRadioListItems = styled.ul`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
`;

const StyledRadioListItem = styled.li``;

export interface RadioListProps extends ComponentWithVariants {
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
  variant,
}: RadioListProps) => {
  const t = useT();

  return (
    <StyledRadioList variant={variant}>
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
