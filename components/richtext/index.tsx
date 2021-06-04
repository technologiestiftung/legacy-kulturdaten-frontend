/* eslint-disable react/display-name */
import styled from '@emotion/styled';
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import { Editor, Transforms, createEditor, Element as SlateElement, Text } from 'slate';
import { withHistory } from 'slate-history';
import React, { PropsWithChildren, Ref, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ButtonColor } from '../button';

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

const StyledRichText = styled.div``;

type CustomElement = { type: string; children: CustomDescendant[] } & SlateElement;
interface CustomElementProps extends RenderElementProps {
  element: CustomElement;
}

enum MarkButtonFormat {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
}

enum BlockButtonFormat {
  'heading_one' = 'heading-one',
  'heading_two' = 'heading-two',
  'heading_three' = 'heading-three',
  'ol-list' = 'ol-list',
  'ul-list' = 'ul-list',
}

const listTypes = [BlockButtonFormat['ol-list'], BlockButtonFormat['ul-list']];

// eslint-disable-next-line react/prop-types
const Element = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: CustomElement;
}) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'ul-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading_one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading_two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading_three':
      return <h3 {...attributes}>{children}</h3>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'ol-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
} & Text;

interface CustomLeafProps extends RenderLeafProps {
  leaf: CustomText;
}

// eslint-disable-next-line react/prop-types
const Leaf = ({ attributes, children, leaf }: CustomLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const isBlockActive = (editor, format: BlockButtonFormat) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === format,
  });

  return !!match;
};

const isMarkActive = (editor, format: MarkButtonFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor, format: BlockButtonFormat) => {
  const isActive = isBlockActive(editor, format);
  const isList = listTypes.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      listTypes.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type),
    split: true,
  });
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes(editor, (newProperties as unknown) as SlateElement);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const Menu = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <div {...props} ref={ref} />
  )
);

const Toolbar = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<OrNull<HTMLDivElement>>) => (
    <Menu {...props} ref={ref} />
  )
);

const BlockButton = ({ format, icon }: { format: BlockButtonFormat; icon: string }) => {
  const editor = useSlate();
  return (
    <Button
      color={isBlockActive(editor, format) ? ButtonColor.white : ButtonColor.default}
      onClick={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const MarkButton = ({ format, icon }: { format: MarkButtonFormat; icon: string }) => {
  const editor = useSlate();
  return (
    <Button
      color={isMarkActive(editor, format) ? ButtonColor.white : ButtonColor.default}
      onClick={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

interface RichTextProps {
  value?: CustomDescendant[];
  onChange?: (value: any) => void;
}

export type CustomDescendant = CustomElement | CustomText;

export const RichText: React.FC<RichTextProps> = ({ value, onChange }: RichTextProps) => {
  const [intValue, setIntValue] = useState<CustomDescendant[]>([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setIntValue(value);
    }
  }, [value]);

  const renderElement = useCallback((props: CustomElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);

  return (
    <StyledRichText>
      <Slate
        editor={editor}
        value={intValue}
        onChange={(updatedValue) => setIntValue(updatedValue as CustomDescendant[])}
      >
        <Toolbar>
          <MarkButton format={MarkButtonFormat.bold} icon="format_bold" />
          <MarkButton format={MarkButtonFormat.italic} icon="format_italic" />
          <MarkButton format={MarkButtonFormat.underline} icon="format_underlined" />
          <BlockButton format={BlockButtonFormat['heading_one']} icon="looks_one" />
          <BlockButton format={BlockButtonFormat['heading_two']} icon="looks_one" />
          <BlockButton format={BlockButtonFormat['heading_three']} icon="looks_one" />
          <BlockButton format={BlockButtonFormat['ol-list']} icon="format_list_numbered" />
          <BlockButton format={BlockButtonFormat['ul-list']} icon="format_list_numbered" />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
        />
      </Slate>
    </StyledRichText>
  );
};
