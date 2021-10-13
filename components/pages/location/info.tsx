import { useContext, useEffect, useMemo, useState } from 'react';
import { Location } from '../../../lib/api/types/location';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useNameForm } from '../helpers/form/Name';
import { LocationShow } from '../../../lib/api/routes/location/show';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { WindowContext } from '../../../lib/WindowService';
import { useSaveDate } from '../helpers/useSaveDate';
import { useDescriptionForm } from '../helpers/form/Description';
import { useAddressForm } from '../helpers/form/Address';
import { Save } from '../../EntryForm/Save';

export const LocationInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const { entry } = useEntry<Location, LocationShow>(category, query);

  const [loaded, setLoaded] = useState(false);
  const [valid, setValid] = useState(true);
  const { rendered } = useContext(WindowContext);
  const formattedDate = useSaveDate(entry);

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const {
    renderedForm: nameForm,
    submit: nameSubmit,
    pristine: namePristine,
    valid: nameValid,
    hint: nameHint,
  } = useNameForm(
    {
      category,
      query,
    },
    loaded,
    valid
  );

  const {
    renderedForm: descriptionForm,
    submit: descriptionSubmit,
    pristine: descriptionPristine,
    valid: descriptionValid,
    hint: descriptionHint,
  } = useDescriptionForm(
    {
      category,
      query,
    },
    loaded,
    valid
  );

  const {
    renderedForm: addressForm,
    submit: addressSubmit,
    pristine: addressPristine,
    valid: addressValid,
    hint: addressHint,
  } = useAddressForm(
    {
      category,
      query,
    },
    loaded,
    valid,
    false
  );

  useEffect(() => {
    setValid(![nameValid, addressValid, descriptionValid].includes(false));
  }, [addressValid, descriptionValid, nameValid]);

  const pristine = useMemo(
    () => ![namePristine, descriptionPristine, addressPristine].includes(false),
    [namePristine, descriptionPristine, addressPristine]
  );

  const hint = useMemo(
    () => nameHint || descriptionHint || addressHint,
    [nameHint, descriptionHint, addressHint]
  );

  return (
    <>
      {renderedEntryHeader}
      <div role="tabpanel">
        <div role="form" aria-invalid={!valid}>
          <Save
            onClick={async () => {
              nameSubmit();
              descriptionSubmit();
              addressSubmit();
            }}
            date={formattedDate}
            active={!pristine}
            valid={loaded === false || valid}
            hint={loaded === true && hint}
          />
          <EntryFormWrapper>
            <EntryFormContainer>{nameForm}</EntryFormContainer>
            <EntryFormContainer>{addressForm}</EntryFormContainer>
            <EntryFormContainer>{descriptionForm}</EntryFormContainer>
          </EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
