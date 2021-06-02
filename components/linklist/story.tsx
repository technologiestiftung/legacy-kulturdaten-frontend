import { Story } from '@storybook/react';
import { useCallback, useEffect, useState } from 'react';
import { LinkList } from '.';

export default {
  title: 'Link List',
};

const X: React.FC = () => {
  const [links, setLinks] = useState<string[]>(undefined);

  const onChange = useCallback((newLinks) => {
    console.log(newLinks);
    setLinks(newLinks);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLinks([
        'https://www.technologiestiftung-berlin.de/',
        'https://www.kulturdaten.berlin/',
        'https://beta.api.kulturdaten.berlin/docs/',
      ]);
    }, 10);
  }, []);

  return <LinkList links={links} label="Social Media Links" onChange={onChange} maxLinks={3} />;
};

export const LinkListDefaultStory: Story = () => <X />;
