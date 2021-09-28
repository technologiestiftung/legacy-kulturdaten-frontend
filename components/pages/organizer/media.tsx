import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useApiCall, useMediaUpload } from '../../../lib/api';
import {
  MediaTranslationCreate,
  mediaTranslationCreateFactory,
} from '../../../lib/api/routes/media/translation/create';
import { MediaUpdate, mediaUpdateFactory } from '../../../lib/api/routes/media/update';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { organizerUpdateFactory } from '../../../lib/api/routes/organizer/update';
import { Media } from '../../../lib/api/types/media';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { WindowContext } from '../../../lib/WindowService';
import { DropZone } from '../../DropZone';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { MediaList } from '../../MediaList';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { EntryFormHook } from './info';

const imagesMax = 5;

const useMediaUploadForm: EntryFormHook = (
  { category, query },
  loaded,
  showHint,
  ...parameters: [boolean, number]
) => {
  const [disabled, maxFiles] = parameters;
  const t = useT();
  const [pristine, setPristine] = useState(true);
  const [files, setFiles] = useState<FileList | File[]>();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [isUploading, setIsUploading] = useState(false);
  const { progress, upload } = useMediaUpload();
  const [uploadSuccess, setUploadSuccess] = useState<{ count: number }>();

  useEffect(() => {
    const x = async () => {
      if (!isUploading && files && files.length > 0) {
        setIsUploading(true);

        try {
          const resp = await upload<OrganizerShow>(files, organizerUpdateFactory, {
            id: query.organizer,
          });

          if (resp.status === 200) {
            mutate(resp.body.data);
            setUploadSuccess({ count: files.length });
            setFiles(undefined);
            // mutateList();
          }

          setIsUploading(false);
        } catch (e) {
          console.error(e);
        }
      }
    };

    x();
  }, [files, isUploading, mutate, query, upload]);

  return {
    renderedForm: (
      <FormItem width={FormItemWidth.full}>
        <DropZone
          onDrop={async (newFiles) => {
            setFiles(newFiles);
          }}
          acceptedFileTypes={[
            { mimeType: 'image/jpeg', name: 'JPG/JPEG' },
            { mimeType: 'image/png', name: 'PNG' },
            { mimeType: 'image/webp', name: 'WEBP' },
          ]}
          label="Neue Bilder hochladen"
          isUploading={isUploading}
          progress={progress}
          success={uploadSuccess}
          disabled={disabled}
          disabledMessage={t('media.maxReached', { count: imagesMax }) as string}
          max={maxFiles}
        />
      </FormItem>
    ),
    hint: false,
    valid: true,
    pristine,
    reset: () => undefined,
    submit: undefined,
  };
};

export const OrganizerMediaPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const [showHint, setShowHint] = useState(false);
  const renderedEntryHeader = useEntryHeader({ category, query }, true);
  const { entry } = useEntry<Organizer, OrganizerShow>(category, query);
  const formattedDate = useSaveDate(entry);
  const { rendered } = useContext(WindowContext);
  const [loaded, setLoaded] = useState(false);
  const call = useApiCall();
  const t = useT();

  const initialMedia = useMemo<Media['data'][]>(
    () => (entry?.data?.relations?.media ? [...entry.data.relations.media].reverse() : undefined),
    [entry?.data?.relations?.media]
  );

  const [media, setMedia] = useState<Media['data'][]>();
  const [mediaFromApi, setMediaFromApi] = useState<Media['data'][]>();
  const [mediaNotPristineList, setMediaNotPristineList] = useState<number[]>([]);

  const uploadDisabled = useMemo(() => media?.length >= imagesMax, [media]);

  useEffect(() => {
    if (initialMedia) {
      if (!media) {
        setMedia(initialMedia);
      }

      if (!mediaFromApi || initialMedia !== mediaFromApi) {
        setMediaFromApi(initialMedia);
      }
    }
  }, [initialMedia, media, mediaFromApi]);

  useEffect(() => {
    if (media && mediaFromApi && media.length !== mediaFromApi.length) {
      const mediaFromApiIds = mediaFromApi.map((mediaItem) => mediaItem.id);
      const mediaIds = media.map((mediaItem) => mediaItem.id);

      setMedia([
        ...mediaFromApi.filter((mediaItem) => !mediaIds.includes(mediaItem.id)),
        ...media.filter((mediaItem) => mediaFromApiIds.includes(mediaItem.id)),
      ]);
    }
  }, [media, mediaFromApi]);

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const pristine = useMemo(() => mediaNotPristineList.length === 0, [mediaNotPristineList]);

  const { renderedForm: renderedMediaUploadForm } = useMediaUploadForm(
    { category, query },
    loaded,
    false,
    uploadDisabled,
    media?.length >= imagesMax ? 0 : imagesMax - media?.length
  );

  const submitMediaList = useCallback(async () => {
    for (let i = 0; i < media.length; i += 1) {
      const mediaItem = media[i];

      const id = mediaItem.id;

      if (mediaNotPristineList.includes(id)) {
        const resp = await call<MediaUpdate>(mediaUpdateFactory, {
          id,
          media: mediaItem,
        });

        if (resp.status !== 200) {
          console.error(resp);
        }

        const translations = mediaItem.relations?.translations;

        if (translations && translations.length > 0) {
          for (let j = 0; j < translations.length; j += 1) {
            const translation = translations[j];
            const translationResp = await call<MediaTranslationCreate>(
              mediaTranslationCreateFactory,
              {
                id,
                translation,
              }
            );

            if (translationResp.status !== 200) {
              console.error(resp);
            }
          }
        }
      }
    }
    setMediaNotPristineList([]);
  }, [call, media, mediaNotPristineList]);

  return (
    <>
      {renderedEntryHeader}
      <div>
        <Save
          onClick={async () => {
            console.log('ejo');
            submitMediaList();
            // submit();
          }}
          active={!pristine}
          date={formattedDate}
          valid={true}
          hint={showHint}
        />
        <EntryFormWrapper>
          <EntryFormContainer>
            <EntryFormHead title={`${t('media.title')} (${t('general.max')} ${imagesMax})`} />
            <FormGrid>
              {renderedMediaUploadForm}
              <FormItem width={FormItemWidth.full}>
                <MediaList
                  media={media}
                  onChange={(newMedia, changedMediaItemId) => {
                    setMedia(newMedia);
                    setMediaNotPristineList([
                      ...mediaNotPristineList.filter((id) => id !== changedMediaItemId),
                      changedMediaItemId,
                    ]);
                  }}
                  setValid={(valid) => setShowHint(!valid)}
                />
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
