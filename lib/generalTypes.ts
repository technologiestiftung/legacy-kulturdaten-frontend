export enum StandardLinkType {
  internal = 'internal',
  external = 'external',
}

export type StandardLink = {
  title: string;
  href: string;
  type: StandardLinkType;
};

export type StandardLinkInternal = Exclude<StandardLink, ['type']>;
