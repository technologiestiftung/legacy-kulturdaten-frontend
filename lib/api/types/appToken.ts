export type AppToken = {
  data: {
    type?: 'appToken';
    attributes?: {
      id: number;
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
