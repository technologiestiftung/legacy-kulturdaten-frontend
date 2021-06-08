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
import { Button, ButtonVariant, IconPosition } from '../button';
import { contentGrid, mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { PSvg } from '../assets/PSvg';
import { H1Svg } from '../assets/H1Svg';
import { H2Svg } from '../assets/H2Svg';
import { H3Svg } from '../assets/H3Svg';
import { ListOrderedSvg } from '../assets/ListOrderedSvg';

interface CustomRenderElementProps extends RenderElementProps {
  element: CustomElement;
}

const StyledRichText = styled.div`
  background: var(--white);
  min-height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledEditableContainer = styled.div`
  background: var(--white);
  min-height: 100%;
  flex-grow: 1;

  box-shadow: inset 0px 2px 10px var(--black-o25);

  ${mq(Breakpoint.mid)} {
    ${contentGrid(9)}
  }

  ${mq(Breakpoint.wide)} {
    ${contentGrid(8)}
  }
`;

const StyledEditable = styled.div`
  caret-color: #0000ff;

  padding: 2rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 4rem 0;
    grid-column: 2 / -2;
  }
  /* ${mq(Breakpoint.mid)} {
    grid-column: 2 / -2;
  } */
`;

interface RichTextProps {
  value?: CustomDescendant[];
  onChange?: (value: CustomDescendant[]) => void;
}

export const RichText: React.FC<RichTextProps> = ({ value, onChange }: RichTextProps) => {
  const [intValue, setIntValue] = useState<CustomDescendant[]>([]);
  const renderElement = useCallback(
    (props: CustomRenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);

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
              label: 'Verlauf',
              width: ToolbarGroupWidth.half,
              items: [
                <Button
                  onMouseDown={() => editor.undo()}
                  disabled={editor.history.undos.length < 1}
                  icon="CornerUpLeft"
                  iconPosition={IconPosition.left}
                  key={0}
                  ariaLabel="Rückgängig"
                  title="Rückgängig"
                  variant={ButtonVariant.toolbar}
                />,
                <Button
                  onMouseDown={() => editor.redo()}
                  disabled={editor.history.redos.length < 1}
                  icon="CornerUpRight"
                  key={1}
                  ariaLabel="Wiederholen"
                  title="Wiederholen"
                  variant={ButtonVariant.toolbar}
                />,
              ],
            },
            {
              label: 'Absatz',
              width: ToolbarGroupWidth.half,
              items: [
                <BlockButton
                  ariaLabel="Paragraph"
                  format={ElementType['paragraph']}
                  renderedIcon={<PSvg />}
                  key={0}
                />,
                <BlockButton
                  ariaLabel="Überschrift 1"
                  format={ElementType['heading_one']}
                  renderedIcon={<H1Svg />}
                  key={1}
                />,
                <BlockButton
                  ariaLabel="Überschrift 2"
                  format={ElementType['heading_two']}
                  renderedIcon={<H2Svg />}
                  key={2}
                />,
                <BlockButton
                  ariaLabel="Überschrift 3"
                  format={ElementType['heading_three']}
                  renderedIcon={<H3Svg />}
                  key={3}
                />,
              ],
            },
            {
              label: 'Listen',
              width: ToolbarGroupWidth.half,
              items: [
                <BlockButton
                  ariaLabel="Strichliste"
                  format={ElementType['ul_list']}
                  icon="List"
                  key={1}
                />,
                <BlockButton
                  ariaLabel="Nummerierte Liste"
                  format={ElementType['ol_list']}
                  renderedIcon={<ListOrderedSvg />}
                  key={0}
                />,
              ],
            },
            {
              label: 'Format',
              width: ToolbarGroupWidth.half,
              items: [
                <MarkButton ariaLabel="Fett" format={MarkButtonFormat.bold} icon="Bold" key={0} />,
                <MarkButton
                  ariaLabel="Kursiv"
                  format={MarkButtonFormat.italic}
                  icon="Italic"
                  key={1}
                />,
                <MarkButton
                  ariaLabel="Unterstrichen"
                  format={MarkButtonFormat.underline}
                  icon="Underline"
                  key={2}
                />,
              ],
            },
          ]}
        />
        <StyledEditableContainer>
          <StyledEditable>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter some rich text…"
              spellCheck
              autoFocus
            />
          </StyledEditable>
        </StyledEditableContainer>
      </Slate>
    </StyledRichText>
  );
};

export type { CustomDescendant };
