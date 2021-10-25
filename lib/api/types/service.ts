export type ServiceField = {
  attributes: {
    type: string;
    key: string;
    value: string;
  };
};

export type Service = {
  id?: number;
  type?: 'service';
  relations?: {
    fields: ServiceField[];
  };
};
