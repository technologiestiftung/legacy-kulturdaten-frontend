import { ParsedUrlQuery } from 'node:querystring';
import { Category } from '../../../../lib/categories';

export interface LocationFormProps {
  category: Category;
  query: ParsedUrlQuery;
}
