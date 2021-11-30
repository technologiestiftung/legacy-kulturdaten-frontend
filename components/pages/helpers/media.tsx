import { ParsedUrlQuery } from 'querystring';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiCall, useApiCall, useMediaUpload } from '../../../lib/api';
import { MediaUpdate, mediaUpdateFactory } from '../../../lib/api/routes/media/update';
import { CategoryEntry } from '../../../lib/api/types/general';
import { Media, MediaLicense } from '../../../lib/api/types/media';
import { useEntry, Category } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { DropZone } from '../../DropZone';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { MediaList } from '../../MediaList';
import { MediaDelete, mediaDeleteFactory } from '../../../lib/api/routes/media/delete';
import { EntryFormHook } from '../helpers/form';
import { FormGrid, FormItem, FormItemWidth } from './formComponents';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { useConfirmScreen } from '../../Confirm/ConfirmScreen';

const imagesMax = 5;
const maxFileSize = 10240;

const useMediaUploadForm = <T extends CategoryEntry, C extends ApiCall>(
  { category, query }: { category: Category; query: ParsedUrlQuery },
  disabled: boolean,
  maxFiles: number,
  maxFileSizeInKb?: number
) => {
  const t = useT();
  const [files, setFiles] = useState<FileList | File[]>();
  const { entry, mutate } = useEntry<T, C>(category, query);
  const [isUploading, setIsUploading] = useState(false);
  const { progress, upload } = useMediaUpload();
  const [uploadSuccess, setUploadSuccess] = useState<{ count: number }>();

  useEffect(() => {
    const uploadFiles = async () => {
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

    uploadFiles();
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
            { mimeType: 'image/gif', name: 'GIF' },
          ]}
          label={t('media.dropZoneLabel') as string}
          isUploading={isUploading}
          progress={progress}
          success={uploadSuccess}
          disabled={disabled}
          disabledMessage={t('media.maxReached', { count: imagesMax }) as string}
          max={maxFiles}
          maxFileSizeInKb={maxFileSizeInKb}
        />
      </FormItem>
    ),
    valid: true,
    pristine: true,
    reset: () => undefined,
    submit: undefined,
  };
};

export const useMediaForm: EntryFormHook = ({ category, query }) => {
  const [valid, setValid] = useState(false);
  const { entry, mutate: mutateEntry } = useEntry(category, query);
  const call = useApiCall();
  const t = useT();
  const loadingScreen = useLoadingScreen();
  const confirmScreen = useConfirmScreen();

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
    media?.length >= imagesMax ? 0 : imagesMax - media?.length,
    maxFileSize
  );

  const submitMediaList = useCallback(async () => {
    for (let i = 0; i < media.length; i += 1) {
      const mediaItem = media[i];

      const id = mediaItem.id;

      if (mediaNotPristineList.includes(id)) {
        const existingRelations = { ...mediaItem.relations };
        delete existingRelations.renditions;

        const newRelations = {
          ...existingRelations,
          license: (mediaItem.relations?.license as MediaLicense)?.id,
          translations: mediaItem.relations?.translations,
        };

        if (!newRelations.license) {
          delete newRelations.license;
        }

        if (!newRelations.translations || newRelations.translations.length < 1) {
          delete newRelations.translations;
        }

        const media = {
          ...mediaItem,
          relations: newRelations,
        };

        if (Object.keys(newRelations).length < 1) {
          delete media.relations;
        }

        const resp = await call<MediaUpdate>(mediaUpdateFactory, {
          id,
          media,
        });

        if (resp.status !== 200) {
          console.error(resp);
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
              onDelete={async (mediaItemId) => {
                confirmScreen({
                  title: t('media.deleteTitle') as string,
                  message: t('general.deleting.confirm', {
                    name: t('general.deleting.media.singular') as string,
                  }),
                  confirmText: t('general.confirmDelete') as string,
                  onConfirm: async () => {
                    loadingScreen(
                      t('general.deleting.loading'),
                      async () => {
                        try {
                          const resp = await call<MediaDelete>(mediaDeleteFactory, {
                            id: mediaItemId,
                            entry: {
                              attributes: {
                                id: mediaItemId,
                              },
                            },
                          });

                          if (resp.status === 200) {
                            mutateEntry();
                            return { success: true };
                          }

                          return { success: false, error: t('general.serverProblem') };
                        } catch (e) {
                          console.error(e);

                          return { success: false, error: t('general.serverProblem') };
                        }
                      },
                      t('general.takeAFewSeconds')
                    );
                  },
                });
              }}
            />
          </FormItem>
        </FormGrid>
      </div>
    ),
    pristine,
    submit: async () => {
      submitMediaList();
    },
    reset: () => undefined,
    valid,
  };
};
