import { Story } from '@storybook/react';
import { useCallback } from 'react';
import { useLinkList } from '.';

export default {
  title: 'Link List',
};

const X: React.FC = () => {
  const onChange = useCallback((newLinks) => {
    console.log(newLinks);
  }, []);

  const { renderedLinkList } = useLinkList({
    links: [
      'https://www.technologiestiftung-berlin.de/',
      'https://www.kulturdaten.berlin/',
      'https://beta.api.kulturdaten.berlin/docs/',
    ],
    label: 'Social Media Links',
    onChange,
    maxLinks: 3,
  });

  return <>{renderedLinkList}</>;
};

export const LinkListDefaultStory: Story = () => <X />;
