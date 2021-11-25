import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { ConfirmContext } from './ConfirmContext';
import { Input, InputType } from '../input';
import { AlertCircle } from 'react-feather';
import { useT } from '../../lib/i18n';

const StyledConfirmScreen = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10003;
  background: rgba(0, 0, 0, var(--overlay-opacity));
  width: var(--app-width);
  height: var(--app-height);
  color: var(--black);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  opacity: 0.85;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10vh 0;

  transition: opacity 0.25s ease-in-out;

  ${({ visible }) =>
    visible &&
    css`
      opacity: 1;
    `}
`;

const StyledConfirmScreenContent = styled.div<{ visible: boolean }>`
  background: var(--white);
  display: flex;
  flex-direction: column;
  row-gap: 2.25rem;
  width: calc(100% - 1.5rem);
  max-width: calc(var(--max-content-width) / 2);
  color: var(--black);
  opacity: 0;
  border-radius: 0.75rem;

  ${({ visible }) =>
    visible
      ? css`
          opacity: 1;
          transition: opacity 0.125s 0.25s, transform 0.125s 0.25s;
        `
      : null}

  ${mq(Breakpoint.mid)} {
    @media screen and (min-height: 36rem) {
      align-self: center;
    }
    row-gap: 1.5rem;
    width: 50%;
    max-width: 34rem;
  }
`;

const StyledConfirmScreenHead = styled.div`
  background: var(--yellow-light);
  display: flex;
  column-gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem 0.75rem 0 0;

  > svg {
    display: block;
    flex-shrink: 0;
    width: var(--line-height-500);
    height: var(--line-height-500);
  }

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.125rem;
  }
`;

const StyledConfirmScreenTitle = styled.h2`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;
`;

const StyledConfirmScreenMessage = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--line-height-400) / 2);
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 400;

  padding: 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.125rem;
  }
`;

const StyledConfirmScreenCondition = styled.div`
  padding: 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.125rem;
  }
`;

const StyledConfirmScreenActions = styled.div`
  display: flex;
  justify-content: stretch;
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
  column-gap: 1px;
  row-gap: 1px;
  flex-wrap: wrap;
  border-top: 1px solid var(--grey-400);
  background: var(--grey-400);
`;

const StyledConfirmScreenAction = styled.button<{ disabled?: boolean }>`
  flex-basis: 0;
  flex-grow: 1;
  appearance: none;
  border: none;
  border-radius: 0;
  background: var(--grey-200);
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  text-align: center;
  padding: 0.75rem;
  margin: 0;
  cursor: pointer;
  color: var(--black);
  transition: background var(--transition-duration-fast), color var(--transition-duration-fast);

  &:hover {
    background: var(--grey-400);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.25;
      cursor: not-allowed;

      &:hover {
        background: var(--grey-200);
        color: var(--black);
      }
    `}

  padding: 0.75rem 1.125rem;
`;

export type ConfirmCondition = {
  label: string;
  value: string;
  error: string;
};

interface ConfirmScreenProps {
  title: React.ReactNode | string;
  visible: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  message: React.ReactNode | string;
  confirmText: string;
  condition?: ConfirmCondition;
}

export const ConfirmScreen: React.FC<ConfirmScreenProps> = ({
  title,
  visible,
  onConfirm,
  onCancel,
  message,
  confirmText,
  condition,
}: ConfirmScreenProps) => {
  const t = useT();
  const [conditionValue, setConditionValue] = useState('');
  const [inputPristine, setInputPristine] = useState(true);

  const conditionValid = useMemo(
    () => conditionValue === condition?.value,
    [condition?.value, conditionValue]
  );

  return (
    <StyledConfirmScreen visible={visible}>
      <StyledConfirmScreenContent visible={visible} role="alert">
        <StyledConfirmScreenHead>
          <AlertCircle />
          <StyledConfirmScreenTitle>{title}</StyledConfirmScreenTitle>
        </StyledConfirmScreenHead>
        <StyledConfirmScreenMessage>{message}</StyledConfirmScreenMessage>
        {condition && (
          <StyledConfirmScreenCondition>
            <Input
              type={InputType.text}
              value={conditionValue}
              label={condition.label}
              onChange={(e) => setConditionValue(e.target.value)}
              valid={inputPristine || conditionValid}
              error={conditionValue !== condition.value ? condition.error : undefined}
              hideError={inputPristine || conditionValid}
              onBlur={() => setInputPristine(false)}
            />
          </StyledConfirmScreenCondition>
        )}
        <StyledConfirmScreenActions>
          <StyledConfirmScreenAction onClick={onConfirm} disabled={!(!condition || conditionValid)}>
            {confirmText}
          </StyledConfirmScreenAction>
          <StyledConfirmScreenAction onClick={onCancel}>
            {t('general.cancel')}
          </StyledConfirmScreenAction>
        </StyledConfirmScreenActions>
      </StyledConfirmScreenContent>
    </StyledConfirmScreen>
  );
};

export const useConfirmScreen = (): ((props: {
  title: React.ReactNode | string;
  message: React.ReactNode | string;
  confirmText: string;
  onConfirm: () => Promise<void>;
  condition?: ConfirmCondition;
}) => void) => {
  const {
    confirmScreen: {
      render,
      setRender,
      setVisible,
      setMessage,
      setOnConfirm,
      setConfirmText,
      setTitle,
      setCondition,
    },
  } = useContext(ConfirmContext);

  const callback = useCallback(
    async ({ title, message, confirmText, onConfirm, condition }) => {
      if (!render) {
        setRender(true);
        setTitle(title);
        setVisible(true);
        setMessage(message);
        setOnConfirm(() => onConfirm);
        setConfirmText(confirmText);
        setCondition(condition);
      }
    },
    [
      render,
      setRender,
      setTitle,
      setVisible,
      setMessage,
      setOnConfirm,
      setConfirmText,
      setCondition,
    ]
  );

  return callback;
};
