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

const useMediaUploadForm: EntryFormHook = ({ category, query }) => {
  const [pristine, setPristine] = useState(true);
  const [files, setFiles] = useState<FileList>();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [isUploading, setIsUploading] = useState(false);
  const { progress, upload } = useMediaUpload();

  useEffect(() => {
    const x = async () => {
      if (!isUploading && files && files.length > 0) {
        setIsUploading(true);

        try {
          const resp = await upload<OrganizerShow>(files, organizerUpdateFactory, query);

          if (resp.status === 200) {
            mutate(resp.body.data);
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
      <EntryFormContainer>
        <EntryFormHead title="Neue Bilder hinzufügen" />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>
            <DropZone
              files={files}
              onDrop={async (newFiles) => {
                setFiles(newFiles);
              }}
              acceptedFileTypes={[{ mimeType: 'image/jpeg', name: 'JPG/JPEG' }]}
              label="New File"
              isUploading={isUploading}
              progress={progress}
            />
          </FormItem>
          <FormItem width={FormItemWidth.full}>{progress}</FormItem>
        </FormGrid>
      </EntryFormContainer>
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
  const renderedEntryHeader = useEntryHeader({ category, query });
  const { entry } = useEntry<Organizer, OrganizerShow>(category, query);
  const formattedDate = useSaveDate(entry);
  const { rendered } = useContext(WindowContext);
  const [loaded, setLoaded] = useState(false);
  const call = useApiCall();

  const initialMedia = useMemo<Media['data'][]>(
    () => (entry?.data?.relations?.media ? [...entry.data.relations.media].reverse() : undefined),
    [entry?.data?.relations?.media]
  );

  const [media, setMedia] = useState<Media['data'][]>();
  const [mediaFromApi, setMediaFromApi] = useState<Media['data'][]>();
  const [mediaNotPristineList, setMediaNotPristineList] = useState<number[]>([]);

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
    false
  );

  const submitMediaList = useCallback(async () => {
    for (const mediaItem of media) {
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

        for (const translation of translations) {
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
        />
        <EntryFormWrapper>
          {renderedMediaUploadForm}
          <EntryFormContainer>
            <EntryFormHead title="Vorhandene Bilder" />
            <FormGrid>
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
                />
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
