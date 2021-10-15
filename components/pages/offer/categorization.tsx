import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CategoryEntryPage, useEntry, useOfferMainTypeList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { WindowContext } from '../../../lib/WindowService';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { Offer, OfferMainType } from '../../../lib/api/types/offer';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { useEntryTypeSubjectForm } from '../helpers/form/TypeSubject';
import { useEntryTags } from '../helpers/form/Tags';
import { EntryFormHook } from '../helpers/form';
import { useApiCall } from '../../../lib/api';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { Select } from '../../select';
import { usePseudoUID } from '../../../lib/uid';
import { getTranslation } from '../../../lib/translations';
import { useLanguage } from '../../../lib/routing';

const useOfferMainTypeForm: EntryFormHook = ({ category, query }, loaded) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const t = useT();
  const call = useApiCall();
  const [types, setTypes] = useState<string[]>([]);
  const [typesFromApi, setTypesFromApi] = useState<string[]>([]);
  const uid = usePseudoUID();
  const language = useLanguage();

  const typeOptions = useOfferMainTypeList();

  // Valid if types and subjects are defined
  const valid = useMemo(() => {
    return !loaded || (types && types.length > 0);
  }, [loaded, types]);

  const initialTypes = useMemo(
    () => entry?.data?.relations?.mainType?.map((type) => String(type.id)),
    [entry?.data?.relations?.mainType]
  );

  const pristine = useMemo(
    () => JSON.stringify(initialTypes) === JSON.stringify(types),
    [initialTypes, types]
  );

  useEffect(() => {
    if (pristine) {
      setTypes(initialTypes);
    }
  }, [pristine, initialTypes]);

  return {
    renderedForm: (
      <div>
        <EntryFormHead title={t('forms.classification') as string} valid={!loaded || valid} />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>
            {typeOptions?.length > 0 && (
              <Select
                value={types[0] || initialTypes[0] || ''}
                id={`${uid}-select`}
                onChange={(e) => setTypes([e.target.value])}
              >
                <option key={'-1'} value="undefined">
                  auswählen
                </option>
                {typeOptions.map((typeOption, typeOptionIndex) => {
                  const currentTranslation = getTranslation(
                    language,
                    typeOption.relations.translations,
                    true
                  );

                  return (
                    <option key={typeOptionIndex} value={String(typeOption.id)}>
                      {currentTranslation.attributes.name}
                    </option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </FormGrid>
      </div>
    ),
    submit: async () => {
      try {
        const resp = await call(category.api.update.factory, {
          id: entry.data.id,
          entry: {
            relations: {
              mainType: types.map((type) => parseInt(type, 10)),
            },
          },
        });

        if (resp.status === 200) {
          mutate();
        }
      } catch (e) {
        console.error(e);
      }
    },
    pristine,
    reset: () => {
      setTypes(initialTypes);
    },
    valid,
    hint: false,
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

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const {
    renderedForm,
    submit,
    pristine: pristineClassification,
    reset,
    valid,
  } = useEntryTypeSubjectForm({ category, query }, loaded, false);

  const {
    renderedForm: renderedTagsForm,
    submit: submitTags,
    pristine: pristineTags,
  } = useEntryTags({ category, query }, loaded, false);

  const {
    renderedForm: mainTypeForm,
    submit: mainTypeSubmit,
    pristine: mainTypePristine,
  } = useOfferMainTypeForm({ category, query }, loaded, false);

  const shouldWarn = useMemo(
    () => !pristineClassification && typeof entry?.data !== 'undefined',
    [pristineClassification, entry?.data]
  );

  useConfirmExit(shouldWarn, t('save.confirmExit') as string, () => reset());

  return (
    <>
      {renderedEntryHeader}
      <div role="form">
        <Save
          onClick={async () => {
            if (!pristineClassification) {
              submit();
            }
            if (!pristineTags) {
              submitTags();
            }
            if (!mainTypePristine) {
              mainTypeSubmit();
            }
          }}
          active={!pristineTags || !pristineClassification || !mainTypePristine}
          date={formattedDate}
          valid={loaded !== true || valid}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{mainTypeForm}</EntryFormContainer>
          <EntryFormContainer>{renderedTagsForm}</EntryFormContainer>
          <EntryFormContainer>{renderedForm}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
