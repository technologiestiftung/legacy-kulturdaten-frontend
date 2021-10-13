import { ParsedUrlQuery } from 'node:querystring';
import { Category } from '../../../../lib/categories';

export interface EntryFormProps {
  category: Category;
  query: ParsedUrlQuery;
}

export type EntryFormHook = (
  props: EntryFormProps,
  loaded: boolean,
  showHint: boolean,
  ...parameters: unknown[]
) => {
  renderedForm: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
  reset: () => void;
  valid: boolean;
  hint: boolean;
  [key: string]: unknown;
};
