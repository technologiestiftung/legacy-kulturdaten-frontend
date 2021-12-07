import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory, makeBearer } from '../..';
import { MediaLicense } from '../../types/media';

/**
 * /mediaLicense/
 */

export interface MediaLicenseList extends ApiCall {
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
      data: MediaLicense[];
    };
  };
}

export const mediaLicenseListFactory: ApiCallFactory = (
  token: MediaLicenseList['request']['headers']['Authorization']
): MediaLicenseList => ({
  request: {
    route: apiRoutes.mediaLicenseList(),
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
