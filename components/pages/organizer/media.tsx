import { useContext, useEffect, useMemo, useState } from 'react';
import { useApiCall, useMediaUpload } from '../../../lib/api';
import { OrganizerMedia } from '../../../lib/api/routes/organizer/media';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate, organizerUpdateFactory } from '../../../lib/api/routes/organizer/update';
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

  const call = useApiCall();

  const { progress, upload } = useMediaUpload();

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
                try {
                  const resp = await upload(newFiles, organizerUpdateFactory, query);

                  console.log(resp);

                  // const resp = await fetch(
                  //   `https://beta.api.kulturdaten.berlin/v1/organizer/${entry.data.id}`,
                  //   {
                  //     method: 'PATCH',
                  //     body: formData,
                  //   }
                  // );

                  // console.log(resp);

                  if (resp.status === 200) {
                    mutate();
                    // mutateList();
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
              label="New File"
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

  const media = useMemo(
    () => (entry?.data?.relations?.media ? [...entry.data.relations.media].reverse() : undefined),
    [entry?.data?.relations?.media]
  );

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const { renderedForm: renderedMediaUploadForm, submit } = useMediaUploadForm(
    { category, query },
    loaded,
    false
  );

  return (
    <>
      {renderedEntryHeader}
      <div>
        <Save
          onClick={async () => {
            console.log('ejo');
            submit();
          }}
          active={true}
          date={formattedDate}
          valid={true}
        />
        <EntryFormWrapper>
          {renderedMediaUploadForm}
          <EntryFormContainer>
            <EntryFormHead title="Vorhandene Bilder" />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <MediaList media={media} onChange={() => undefined} />
              </FormItem>
            </FormGrid>
          </EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
