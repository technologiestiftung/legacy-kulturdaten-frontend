import { Locale } from '../config/locales';
import { Localization } from '../lib/i18n';
import { deDE } from './de-DE';
import { enDE } from './en-DE';

const localizations: { [key in Locale]: Localization } = { 'de-DE': deDE, 'en-DE': enDE };

export default localizations;
