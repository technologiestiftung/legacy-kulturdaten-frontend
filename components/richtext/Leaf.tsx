import React, { PropsWithChildren } from 'react';
import { RenderLeafProps } from 'slate-react';
import { CustomText } from './Element';
import { RichTextEm, RichTextStrong, RichTextU } from './elements';

interface CustomLeafProps extends RenderLeafProps {
  leaf: CustomText;
}
export const Leaf: React.FC<PropsWithChildren<CustomLeafProps>> = ({
  attributes,
  children,
  leaf,
}: CustomLeafProps) => {
  if (leaf.bold) {
    children = <RichTextStrong>{children}</RichTextStrong>;
  }

  if (leaf.italic) {
    children = <RichTextEm>{children}</RichTextEm>;
  }

  if (leaf.underline) {
    children = <RichTextU>{children}</RichTextU>;
  }

  return <span {...attributes}>{children}</span>;
};
