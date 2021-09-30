import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { OfferDate } from '../../../types/offer';

/**
 * /auth/info
 */

export type OfferDateUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: OfferDate;
  };
  response: {
    status: 200;
    body: {
      data: OfferDate;
      meta: {
        message: 'OfferDate updated successfully';
      };
    };
  };
};

export const offerDateUpdateFactory = (
  token: OfferDateUpdate['request']['headers']['Authorization'],
  query: {
    offerId: string;
    dateId: number;
    offerDate: OfferDate;
  }
): OfferDateUpdate => ({
  request: {
    route: apiRoutes.offerDateUpdate({ offerId: query.offerId, dateId: String(query.dateId) }),
    method: 'PATCH',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.offerDate,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
