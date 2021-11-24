import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useCallback, useContext, useState } from 'react';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { ConfirmContext } from './ConfirmContext';
import { Button } from '../button';
import { Input, InputType } from '../input';

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
  flex-direction: column;
  align-items: center;
  opacity: 0.85;
  overflow-y: auto;
  overflow-x: hidden;

  transition: opacity 0.25s ease-in-out;

  ${({ visible }) =>
    visible &&
    css`
      opacity: 1;
    `}
`;

const StyledConfirmScreenContent = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  row-gap: 2.25rem;
  width: calc(100% - 1.5rem);
  max-width: calc(var(--max-content-width) / 2);
  overflow: hidden;
  color: var(--white);
  margin-top: 30vh;
  text-align: center;
  opacity: 0;

  ${({ visible }) =>
    visible
      ? css`
          opacity: 1;
          transition: opacity 0.125s 0.25s, transform 0.125s 0.25s;
        `
      : null}

  ${mq(Breakpoint.mid)} {
    row-gap: 3rem;
    width: 33%;
  }
`;

const StyledConfirmScreenHead = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
`;

const StyledConfirmScreenTitle = styled.h2`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;
`;

const StyledConfirmScreenMessage = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 400;
`;

interface ConfirmScreenProps {
  title: React.ReactNode | string;
  visible: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  message: React.ReactNode | string;
  confirmText: string;
  condition?: {
    label: string;
    value: string;
  };
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
  const [conditionValue, setConditionValue] = useState('');

  return (
    <StyledConfirmScreen visible={visible}>
      <StyledConfirmScreenContent visible={visible} role="alert">
        <StyledConfirmScreenHead>
          <StyledConfirmScreenTitle>{title}</StyledConfirmScreenTitle>
        </StyledConfirmScreenHead>
        <StyledConfirmScreenMessage>{message}</StyledConfirmScreenMessage>
        {condition && (
          <div>
            <Input
              type={InputType.text}
              value={conditionValue}
              label={condition.label}
              onChange={(e) => setConditionValue(e.target.value)}
            />
          </div>
        )}
        <div>
          <Button
            onClick={onConfirm}
            disabled={!(!condition || conditionValue === condition.value)}
          >
            {confirmText}
          </Button>
          <Button onClick={onCancel}>cancel</Button>
        </div>
      </StyledConfirmScreenContent>
    </StyledConfirmScreen>
  );
};

export const useConfirmScreen = (): ((props: {
  title: React.ReactNode | string;
  message: React.ReactNode | string;
  confirmText: string;
  onConfirm: () => Promise<void>;
  condition?: {
    label: string;
    value: string;
  };
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
        if (condition) {
          setCondition(condition);
        }
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
