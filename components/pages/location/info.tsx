import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Location, LocationTranslation, LocationType } from '../../../lib/api/types/location';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { StyledEntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useNameForm } from '../helpers/form/Name';
import { LocationShow } from '../../../lib/api/routes/location/show';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { WindowContext } from '../../../lib/WindowService';
import { useSaveDate } from '../helpers/useSaveDate';
import { useDescriptionForm } from '../helpers/form/Description';
import { useAddressForm } from '../helpers/form/Address';
import { useArrivalForm } from '../helpers/form/Arrival';
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
import { OpeningHours } from '../../../lib/api/types/hours';
import { useHoursField } from '../../HoursField';
import { LocationDelete } from '../../../lib/api/routes/location/delete';
import { contentLanguages, languageTranslationKeys } from '../../../config/locales';
import { getTranslation } from '../../../lib/translations';
import { Textarea } from '../../textarea';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { usePublish } from '../../Publish';

const useOpeningHoursForm: EntryFormHook = ({ category, query }) => {
  const uid = usePseudoUID();
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>();
  const [openingHoursFromApi, setOpeningHoursFromApi] = useState<OpeningHours[]>();
  const [openingHoursTranslations, setOpeningHoursTranslations] = useState<LocationTranslation[]>();
  const [openingHoursTranslationsFromApi, setOpeningHoursTranslationsFromApi] =
    useState<LocationTranslation[]>();

  const call = useApiCall();
  const t = useT();

  const { renderedHoursField, init: initHoursField } = useHoursField({
    onChange: (updatedOpeningHours) => setOpeningHours(updatedOpeningHours),
    i18nKeys: { addButton: 'openingHours.add' },
  });

  const initialOpeningHours = useMemo(
    () => entry?.data?.relations?.openingHours,
    [entry?.data?.relations?.openingHours]
  );

  const initialOpeningHoursTranslations = useMemo(
    () =>
      entry?.data?.relations?.translations?.map((translation) => ({
        ...translation,
        attributes: {
          language: translation.attributes.language,
          openingHours: translation.attributes?.openingHours,
        },
      })),
    [entry?.data?.relations?.translations]
  );

  const pristine = useMemo(
    () =>
      JSON.stringify(openingHours) === JSON.stringify(openingHoursFromApi) &&
      JSON.stringify(openingHoursTranslations) === JSON.stringify(initialOpeningHoursTranslations),
    [initialOpeningHoursTranslations, openingHours, openingHoursFromApi, openingHoursTranslations]
  );

  const valid = useMemo(() => {
    if (openingHours?.length > 0) {
      for (let i = 0; i < openingHours.length; i += 1) {
        if (openingHours[i].attributes.from >= openingHours[i].attributes.to) {
          return false;
        }
      }
    }

    return true;
  }, [openingHours]);

  useEffect(() => {
    if (JSON.stringify(initialOpeningHours) !== JSON.stringify(openingHoursFromApi)) {
      setOpeningHoursFromApi(initialOpeningHours);
      setOpeningHours(initialOpeningHours);
      initHoursField(initialOpeningHours);
    }
  }, [initialOpeningHours, openingHoursFromApi, initHoursField]);

  useEffect(() => {
    if (
      JSON.stringify(initialOpeningHoursTranslations) !==
      JSON.stringify(openingHoursTranslationsFromApi)
    ) {
      setOpeningHoursTranslationsFromApi(initialOpeningHoursTranslations);
      setOpeningHoursTranslations(initialOpeningHoursTranslations);
    }
  }, [initialOpeningHoursTranslations, openingHoursTranslationsFromApi]);

  const renderedForm = (
    <div>
      <EntryFormHead title={t('categories.location.form.openingHours') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>{renderedHoursField}</FormItem>
      </FormGrid>
      <EntryFormHead title={t('hours.note') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          {contentLanguages.map((contentLanguage, index) => {
            const currentTranslation = getTranslation(
              contentLanguage,
              openingHoursTranslations,
              false
            );

            return (
              <Textarea
                key={index}
                label={t(languageTranslationKeys[contentLanguage]) as string}
                id={`${uid}-textarea-${index}`}
                value={currentTranslation?.attributes?.openingHours || ''}
                rows={4}
                onChange={(e) => {
                  const newTranslation = {
                    ...currentTranslation,
                    attributes: {
                      ...currentTranslation?.attributes,
                      language: contentLanguage,
                      openingHours: e.target.value,
                    },
                  };

                  setOpeningHoursTranslations([
                    ...openingHoursTranslations.slice(0, index),
                    newTranslation,
                    ...openingHoursTranslations.slice(index + 1),
                  ]);
                }}
              />
            );
          })}
        </FormItem>
      </FormGrid>
    </div>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        const openingHoursIds = openingHours?.map((openingHour) => openingHour.id);
        const deletedOpeningHours = openingHoursFromApi
          ?.filter((openingHour) => !openingHoursIds.includes(openingHour.id))
          .map((openingHour) => openingHour.id);

        if (deletedOpeningHours?.length > 0) {
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
                translations: openingHoursTranslations,
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
    reset: () => {
      setOpeningHours(initialOpeningHours);
      setOpeningHoursTranslations(initialOpeningHoursTranslations);
    },
    valid,
  };
};

const useRentForm: EntryFormHook = ({ category, query }) => {
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
      <EntryFormHead title={t('categories.location.form.rent.title') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <Input
            label={t('categories.location.form.rent.url') as string}
            placeholder={t('categories.location.form.rent.urlPlaceholder') as string}
            type={InputType.url}
            autoComplete="url"
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
                rentUrl: url,
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
    reset: () => {
      setUrl(initialUrl);
    },
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
            placeholder={t('categories.location.form.urlPlaceholder') as string}
            type={InputType.url}
            autoComplete="url"
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
    reset: () => {
      setUrl(initialUrl);
    },
    valid: true,
  };
};

const useTypeForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const [type, setType] = useState<LocationType>();
  const call = useApiCall();
  const t = useT();
  const uid = usePseudoUID();

  const [typeFromApi, setTypeFromApi] = useState<LocationType>();

  const initialType = useMemo(() => entry?.data?.attributes?.type, [entry?.data?.attributes?.type]);

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
                value: LocationType.physical,
                label: t('categories.location.form.type.physicalLabel') as string,
                children: [
                  <RadioVariantOptionParagraph key={0}>
                    {t('categories.location.form.type.physicalText')}
                  </RadioVariantOptionParagraph>,
                ],
              },
              {
                value: LocationType.virtual,
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
              attributes: { type },
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
    reset: () => {
      setType(initialType);
    },
    valid: true,
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
  const t = useT();

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
    reset: nameReset,
    requirementFulfillment: nameRequirementFulfillment,
  } = useNameForm({
    category,
    query,
    loaded,
    title: t('categories.location.form.name') as string,
    id: 'location-name',
  });

  const {
    renderedForm: descriptionForm,
    submit: descriptionSubmit,
    pristine: descriptionPristine,
    valid: descriptionValid,
    reset: descriptionReset,
    requirementFulfillment: descriptionRequirementFulfillment,
  } = useDescriptionForm({
    category,
    query,
    loaded,
    id: 'location-description',
  });

  const {
    renderedForm: addressForm,
    submit: addressSubmit,
    pristine: addressPristine,
    valid: addressValid,
    reset: addressReset,
  } = useAddressForm({
    category,
    query,
    loaded,
    district: true,
    customRequired: false,
  });

  const {
    renderedForm: arrivalForm,
    submit: arrivalSubmit,
    pristine: arrivalPristine,
    valid: arrivalValid,
    reset: arrivalReset,
  } = useArrivalForm({
    category,
    query,
    loaded,
  });

  const {
    renderedForm: typeForm,
    submit: typeSubmit,
    pristine: typePristine,
    valid: typeValid,
    value: typeValue,
    reset: typeReset,
  } = useTypeForm({
    category,
    query,
    loaded,
  });

  const {
    renderedForm: openingHoursForm,
    submit: openingHoursSubmit,
    pristine: openingHoursPristine,
    valid: openingHoursValid,
    reset: openingHoursReset,
  } = useOpeningHoursForm({
    category,
    query,
    loaded,
  });

  const {
    renderedForm: urlForm,
    submit: urlSubmit,
    pristine: urlPristine,
    valid: urlValid,
    reset: urlReset,
  } = useUrlForm({
    category,
    query,
    loaded,
  });

  const {
    renderedForm: rentForm,
    submit: rentSubmit,
    pristine: rentPristine,
    valid: rentValid,
    reset: rentReset,
  } = useRentForm({
    category,
    query,
    loaded,
  });

  useEffect(() => {
    setValid(
      ![
        nameValid,
        descriptionValid,
        typeValid,
        urlValid,
        LocationType.physical ? addressValid : true,
        LocationType.physical ? arrivalValid : true,
        LocationType.physical ? rentValid : true,
        LocationType.virtual ? openingHoursValid : true,
      ].includes(false)
    );
  }, [
    addressValid,
    arrivalValid,
    descriptionValid,
    nameValid,
    typeValid,
    urlValid,
    openingHoursValid,
    rentValid,
  ]);

  const pristine = useMemo(
    () =>
      ![
        namePristine,
        descriptionPristine,
        typePristine,
        urlPristine,
        LocationType.physical ? addressPristine : true,
        LocationType.physical ? arrivalPristine : true,
        LocationType.physical ? rentPristine : true,
        LocationType.virtual ? openingHoursPristine : true,
      ].includes(false),
    [
      namePristine,
      descriptionPristine,
      typePristine,
      addressPristine,
      arrivalPristine,
      rentPristine,
      openingHoursPristine,
      urlPristine,
    ]
  );

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    addressReset();
    arrivalReset();
    nameReset();
    descriptionReset();
    rentReset();
    openingHoursReset();
    typeReset();
    urlReset();
  });

  const formRequirementFulfillments = useMemo(
    () => [nameRequirementFulfillment, descriptionRequirementFulfillment],
    [nameRequirementFulfillment, descriptionRequirementFulfillment]
  );

  const onSave = useCallback(async () => {
    typeSubmit();
    nameSubmit();
    descriptionSubmit();
    urlSubmit();

    if (typeValue === LocationType.physical) {
      addressSubmit();
      arrivalSubmit();
      openingHoursSubmit();
      rentSubmit();
    }
  }, [
    addressSubmit,
    arrivalSubmit,
    descriptionSubmit,
    nameSubmit,
    openingHoursSubmit,
    rentSubmit,
    typeSubmit,
    typeValue,
    urlSubmit,
  ]);

  const { renderedPublish } = usePublish({
    category,
    query,
    formRequirementFulfillments,
    onPublish: onSave,
  });

  return (
    <>
      {renderedPublish}
      {renderedEntryHeader}
      <div role="tabpanel">
        <div role="form">
          <Save
            onClick={onSave}
            date={formattedDate}
            active={!pristine}
            valid={loaded === false || valid}
          />
          <EntryFormWrapper>
            <StyledEntryFormContainer>{nameForm}</StyledEntryFormContainer>
            <StyledEntryFormContainer>{typeForm}</StyledEntryFormContainer>
            {typeValue === LocationType.physical ? (
              <>
                <StyledEntryFormContainer>{addressForm}</StyledEntryFormContainer>
                <StyledEntryFormContainer>{urlForm}</StyledEntryFormContainer>
                <StyledEntryFormContainer noPadding>{arrivalForm}</StyledEntryFormContainer>
                <StyledEntryFormContainer>{openingHoursForm}</StyledEntryFormContainer>
                <StyledEntryFormContainer>{rentForm}</StyledEntryFormContainer>
              </>
            ) : (
              <StyledEntryFormContainer>{urlForm}</StyledEntryFormContainer>
            )}
            <StyledEntryFormContainer>{descriptionForm}</StyledEntryFormContainer>
          </EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
