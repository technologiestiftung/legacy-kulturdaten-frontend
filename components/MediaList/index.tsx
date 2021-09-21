import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatISO9075 from 'date-fns/formatISO9075';
import Image from 'next/image';
import { ExternalLink } from 'react-feather';
import { contentLanguages, languageTranslationKeys } from '../../config/locales';
import { Media, MediaTranslation } from '../../lib/api/types/media';
import { useT } from '../../lib/i18n';
import { getTranslation } from '../../lib/translations';
import { Language } from '../../config/locales';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';
import { Button } from '../button';
import { useApiCall } from '../../lib/api';
import { MediaDelete, mediaDeleteFactory } from '../../lib/api/routes/media/delete';

const StyledMediaList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
`;

const StyledMediaListItem = styled.div`
  background: var(--white);
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  /* background: var(--grey-200); */
  overflow: hidden;
`;

const StyledMediaListItemMain = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 2fr;
  }
`;

const StyledMediaListItemThumbnail = styled.div`
  position: relative;
  grid-column: span 1;
  height: 100%;
  border-bottom: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    border-bottom: none;
  }
`;

const StyledMediaListItemThumbnailLinkHover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: var(--black-o40);
  opacity: 0;
  transition: opacity var(--transition-duration);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    width: 2.25rem;
    height: 2.25em;
  }

  @media screen and (pointer: coarse) {
    bottom: 0;
    top: initial;
    height: auto;
    background: transparent;
    opacity: 1;
    justify-content: flex-end;
    padding: 0.75rem;

    > svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  ${mq(Breakpoint.mid)} {
    @media screen and (pointer: fine) {
      border-radius: 0.375rem;
    }
  }
`;

const StyledMediaListItemThumbnailLink = styled.a`
  display: block;
  cursor: pointer;
  color: white;
  text-decoration: none;
  line-height: 0;
  height: 100%;
  box-shadow: var(--shadow-light);

  ${mq(Breakpoint.mid)} {
    position: relative;
    border-radius: 0.375rem;
    width: 100%;
    height: initial;
  }

  &:hover {
    ${StyledMediaListItemThumbnailLinkHover} {
      opacity: 1;
    }
  }
`;

const thumbnailImgStyles = css`
  background: var(--grey-200);

  ${mq(Breakpoint.mid)} {
    border-radius: 0.375rem;
  }
`;

const StyledMediaListItemThumbnailInner = styled.div`
  position: relative;
  height: 50vw;
  display: flex;
  justify-content: center;
  align-items: stretch;

  img {
    ${thumbnailImgStyles}
    padding: 0;
    vertical-align: middle;
  }

  ${mq(Breakpoint.mid)} {
    flex-direction: column;
    justify-content: flex-start;
    padding: 1.5rem 0 1.5rem 1.5rem;
    height: 100%;
    padding-bottom: 0;
  }
`;

const StyledMediaListItemThumbnailPlaceholder = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  position: relative;

  ${thumbnailImgStyles}

  background: var(--grey-350);

  ${mq(Breakpoint.mid)} {
    padding-bottom: 100%;
    grid-template-columns: 1fr 2fr;
  }
`;

const StyledMediaListItemThumbnailPlaceholderInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;

  > div {
    background: var(--white);
    padding: 0.1875rem 0.375rem;
    border-radius: 0.375rem;
  }
`;

const StyledMediaListItemForm = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem;
    grid-template-columns: 1fr 2fr;
  }
`;

const StyledMediaListItemFunctions = styled.div``;

const StyledMediaListItemInfo = styled.div`
  padding: 0.75rem;
  border-top: 1px solid var(--grey-400);
  background: var(--grey-200);

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.5rem;
  }
`;

interface MediaListItemProps {
  mediaItem: Media['data'];
  onChange: (mediaItem: Media['data']) => void;
}

const MediaListItem: React.FC<MediaListItemProps> = ({
  mediaItem,
  onChange,
}: MediaListItemProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const uid = usePseudoUID();
  const t = useT();
  const call = useApiCall();

  return (
    <StyledMediaListItem>
      <StyledMediaListItemMain>
        <StyledMediaListItemThumbnail>
          {mediaItem.attributes.width && mediaItem.attributes.height ? (
            <StyledMediaListItemThumbnailInner>
              <StyledMediaListItemThumbnailLink
                title={t('media.openImage') as string}
                aria-label={t('media.openImage') as string}
                href={mediaItem.attributes.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={mediaItem.attributes.url}
                  layout={isMidOrWider ? 'intrinsic' : 'fill'}
                  width={isMidOrWider ? mediaItem.attributes.width : undefined}
                  height={isMidOrWider ? mediaItem.attributes.height : undefined}
                  objectFit="contain"
                />
                <StyledMediaListItemThumbnailLinkHover>
                  <ExternalLink />
                </StyledMediaListItemThumbnailLinkHover>
              </StyledMediaListItemThumbnailLink>
            </StyledMediaListItemThumbnailInner>
          ) : (
            <StyledMediaListItemThumbnailInner>
              <StyledMediaListItemThumbnailPlaceholder>
                <StyledMediaListItemThumbnailPlaceholderInner>
                  <div>{t('media.imageProcessing')}</div>
                </StyledMediaListItemThumbnailPlaceholderInner>
              </StyledMediaListItemThumbnailPlaceholder>
            </StyledMediaListItemThumbnailInner>
          )}
        </StyledMediaListItemThumbnail>
        <StyledMediaListItemForm>
          {contentLanguages.map((language: Language, index) => {
            const currentTranslation = mediaItem.relations?.translations
              ? getTranslation<MediaTranslation>(language, mediaItem.relations.translations, false)
              : undefined;

            return (
              <div key={index}>
                <Input
                  type={InputType.text}
                  label={`${t('media.alt')} (${t(languageTranslationKeys[language])})`}
                  id={`${uid}-copyright`}
                  value={currentTranslation?.attributes?.alternativeText || ''}
                  onChange={(e) => {
                    const updatedTranslation = {
                      ...currentTranslation,
                      attributes: {
                        ...currentTranslation?.attributes,
                        language,
                        alternativeText: e.target.value,
                      },
                    };

                    onChange({
                      ...mediaItem,
                      relations: mediaItem.relations
                        ? {
                            ...mediaItem.relations,
                            translations: [
                              ...mediaItem.relations.translations?.filter(
                                (translation) => translation.attributes?.language !== language
                              ),
                              updatedTranslation,
                            ],
                          }
                        : {
                            translations: [updatedTranslation],
                          },
                    });
                  }}
                />
              </div>
            );
          })}
          <div>
            <Input
              type={InputType.text}
              label={t('media.copyright') as string}
              id={`${uid}-copyright`}
              value={mediaItem.attributes.copyright || ''}
              onChange={(e) =>
                onChange({
                  ...mediaItem,
                  attributes: { ...mediaItem.attributes, copyright: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Input
              type={InputType.text}
              label={t('media.license') as string}
              id={`${uid}-copyright`}
              value={mediaItem.attributes.license || ''}
              onChange={(e) =>
                onChange({
                  ...mediaItem,
                  attributes: { ...mediaItem.attributes, license: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Input
              type={InputType.date}
              label={t('media.licenseEnd') as string}
              id={`${uid}-copyright`}
              value={
                mediaItem.attributes.expiresAt
                  ? formatISO9075(new Date(mediaItem.attributes.expiresAt), {
                      representation: 'date',
                    })
                  : ''
              }
              onChange={(e) =>
                onChange({
                  ...mediaItem,
                  attributes: {
                    ...mediaItem.attributes,
                    expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                  },
                })
              }
            />
          </div>
        </StyledMediaListItemForm>
        <StyledMediaListItemFunctions></StyledMediaListItemFunctions>
      </StyledMediaListItemMain>
      <StyledMediaListItemInfo>
        <Button
          onClick={() => {
            if (window.confirm()) {
              () => call<MediaDelete>(mediaDeleteFactory, { id: mediaItem.id });
            }
          }}
        >
          delete
        </Button>
      </StyledMediaListItemInfo>
    </StyledMediaListItem>
  );
};

interface MediaListProps {
  media: Media['data'][];
  onChange: (media: Media['data'][], changesMediaItemId: number) => void;
}

export const MediaList: React.FC<MediaListProps> = ({ media, onChange }: MediaListProps) => {
  return (
    <StyledMediaList>
      {media?.map((mediaItem, index) => (
        <MediaListItem
          key={index}
          mediaItem={mediaItem}
          onChange={(mediaItem) =>
            onChange(
              [...media.slice(0, index), mediaItem, ...media.slice(index + 1, media.length)],
              mediaItem.id
            )
          }
        />
      ))}
    </StyledMediaList>
  );
};
