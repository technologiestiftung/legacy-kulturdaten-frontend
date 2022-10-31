import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatISO9075 from 'date-fns/formatISO9075';
import Image from 'next/image';
import { ExternalLink } from 'react-feather';
import { StyledRequiredInfoText } from '../EntryForm/wrappers';
import { contentLanguages, languageTranslationKeys } from '../../config/locales';
import {
  Media,
  MediaLicense,
  MediaTranslation,
  RenditionAttributes,
} from '../../lib/api/types/media';
import { useT } from '../../lib/i18n';
import { getTranslation } from '../../lib/translations';
import { Language } from '../../config/locales';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';
import { Button, ButtonVariant } from '../button';
import { useFormatNumber } from '../../lib/number';
import { useEffect, useMemo } from 'react';
import { AlertSymbol } from '../assets/AlertSymbol';
import { defaultLanguage } from '../../config/locale';
import { useMediaLicenseList } from '../../lib/categories';
import { RadioList } from '../Radio/RadioList';
import { Info, InfoColor } from '../info';
import { Checkbox } from '../checkbox';
import { useLanguage } from '../../lib/routing';

const StyledMediaList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
`;

const StyledMediaListItem = styled.div`
  background: var(--white);
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
`;

const StyledMediaListItemTitle = styled.h3`
  font-weight: 700;
  padding: 1.5rem 1.5rem 0;
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
  padding-bottom: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding-bottom: 1.5rem;
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

  @media screen and (pointer: coarse) {
    color: var(--black);
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
  height: 100%;
  position: relative;

  ${thumbnailImgStyles}

  background: var(--grey-350);

  ${mq(Breakpoint.mid)} {
    height: initial;
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

const StyledMediaListItemFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  row-gap: 1.5rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem;
  }

  ${mq(Breakpoint.ultra)} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1.5rem;
  }
`;

const StyledMediaListItemForm = styled.div<{ columns?: number }>`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;

  ${({ columns }) =>
    columns &&
    css`
      ${mq(Breakpoint.ultra)} {
        grid-column: span ${columns};
      }
    `}
`;

const StyledMediaListItemSub = styled.div`
  padding: 0.75rem;
  border-top: 1px solid var(--grey-400);
  border-radius: 0 0 calc(0.75rem - 1px) calc(0.75rem - 1px);
  background: var(--grey-200);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  row-gap: 0.75rem;

  ${mq(Breakpoint.mid)} {
    row-gap: 1.125rem;
    padding: 1.125rem 1.5rem;
  }
`;

const StyledMediaListItemInfo = styled.table`
  font-family: var(--font-family-mono);
  font-size: var(--font-size-200);
  line-height: calc(var(--line-height-200) * 1);
`;

const StyledMediaListItemInfoText = styled.td`
  word-break: break-all;
`;

const StyledMediaListItemInfoLabel = styled.td`
  font-weight: 700;
  padding-right: 1rem;
`;

const StyledMediaListItemDelete = styled.div`
  flex-shrink: 0;
`;

const StlyedMediaListItemHint = styled.div`
  display: flex;
  padding: 0.75rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  column-gap: 0.75rem;
  border-bottom: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    border-bottom: none;
    padding: 1.5rem 1.5rem 0;
  }
`;

interface MediaListItemProps {
  mediaItem: Media['data'];
  onChange: (mediaItem: Media['data']) => void;
  valid: boolean;
  onDelete?: (mediaItemId: number) => void;
  index?: number;
}

const MediaListItem: React.FC<MediaListItemProps> = ({
  mediaItem,
  onChange,
  valid,
  onDelete,
  index,
}: MediaListItemProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const uid = usePseudoUID();
  const t = useT();
  const language = useLanguage();
  const formatNumber = useFormatNumber();
  const mediaLicenses = useMediaLicenseList();
  const currentTranslation = getTranslation<MediaTranslation>(
    language,
    mediaItem?.relations?.translations
  );

  const smallestRendition =
    mediaItem.relations?.renditions?.length > 0
      ? mediaItem.relations.renditions.reduce<RenditionAttributes>((pick, rendition) => {
          if (parseInt(rendition.attributes.filesize, 10) < parseInt(pick.filesize, 10)) {
            return rendition.attributes;
          }
          return pick;
        }, mediaItem.attributes)
      : mediaItem.attributes;

  return (
    <StyledMediaListItem role="listitem">
      <StyledMediaListItemTitle>{currentTranslation?.attributes?.alternativeText || `${t('media.image')} ${index}`}</StyledMediaListItemTitle>
      {!valid && (
        <StlyedMediaListItemHint>
          <AlertSymbol />
          <span>{t('media.hint')}</span>
        </StlyedMediaListItemHint>
      )}
      <StyledMediaListItemMain>
        <StyledMediaListItemThumbnail role="img">
          {smallestRendition.width && smallestRendition.height ? (
            <StyledMediaListItemThumbnailInner>
              <StyledMediaListItemThumbnailLink
                title={t('media.openImage') as string}
                aria-label={t('media.openImage') as string}
                href={mediaItem.attributes.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={smallestRendition.url}
                  layout={isMidOrWider ? 'intrinsic' : 'fill'}
                  width={isMidOrWider ? smallestRendition.width : undefined}
                  height={isMidOrWider ? smallestRendition.height : undefined}
                  objectFit="contain"
                  alt={currentTranslation?.attributes?.alternativeText || ''}
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
        <StyledMediaListItemFormWrapper>
          <StyledRequiredInfoText wrapped/>
          <StyledMediaListItemForm>
            {contentLanguages.map((language: Language, index) => {
              const currentTranslation = mediaItem.relations?.translations
                ? getTranslation<MediaTranslation>(
                    language,
                    mediaItem.relations.translations,
                    false
                  )
                : undefined;

              return (
                <div key={index}>
                  <Input
                    type={InputType.text}
                    label={`${t('media.alt')} ${t(languageTranslationKeys[language])}`}
                    id={`${uid}-alt-${language}`}
                    lang={language.slice(0,2) as "de" | "en"}
                    value={currentTranslation?.attributes?.alternativeText || ''}
                    tooltip={language === defaultLanguage ? (t('media.altTooltip') as string) : ''}
                    onChange={(e) => {
                      const updatedTranslation = {
                        ...currentTranslation,
                        attributes: {
                          ...currentTranslation?.attributes,
                          language,
                          alternativeText: e.target.value,
                        },
                      };

                      const filteredTranslations =
                        mediaItem?.relations?.translations?.filter(
                          (translation) => translation.attributes?.language !== language
                        ) || [];

                      onChange({
                        attributes: mediaItem?.attributes,
                        id: mediaItem?.id,
                        type: mediaItem?.type,
                        relations: mediaItem?.relations
                          ? {
                              ...mediaItem.relations,
                              translations: [...filteredTranslations, updatedTranslation],
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
                placeholder={t('media.copyrightPlaceholder') as string}
                tooltip={t('media.copyrightTooltip') as string}
                onChange={(e) =>
                  onChange({
                    ...mediaItem,
                    attributes: { ...mediaItem.attributes, copyright: e.target.value },
                  })
                }
                required
                softRequired
              />
            </div>
          </StyledMediaListItemForm>
          <StyledMediaListItemForm>
            {' '}
            <div>
              <RadioList
                required
                softRequired
                label={t('media.license') as string}
                id={`${uid}-license`}
                name={`${uid}-license`}
                value={String((mediaItem.relations?.license as MediaLicense)?.id)}
                options={mediaLicenses?.map((mediaLicense) => ({
                  value: String(mediaLicense.id),
                  label: t(`media.licenses.${mediaLicense.id}.name`) as string,
                  link: {
                    href: t(`media.licenses.${mediaLicense.id}.href`) as string,
                    title: t(`media.licenses.${mediaLicense.id}.title`) as string,
                  },
                }))}
                onChange={(newValue) =>
                  onChange({
                    ...mediaItem,
                    attributes: {
                      ...mediaItem.attributes,
                      expiresAt:
                        parseInt(newValue, 10) !== 4 ? null : mediaItem?.attributes?.expiresAt,
                    },
                    relations: {
                      ...mediaItem.relations,
                      license: mediaLicenses.find(
                        (license) => license.id === parseInt(newValue, 10)
                      ),
                    },
                  })
                }
              />
            </div>
            {(mediaItem.relations?.license as MediaLicense)?.id === 4 && (
              <div>
                <Input
                  type={InputType.date}
                  label={t('media.licenseEnd') as string}
                  id={`${uid}-license`}
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
                        expiresAt: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : undefined,
                      },
                    })
                  }
                  required
                  softRequired
                />
              </div>
            )}
          </StyledMediaListItemForm>
          <StyledMediaListItemForm columns={2}>
            <div>
              <Info color={InfoColor.grey} noMaxWidth>
                {t('media.usageInfo')}
                <Checkbox
                  id={`${uid}-terms`}
                  checked={mediaItem?.attributes?.acceptedTermsAt?.length > 0}
                  label={t('media.acknowledgedUsageInfo') as string}
                  onChange={(e) => {
                    onChange({
                      ...mediaItem,
                      attributes: {
                        ...mediaItem.attributes,
                        acceptedTermsAt: e.target.checked ? new Date().toISOString() : undefined,
                      },
                    });
                  }}
                  valid={mediaItem?.attributes?.acceptedTermsAt?.length > 0}
                  required
                />
              </Info>
            </div>
          </StyledMediaListItemForm>
        </StyledMediaListItemFormWrapper>
      </StyledMediaListItemMain>
      <StyledMediaListItemSub>
        <StyledMediaListItemInfo>
          <tbody>
            {mediaItem.attributes.format && (
              <tr>
                <StyledMediaListItemInfoLabel>{t('media.format')}</StyledMediaListItemInfoLabel>
                <StyledMediaListItemInfoText>
                  {mediaItem.attributes.format.toUpperCase()}
                </StyledMediaListItemInfoText>
              </tr>
            )}
            {mediaItem.attributes.url && (
              <tr>
                <StyledMediaListItemInfoLabel>{t('media.url')}</StyledMediaListItemInfoLabel>
                <StyledMediaListItemInfoText>{mediaItem.attributes.url}</StyledMediaListItemInfoText>
              </tr>
            )}
            {mediaItem.attributes.filesize && (
              <tr>
                <StyledMediaListItemInfoLabel>{t('media.size')}</StyledMediaListItemInfoLabel>
                <StyledMediaListItemInfoText>
                  {formatNumber(
                    Math.ceil((parseInt(mediaItem.attributes.filesize, 10) / 1024 / 1024) * 100) / 100
                  )}{' '}
                  {t('media.mb')}
                </StyledMediaListItemInfoText>
              </tr>
            )}
          </tbody>
        </StyledMediaListItemInfo>
        {onDelete && (
          <StyledMediaListItemDelete>
            <Button variant={ButtonVariant.minimal} onClick={() => onDelete(mediaItem.id)}>
              {t('media.delete')}
            </Button>
          </StyledMediaListItemDelete>
        )}
      </StyledMediaListItemSub>
    </StyledMediaListItem>
  );
};

interface MediaListProps {
  media: Media['data'][];
  onChange: (media: Media['data'][], changesMediaItemId: number) => void;
  setValid: (valid: boolean) => void;
  onDelete?: (mediaItemId: number) => void;
}

export const MediaList: React.FC<MediaListProps> = ({
  media,
  onChange,
  setValid,
  onDelete,
}: MediaListProps) => {
  const itemsValidList = useMemo(
    () =>
      media?.map((mediaItem) => {
        const requiredAttributes = [
          mediaItem.attributes.acceptedTermsAt,
          mediaItem.attributes.copyright,
          mediaItem.relations.license,
        ];

        if (
          mediaItem.relations?.translations &&
          Array.isArray(mediaItem.relations?.translations) &&
          mediaItem.relations.translations.filter(
            ({ attributes }) => attributes.language === defaultLanguage
          )[0]
        ) {
          requiredAttributes.push(
            mediaItem.relations.translations.filter(
              ({ attributes }) => attributes.language === defaultLanguage
            )[0].attributes.alternativeText
          );
        }

        for (let i = 0; i < requiredAttributes.length; i += 1) {
          const attribute = requiredAttributes[i];
          if (
            !attribute ||
            typeof attribute === 'undefined' ||
            (typeof attribute === 'string' && attribute.length === 0)
          ) {
            return false;
          }
        }

        return true;
      }),
    [media]
  );

  useEffect(() => {
    setValid(true);
  }, [setValid]);

  return (
    <StyledMediaList role="list">
      {media?.map((mediaItem, index) => (
        <MediaListItem
          key={mediaItem.id}
          valid={itemsValidList[index]}
          mediaItem={mediaItem}
          index={index + 1}
          onChange={(mediaItem) => {
            onChange(
              [...media.slice(0, index), mediaItem, ...media.slice(index + 1, media.length)],
              mediaItem.id
            );
          }}
          onDelete={onDelete}
        />
      ))}
    </StyledMediaList>
  );
};
