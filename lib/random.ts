import { useMemo } from 'react';

/**
 * Generates a random int >= min and < max
 * @param min - Min value
 * @param max - Max value (not included in return range)
 * @returns a random Integer value
 */
export const useRandomInt = (min: number, max: number): number =>
  useMemo(() => min + Math.floor(Math.random() * (max - min)), [min, max]);
