import { ParsedUrlQuery } from 'node:querystring';
import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../../..';
import { Language } from '../../../../../config/locale';
import { OfferDate } from '../../../types/offer';

/**
 * /auth/info
 */

export interface OfferDateList extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
    headers: {
      Authorization: string;
    };
  };
  response: {
    status: 200;
    body: {
      data: OfferDate['data'][];
      meta?: {
        language: Language;
        pages: {
          total: number;
          perPage: number;
          currentPage: number;
          lastPage: number;
        };
      };
    };
  };
}

export const offerDateListFactory: ApiCallFactory = (
  token: OfferDateList['request']['headers']['Authorization'],
  query: ParsedUrlQuery & {
    offerId: string;
  }
): OfferDateList => ({
  request: {
    route: apiRoutes.offerDateList(query),
    method: 'GET',
    headers: {
      Authorization: makeBearer(token),
    },
  },
  response: {
    status: 200,
    body: undefined,
  },
});
