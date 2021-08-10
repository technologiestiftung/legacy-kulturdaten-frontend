import { ParsedUrlQuery } from 'node:querystring';
import { Category } from '../../../../lib/categories';

export interface EntryFormProps {
  category: Category;
  query: ParsedUrlQuery;
}
