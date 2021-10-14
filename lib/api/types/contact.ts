import { Translation } from './general';

export type ContactTranslation = Translation;

export type Contact = {
  id?: number;
  attributes: {
    phone: string;
    email: string;
  };
  relations: {
    translations: ContactTranslation[];
  };
};
