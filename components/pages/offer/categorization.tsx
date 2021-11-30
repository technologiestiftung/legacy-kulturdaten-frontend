import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  CategoryEntryPage,
  useEntry,
  useMutateList,
  useOfferMainTypeList,
} from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { WindowContext } from '../../../lib/WindowService';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { Offer } from '../../../lib/api/types/offer';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { useEntryTypeSubjectForm } from '../helpers/form/TypeSubject';
import { useEntryTags } from '../helpers/form/Tags';
import { EntryFormHook } from '../helpers/form';
import { useApiCall } from '../../../lib/api';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth, FormWrapper } from '../helpers/formComponents';
import { usePseudoUID } from '../../../lib/uid';
import { getTranslation } from '../../../lib/translations';
import { useLanguage } from '../../../lib/routing';
import { usePublish } from '../../Publish';
import { Tags } from '../../tags';
import { Tag } from '../../../lib/api/types/tag';
import { Language } from '../../../config/locale';
import { useOrganizerId } from '../../../lib/useOrganizer';
import { PublishedStatus } from '../../../lib/api/types/general';

const useOfferMainTypeForm: EntryFormHook = ({ category, query, loaded, required, id }) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const t = useT();
  const call = useApiCall();
  const [types, setTypes] = useState<Tag['id'][]>();
  const [typesFromApi, setTypesFromApi] = useState<Tag['id'][]>();
  const uid = usePseudoUID();
  const language = useLanguage();
  const organizerId = useOrganizerId();
  const mutateList = useMutateList(
    category,

    [['organizers', organizerId]]
  );

  const typeOptions = useOfferMainTypeList();

  // Valid if types and subjects are defined
  const valid = useMemo(
    () => !required || !loaded || (types?.length > 0 && types[0] !== 'undefined'),
    [required, loaded, types]
  );

  const initialTypes = useMemo(
    () => entry?.data?.relations?.mainType?.map((type) => type.id),
    [entry?.data?.relations?.mainType]
  );

  const pristine = useMemo(() => {
    if (!Array.isArray(initialTypes) || !Array.isArray(types)) {
      return true;
    }

    return JSON.stringify([...initialTypes].sort()) === JSON.stringify([...types].sort());
  }, [initialTypes, types]);

  const fulfilled = useMemo(() => types?.length > 0 && types[0] !== 'undefined', [types]);

  useEffect(() => {
    if (initialTypes) {
      if (!typesFromApi || initialTypes !== typesFromApi) {
        setTypesFromApi(initialTypes);
      }
    }
  }, [types, initialTypes, typesFromApi]);

  return {
    renderedForm: (
      <FormWrapper requirement={{ fulfilled }}>
        <EntryFormHead
          title={`${t('categories.offer.form.mainType.title')} (${t('forms.required')})`}
          id={id}
        />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>
            {typeOptions?.length > 0 && (
              <Tags
                id={`${uid}-select`}
                value={types?.length > 0 ? types : initialTypes?.length > 0 ? initialTypes : []}
                onChange={setTypes}
                i18nKeys={{
                  addButton: 'mainTypeTags.addButton',
                  addLabel: 'mainTypeTags.addLabel',
                  addPlaceholder: 'mainTypeTags.addPlaceholder',
                  listDelete: 'mainTypeTags.listDelete',
                  listLabel: 'mainTypeTags.listLabel',
                  listPlaceholder: 'mainTypeTags.listPlaceholder',
                  noMatch: 'mainTypeTags.noMatch',
                }}
                options={typeOptions?.map<Tag>((typeOption) => ({
                  id: typeOption.id,
                  type: 'tag',
                  relations: {
                    translations: [
                      {
                        id: typeOption.id,
                        type: 'TagTranslation',
                        attributes: {
                          language: Language.de,
                          name: getTranslation(language, typeOption.relations.translations, true)
                            .attributes.name,
                        },
                      },
                    ],
                  },
                }))}
              />
            )}
          </FormItem>
        </FormGrid>
      </FormWrapper>
    ),
    submit: async () => {
      if (valid && !pristine) {
        try {
          const resp = await call(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                mainType: types,
              },
            },
          });

          if (resp.status === 200) {
            mutate();
            mutateList();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    reset: () => {
      setTypes(initialTypes);
    },
    valid,
    requirementFulfillment: {
      requirementKey: 'mainType',
      fulfilled,
    },
  };
};

export const OfferCategorizationPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry } = useEntry<Offer, OfferShow>(category, query);
  const formattedDate = useSaveDate(entry);
  const t = useT();
  const renderedEntryHeader = useEntryHeader({ category, query });
  const [loaded, setLoaded] = useState(false);
  const { rendered } = useContext(WindowContext);

  const isPublished = useMemo(
    () => entry?.data?.attributes?.status === PublishedStatus.published,
    [entry?.data?.attributes?.status]
  );

  const mainTypeRequired = useMemo(
    () => isPublished || entry?.data?.relations?.mainType?.length >= 1,
    [isPublished, entry?.data?.relations?.mainType?.length]
  );

  const typeSubjectRequired = useMemo(
    () => isPublished || entry?.data?.relations?.types?.length >= 1,
    [isPublished, entry?.data?.relations?.types?.length]
  );

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const {
    renderedForm: formTypeSubject,
    submit: submitTypeSubject,
    pristine: pristineTypeSubject,
    reset: resetTypeSubject,
    valid: entryTypeSubjectValid,
    requirementFulfillment: requirementFulfillmentTypeSubject,
  } = useEntryTypeSubjectForm({
    category,
    query,
    loaded,
    title: t('categories.offer.form.topics') as string,
    required: typeSubjectRequired,
    id: 'offer-types',
  });

  const {
    renderedForm: renderedTagsForm,
    submit: submitTags,
    pristine: pristineTags,
  } = useEntryTags({ category, query, loaded, tooltip: t('categories.offer.form.topicsTooltip') });

  const {
    renderedForm: mainTypeForm,
    submit: mainTypeSubmit,
    pristine: mainTypePristine,
    valid: mainTypeValid,
    requirementFulfillment: requirementFulfillmentMainType,
    reset: resetMainType,
  } = useOfferMainTypeForm({
    category,
    query,
    loaded,
    required: mainTypeRequired,
    id: 'offer-main-type',
  });

  const pristine = useMemo(
    () => pristineTags && pristineTypeSubject && mainTypePristine,
    [mainTypePristine, pristineTypeSubject, pristineTags]
  );

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, t('save.confirmExit') as string, () => {
    resetTypeSubject();
    resetMainType();
  });

  const formRequirementFulfillments = useMemo(
    () => [requirementFulfillmentTypeSubject, requirementFulfillmentMainType],
    [requirementFulfillmentTypeSubject, requirementFulfillmentMainType]
  );

  const onSave = useCallback(async () => {
    submitTypeSubject();
    submitTags();
    mainTypeSubmit();
  }, [submitTypeSubject, submitTags, mainTypeSubmit]);

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
      <div role="form">
        <Save
          onClick={onSave}
          active={!pristine}
          date={formattedDate}
          valid={loaded !== true || (entryTypeSubjectValid && mainTypeValid)}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{mainTypeForm}</EntryFormContainer>
          <EntryFormContainer>{formTypeSubject}</EntryFormContainer>
          <EntryFormContainer>{renderedTagsForm}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
