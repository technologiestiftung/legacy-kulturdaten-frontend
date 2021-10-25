export type AudienceField = {
  attributes: {
    type: string;
    key: string;
    value: string;
  };
};

export type Audience = {
  id?: number;
  type?: 'audience';
  relations?: {
    fields: AudienceField[];
  };
};
