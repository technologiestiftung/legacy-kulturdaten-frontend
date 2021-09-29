import { ParsedUrlQuery } from 'querystring';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiCall, useApiCall, useMediaUpload } from '../../../lib/api';
import {
  MediaTranslationCreate,
  mediaTranslationCreateFactory,
} from '../../../lib/api/routes/media/translation/create';
import { MediaUpdate, mediaUpdateFactory } from '../../../lib/api/routes/media/update';
import { CategoryEntry } from '../../../lib/api/types/general';
import { Media } from '../../../lib/api/types/media';
import { useEntry, Category } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { DropZone } from '../../DropZone';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { MediaList } from '../../MediaList';
import { EntryFormHook } from '../organizer/info';
import { FormGrid, FormItem, FormItemWidth } from './formComponents';

const imagesMax = 5;

const useMediaUploadForm = <T extends CategoryEntry, C extends ApiCall>(
  { category, query }: { category: Category; query: ParsedUrlQuery },
  disabled: boolean,
  maxFiles: number
) => {
  const t = useT();
  const [files, setFiles] = useState<FileList | File[]>();
  const { entry, mutate } = useEntry<T, C>(category, query);
  const [isUploading, setIsUploading] = useState(false);
  const { progress, upload } = useMediaUpload();
  const [uploadSuccess, setUploadSuccess] = useState<{ count: number }>();

  useEffect(() => {
    const x = async () => {
      if (!isUploading && files && files.length > 0) {
        setIsUploading(true);

        try {
          const resp = await upload<C>(files, category.api.update.factory, {
            id: entry.data.id,
          });

          if (resp.status === 200) {
            mutate(resp.body.data as T);
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
  }, [category?.api?.update?.factory, entry?.data?.id, files, isUploading, mutate, query, upload]);

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
          label={t('media.dropZoneLabel') as string}
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
    pristine: true,
    reset: () => undefined,
    submit: undefined,
  };
};

export const useMediaForm: EntryFormHook = <T extends CategoryEntry, C extends ApiCall>({
  category,
  query,
}) => {
  const [valid, setValid] = useState(false);
  const { entry } = useEntry<T, C>(category, query);
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

  const pristine = useMemo(() => mediaNotPristineList.length === 0, [mediaNotPristineList]);

  const { renderedForm: renderedMediaUploadForm } = useMediaUploadForm(
    { category, query },
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

  return {
    renderedForm: (
      <div>
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
              setValid={(valid) => setValid(valid)}
            />
          </FormItem>
        </FormGrid>
      </div>
    ),
    hint: false,
    pristine,
    submit: async () => {
      submitMediaList();
    },
    reset: () => undefined,
    valid,
  };
};
