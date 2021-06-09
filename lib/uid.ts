import { useMemo } from 'react';

/**
 * Generates a pseudo unique ID. Only use for non critical functions!
 * @returns a string in form "uid-000000000000"
 */
export const usePseudoUID = (): string => {
  return useMemo(() => `${getPseudoUID()}`, []);
};

export const getPseudoUID = (): string => `${Math.floor(Math.random() * 10000000000000)}`;
