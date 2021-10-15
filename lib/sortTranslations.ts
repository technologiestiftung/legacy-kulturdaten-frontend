import { Language } from '../config/locale';
import { Translation } from './api/types/general';
import { Order } from './categories';
import { getTranslation } from './translations';

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
    const aTranslation = getTranslation(language, a.relations.translations, true)?.attributes[
      key
    ]?.toLowerCase();
    const bTranslation = getTranslation(language, b.relations.translations, true)?.attributes[
      key
    ]?.toLowerCase();

    if (aTranslation > bTranslation) {
      return order === Order.ASC ? 1 : -1;
    } else if (aTranslation < bTranslation) {
      return order === Order.ASC ? -1 : 1;
    }
    return 0;
  });
};
