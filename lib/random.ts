import { useMemo } from 'react';

export const useRandomInt = (min: number, max: number): number =>
  useMemo(() => min + Math.floor(Math.random() * (max - min)), [min, max]);
