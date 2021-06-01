import { Address } from './address';
import { DefaultAttributes } from './general';

export type OrganizerSubject = {
  type: 'organizersubject';
  id: string;
  attributes: {
    name: string;
  };
};

export type OrganizerType = {
  type: 'organizertype';
  id: string;
  attributes: DefaultAttributes;
  relations?: {
    subjects?: OrganizerSubject[];
  };
};

export type Organizer = {
  type: 'organizer';
  id: string;
  attributes: DefaultAttributes;
  relations: {
    address?: Address;
    type?: OrganizerType;
    subjects?: OrganizerSubject[];
  };
};
