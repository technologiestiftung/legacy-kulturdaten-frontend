import styled from '@emotion/styled';
import Image from 'next/image';
import { Media } from '../../lib/api/types/media';

const StyledMediaList = styled.div``;
const StyledMediaListItem = styled.div``;
const StyledMediaListItemMain = styled.div`
  display: flex;
`;
const StyledMediaListItemThumbnail = styled.div`
  position: relative;
  width: 25%;

  img {
    background: var(--grey-200);
    border-radius: 0.75rem;
    overflow: hidden;
  }
`;
const StyledMediaListItemForm = styled.div``;
const StyledMediaListItemFunctions = styled.div``;
const StyledMediaListItemInfo = styled.div``;

interface MediaListProps {
  media: Media['data'][];
  onChange: (media: Media['data'][]) => void;
}

export const MediaList: React.FC<MediaListProps> = ({ media, onChange }: MediaListProps) => {
  return (
    <StyledMediaList>
      {media?.map((mediaItem, index) => (
        <StyledMediaListItem key={index}>
          <StyledMediaListItemMain>
            <StyledMediaListItemThumbnail>
              {mediaItem.attributes.width && mediaItem.attributes.height && (
                <Image
                  src={mediaItem.attributes.url}
                  width={mediaItem.attributes.width}
                  height={mediaItem.attributes.height}
                />
              )}
            </StyledMediaListItemThumbnail>
            <StyledMediaListItemForm></StyledMediaListItemForm>
            <StyledMediaListItemFunctions></StyledMediaListItemFunctions>
          </StyledMediaListItemMain>
          <StyledMediaListItemInfo></StyledMediaListItemInfo>
        </StyledMediaListItem>
      ))}
    </StyledMediaList>
  );
};
