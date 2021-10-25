export type GenericFormField = {
  attributes: {
    type: string;
    key: string;
    value: string;
  };
};

export type Accessibility = {
  id?: number;
  type?: 'accessibility';
  relations?: {
    fields: GenericFormField[];
  };
};
