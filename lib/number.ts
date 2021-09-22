import { useLanguage } from './routing';

export const useFormatNumber = (): ((
  number: number,
  options?: Intl.NumberFormatOptions
) => string) => {
  const language = useLanguage();

  return (number, options?): string => {
    const NumberFormat = Intl.NumberFormat(language, options || { style: 'decimal' });
    return NumberFormat.format(number);
  };
};
