export type Cookie = {
  'name': string;
  'value': string;
  'path'?: string;
  'domain'?: string;
  'max-age'?: number;
};

export const getCookie = (name: string): Cookie => {
  const cookie =
    typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .filter((cookie: string) => cookie.split('=')[0] === name)
          .reduce<Cookie>(
            (map, obj) => {
              return { name: obj.split('=')[0], value: obj.split('=')[1] };
            },
            { name: undefined, value: undefined }
          )
      : undefined;

  return cookie;
};

export const setCookie = ({ name, value, path, domain, 'max-age': maxAge }: Cookie): void => {
  document.cookie = `${name}=${value};${maxAge ? `max-age=${maxAge};` : ''}${
    domain ? `domain=${domain};` : ''
  }${path ? `path=${path};` : ''}samesite=strict`;
};

export const deleteCookie = ({ name, path, domain }: Cookie): void => {
  document.cookie = `${name}= ;path=${path};${
    domain ? `domain=${domain};` : ''
  }expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
