import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Download } from 'react-feather';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

export const DownloadToastWrapper = styled.div`
  position: fixed;
  bottom: calc(var(--header-height) + 0.75rem);
  left: 0;
  width: var(--app-width);
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  padding: 0 0.75rem;
  row-gap: 0.75rem;
  pointer-events: none;
  z-index: 999;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.5rem;
    bottom: 1.5rem;
    row-gap: 0.75rem;
  }
`;

enum ToastAnimationStatus {
  fadeIn = 'fadeIn',
  paused = 'paused',
  fadeOut = 'fadeOut',
}

const StyledDownloadToast = styled.div<{ status: ToastAnimationStatus }>`
  @keyframes fade {
    0% {
      transform: translateY(5rem);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  width: 100%;
  background: var(--black);
  border-radius: 1.125rem;
  overflow: hidden;
  color: var(--white);
  pointer-events: auto;
  display: flex;
  box-shadow: 0.375rem 0.375rem 4rem rgba(0, 0, 0, 0.5);
  position: relative;
  align-items: stretch;
  ${({ status }) => {
    switch (status) {
      case ToastAnimationStatus.fadeIn: {
        return css`
          animation: fade 0.125s;
        `;
      }

      case ToastAnimationStatus.paused: {
        return '';
      }

      case ToastAnimationStatus.fadeOut: {
        return css`
          animation: fade 0.125s reverse;
          transform: translateY(5rem);
          opacity: 0;
        `;
      }

      default: {
        return '';
      }
    }
  }};

  ${mq(Breakpoint.mid)} {
    width: 35rem;
    max-width: 100%;
  }
`;

const StyledDownloadToastIcon = styled.div`
  padding: 1.125rem;
  background: rgba(255, 255, 255, 0.15);
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    display: block;
  }
`;

const StyledDownloadToastBody = styled.div`
  flex-grow: 1;
  position: relative;
`;

const StyledDownloadToastBodyContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledDownloadToastText = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  padding: 1.125rem;
  column-gap: 0.75rem;
`;

const StyledDownloadToastTextText = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
`;

const StyledDownloadToastProgressBar = styled.div<{ progress: number }>`
  background: var(--grey-600);
  width: 100%;
  height: 0.25rem;
  position: absolute;
  bottom: 0;
  left: 0;

  &::after {
    content: '';
    display: block;
    background: var(--green-light);
    height: 100%;
    width: ${({ progress }) => `calc(100% * ${progress})`};
    transition: width var(--transition-duration-fast);
  }
`;

interface DownloadToastProps {
  fileName: string;
  progress: number;
  fadeOut?: boolean;
}

export const DownloadToast: React.FC<DownloadToastProps> = ({ fileName, progress, fadeOut }) => {
  const t = useT();
  const [animationStatus, setAnimationStatus] = useState(ToastAnimationStatus.fadeIn);

  useEffect(() => {
    if (fadeOut && animationStatus === ToastAnimationStatus.fadeIn) {
      setAnimationStatus(ToastAnimationStatus.paused);

      setTimeout(
        () => requestAnimationFrame(() => setAnimationStatus(ToastAnimationStatus.fadeOut)),
        50
      );
    }
  }, [animationStatus, fadeOut]);

  return (
    <StyledDownloadToast
      status={animationStatus}
      role="alert"
      aria-label={t('download.title', { fileName }) as string}
    >
      <StyledDownloadToastIcon>
        <Download />
      </StyledDownloadToastIcon>
      <StyledDownloadToastBody>
        <StyledDownloadToastBodyContent>
          <StyledDownloadToastText>
            <StyledDownloadToastTextText>
              {t('download.title', { fileName })}
            </StyledDownloadToastTextText>
            <StyledDownloadToastTextText>
              {t('download.progress', { percent: String(Math.floor(progress * 100)) })}
            </StyledDownloadToastTextText>
          </StyledDownloadToastText>
        </StyledDownloadToastBodyContent>
        <StyledDownloadToastProgressBar progress={progress}></StyledDownloadToastProgressBar>
      </StyledDownloadToastBody>
    </StyledDownloadToast>
  );
};
