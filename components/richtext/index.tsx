import styled from '@emotion/styled';
import { Editable, withReact, Slate, ReactEditor, RenderElementProps } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import React, { Ref, useCallback, useEffect, useMemo, useState } from 'react';

import { CustomDescendant, CustomElement, ElementType, Element, CustomText } from './Element';
import { Toolbar, ToolbarGroupWidth } from './Toolbar';
import { MarkButton, MarkButtonFormat } from './MarkButton';
import { BlockButton } from './BlockButton';
import { Leaf } from './Leaf';
import { Button, ButtonVariant, IconPosition } from '../button';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { PSvg } from '../assets/PSvg';
import { H1Svg } from '../assets/H1Svg';
import { H2Svg } from '../assets/H2Svg';
import { H3Svg } from '../assets/H3Svg';
import { ListOrderedSvg } from '../assets/ListOrderedSvg';
import { useT } from '../../lib/i18n';

interface CustomRenderElementProps extends RenderElementProps {
  element: CustomElement;
}

const StyledRichText = styled.div`
  /* background: var(--white); */
  min-height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledEditableContainer = styled.div`
  /* background: var(--white); */
  min-height: 100%;
  flex-grow: 1;
`;

const StyledEditable = styled.div`
  caret-color: #0000ff;

  > div {
    padding: 2rem 0.75rem;
    min-height: 100%;

    max-width: 44rem;
    margin: 0 auto;

    ${mq(Breakpoint.mid)} {
      padding: 4rem 4rem;
    }
  }
`;

type RichTextProps = {
  value?: CustomDescendant[];
  onChange?: (value: CustomDescendant[]) => void;
  placeholder?: string;
  contentRef?: Ref<HTMLDivElement>;
  intValue: CustomDescendant[];
  setIntValue: (value: CustomDescendant[]) => void;
  required?: boolean;
  valid: boolean;
};

export const emptyRichTextValue = [{ type: ElementType.paragraph, children: [{ text: '' }] }];

const RichText: React.FC<RichTextProps> = ({
  onChange,
  placeholder,
  contentRef,
  intValue,
  setIntValue,
  valid,
}: RichTextProps) => {
  const renderElement = useCallback(
    (props: CustomRenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);
  const t = useT();

  useEffect(() => {
    if (onChange) {
      onChange(intValue);
    }
  }, [intValue, onChange]);

  return (
    <StyledRichText>
      <Slate
        editor={editor}
        value={intValue || []}
        onChange={(updatedValue) => setIntValue(updatedValue as CustomDescendant[])}
      >
        <Toolbar
          groups={[
            {
              label: t('richText.history') as string,
              width: ToolbarGroupWidth.half,
              items: [
                <Button
                  onMouseDown={() => editor.undo()}
                  disabled={editor.history.undos.length < 1}
                  icon="CornerUpLeft"
                  iconPosition={IconPosition.left}
                  key={0}
                  ariaLabel={t('richText.undo') as string}
                  title={t('richText.undo') as string}
                  variant={ButtonVariant.toolbar}
                />,
                <Button
                  onMouseDown={() => editor.redo()}
                  disabled={editor.history.redos.length < 1}
                  icon="CornerUpRight"
                  key={1}
                  ariaLabel={t('richText.redo') as string}
                  title={t('richText.redo') as string}
                  variant={ButtonVariant.toolbar}
                />,
              ],
            },
            {
              label: t('richText.format') as string,
              width: ToolbarGroupWidth.half,
              items: [
                <BlockButton
                  ariaLabel={t('richText.paragraph') as string}
                  format={ElementType['paragraph']}
                  renderedIcon={<PSvg />}
                  key={0}
                />,
                <BlockButton
                  ariaLabel={t('richText.headingOne') as string}
                  format={ElementType['heading_one']}
                  renderedIcon={<H1Svg />}
                  key={1}
                />,
                <BlockButton
                  ariaLabel={t('richText.headingTwo') as string}
                  format={ElementType['heading_two']}
                  renderedIcon={<H2Svg />}
                  key={2}
                />,
                <BlockButton
                  ariaLabel={t('richText.headingThree') as string}
                  format={ElementType['heading_three']}
                  renderedIcon={<H3Svg />}
                  key={3}
                />,
              ],
            },
            {
              label: t('richText.lists') as string,
              width: ToolbarGroupWidth.half,
              items: [
                <BlockButton
                  ariaLabel={t('richText.listUnordered') as string}
                  format={ElementType['ul_list']}
                  icon="List"
                  key={1}
                />,
                <BlockButton
                  ariaLabel={t('richText.listOrdered') as string}
                  format={ElementType['ol_list']}
                  renderedIcon={<ListOrderedSvg />}
                  iconWidth="1.125rem"
                  iconHeight="1.125rem"
                  key={0}
                />,
              ],
            },
            {
              label: t('richText.style') as string,
              width: ToolbarGroupWidth.half,
              items: [
                <MarkButton
                  ariaLabel={t('richText.bold') as string}
                  format={MarkButtonFormat.bold}
                  icon="Bold"
                  key={0}
                />,
                <MarkButton
                  ariaLabel={t('richText.italic') as string}
                  format={MarkButtonFormat.italic}
                  icon="Italic"
                  key={1}
                />,
              ],
            },
          ]}
        />
        <StyledEditableContainer>
          <StyledEditable ref={contentRef}>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder || ''}
              spellCheck
            />
          </StyledEditable>
        </StyledEditableContainer>
      </Slate>
    </StyledRichText>
  );
};

const hasDescendantText = (descendant: CustomDescendant): boolean => {
  if ((descendant as CustomText).text?.length > 0) {
    return true;
  }

  if ((descendant as CustomElement).children?.length > 0) {
    const children = (descendant as CustomElement).children;

    for (let i = 0; i < children.length; i += 1) {
      if (hasDescendantText(children[i])) {
        return true;
      }
    }
  }

  return false;
};

const haveDescendantsText = (descendants: CustomDescendant[]): boolean => {
  if (descendants && descendants.length > 0) {
    for (let i = 0; i < descendants.length; i += 1) {
      if (hasDescendantText(descendants[i])) {
        return true;
      }
    }
  }

  return false;
};

export const useRichText = (
  props: Pick<RichTextProps, 'value' | 'placeholder' | 'onChange' | 'contentRef' | 'required'>
): {
  renderedRichText: React.ReactElement<RichTextProps>;
  init: (value: RichTextProps['value']) => void;
  valid: boolean;
} => {
  const [intValue, setIntValue] = useState<CustomDescendant[]>(emptyRichTextValue);

  const hasText = useMemo(() => haveDescendantsText(intValue), [intValue]);

  const valid = useMemo(() => props.required !== true || hasText, [hasText, props?.required]);

  return {
    renderedRichText: (
      <RichText {...props} intValue={intValue} setIntValue={setIntValue} valid={valid} />
    ),
    init: (value) => {
      setIntValue(value);
    },
    valid,
  };
};

export type { CustomDescendant };
