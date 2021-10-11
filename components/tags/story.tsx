import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Tags } from '.';
import { Language } from '../../config/locale';

export default {
  title: 'Tags',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

const TagsExample: React.FC = () => {
  const [value, setValue] = useState([]);

  useEffect(() => {
    setTimeout(() => setValue(['this', 'are', 'some', 'tags']), 100);
  }, []);

  return (
    <StyledTestWrapper>
      <Tags
        value={value}
        onChange={setValue}
        options={[
          {
            id: 1,
            type: 'tag',
            relations: {
              translations: [
                {
                  id: 1,
                  type: 'TagTranslation',
                  attributes: {
                    language: Language.de,
                    name: 'These',
                  },
                },
              ],
            },
          },
          {
            id: 2,
            type: 'tag',
            relations: {
              translations: [
                {
                  id: 1,
                  type: 'TagTranslation',
                  attributes: {
                    language: Language.de,
                    name: 'are some',
                  },
                },
              ],
            },
          },
          {
            id: 3,
            type: 'tag',
            relations: {
              translations: [
                {
                  id: 1,
                  type: 'TagTranslation',
                  attributes: {
                    language: Language.de,
                    name: 'fancy tags',
                  },
                },
              ],
            },
          },
        ]}
      />
    </StyledTestWrapper>
  );
};

export const TagsDefaultStory: Story = () => <TagsExample />;
