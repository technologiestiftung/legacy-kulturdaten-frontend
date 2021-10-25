import { GenericFormTranslation } from '../../lib/genericForm';
import { Language } from '../locale';
import { languagesDe } from './languagesDE';
import { languagesEn } from './languagesEN';

export type LanguageList = {
  dinKey: string;
  translation: string;
}[];

const languageToListMap: { [key in Language]: LanguageList } = {
  de: languagesDe,
  en: languagesEn,
};

export const dinLanguages = languagesDe
  .map<{
    value: string;
    translations: GenericFormTranslation[];
  }>(({ dinKey, translation }) => {
    const translationEn = languageToListMap['en'].find(
      ({ dinKey: dinKeyEn }) => dinKeyEn === dinKey
    )?.translation;

    return translationEn
      ? {
          value: dinKey,
          translations: [
            {
              attributes: {
                language: Language.de,
                name: translation,
              },
            },
            {
              attributes: {
                language: Language.en,
                name: translationEn,
              },
            },
          ],
        }
      : undefined;
  })
  .filter((language) => typeof language?.value === 'string');
