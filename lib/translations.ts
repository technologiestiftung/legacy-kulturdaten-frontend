import { defaultLanguage, Language } from '../config/locale';
import { Translation } from './api/types/general';

export const getTranslation = <T extends Translation>(
  language: Language,
  translations: T[],
  fallback = true
): T => {
  const currentTranslation = translations?.find(
    (translation) => translation.attributes?.language === language
  );

  if (currentTranslation) {
    return currentTranslation;
  }

  if (fallback) {
    return translations?.find(
      (translation) => translation.attributes?.language === defaultLanguage
    );
  }

  return undefined;
};
