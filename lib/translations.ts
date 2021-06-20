import { defaultLanguage, Language } from '../config/locale';
import { Translation } from './api/types/general';

export const getTranslation = <T extends Translation>(language: Language, translations: T[]): T => {
  const currentTranslation = translations?.find(
    (translation) => translation.attributes?.language === language
  );

  if (currentTranslation) {
    return currentTranslation;
  }

  return translations?.find((translation) => translation.attributes?.language === defaultLanguage);
};
