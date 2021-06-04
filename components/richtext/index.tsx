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
import { Editor, Transforms, createEditor, Element as SlateElement, Text, BaseEditor } from 'slate';
import { withHistory } from 'slate-history';
import React, { PropsWithChildren, Ref, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ButtonColor } from '../button';

import {
  RichTextP,
  RichTextH1,
  RichTextH2,
  RichTextH3,
  RichTextStrong,
  RichTextEm,
  RichTextU,
  RichTextUl,
  RichTextOl,
  RichTextLi,
} from './elements';

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

type CustomElement = { type: ElementType; children: CustomDescendant[] } & SlateElement;

interface CustomElementProps extends RenderElementProps {
  element: CustomElement;
}

enum MarkButtonFormat {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
}

enum ElementType {
  'heading_one' = 'heading_one',
  'heading_two' = 'heading_two',
  'heading_three' = 'heading_three',
  'ol_list' = 'ol_list',
  'ul_list' = 'ul_list',
  'list_item' = 'list_item',
}

const listTypes = [ElementType['ol_list'], ElementType['ul_list']];

const Element = ({
  attributes,
  children,
  element,
}: {
  attributes: { [key: string]: string | number | boolean };
  children: React.ReactNode;
  element: CustomElement;
}) => {
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

const isBlockActive = (editor: BaseEditor, format: ElementType) => {
  const [match] = Editor.nodes(editor, {
    match: (n: CustomElement) => {
      return !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format;
    },
  });

  return !!match;
};

const isMarkActive = (editor: BaseEditor, format: MarkButtonFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor: BaseEditor, format: ElementType) => {
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

const toggleMark = (editor: BaseEditor, format) => {
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

const BlockButton = ({ format, icon }: { format: ElementType; icon: string }) => {
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
  onChange?: (value: CustomDescendant[]) => void;
}

const StyledRichText = styled.div``;

export type CustomDescendant = CustomElement | CustomText;

export const RichText: React.FC<RichTextProps> = ({ value, onChange }: RichTextProps) => {
  const [intValue, setIntValue] = useState<CustomDescendant[]>([]);

  useEffect(() => {
    if ((!intValue || (Array.isArray(intValue) && intValue.length === 0)) && Array.isArray(value)) {
      setIntValue(value);
    }
  }, [intValue, value]);

  useEffect(() => {
    if (onChange) {
      onChange(intValue);
    }
  }, [intValue, onChange]);

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
          <BlockButton format={ElementType['heading_one']} icon="looks_one" />
          <BlockButton format={ElementType['heading_two']} icon="looks_one" />
          <BlockButton format={ElementType['heading_three']} icon="looks_one" />
          <BlockButton format={ElementType['ol_list']} icon="format_list_numbered" />
          <BlockButton format={ElementType['ul_list']} icon="format_list_numbered" />
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
