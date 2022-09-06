export const urlRegExpString =
  `^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$`;

const urlRegExp = new RegExp(urlRegExpString);

export const isUrl = (candidate: string): boolean => {
  if(typeof candidate === "string") {
    return urlRegExp.test(candidate);
  } else {
    return false
  }
};

export const emailRegExpString = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}';

const emailRegExp = new RegExp(emailRegExpString);

export const isEmail = (candidate: string): boolean => {
  return emailRegExp.test(candidate);
};

export const telRegExpString = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$';

const telRegExp = new RegExp(telRegExpString);

export const isPhoneNumber = (candidate: string): boolean => {
  return telRegExp.test(candidate);
};
