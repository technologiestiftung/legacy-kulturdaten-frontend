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

export enum ComponentVariants {
  default = 'default',
  formList = 'formList',
}

export type ComponentVariant = ComponentVariants | string;

export interface ComponentWithVariants {
  variant?: ComponentVariant;
}
