import { useCallback } from 'react';
import { BaseEditor, Editor, Element as SlateElement, Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { Button, ButtonColor, ButtonVariant } from '../button';
import { CustomElement, ElementType } from './Element';

const isBlockActive = (editor: BaseEditor, format: ElementType) => {
  try {
    const [match] = Editor.nodes(editor, {
      match: (n: CustomElement) => {
        return !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format;
      },
    });

    return !!match;
  } catch (e) {
    return false;
  }
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
  Transforms.setNodes(editor, newProperties as unknown as SlateElement);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

interface BlockButtonProps {
  format: ElementType;
  ariaLabel: string;
  icon?: string;
  renderedIcon?: React.ReactElement;
  label?: string;
  iconWidth?: string;
  iconHeight?: string;
}

export const BlockButton: React.FC<BlockButtonProps> = ({
  format,
  icon,
  renderedIcon,
  ariaLabel,
  label,
  iconWidth,
  iconHeight,
}: BlockButtonProps) => {
  const editor = useSlate();

  const blockActive = useCallback(
    (editor: BaseEditor, format: ElementType) => isBlockActive(editor, format),
    []
  );

  return (
    <Button
      color={blockActive(editor, format) ? ButtonColor.green : ButtonColor.default}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      variant={ButtonVariant.toolbar}
      ariaLabel={ariaLabel}
      title={ariaLabel}
      icon={icon}
      iconHeight={iconHeight || '1.125rem'}
      iconWidth={iconWidth}
      renderedIcon={renderedIcon}
    >
      {label}
    </Button>
  );
};
