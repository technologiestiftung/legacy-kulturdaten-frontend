import { Language } from '../../../config/locale';
import { DefaultAttributes, Translation } from './general';

export type EntryTypeTranslation = {
  attributes: {
    language: Language;
    name: string;
  };
} & Translation;

export type EntrySubjectTranslation = EntryTypeTranslation;

export type EntrySubject = {
  type: 'organizersubject' | 'offersubject';
  id: number;
  relations?: {
    translations: EntrySubjectTranslation[];
  };
};

export type EntryType = {
  type: 'organizertype';
  id: number;
  attributes: DefaultAttributes;
  relations?: {
    translations: EntryTypeTranslation[];
    subjects?: EntrySubject[];
  };
};
