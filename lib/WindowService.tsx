import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type WindowContext = {
  innerWidth: number;
  innerHeight: number;
  rendered: boolean;
};

export const WindowContext = React.createContext<WindowContext>({
  innerWidth: 0,
  innerHeight: 0,
  rendered: false,
});

type WindowContextProviderProps = {
  children: ReactNode;
};

export const WindowContextProvider: React.FC<WindowContextProviderProps> = ({
  children,
}: WindowContextProviderProps) => {
  const [innerWidth, setInnerWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const [innerHeight, setinnerHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    setinnerHeight(window.innerHeight);
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--app-width', `${window.innerWidth}px`);
    setRendered(true);

    const computeResize = () => {
      setInnerWidth(window.innerWidth);
      setinnerHeight(window.innerHeight);

      let isWritingAppHeight = false;

      requestAnimationFrame(() => {
        if (!isWritingAppHeight) {
          isWritingAppHeight = true;
          document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
          document.documentElement.style.setProperty('--app-width', `${window.innerWidth}px`);
          isWritingAppHeight = false;
        }
      });
    };

    window.addEventListener('resize', () => {
      computeResize();
    });
  }, []);

  return (
    <WindowContext.Provider
      value={{
        innerWidth,
        innerHeight,
        rendered,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export enum Breakpoint {
  default = 'default',
  mid = 'mid',
  widish = 'widish',
  wide = 'wide',
  ultra = 'ultra',
}

export const breakpoints: { [key in Breakpoint]: number } = {
  default: 0,
  mid: 768,
  widish: 1024,
  wide: 1200,
  ultra: 1600,
};

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(Breakpoint.default);
  const { innerWidth } = useContext(WindowContext);

  useEffect(() => {
    const currentBreakpoint = Object.entries(breakpoints).reduce(
      (before, [candidateKey, candidateValue]) => {
        if (innerWidth >= candidateValue && candidateValue > breakpoints[before]) {
          return candidateKey as Breakpoint;
        }
        return before;
      },
      Breakpoint.default
    );

    setBreakpoint(currentBreakpoint);
  }, [innerWidth]);

  return breakpoint;
};

export const useBreakpointOrWider = (breakpoint: Breakpoint): boolean => {
  const { innerWidth } = useContext(WindowContext);

  const isBreakpointOrWider = useMemo<boolean>(() => {
    return innerWidth >= breakpoints[breakpoint];
  }, [innerWidth, breakpoint]);

  return isBreakpointOrWider;
};
