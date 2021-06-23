import { ParsedUrlQuery } from 'node:querystring';
import { Category } from '../../../../lib/categories';

export interface OrganizerFormProps {
  category: Category;
  query: ParsedUrlQuery;
}
