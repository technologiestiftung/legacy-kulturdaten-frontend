import React, { useEffect, useMemo, useState } from 'react';

export interface BodyLockProps {
  locked: boolean;
  windowScrollY: number;
  setWindowScrollY: (windowScrollY: number) => void;
}

export const BodyLock: React.FC<BodyLockProps> = ({
  locked,
  windowScrollY,
  setWindowScrollY,
}: BodyLockProps) => {
  useEffect(() => {
    if (locked) {
      // Timeout as workaround for font flash which leads to temporary change in body height
      setTimeout(() => {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setWindowScrollY(scrollY);
          requestAnimationFrame(() => {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            // Use double requestAnimationFrame to prevent screen flash on slower (iOS) devices
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                document.body.style.overflow = 'hidden';
              });
            });
          });
        });
      }, 200);
    } else {
      document.body.style.top = null;
      document.body.style.overflow = null;
      document.body.style.position = null;
      window.scrollTo(0, windowScrollY);
    }
    // not ideal useEffect dependency used on purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);

  return null;
};

export const useBodyLock = (
  conditions: boolean[]
): { bodyLock: React.ReactElement<BodyLockProps>; locked: boolean; windowScrollY: number } => {
  const locked = useMemo(() => conditions.includes(true), [conditions]);
  const [windowScrollY, setWindowScrollY] = useState(window ? window.scrollY : 0);

  return {
    bodyLock: (
      <BodyLock locked={locked} windowScrollY={windowScrollY} setWindowScrollY={setWindowScrollY} />
    ),
    locked,
    windowScrollY,
  };
};
