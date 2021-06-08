import React, { PropsWithChildren } from 'react';
import { Element as SlateElement, Text } from 'slate';
import {
  RichTextH1,
  RichTextH2,
  RichTextH3,
  RichTextLi,
  RichTextOl,
  RichTextUl,
  RichTextP,
} from './elements';

export enum ElementType {
  'heading_one' = 'heading_one',
  'heading_two' = 'heading_two',
  'heading_three' = 'heading_three',
  'ol_list' = 'ol_list',
  'ul_list' = 'ul_list',
  'list_item' = 'list_item',
  'paragraph' = 'paragraph',
}

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
} & Text;
export type CustomDescendant = CustomElement | CustomText;
export type CustomElement = { type: ElementType; children: CustomDescendant[] } & SlateElement;

interface ElementProps {
  attributes: { [key: string]: string | number | boolean };
  children: React.ReactNode;
  element: CustomElement;
}

export const Element: React.FC<PropsWithChildren<ElementProps>> = ({
  attributes,
  children,
  element,
}: ElementProps) => {
  switch (element.type) {
    case ElementType['heading_one']:
      return <RichTextH1 {...attributes}>{children}</RichTextH1>;
    case ElementType['heading_two']:
      return <RichTextH2 {...attributes}>{children}</RichTextH2>;
    case ElementType['heading_three']:
      return <RichTextH3 {...attributes}>{children}</RichTextH3>;
    case ElementType['list_item']:
      return <RichTextLi {...attributes}>{children}</RichTextLi>;
    case ElementType['ol_list']:
      return <RichTextOl {...attributes}>{children}</RichTextOl>;
    case ElementType['ul_list']:
      return <RichTextUl {...attributes}>{children}</RichTextUl>;
    default:
      return <RichTextP {...attributes}>{children}</RichTextP>;
  }
};
