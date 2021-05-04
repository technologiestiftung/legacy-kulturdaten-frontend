import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type WindowContext = {
  innerWidth: number;
  innerHeight: number;
};

export const WindowContext = React.createContext<WindowContext>({
  innerWidth: 0,
  innerHeight: 0,
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

  useEffect(() => {
    window.addEventListener('resize', () => {
      setInnerWidth(window.innerWidth);
      setinnerHeight(window.innerHeight);
    });
  }, []);

  return (
    <WindowContext.Provider
      value={{
        innerWidth,
        innerHeight,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export enum Breakpoint {
  default = 'default',
  mid = 'mid',
  wide = 'wide',
}

export const breakpoints: { [key in Breakpoint]: number } = {
  default: 0,
  mid: 768,
  wide: 1200,
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
