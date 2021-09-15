import { Story } from '@storybook/react';
import styled from '@emotion/styled';
import { DropZone } from '.';
import { useState } from 'react';

export default {
  title: 'Drop Zone',
};

const StoryWrapper = styled.div`
  padding: 3rem;
`;

export const DropZoneDefaultStory: Story = () => {
  const [files, setFiles] = useState<FileList>();

  return (
    <StoryWrapper>
      <DropZone
        files={files}
        onDrop={(e) => setFiles(e.dataTransfer.files)}
        label="Example Drop Zone"
        acceptFileTypes={['image/svg+xml']}
      />
    </StoryWrapper>
  );
};
