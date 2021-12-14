import { Language } from '../config/locale';
import { Translation } from './api/types/general';
import { Order } from './categories';
import { getTranslation } from './translations';

const normalizeTranslationString = (text: string): string =>
  text
    .toLowerCase()
    .replaceAll('ö', 'oe')
    .replaceAll('ä', 'ae')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss');

export const sortByTranslation = <
  T extends {
    relations?: {
      translations: Translation[];
    };
  }
>(
  entries: T[],
  language: Language,
  order = Order.ASC,
  key = 'name'
): T[] => {
  return entries.sort((a, b) => {
    const aTranslation = normalizeTranslationString(
      getTranslation(language, a.relations.translations, true)?.attributes[key] || ''
    );
    const bTranslation = normalizeTranslationString(
      getTranslation(language, b.relations.translations, true)?.attributes[key] || ''
    );

    if (aTranslation > bTranslation) {
      return order === Order.ASC ? 1 : -1;
    } else if (aTranslation < bTranslation) {
      return order === Order.ASC ? -1 : 1;
    }
    return 0;
  });
};
