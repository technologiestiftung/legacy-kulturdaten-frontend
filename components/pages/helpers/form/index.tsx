import { ParsedUrlQuery } from 'node:querystring';
import { Category } from '../../../../lib/categories';

export interface EntryFormProps {
  category: Category;
  query: ParsedUrlQuery;
}

export interface EntryFormHookProps extends EntryFormProps {
  loaded: boolean;
  tooltip?: string | React.ReactNode;
  title?: string;
}

export type EntryFormHook<T = EntryFormHookProps> = (props: T) => {
  renderedForm: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
  reset: () => void;
  valid: boolean;
  [key: string]: unknown;
};
