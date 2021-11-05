import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiCall, useApiCall, useMediaUpload } from '../../../lib/api';
import { CategoryEntry } from '../../../lib/api/types/general';
import { Category, CategoryEntryPage, useEntry } from '../../../lib/categories';
import { WindowContext } from '../../../lib/WindowService';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { useMediaForm } from '../helpers/media';
import { useT } from '../../../lib/i18n';
import { ParsedUrlQuery } from 'querystring';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { DropZone } from '../../DropZone';
import { Media, MediaLicense } from '../../../lib/api/types/media';
import { EntryFormHook } from '../helpers/form';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { Organizer } from '../../../lib/api/types/organizer';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { MediaList } from '../../MediaList';
import { useUser } from '../../user/useUser';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { MediaDelete, mediaDeleteFactory } from '../../../lib/api/routes/media/delete';
import { MediaUpdate, mediaUpdateFactory } from '../../../lib/api/routes/media/update';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { usePublish } from '../../Publish';

const maxLogoSize = 2048;

const useLogoUploadForm = <T extends CategoryEntry, C extends ApiCall>(
  { category, query }: { category: Category; query: ParsedUrlQuery },
  disabled: boolean,
  maxFiles = 1
) => {
  const t = useT();
  const [files, setFiles] = useState<FileList | File[]>();
  const { entry, mutate } = useEntry<T, C>(category, query);
  const [isUploading, setIsUploading] = useState(false);
  const { progress, upload } = useMediaUpload();
  const [uploadSuccess, setUploadSuccess] = useState<{ count: number }>();
  const { mutateUserInfo } = useUser();

  useEffect(() => {
    const x = async () => {
      if (!isUploading && files && files.length > 0) {
        setIsUploading(true);

        try {
          const resp = await upload<C>(
            files,
            category.api.update.factory,
            {
              id: entry.data.id,
            },
            'logo'
          );

          if (resp.status === 200) {
            mutate(resp.body.data as T);
            setUploadSuccess({ count: files.length });
            setFiles(undefined);
            setTimeout(() => mutateUserInfo(), 1000);
            // mutateList();
          }

          setIsUploading(false);
        } catch (e) {
          console.error(e);
        }
      }
    };

    x();
  }, [
    category?.api?.update?.factory,
    entry?.data?.id,
    files,
    isUploading,
    mutate,
    query,
    upload,
    mutateUserInfo,
  ]);

  return {
    renderedForm: (
      <FormItem width={FormItemWidth.full}>
        <DropZone
          onDrop={async (newFiles) => {
            setFiles(newFiles);
          }}
          acceptedFileTypes={[
            { mimeType: 'image/svg+xml', name: 'SVG' },
            { mimeType: 'image/jpeg', name: 'JPG/JPEG' },
            { mimeType: 'image/png', name: 'PNG' },
            { mimeType: 'image/webp', name: 'WEBP' },
            { mimeType: 'image/gif', name: 'GIF' },
          ]}
          label={t('logo.dropZoneLabel') as string}
          isUploading={isUploading}
          progress={progress}
          success={uploadSuccess}
          disabled={disabled}
          max={maxFiles}
          maxFileSizeInKb={maxLogoSize}
        />
      </FormItem>
    ),
    valid: true,
    pristine: true,
    reset: () => undefined,
    submit: undefined,
  };
};

export const useLogoForm: EntryFormHook = ({ category, query }) => {
  const [valid, setValid] = useState(false);
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const t = useT();
  const loadingScreen = useLoadingScreen();
  const { mutateUserInfo } = useUser();

  const initialLogo = useMemo<Media['data']>(
    () => entry?.data?.relations?.logo,
    [entry?.data?.relations?.logo]
  );

  const [logo, setLogo] = useState<Media['data']>();
  const [logoFromApi, setLogoFromApi] = useState<Media['data']>();

  const pristine = useMemo(
    () => JSON.stringify(logo) === JSON.stringify(logoFromApi),
    [logo, logoFromApi]
  );

  useEffect(() => {
    if (initialLogo) {
      if (logo === undefined || JSON.stringify(initialLogo) !== JSON.stringify(logoFromApi)) {
        setLogo(initialLogo);
      }

      if (JSON.stringify(initialLogo) !== JSON.stringify(logoFromApi)) {
        setLogoFromApi(initialLogo);
      }
    }

    if (entry?.data?.id && !initialLogo) {
      setLogo(undefined);
      setLogoFromApi(initialLogo);
    }
  }, [initialLogo, logo, logoFromApi, entry?.data?.id]);

  const { renderedForm: renderedLogoUploadForm } = useLogoUploadForm({ category, query }, false);

  const submitLogo = useCallback(async () => {
    try {
      const resp = await call<MediaUpdate>(mediaUpdateFactory, {
        id: logo.id,
        media: {
          ...logo,
          relations: {
            ...logo.relations,
            license: (logo.relations.license as MediaLicense).id,
            translations: logo.relations?.translations,
          },
        },
      });

      if (resp.status === 200) {
        mutate();
      }
    } catch (e) {
      console.error(e);
    }
  }, [call, logo, mutate]);

  return {
    renderedForm: (
      <div>
        <EntryFormHead title={`${t('logo.title')}`} />
        <FormGrid>
          {!logo && !logoFromApi && renderedLogoUploadForm}
          <FormItem width={FormItemWidth.full}>
            <MediaList
              media={logo ? [logo] : logoFromApi ? [logoFromApi] : undefined}
              onChange={(newLogo) => {
                setLogo(newLogo[0]);
              }}
              setValid={(valid) => setValid(valid)}
              onDelete={async (mediaItemId) => {
                if (
                  confirm(
                    t('general.deleting.confirm', {
                      name: t('general.deleting.logo.singular') as string,
                    }) as string
                  )
                ) {
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
                          setTimeout(() => {
                            mutate();
                            mutateUserInfo();
                          }, 1000);
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
                }
              }}
            />
          </FormItem>
        </FormGrid>
      </div>
    ),
    pristine,
    submit: async () => {
      submitLogo();
    },
    reset: () => {
      setLogo(initialLogo);
    },
    valid,
  };
};

export const OrganizerMediaPage: React.FC<CategoryEntryPage> = <
  T extends CategoryEntry,
  C extends ApiCall
>({
  category,
  query,
}: CategoryEntryPage) => {
  const t = useT();
  const renderedEntryHeader = useEntryHeader(
    { category, query },
    t('menu.start.items.profile') as string,
    true
  );
  const { entry } = useEntry<T, C>(category, query);
  const formattedDate = useSaveDate(entry);
  const { rendered } = useContext(WindowContext);
  const [loaded, setLoaded] = useState(false);

  const {
    renderedForm: mediaForm,
    submit: mediaSubmit,
    pristine: mediaPristine,
    valid: mediaValid,
    reset: mediaReset,
  } = useMediaForm({ category, query, loaded });
  const {
    renderedForm: logoForm,
    submit: logoSubmit,
    pristine: logoPristine,
    valid: logoValid,
    reset: logoReset,
  } = useLogoForm({ category, query, loaded });

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const pristine = useMemo(() => mediaPristine && logoPristine, [mediaPristine, logoPristine]);

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    mediaReset();
    logoReset();
  });

  const onSave = useCallback(async () => {
    if (!mediaPristine && mediaValid) {
      mediaSubmit();
    }
    if (!logoPristine && logoValid) {
      logoSubmit();
    }
  }, [mediaPristine, mediaValid, mediaSubmit, logoPristine, logoValid, logoSubmit]);

  const { renderedPublish } = usePublish({
    category,
    query,
    onPublish: onSave,
  });

  return (
    <>
      {renderedPublish}
      {renderedEntryHeader}
      <div>
        <Save
          onClick={onSave}
          active={!mediaPristine || !logoPristine}
          date={formattedDate}
          valid={mediaValid && logoValid}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{logoForm}</EntryFormContainer>
          <EntryFormContainer>{mediaForm}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
