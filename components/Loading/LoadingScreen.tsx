import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useCallback, useContext } from 'react';
import { Check } from 'react-feather';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { LoadingContext } from './LoadingContext';

enum AnimationDirection {
  in = 'in',
  out = 'out',
}

const StyledLoadingScreen = styled.div<{ visible: boolean; direction: AnimationDirection }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10003;
  background: rgba(0, 0, 0, 1);
  width: var(--app-width);
  height: var(--app-height);
  color: var(--black);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.85;
  overflow-y: auto;
  overflow-x: hidden;

  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
  transform: ${({ direction }) =>
    direction === AnimationDirection.in
      ? 'translateY(var(--app-height))'
      : 'translateY(calc(-1 * var(--app-height)))'};

  ${({ visible }) =>
    visible &&
    css`
      transform: translateY(0px);
      opacity: 1;
    `}
`;

const StyledLoadingScreenContent = styled.div<{ visible: boolean; direction: AnimationDirection }>`
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
  transform: ${({ direction }) =>
    direction === AnimationDirection.in ? 'translateY(10rem)' : 'translazteY(0)'};

  transition: ${({ direction }) =>
    direction === AnimationDirection.in
      ? 'opacity 0.125s 0.25s, transform 0.125s 0.25s'
      : 'opacity 0.125s, transform 0.125s'};

  ${({ visible }) =>
    visible
      ? css`
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.125s 0.25s, transform 0.125s 0.25s;
        `
      : null}

  ${mq(Breakpoint.mid)} {
    /* padding: 1.5rem; */
    /* border-radius: 0.375rem; */
    row-gap: 3rem;
    width: 33%;
  }
`;

const StyledLoadingScreenHead = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
`;

const StyledLoadingScreenTitle = styled.h2`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;
`;

const StyledLoadingScreenMessage = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 400;
`;

const StyledLoadingScreenError = styled(StyledLoadingScreenMessage)`
  color: var(--yellow);
`;

const StyledLoadingScreenCheck = styled.div`
  display: flex;
  justify-content: center;

  svg {
    width: 4rem;
    height: 4rem;
  }
`;

export const StyledLoadingScreenWobbler = styled.div<{ invert?: boolean }>`
  @keyframes wobble {
    0% {
      transform: translateX(calc(0));
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(calc(0));
    }
  }

  width: 60%;
  margin: 0 auto;
  height: 0.1875rem;
  border-radius: 1.5rem;
  position: relative;

  ${({ invert }) =>
    invert
      ? css`
          color: var(--grey-500);
          background: var(--grey-200);
        `
      : css`
          color: var(--white);
          background: var(--grey-600);
        `}

  &::before {
    content: '';
    position: absolute;
    width: calc(50%);
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 1.5rem;
    background: ${({ invert }) => (invert ? 'var(--grey-500)' : 'var(--grey-200)')};
    animation: wobble 1.5s infinite ease-in-out;
  }
`;

interface LoadingScreenProps {
  title: React.ReactNode | string;
  visible: boolean;
  loading: boolean;
  message?: React.ReactNode | string;
  error?: React.ReactNode | string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title,
  visible,
  loading,
  message,
  error,
}: LoadingScreenProps) => {
  return (
    <StyledLoadingScreen
      visible={visible}
      direction={!loading ? AnimationDirection.out : AnimationDirection.in}
    >
      <StyledLoadingScreenContent
        visible={visible}
        direction={!loading ? AnimationDirection.out : AnimationDirection.in}
        role="alert"
      >
        <StyledLoadingScreenHead>
          <StyledLoadingScreenTitle>{title}</StyledLoadingScreenTitle>
        </StyledLoadingScreenHead>
        {loading && <StyledLoadingScreenWobbler />}
        {error ? (
          <StyledLoadingScreenError>{error}</StyledLoadingScreenError>
        ) : (
          loading && message && <StyledLoadingScreenMessage>{message}</StyledLoadingScreenMessage>
        )}
        {!loading && !error && (
          <StyledLoadingScreenCheck>
            <Check />
          </StyledLoadingScreenCheck>
        )}
      </StyledLoadingScreenContent>
    </StyledLoadingScreen>
  );
};

export const useLoadingScreen = (): ((
  title: React.ReactNode | string,
  load: () => Promise<{
    success: boolean;
    error?: React.ReactNode | string;
  }>,
  message?: React.ReactNode | string,
  preDelayInMs?: number,
  postDelayInMs?: number
) => void) => {
  const {
    loadingScreen: { render, setRender, setVisible, setMessage, setError, setLoading, setTitle },
  } = useContext(LoadingContext);

  const callback = useCallback(
    async (
      title: React.ReactNode | string,
      load: () => Promise<{
        success: boolean;
        error?: React.ReactNode | string;
      }>,
      message,
      preDelayInMs = 1250,
      postDelayInMs = 1250
    ) => {
      if (!render) {
        setRender(true);
        setTitle(title);
        setMessage(message);
        setLoading(true);

        setTimeout(() => setVisible(true), 100);

        setTimeout(async () => {
          try {
            const response = await load();

            if (response.success) {
              setLoading(false);
              setTimeout(() => {
                setVisible(false);
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    setMessage(undefined);
                    setRender(false);
                  }, 500);
                });
              }, postDelayInMs);
            } else {
              setLoading(false);
              setError(response.error);

              setTimeout(() => {
                setVisible(false);

                requestAnimationFrame(() => {
                  setTimeout(() => {
                    setMessage(undefined);
                    setError(undefined);
                    setRender(false);
                  }, 500);
                });
              }, 3000);
            }
          } catch (e) {
            console.error(e);
          }
        }, preDelayInMs);
      }
    },
    [setTitle, setError, setMessage, setVisible, render, setRender, setLoading]
  );

  return callback;
};
