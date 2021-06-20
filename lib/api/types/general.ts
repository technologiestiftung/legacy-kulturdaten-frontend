import { Language } from '../../../config/locale';

export type Translation = {
  id: number;
  type: string;
  attributes: {
    language: Language;
  };
};

export enum PublishedStatus {
  published = 'published',
  draft = 'draft',
}

export type DefaultAttributes = {
  createdAt: string;
  updatedAt: string;
  status: PublishedStatus;
};
