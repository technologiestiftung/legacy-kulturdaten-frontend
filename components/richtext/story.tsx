import { Story } from '@storybook/react';
import unified from 'unified';
import markdown from 'remark-parse';
import slate from 'remark-slate';

import { CustomDescendant, RichText } from '.';
import { useEffect, useState } from 'react';

export default {
  title: 'RichText',
};

const md = `
  # Headline 1

  Text

  **bold**

  *italic*

  ## Headline 2

  text
`;

const X: React.FC = () => {
  const [v, setV] = useState<CustomDescendant[]>();

  const x = async () => {
    const ser = await unified().use(markdown).use(slate).process(md);
    setV((ser.result as unknown) as CustomDescendant[]);
  };

  useEffect(() => {
    x();
  }, []);

  console.log(v);

  return <>{Array.isArray(v) && <RichText value={v} />}</>;
};

export const RichTextDefaultStory: Story = () => <X />;
RichTextDefaultStory.storyName = 'RichText Default';
