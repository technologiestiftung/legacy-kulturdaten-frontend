import { useContext, useEffect, useMemo, useState } from 'react';
import { Location, LocationType } from '../../../lib/api/types/location';
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
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { RadioVariant, RadioVariantOptionParagraph } from '../../RadioVariant';
import { usePseudoUID } from '../../../lib/uid';
import { EntryFormHook } from '../helpers/form';
import { useApiCall } from '../../../lib/api';
import { useT } from '../../../lib/i18n';
import { LocationUpdate } from '../../../lib/api/routes/location/update';

const useTypeForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const [type, setType] = useState<LocationType>();
  const call = useApiCall();
  const t = useT();
  const uid = usePseudoUID();

  const [typeFromApi, setTypeFromApi] = useState<LocationType>();

  const initialType = useMemo(() => entry?.data?.type, [entry?.data?.type]);

  const pristine = useMemo(() => type === typeFromApi, [type, typeFromApi]);

  useEffect(() => {
    if (initialType !== typeFromApi) {
      setTypeFromApi(initialType);
      setType(initialType);
    }
  }, [initialType, typeFromApi]);

  const renderedForm = (
    <div>
      <EntryFormHead title={t('categories.location.form.type.title') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <RadioVariant
            name={`${uid}-variant`}
            value={type || ''}
            onChange={(value) => setType(value as LocationType)}
            options={[
              {
                value: LocationType.physicallocation,
                label: t('categories.location.form.type.physicalLabel') as string,
                children: [
                  <RadioVariantOptionParagraph key={0}>
                    {t('categories.location.form.type.physicalText')}
                  </RadioVariantOptionParagraph>,
                ],
              },
              {
                value: LocationType.virtuallocation,
                label: t('categories.location.form.type.virtualLabel') as string,
                children: [
                  <RadioVariantOptionParagraph key={0}>
                    {t('categories.location.form.type.virtualText')}
                  </RadioVariantOptionParagraph>,
                ],
              },
            ]}
          />
        </FormItem>
      </FormGrid>
    </div>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<LocationUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              type,
            },
          });

          if (resp.status === 200) {
            mutate();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    reset: () => undefined,
    valid: true,
    hint: false,
    value: type,
  };
};

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

  const {
    renderedForm: typeForm,
    submit: typeSubmit,
    pristine: typePristine,
    valid: typeValid,
    hint: typeHint,
    value: typeValue,
  } = useTypeForm(
    {
      category,
      query,
    },
    loaded,
    valid,
    false
  );

  useEffect(() => {
    setValid(![nameValid, addressValid, descriptionValid, typeValid].includes(false));
  }, [addressValid, descriptionValid, nameValid, typeValid]);

  const pristine = useMemo(
    () => ![namePristine, descriptionPristine, addressPristine, typePristine].includes(false),
    [namePristine, descriptionPristine, addressPristine, typePristine]
  );

  const hint = useMemo(
    () => nameHint || descriptionHint || addressHint || typeHint,
    [nameHint, descriptionHint, addressHint, typeHint]
  );

  return (
    <>
      {renderedEntryHeader}
      <div role="tabpanel">
        <div role="form" aria-invalid={!valid}>
          <Save
            onClick={async () => {
              typeSubmit();
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
            <EntryFormContainer>{typeForm}</EntryFormContainer>
            {typeValue === LocationType.physicallocation && (
              <EntryFormContainer>{addressForm}</EntryFormContainer>
            )}
            <EntryFormContainer>{descriptionForm}</EntryFormContainer>
          </EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
