import { Address } from './address';

export type Organizer = {
  type: 'organizer';
  id: string;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
    address: Address;
  };
};
