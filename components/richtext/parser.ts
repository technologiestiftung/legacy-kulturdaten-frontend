import { jsx } from 'slate-hyperscript';
import marked from 'marked';
import TurndownService from 'turndown';

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

    // Make sure no empty children Arrays occure. Those break slate.
    const neverEmptyChildren =
      children && Array.isArray(children) && children.length === 0 ? [{ text: '' }] : children;

    return jsx('element', attrs, neverEmptyChildren);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children?.map((child: ChildNode) => jsx('text', attrs, child));
  }

  return children;
};

export const markdownToSlate = (markdownV: string): CustomDescendant[] => {
  const parsedMarkdown = marked(markdownV);
  const document = new DOMParser().parseFromString(parsedMarkdown, 'text/html');
  const slateStructure = deserialize(document.children[0]);

  return slateStructure;
};

export const htmlToMarkdown = (htmlElement: HTMLElement): string => {
  const turndownService = new TurndownService({ headingStyle: 'atx' });

  // from https://github.com/domchristie/turndown/issues/291#issuecomment-606575368
  turndownService.addRule('listItem', {
    filter: 'li',
    replacement: (content, node, options) => {
      content = content
        .replace(/^\n+/, '') // remove leading newlines
        .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
        .replace(/\n/gm, '\n    '); // indent
      let prefix = options.bulletListMarker + ' ';
      const parent = node.parentNode;
      if (parent.nodeName === 'OL') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const start = ((parent as unknown) as any).getAttribute('start');
        const index = Array.prototype.indexOf.call(parent.children, node);
        prefix = (start ? Number(start) + index : index + 1) + '. ';
      }
      return prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '');
    },
  });

  const serializedMarkdown = turndownService.turndown(htmlElement);

  return serializedMarkdown;
};
