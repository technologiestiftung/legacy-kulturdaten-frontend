import { Localization } from '../lib/i18n';

export const enDE: Localization = {
  foo: {
    bar: () => 'fun',
    coo: ({ x }) => `Value ${x}`,
  },
  menu: {
    button: {
      open: () => 'open menu',
      close: () => 'close menu',
    },
  },
};
