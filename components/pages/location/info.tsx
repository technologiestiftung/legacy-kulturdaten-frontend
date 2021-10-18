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
import { Input, InputType } from '../../input';
import { OpeningHours } from '../../../lib/api/types/openingHours';
import { OpeningHoursField } from '../../OpeningHoursField';
import { LocationDelete } from '../../../lib/api/routes/location/delete';

const useOpeningHoursForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>();
  const call = useApiCall();
  const t = useT();

  const [openingHoursFromApi, setOpeningHoursFromApi] = useState<OpeningHours[]>();

  const initialOpeningHours = useMemo(
    () => entry?.data?.relations?.openingHours,
    [entry?.data?.relations?.openingHours]
  );

  const pristine = useMemo(
    () => JSON.stringify(openingHours) === JSON.stringify(openingHoursFromApi),
    [openingHours, openingHoursFromApi]
  );

  useEffect(() => {
    if (JSON.stringify(initialOpeningHours) !== JSON.stringify(openingHoursFromApi)) {
      setOpeningHoursFromApi(initialOpeningHours);
      setOpeningHours(initialOpeningHours);
    }
  }, [initialOpeningHours, openingHoursFromApi]);

  const renderedForm = (
    <div>
      <EntryFormHead title={t('categories.location.form.openingHours') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <OpeningHoursField
            openingHours={openingHours || []}
            onChange={(updatedOpeningHours) => setOpeningHours(updatedOpeningHours)}
          />
        </FormItem>
      </FormGrid>
    </div>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        const openingHoursIds = openingHours.map((openingHour) => openingHour.id);
        const deletedOpeningHours = openingHoursFromApi
          .filter((openingHour) => !openingHoursIds.includes(openingHour.id))
          .map((openingHour) => openingHour.id);

        if (deletedOpeningHours.length > 0) {
          try {
            await call<LocationDelete>(category.api.delete.factory, {
              id: entry.data.id,
              entry: {
                relations: {
                  openingHours: deletedOpeningHours,
                },
              },
            });
          } catch (e) {
            console.error(e);
          }
        }

        try {
          const resp = await call<LocationUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                openingHours: openingHours,
              },
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
  };
};

const useUrlForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const [url, setUrl] = useState<string>();
  const call = useApiCall();
  const t = useT();

  const [urlFromApi, setUrlFromApi] = useState<string>();

  const initialUrl = useMemo(() => entry?.data?.attributes?.url, [entry?.data?.attributes?.url]);

  const pristine = useMemo(() => url === urlFromApi, [url, urlFromApi]);

  useEffect(() => {
    if (initialUrl !== urlFromApi) {
      setUrlFromApi(initialUrl);
      setUrl(initialUrl);
    }
  }, [initialUrl, urlFromApi]);

  const renderedForm = (
    <div>
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <Input
            label={t('categories.location.form.url') as string}
            type={InputType.url}
            value={url || ''}
            onChange={(e) => setUrl(e.target.value)}
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
              attributes: {
                url,
              },
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
  };
};

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

  const {
    renderedForm: openingHoursForm,
    submit: openingHoursSubmit,
    pristine: openingHoursPristine,
    valid: openingHoursValid,
    hint: openingHoursHint,
  } = useOpeningHoursForm(
    {
      category,
      query,
    },
    loaded,
    valid,
    false
  );

  const {
    renderedForm: urlForm,
    submit: urlSubmit,
    pristine: urlPristine,
    valid: urlValid,
    hint: urlHint,
  } = useUrlForm(
    {
      category,
      query,
    },
    loaded,
    valid,
    false
  );

  useEffect(() => {
    setValid(
      ![nameValid, addressValid, descriptionValid, typeValid, urlValid, openingHoursValid].includes(
        false
      )
    );
  }, [addressValid, descriptionValid, nameValid, typeValid, urlValid, openingHoursValid]);

  const pristine = useMemo(
    () =>
      ![
        namePristine,
        descriptionPristine,
        addressPristine,
        typePristine,
        urlPristine,
        openingHoursPristine,
      ].includes(false),
    [
      namePristine,
      descriptionPristine,
      addressPristine,
      typePristine,
      urlPristine,
      openingHoursPristine,
    ]
  );

  const hint = useMemo(
    () => nameHint || descriptionHint || addressHint || typeHint || urlHint || openingHoursHint,
    [nameHint, descriptionHint, addressHint, typeHint, urlHint, openingHoursHint]
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

              if (typeValue === LocationType.physicallocation) {
                addressSubmit();
                openingHoursSubmit();
              } else {
                urlSubmit();
              }
            }}
            date={formattedDate}
            active={!pristine}
            valid={loaded === false || valid}
            hint={loaded === true && hint}
          />
          <EntryFormWrapper>
            <EntryFormContainer>{nameForm}</EntryFormContainer>
            <EntryFormContainer>{typeForm}</EntryFormContainer>
            {typeValue === LocationType.physicallocation ? (
              <>
                <EntryFormContainer>{addressForm}</EntryFormContainer>
                <EntryFormContainer>{openingHoursForm}</EntryFormContainer>
              </>
            ) : (
              <EntryFormContainer>{urlForm}</EntryFormContainer>
            )}
            <EntryFormContainer>{descriptionForm}</EntryFormContainer>
          </EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
