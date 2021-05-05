import { useCallback, useEffect } from 'react';

export const useKeyboard = (keys: string[], callback: (e: KeyboardEvent) => void): void => {
  const keyboardCallback = useCallback(
    (e: KeyboardEvent) => {
      if (e && keys.includes(e.key)) {
        callback(e);
      }
    },
    [callback, keys]
  );

  useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      keyboardCallback(e);
    };
    window.addEventListener('keydown', eventListener);

    // Cleanup event listener on on-mount
    return () => {
      window.removeEventListener('keydown', eventListener);
    };
  }, [keyboardCallback]);
};
