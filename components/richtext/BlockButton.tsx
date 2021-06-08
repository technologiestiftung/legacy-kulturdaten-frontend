import { BaseEditor, Editor, Element as SlateElement, Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { Button, ButtonColor } from '../button';
import { CustomElement, ElementType } from './Element';

const isBlockActive = (editor: BaseEditor, format: ElementType) => {
  const [match] = Editor.nodes(editor, {
    match: (n: CustomElement) => {
      return !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format;
    },
  });

  return !!match;
};

const listTypes = [ElementType['ol_list'], ElementType['ul_list']];

export const toggleBlock = (editor: BaseEditor, format: ElementType): void => {
  const isActive = isBlockActive(editor, format);
  const isList = listTypes.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n: CustomElement) =>
      listTypes.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
    split: true,
  });
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list_item' : format,
  };
  Transforms.setNodes(editor, (newProperties as unknown) as SlateElement);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

interface BlockButtonProps {
  format: ElementType;
  icon: string;
}

export const BlockButton: React.FC<BlockButtonProps> = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();

  return (
    <Button
      color={isBlockActive(editor, format) ? ButtonColor.white : ButtonColor.default}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};
