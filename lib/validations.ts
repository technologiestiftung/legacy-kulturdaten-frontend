export const isUrl = (candidate: string): boolean => {
  const expression = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-ZäöüÄÖÜ0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/gi;
  const regex = new RegExp(expression);

  return Boolean(candidate.match(regex)?.length > 0);
};
