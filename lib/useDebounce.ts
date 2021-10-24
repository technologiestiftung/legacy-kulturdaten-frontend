import { useCallback, useState } from 'react';

export const useDebounce = (timeInMs = 250): ((callback: () => void) => void) => {
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout>();
  const debounce = useCallback(
    (callback: () => void) => {
      clearTimeout(timeoutRef);

      setTimeoutRef(setTimeout(() => callback(), timeInMs));
    },
    [timeoutRef, timeInMs]
  );

  return debounce;
};
