export type Address = {
  type: 'address';
  id: number;
  attributes: {
    street1: string;
    street2: string;
    city: string;
    zipCode: string;
    district: string;
  };
};
