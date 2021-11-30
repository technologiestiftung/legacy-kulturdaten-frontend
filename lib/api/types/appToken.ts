export type AppToken = {
  data: {
    type?: 'appToken';
    attributes?: {
      name: string;
      description: string;
      url: string;
      token: {
        type: 'bearer';
        token: string;
      };
    };
  };
};
