import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useT } from '../../lib/i18n';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { AlertSymbol } from '../assets/AlertSymbol';
import { CheckSvg } from '../assets/CheckSvg';
import { ExclamationMarkSvg } from '../assets/ExclamationMarkSvg';
import { InfoSymbol } from '../assets/InfoSymbol';
import { UploadCloudSvg } from '../assets/UploadCloudSvg';
import { contentGrid, mq } from '../globals/Constants';

const StyledSave = styled.div`
  position: sticky;
  width: 100%;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0.375rem 0;
  z-index: 10;
  background: var(--white);
  box-shadow: 0 0.125rem 0.625rem -0.125rem rgba(0, 0, 0, 0.125);

  ${mq(Breakpoint.mid)} {
    ${contentGrid(8)}
    padding: 0.75rem 0;
    top: var(--header-height);
  }

  @supports (backdrop-filter: blur(16px)) {
    backdrop-filter: blur(16px);
    background: rgba(248, 248, 248, 0.8);
  }

  @supports (-webkit-backdrop-filter: blur(16px)) {
    -webkit-backdrop-filter: blur(16px);
    background: rgba(248, 248, 248, 0.8);
  }
`;

const StyledSaveContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
    padding: 0 1.5rem;
  }

  ${mq(Breakpoint.widish)} {
    grid-column: 2 / -2;
    padding: 0;
  }
`;

const StyledSaveMessage = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  padding: 0.5rem 0.75rem 0.5rem 0;
`;

const StyledSaveMessageSymbol = styled.div`
  position: relative;
  margin: 0 0.75rem 0 0;
  width: 1.5rem;
  height: 1.5rem;

  ${mq(Breakpoint.widish)} {
    position: absolute;
    top: 0.5rem;
    left: -2.25rem;
    margin: 0;
  }
`;

const StyledSaveMessageText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const StyledSaveButton = styled.button<{ saving: boolean }>`
  pointer-events: all;
  margin: 0;
  border: none;
  border: 1px solid var(--black-o25);
  flex-shrink: 0;
  border-radius: 0.75rem;
  appearance: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background: rgb(10, 47, 211);
  color: var(--white);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  box-shadow: 0.125rem 0.125rem 1.75rem -0.25rem rgba(4, 35, 172, 0.35);
  transition: box-shadow var(--transition-duration), border var(--transition-duration),
    transform var(--transition-duration);
  transform: translateY(0);

  &:not(:disabled) {
    &:hover {
      border-color: var(--black);
      box-shadow: 0.125rem 0.125rem 1.75rem -0.25rem rgba(4, 35, 172, 0.75);
      transform: translateY(-0.0625rem);
    }

    &:active {
      border-color: var(--black);
      box-shadow: 0.125rem 0.125rem 0.75rem -0.25rem rgba(4, 35, 172, 0.95);
      transform: translateY(0.0625rem);
    }
  }

  &:disabled {
    cursor: default;
  }

  ${({ saving }) =>
    saving
      ? css`
          transform: translateY(0) !important;
          box-shadow: 0.125rem 0.125rem 1.75rem -0.25rem rgba(4, 35, 172, 0.35) !important;
          cursor: progress !important;
        `
      : css`
          &:disabled {
            opacity: 0.5;
          }
        `}
`;

const StyledSaveButtonText = styled.div`
  padding: calc(0.5rem - 1px) calc(1rem - 1px);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
`;

const StyledSaveButtonIcon = styled.div<{ active: boolean; saving: boolean }>`
  @keyframes arrowAnimation {
    0% {
      transform: scale(1.15) translateY(0);
    }

    50% {
      transform: scale(1.15) translateY(-100%);
    }

    50.001% {
      transform: scale(1.15) translateY(100%);
    }

    100% {
      transform: scale(1.15) translateY(0);
    }
  }

  flex-grow: 0;
  line-height: 0;
  background: rgba(255, 255, 255, 0.125);
  display: flex;
  align-items: center;

  svg {
    width: calc(2.25rem + 0.125rem);
    height: calc(2.25rem + 0.125rem);

    .upload-cloud-arrow {
      transform-origin: 50% 50%;

      ${({ active }) =>
        active
          ? css`
              opacity: 1;
            `
          : css`
              opacity: 0;
            `}
    }

    .upload-cloud-cloud {
      transition: transform 0.1s, opacity 0.1s;
      transform: scale(1);
      transform-origin: 50% 50%;
      opacity: 1;
    }
  }

  ${({ saving }) =>
    saving
      ? css`
          svg {
            .upload-cloud-arrow {
              animation-duration: 1s;
              animation-name: arrowAnimation;
              animation-iteration-count: infinite;
            }

            .upload-cloud-cloud {
              transform: scale(0.85);

              opacity: 0.5;
            }
          }
        `
      : css``}
`;

interface SaveProps {
  onClick: () => Promise<void>;
  date: string;
  active?: boolean;
  valid?: boolean;
  hint?: boolean;
}

export const Save: React.FC<SaveProps> = ({
  onClick,
  date,
  active = false,
  valid = true,
  hint = false,
}: SaveProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const t = useT();

  const [saving, setSaving] = useState(false);
  const [timeThresholdReached, setTimeThresholdReached] = useState(false);

  useEffect(() => {
    if (saving) {
      if (!timeThresholdReached && active) {
        setTimeout(() => {
          setTimeThresholdReached(true);
        }, 1500);
      }

      if (!active && timeThresholdReached) {
        setSaving(false);
        setTimeThresholdReached(false);
      }
    }
  }, [saving, active, timeThresholdReached]);

  return (
    <StyledSave>
      <StyledSaveContainer>
        <StyledSaveMessage role={!valid ? 'alert' : ''}>
          {valid === false ? (
            <>
              <StyledSaveMessageSymbol>
                <AlertSymbol />
              </StyledSaveMessageSymbol>
              <StyledSaveMessageText>
                {t(isMidOrWider ? 'save.issues' : 'save.issuesShort')}
              </StyledSaveMessageText>
            </>
          ) : hint ? (
            <>
              <StyledSaveMessageSymbol>
                <InfoSymbol />
              </StyledSaveMessageSymbol>
              <StyledSaveMessageText>
                {t(isMidOrWider ? 'save.hint' : 'save.hintShort')}
              </StyledSaveMessageText>
            </>
          ) : (
            <StyledSaveMessageText>
              {date && (
                <>
                  {isMidOrWider ? t('statusBar.saved') : t('statusBar.savedShort')}: {date}
                </>
              )}
            </StyledSaveMessageText>
          )}
        </StyledSaveMessage>
        <StyledSaveButton
          onClick={() => {
            if (!saving && typeof onClick === 'function') {
              setSaving(true);
              onClick();
            }
          }}
          disabled={!active || !valid}
          saving={saving}
        >
          <StyledSaveButtonText>
            {!valid
              ? t('save.invalid')
              : saving
              ? `${t('general.saving')}...`
              : active
              ? t('general.save')
              : t('general.saved')}
          </StyledSaveButtonText>
          <StyledSaveButtonIcon saving={saving} active={saving || active}>
            {!valid ? <ExclamationMarkSvg /> : saving || active ? <UploadCloudSvg /> : <CheckSvg />}
          </StyledSaveButtonIcon>
        </StyledSaveButton>
      </StyledSaveContainer>
    </StyledSave>
  );
};
