import { Localization } from '../lib/i18n';

export const deDE: Localization = {
  foo: {
    bar: () => 'Spaß',
    coo: ({ x }) => `Wert ${x}`,
  },
  menu: {
    button: {
      open: () => 'Menü öffnen',
      close: () => 'Menü schließen',
    },
  },
};
