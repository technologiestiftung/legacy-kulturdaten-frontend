import { useContext, useEffect, useState } from 'react';
import { ApiCall } from '../../../lib/api';
import { CategoryEntry } from '../../../lib/api/types/general';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { WindowContext } from '../../../lib/WindowService';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { useMediaForm } from '../helpers/media';
import { Offer } from '../../../lib/api/types/offer';
import { OfferShow } from '../../../lib/api/routes/offer/show';

export const OfferMediaPage: React.FC<CategoryEntryPage> = <
  T extends CategoryEntry,
  C extends ApiCall
>({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const { entry } = useEntry<T, C>(category, query);
  const formattedDate = useSaveDate(entry);
  const { rendered } = useContext(WindowContext);
  const [loaded, setLoaded] = useState(false);

  const { renderedForm, submit, pristine } = useMediaForm<Offer, OfferShow>(
    { category, query },
    loaded,
    false
  );

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  return (
    <>
      {renderedEntryHeader}
      <div>
        <Save
          onClick={async () => {
            submit();
          }}
          active={!pristine}
          date={formattedDate}
          valid={true}
          hint={false}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{renderedForm}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
