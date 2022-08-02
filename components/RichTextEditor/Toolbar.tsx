import styled from '@emotion/styled'
import { insetBorder, mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonVariant, ButtonColor } from '../button';
import { H1Svg } from '../assets/H1Svg';
import { H2Svg } from '../assets/H2Svg';
import { H3Svg } from '../assets/H3Svg';
import { ListOrderedSvg } from '../assets/ListOrderedSvg';
import { useT } from '../../lib/i18n';
import { Label } from '../label';

export enum ToolbarGroupWidth {
  full = 'full',
  half = 'half',
}

const StyledToolbar = styled.div`
background: var(--grey-200);
padding: 0.25rem 0.75rem 0.75rem;
box-shadow: ${insetBorder(false, false, true)};
display: flex;
flex-wrap: wrap;
position: relative;
`;

const StyledToolbarGroupItems = styled.div`
  display: flex;
  gap: 0.375rem;
  padding-right:
`;

const StyledToolbarGroup = styled.div<{ width: ToolbarGroupWidth }>`
  margin-right: 0.375rem;
  position: relative;

  &:last-of-type {
    margin-right: 0;
  }

  &:not(:last-of-type) {
    ${StyledToolbarGroupItems} {
      &:after {
        border-top: 0.375rem solid var(--grey-200);
        border-bottom: 0.375rem solid var(--grey-200);
        padding: 3px 0;
        content: '';
        display: block;
        position: relative;
        width: 1px;
        align-self: stretch;
        background: var(--grey-400);
      }
    }
  }

  ${mq(Breakpoint.mid)} {
    margin-right: 0.75rem;

    &:not(:last-of-type) {
      ${StyledToolbarGroupItems} {
        &:after {
          margin-left: 0.357rem;
        }
      }
    }
  }
`;


export const Toolbar = ({ editor }) => {
  const t = useT();
  if (!editor) {
    return null
  }

  return (
    <StyledToolbar>
      <StyledToolbarGroup width={ToolbarGroupWidth.half}>
        <Label>{t('richText.history') as string}</Label>
        <StyledToolbarGroupItems>
          <Button
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
            icon="CornerUpLeft"
            variant={ButtonVariant.toolbar}
          />
          <Button
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
            icon="CornerUpRight"
            variant={ButtonVariant.toolbar}
          />
        </StyledToolbarGroupItems>
      </StyledToolbarGroup>
      <StyledToolbarGroup width={ToolbarGroupWidth.half}>
        <Label>{t('richText.format') as string}</Label>
        <StyledToolbarGroupItems>
          <Button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            renderedIcon={<H1Svg />}
            variant={ButtonVariant.toolbar}
            color={editor.isActive('heading', { level: 1 }) ? ButtonColor.green : ButtonColor.default}>
          </Button>
          <Button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            renderedIcon={<H2Svg />}
            variant={ButtonVariant.toolbar}
            color={editor.isActive('heading', { level: 2 }) ? ButtonColor.green : ButtonColor.default}>
          </Button>
          <Button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            renderedIcon={<H3Svg />}
            variant={ButtonVariant.toolbar}
            color={editor.isActive('heading', { level: 3 }) ? ButtonColor.green : ButtonColor.default}>
          </Button>
        </StyledToolbarGroupItems>
      </StyledToolbarGroup>
      <StyledToolbarGroup width={ToolbarGroupWidth.half}>
      <Label>{t('richText.lists') as string}</Label>
        <StyledToolbarGroupItems>
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon="List"
            variant={ButtonVariant.toolbar}
            color={editor.isActive('bulletList') ? ButtonColor.green : ButtonColor.default}
          />
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            renderedIcon={<ListOrderedSvg />}
            iconWidth="1.125rem"
            iconHeight="1.125rem"
            variant={ButtonVariant.toolbar}
            color={editor.isActive('orderedList') ? ButtonColor.green : ButtonColor.default}
          />
        </StyledToolbarGroupItems>
      </StyledToolbarGroup>
      <StyledToolbarGroup width={ToolbarGroupWidth.half}>
      <Label>{t('richText.style') as string}</Label>
        <StyledToolbarGroupItems>
          <Button 
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon="Bold"
            variant={ButtonVariant.toolbar}
            color={editor.isActive('bold') ? ButtonColor.green : ButtonColor.default}
            />
          <Button 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon="Italic"
            variant={ButtonVariant.toolbar}
            color={editor.isActive('italic') ? ButtonColor.green : ButtonColor.default}
            />
        </StyledToolbarGroupItems>
      </StyledToolbarGroup>
    </StyledToolbar>
  )
}