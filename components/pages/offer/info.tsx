import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useNameForm } from '../helpers/form/Name';
import { FormContainer, FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { Location } from '../../../lib/api/types/location';
import { Offer, OfferTranslation } from '../../../lib/api/types/offer';
import { Language, languageTranslationKeys } from '../../../config/locales';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { EntryPicker } from '../../EntryPicker';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { getTranslation } from '../../../lib/translations';
import { useLanguage } from '../../../lib/routing';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Categories } from '../../../config/categories';
import { LocationList } from '../../EntryList/LocationList';
import { Save } from '../../EntryForm/Save';
import { useSaveDate } from '../helpers/useSaveDate';
import { useDescriptionForm } from '../helpers/form/Description';
import { EntryFormHook } from '../helpers/form';
import { useApiCall } from '../../../lib/api';
import { OfferUpdate } from '../../../lib/api/routes/offer/update';
import { usePseudoUID } from '../../../lib/uid';
import { Input, InputType } from '../../input';
import { contentLanguages } from '../../../config/locales';
import { useLinksForm } from '../helpers/form/Links';
import { RadioList } from '../../Radio/RadioList';
import { useTeaserForm } from '../helpers/form/Teaser';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { usePublish } from '../../Publish';

const useRoomForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const [translations, setTranslations] = useState<OfferTranslation[]>();
  const call = useApiCall();
  const t = useT();

  const [translationsFromApi, setTranslationsFromApi] = useState<OfferTranslation[]>();

  const initialTranslations = useMemo(
    () => entry?.data?.relations?.translations,
    [entry?.data?.relations?.translations]
  );

  const pristine = useMemo(
    () => JSON.stringify(translations) === JSON.stringify(translationsFromApi),
    [translations, translationsFromApi]
  );

  useEffect(() => {
    if (JSON.stringify(initialTranslations) !== JSON.stringify(translationsFromApi)) {
      setTranslationsFromApi(initialTranslations);
      setTranslations(initialTranslations);
    }
  }, [initialTranslations, translationsFromApi]);

  const renderedForm = (
    <FormContainer>
      <EntryFormHead
        title={t('categories.offer.form.locationInfo') as string}
        tooltip={t('categories.offer.form.locationInfoTooltip') as string}
      />
      <FormGrid>
        {contentLanguages.map((language: Language, index) => {
          const currentTranslation = translations
            ? getTranslation<OfferTranslation>(language, translations, false)
            : undefined;

          return (
            <FormItem width={FormItemWidth.half} key={index}>
              <Input
                label={t(languageTranslationKeys[language]) as string}
                ariaLabel={`${t('date.roomInfo')} ${t(languageTranslationKeys[language])}`}
                value={currentTranslation?.attributes?.roomDescription || ''}
                type={InputType.text}
                placeholder={`${t('categories.offer.form.locationInfoPlaceholder')} (${t(
                  languageTranslationKeys[language]
                )})`}
                onChange={(e) => {
                  const updatedTranslation = {
                    ...currentTranslation,
                    attributes: {
                      ...currentTranslation?.attributes,
                      language,
                      roomDescription: e.target.value,
                    },
                  };

                  const filteredTranslations =
                    translations?.filter(
                      (translation) => translation.attributes?.language !== language
                    ) || [];

                  setTranslations([...filteredTranslations, updatedTranslation]);
                }}
              />
            </FormItem>
          );
        })}
      </FormGrid>
    </FormContainer>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<OfferUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                translations: translations?.length > 0 ? translations : undefined,
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
      setTranslations(initialTranslations);
    },
    valid: true,
  };
};

const usePricingForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const [attributes, setAttributes] = useState<Offer['data']['attributes']>();
  const call = useApiCall();
  const t = useT();
  const uid = usePseudoUID();

  const [attributesFromApi, setAttributesFromApi] = useState<Offer['data']['attributes']>();

  const initialAttributes = useMemo(() => entry?.data?.attributes, [entry?.data?.attributes]);

  const pristine = useMemo(
    () => JSON.stringify(attributes) === JSON.stringify(attributesFromApi),
    [attributes, attributesFromApi]
  );

  useEffect(() => {
    if (JSON.stringify(initialAttributes) !== JSON.stringify(attributesFromApi)) {
      setAttributesFromApi(initialAttributes);
      setAttributes(initialAttributes);
    }
  }, [initialAttributes, attributesFromApi]);

  const renderedForm = (
    <FormContainer>
      <EntryFormHead title={t('categories.offer.form.pricing.title') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <RadioList
            name={`${uid}-fee`}
            id={`${uid}-fee`}
            label={t('categories.offer.form.pricing.feeLabel') as string}
            options={[
              { label: t('categories.offer.form.pricing.hasFee') as string, value: 'has-fee' },
              { label: t('categories.offer.form.pricing.noFee') as string, value: 'no-fee' },
            ]}
            value={attributes?.hasFee ? 'has-fee' : 'no-fee'}
            onChange={(value) =>
              setAttributes({ ...attributes, hasFee: value === 'has-fee' ? true : false })
            }
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <RadioList
            name={`${uid}-registration`}
            id={`${uid}-registration`}
            label={t('categories.offer.form.pricing.registrationLabel') as string}
            options={[
              {
                label: t('categories.offer.form.pricing.needsRegistration') as string,
                value: 'needs-registration',
              },
              {
                label: t('categories.offer.form.pricing.noRegistration') as string,
                value: 'no-registration',
              },
            ]}
            value={attributes?.needsRegistration ? 'needs-registration' : 'no-registration'}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                needsRegistration: value === 'needs-registration' ? true : false,
              })
            }
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Input
            type={InputType.url}
            label={t('categories.offer.form.pricing.ticketUrl') as string}
            value={attributes?.ticketUrl || ''}
            placeholder={t('categories.offer.form.pricing.ticketUrlPlaceholder') as string}
            onChange={(e) => setAttributes({ ...attributes, ticketUrl: e.target.value })}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Input
            type={InputType.url}
            label={t('categories.offer.form.pricing.registrationUrl') as string}
            value={attributes?.registrationUrl || ''}
            placeholder={t('categories.offer.form.pricing.registrationUrlPlaceholder') as string}
            onChange={(e) => setAttributes({ ...attributes, registrationUrl: e.target.value })}
          />
        </FormItem>
      </FormGrid>
    </FormContainer>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<OfferUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              attributes,
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
      setAttributes(initialAttributes);
    },
    valid: true,
  };
};

const useOrganizerLocationForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const [locationIds, setLocationIds] = useState<string[]>();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const language = useLanguage();
  const call = useApiCall();
  const t = useT();
  const translation = getTranslation(language, entry?.data?.relations?.translations, true);

  const [locationIdsFromApi, setLocationIdsFromApi] = useState<string[]>();
  const initialLocationIds = useMemo(
    () => (entry?.data?.relations?.locations as Location['data'][])?.map(({ id }) => id),
    [entry?.data?.relations?.locations]
  );

  const pristine = useMemo(
    () => locationIds?.toString() === locationIdsFromApi?.toString(),
    [locationIdsFromApi, locationIds]
  );

  useEffect(() => {
    if (initialLocationIds?.toString() !== locationIdsFromApi?.toString()) {
      setLocationIdsFromApi(initialLocationIds);
      setLocationIds(initialLocationIds);
    }
  }, [initialLocationIds, locationIdsFromApi]);

  const renderedForm = (
    <div>
      <EntryFormHead title={t('categories.offer.form.location.label') as string} />
      <FormGrid>
        {locationIds?.map((locationId, index) => (
          <FormItem
            width={locationIds?.length > 1 ? FormItemWidth.half : FormItemWidth.full}
            key={index}
          >
            <EntryPicker
              chooseText={t('categories.offer.form.location.choose') as string}
              editText={t('categories.offer.form.location.edit') as string}
              overlayTitle={
                t('categories.offer.form.location.title', {
                  name: translation?.attributes?.name,
                }) as string
              }
              value={locationId}
              onChange={(value) =>
                setLocationIds(
                  value
                    ? [...locationIds.slice(0, index), value, ...locationIds.slice(index + 1)]
                    : locationIds.filter((id) => id !== locationId)
                )
              }
              categoryName={Categories.location}
              list={
                <LocationList
                  expanded={isMidOrWider}
                  expandable={false}
                  enableUltraWideLayout={false}
                  activeEntryId={locationId}
                  showAllLocationsSwitch={true}
                  hideExport
                  chosenEntryIds={locationIds}
                />
              }
              remove={{
                onRemove: () => setLocationIds(locationIds.filter((id) => id !== locationId)),
                text: t('categories.offer.form.location.remove') as string,
              }}
            />
          </FormItem>
        ))}
        {locationIds.length < 10 && (
          <FormItem width={FormItemWidth.full}>
            <EntryPicker
              chooseText={
                t(
                  locationIds?.length > 0
                    ? 'categories.offer.form.location.chooseAdditional'
                    : 'categories.offer.form.location.choose'
                ) as string
              }
              editText={t('categories.offer.form.location.edit') as string}
              overlayTitle={
                t('categories.offer.form.location.title', {
                  name: translation?.attributes?.name,
                }) as string
              }
              value={undefined}
              onChange={(value) =>
                setLocationIds(
                  value ? (locationIds ? [...locationIds, value] : [value]) : locationIds
                )
              }
              categoryName={Categories.location}
              list={
                <LocationList
                  expanded={isMidOrWider}
                  expandable={false}
                  enableUltraWideLayout={false}
                  activeEntryId={undefined}
                  showAllLocationsSwitch={true}
                  hideExport
                  chosenEntryIds={locationIds}
                />
              }
            />
          </FormItem>
        )}
      </FormGrid>
    </div>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<OfferUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                locations: locationIds,
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
      setLocationIds(initialLocationIds);
    },
    valid: true,
  };
};

export const OfferInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const { entry } = useEntry<Offer, OfferShow>(category, query);
  const t = useT();

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
    renderedForm: organizerLocationForm,
    submit: organizerLocationSubmit,
    pristine: organizerLocationPristine,
    valid: organizerLocationValid,
    reset: organizerLocationReset,
  } = useOrganizerLocationForm({
    category,
    query,
    loaded,
  });

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
    title: t('categories.offer.form.name') as string,
    id: 'offer-name',
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
    id: 'offer-description',
  });

  const {
    renderedForm: teaserForm,
    submit: teaserSubmit,
    pristine: teaserPristine,
    valid: teaserValid,
    reset: teaserReset,
  } = useTeaserForm({
    category,
    query,
    loaded,
  });

  const {
    renderedForm: pricingForm,
    submit: pricingSubmit,
    pristine: pricingPristine,
    valid: pricingValid,
    reset: pricingReset,
  } = usePricingForm({
    category,
    query,
    loaded,
  });

  const {
    renderedForm: roomForm,
    submit: roomSubmit,
    pristine: roomPristine,
    valid: roomValid,
    reset: roomReset,
  } = useRoomForm({
    category,
    query,
    loaded,
  });

  const {
    renderedForm: linksForm,
    submit: linksSubmit,
    pristine: linksPristine,
    valid: linksValid,
    reset: linksReset,
  } = useLinksForm({
    category,
    query,
    loaded,
  });

  useEffect(() => {
    setValid(
      ![
        nameValid,
        pricingValid,
        roomValid,
        descriptionValid,
        teaserValid,
        linksValid,
        organizerLocationValid,
      ].includes(false)
    );
  }, [
    pricingValid,
    roomValid,
    descriptionValid,
    teaserValid,
    linksValid,
    nameValid,
    organizerLocationValid,
  ]);

  const pristine = useMemo(
    () =>
      ![
        namePristine,
        organizerLocationPristine,
        descriptionPristine,
        teaserPristine,
        pricingPristine,
        roomPristine,
        linksPristine,
      ].includes(false),
    [
      namePristine,
      descriptionPristine,
      teaserPristine,
      organizerLocationPristine,
      pricingPristine,
      roomPristine,
      linksPristine,
    ]
  );

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    linksReset();
    nameReset();
    descriptionReset();
    organizerLocationReset();
    pricingReset();
    roomReset();
    teaserReset();
  });

  const formRequirementFulfillments = useMemo(
    () => [nameRequirementFulfillment, descriptionRequirementFulfillment],
    [nameRequirementFulfillment, descriptionRequirementFulfillment]
  );

  const onSave = useCallback(async () => {
    nameSubmit();
    descriptionSubmit();
    teaserSubmit();
    organizerLocationSubmit();
    pricingSubmit();
    roomSubmit();
    linksSubmit();
  }, [
    descriptionSubmit,
    linksSubmit,
    nameSubmit,
    organizerLocationSubmit,
    pricingSubmit,
    roomSubmit,
    teaserSubmit,
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
            <EntryFormContainer>{nameForm}</EntryFormContainer>
            <EntryFormContainer>{organizerLocationForm}</EntryFormContainer>
            <EntryFormContainer>{roomForm}</EntryFormContainer>
            <EntryFormContainer>{teaserForm}</EntryFormContainer>
            <EntryFormContainer>{descriptionForm}</EntryFormContainer>
            <EntryFormContainer>{pricingForm}</EntryFormContainer>
            <EntryFormContainer>{linksForm}</EntryFormContainer>
          </EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
