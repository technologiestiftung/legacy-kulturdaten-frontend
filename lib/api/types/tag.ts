import { Language } from '../../../config/locale';
import { Translation } from './general';

type TagTranslation = {
  attributes: {
    language: Language;
    name: string;
  };
} & Translation;

export type Tag = {
  id: number;
  type: 'tag';
  relations: {
    translations: TagTranslation[];
  };
};
