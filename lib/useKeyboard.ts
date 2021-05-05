import { useCallback, useEffect } from 'react';

/**
 * Hook to listen to keyboard events
 * @param callback - Function to call when a key is pressed
 * @param keys - Optional list of keys which should exclusively trigger the callback
 */
export const useKeyboard = (callback: (e: KeyboardEvent) => void, keys?: string[]): void => {
  const keyboardCallback = useCallback(
    (e: KeyboardEvent) => {
      if (!keys || keys.includes(e?.key)) {
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
