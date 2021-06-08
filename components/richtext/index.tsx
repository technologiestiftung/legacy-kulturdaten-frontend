import styled from '@emotion/styled';
import { Editable, withReact, Slate, ReactEditor, RenderElementProps } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CustomDescendant, CustomElement, ElementType, Element } from './Element';
import { Toolbar, ToolbarGroupWidth } from './Toolbar';
import { MarkButton, MarkButtonFormat } from './MarkButton';
import { BlockButton } from './BlockButton';
import { Leaf } from './Leaf';

interface CustomElementProps extends RenderElementProps {
  element: CustomElement;
}

interface RichTextProps {
  value?: CustomDescendant[];
  onChange?: (value: CustomDescendant[]) => void;
}

const StyledRichText = styled.div`
  caret-color: #0000ff;
`;

export const RichText: React.FC<RichTextProps> = ({ value, onChange }: RichTextProps) => {
  const [intValue, setIntValue] = useState<CustomDescendant[]>([]);

  useEffect(() => {
    if (
      (typeof intValue === 'undefined' || (Array.isArray(intValue) && intValue.length === 0)) &&
      Array.isArray(value)
    ) {
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
        <Toolbar
          groups={[
            {
              label: 'Headline',
              width: ToolbarGroupWidth.full,
              items: [
                <BlockButton format={ElementType['paragraph']} icon="p" key={0} />,
                <BlockButton format={ElementType['heading_one']} icon="h1" key={1} />,
                <BlockButton format={ElementType['heading_two']} icon="h2" key={2} />,
                <BlockButton format={ElementType['heading_three']} icon="h3" key={3} />,
              ],
            },
            {
              label: 'Format',
              width: ToolbarGroupWidth.half,
              items: [
                <MarkButton format={MarkButtonFormat.bold} icon="format_bold" key={0} />,
                <MarkButton format={MarkButtonFormat.italic} icon="format_italic" key={1} />,
                <MarkButton format={MarkButtonFormat.underline} icon="format_underlined" key={2} />,
              ],
            },
            {
              label: 'List',
              width: ToolbarGroupWidth.half,
              items: [
                <BlockButton format={ElementType['ol_list']} icon="format_list_numbered" key={0} />,
                <BlockButton format={ElementType['ul_list']} icon="format_list_bulleted" key={1} />,
              ],
            },
          ]}
        />
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

export type { CustomDescendant };
