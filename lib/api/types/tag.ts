import { Translation } from './general';

type TagTranslation = Translation;

export type Tag = {
  id: number | string;
  type?: 'tag';
  relations: {
    translations: TagTranslation[];
  };
};
