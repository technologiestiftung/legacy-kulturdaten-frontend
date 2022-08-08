export const urlRegExpString =
  '^(https?:\\/\\/)?([a-zA-Z0-9]([a-zA-ZäöüÄÖÜ0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}(\\/[a-zA-Z0-9\\-]*)*(\\?([a-zA-Z0-9\\-]+([=&][a-zA-Z0-9:\\-]*)*))?(#[a-zA-Z0-9\\-]*)?(.[a-zA-Z]*)+$';
  
const urlRegExp = new RegExp(urlRegExpString);

export const isUrl = (candidate: string): boolean => {
  return urlRegExp.test(candidate);
};

export const emailRegExpString = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}';

const emailRegExp = new RegExp(emailRegExpString);

export const isEmail = (candidate: string): boolean => {
  return emailRegExp.test(candidate);
};

export const telRegExpString = '[0-9]*';
