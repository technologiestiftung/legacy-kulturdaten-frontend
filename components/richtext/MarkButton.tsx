import React from 'react';
import { BaseEditor, Editor } from 'slate';
import { useSlate } from 'slate-react';
import { Button, ButtonColor, ButtonVariant } from '../button';

export enum MarkButtonFormat {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
}

const toggleMark = (editor: BaseEditor, format: MarkButtonFormat): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: BaseEditor, format: MarkButtonFormat): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

interface MarkButtonProps {
  format: MarkButtonFormat;
  ariaLabel: string;
  icon?: string;
  renderedIcon?: React.ReactElement;
  label?: string;
}

export const MarkButton: React.FC<MarkButtonProps> = ({
  format,
  icon,
  renderedIcon,
  ariaLabel,
  label,
}: MarkButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      color={isMarkActive(editor, format) ? ButtonColor.green : ButtonColor.default}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      icon={icon}
      ariaLabel={ariaLabel}
      title={ariaLabel}
      variant={ButtonVariant.toolbar}
      renderedIcon={renderedIcon}
      iconHeight="1.125rem"
    >
      {label}
    </Button>
  );
};
