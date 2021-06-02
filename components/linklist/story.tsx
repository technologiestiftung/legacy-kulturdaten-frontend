import { Story } from '@storybook/react';
import { useCallback, useEffect, useState } from 'react';
import { LinkList } from '.';

export default {
  title: 'Link List',
};

const X: React.FC = () => {
  const [links, setLinks] = useState<{ value: string }[]>(undefined);

  const onChange = useCallback((newLinks) => {
    console.log(newLinks);
    setLinks(newLinks);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLinks([
        {
          value: 'https://www.technologiestiftung-berlin.de/',
        },
        {
          value: 'https://www.kulturdaten.berlin/',
        },
        {
          value: 'https://beta.api.kulturdaten.berlin/docs/',
        },
      ]);
    }, 10);
  }, []);

  return <LinkList links={links} label="Social Media Links" onChange={onChange} maxLinks={4} />;
};

export const LinkListDefaultStory: Story = () => <X />;
