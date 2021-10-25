import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { Audience } from '../../../types/audience';
import { Offer } from '../../../types/offer';

/**
 * /offer/audience/update
 */

export type OfferAudienceUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Audience;
  };
  response: {
    status: 200;
    body: {
      data: Offer;
      meta: {
        message: 'Offer Audience updated successfully';
      };
    };
  };
};

export const offerAudienceUpdateFactory = (
  token: OfferAudienceUpdate['request']['headers']['Authorization'],
  query: {
    id: string;
    entry: Audience;
  }
): OfferAudienceUpdate => ({
  request: {
    route: apiRoutes.offerAudienceUpdate({ id: query.id }),
    method: 'PATCH',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query?.entry,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
