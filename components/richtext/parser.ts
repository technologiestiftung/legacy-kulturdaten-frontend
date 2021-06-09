import { defaultNodeTypes, serialize } from 'remark-slate';
import { jsx } from 'slate-hyperscript';
import marked from 'marked';

import { CustomDescendant } from '.';
import { ElementType } from './Element';

const ELEMENT_TAGS = {
  H1: () => ({ type: ElementType['heading_one'] }),
  H2: () => ({ type: ElementType['heading_two'] }),
  H3: () => ({ type: ElementType['heading_three'] }),
  LI: () => ({ type: ElementType['list_item'] }),
  OL: () => ({ type: ElementType['ol_list'] }),
  UL: () => ({ type: ElementType['ul_list'] }),
  P: () => ({ type: ElementType['paragraph'] }),
};

const TEXT_TAGS = {
  EM: () => ({ italic: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

const deserialize = (el: ChildNode) => {
  if (el.nodeType === 3) {
    return el.textContent !== '\n' ? el.textContent : null;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;
  const parent = el;

  const children = Array.from(parent.childNodes)
    .map((ch) => deserialize(ch))
    .flat();

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx('element', attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map((child) => jsx('text', attrs, child));
  }

  return children;
};

export const slateToMarkdown = (slateStructure: CustomDescendant[]): string =>
  slateStructure
    .map((v) => serialize(v, { nodeTypes: { ...defaultNodeTypes, listItem: 'list_item' } }))
    .join('');

export const markdownToSlate = (markdown: string): CustomDescendant[] => {
  const parsedMarkdown = marked(markdown);
  const document = new DOMParser().parseFromString(parsedMarkdown, 'text/html');
  const slateStructure = deserialize(document.children[0]);

  return slateStructure;
};
