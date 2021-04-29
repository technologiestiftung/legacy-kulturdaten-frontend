import { Localization } from '../lib/i18n';

export const enDE: Localization = {
  foo: {
    bar: () => 'fun',
    coo: ({ x }) => `Value ${x}`,
  },
};
