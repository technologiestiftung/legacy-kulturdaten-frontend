import { ParsedUrlQuery } from 'node:querystring';
import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { Offer } from '../../types/offer';

/**
 * /auth/info
 */

export interface OfferList extends ApiCall {
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
      data: Offer[];
    };
  };
}

export const offerListFactory: ApiCallFactory = (
  token: OfferList['request']['headers']['Authorization'],
  query: ParsedUrlQuery
): OfferList => ({
  request: {
    route: apiRoutes.offerList(query),
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
