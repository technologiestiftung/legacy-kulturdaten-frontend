import dompurify from 'dompurify';

export enum JsonParts {
  key = 'key',
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  null = 'null',
  symbol = 'symbol',
}

export const generateSpan = (part: JsonParts, value?: string): string =>
  value ? `<span class=code--${part}>${value}</span>` : '';

export const createHtmlNodes = (value: string): string => {
  let type = JsonParts.number;
  if (['true', 'false'].includes(value)) {
    type = JsonParts.boolean;
  }
  if (value === 'null') {
    type = JsonParts.null;
  }
  if (/^"/.test(value)) {
    type = JsonParts.string;
  }
  return generateSpan(type, value);
};

export const formatJSON = (content: unknown): string => {
  const regex = /^( *)("[^"]+": )?("[^"]*"|[\w.+-]*)?([{}[\],]*)?$/gm;
  const stringified = JSON.stringify(content, null, 2) || 'undefined';

  const prettifiedJsonString = stringified.replace(
    regex,
    (match: string, indentation: string, key: string, value: string, end: string): string => {
      const keyHtml = key
        ? generateSpan(JsonParts.key, key.replace(/(.*)(): /, '$1$2')) +
          generateSpan(JsonParts.symbol, ': ')
        : '';

      const valHtml = value ? createHtmlNodes(value) : '';
      const lineEnd = generateSpan(JsonParts.symbol, end);

      return `${indentation || ''} ${keyHtml} ${valHtml} ${lineEnd}`;
    }
  );

  const sanitizer = dompurify.sanitize;
  return sanitizer(prettifiedJsonString);
};
