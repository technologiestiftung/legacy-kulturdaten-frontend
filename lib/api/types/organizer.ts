import { Address } from './address';
import { DefaultAttributes } from './general';

export type OrganizerSubject = {
  type: 'organizersubject';
  id: number;
  attributes: {
    name: string;
  };
};

export type OrganizerType = {
  type: 'organizertype';
  id: number;
  attributes: DefaultAttributes;
  relations?: {
    subjects?: OrganizerSubject[];
  };
};

export type Organizer = {
  type: 'organizer';
  id: string;
  attributes: { description?: string } & DefaultAttributes;
  relations: {
    address?: Address;
    type?: OrganizerType;
    subjects?: OrganizerSubject[];
  };
};

export type CreateOrganizer = {
  attributes?: {
    name?: string;
    description?: string;
  };
  relations?: {
    address?: Address;
    type?: number;
    subjects?: number[];
  };
};
