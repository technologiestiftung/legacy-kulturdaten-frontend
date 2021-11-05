import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { offerAudience } from '../../../config/audience';
import {
  genericFormActionInit,
  GenericFormState,
  useGenericFormStructure,
} from '../../GenericForm/useGenericFormStructure';
import { EntryFormHook } from '../helpers/form';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { WindowContext } from '../../../lib/WindowService';
import { useSaveDate } from '../helpers/useSaveDate';
import { Offer } from '../../../lib/api/types/offer';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { Save } from '../../EntryForm/Save';
import { AudienceField } from '../../../lib/api/types/audience';
import { useApiCall } from '../../../lib/api';
import {
  OfferAudienceUpdate,
  offerAudienceUpdateFactory,
} from '../../../lib/api/routes/offer/audience/update';
import { PeakHours } from '../../../lib/api/types/hours';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { HoursField } from '../../HoursField';
import { OfferDelete } from '../../../lib/api/routes/offer/delete';
import { OfferUpdate } from '../../../lib/api/routes/offer/update';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { usePublish } from '../../Publish';

const usePeakHoursForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const [peakHours, setPeakHours] = useState<PeakHours[]>();
  const [peakHoursFromApi, setPeakHoursFromApi] = useState<PeakHours[]>();

  const call = useApiCall();
  const t = useT();

  const initialPeakHours = useMemo(
    () => entry?.data?.relations?.peakHours,
    [entry?.data?.relations?.peakHours]
  );

  const pristine = useMemo(
    () => JSON.stringify(peakHours) === JSON.stringify(peakHoursFromApi),
    [peakHours, peakHoursFromApi]
  );

  useEffect(() => {
    if (JSON.stringify(initialPeakHours) !== JSON.stringify(peakHoursFromApi)) {
      setPeakHoursFromApi(initialPeakHours);
      setPeakHours(initialPeakHours);
    }
  }, [initialPeakHours, peakHoursFromApi]);

  const renderedForm = (
    <div>
      <EntryFormHead title={t('categories.offer.form.peakHours') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <HoursField
            i18nKeys={{ addButton: 'peakHours.add' }}
            hours={peakHours || []}
            onChange={(updatedPeakHours) => setPeakHours(updatedPeakHours)}
          />
        </FormItem>
      </FormGrid>
    </div>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        const peakHoursIds = peakHours?.map((peakHour) => peakHour.id);
        const deletedPeakHours = peakHoursFromApi
          ?.filter((peakHour) => !peakHoursIds.includes(peakHour.id))
          .map((peakHour) => peakHour.id);

        if (deletedPeakHours?.length > 0) {
          try {
            await call<OfferDelete>(category.api.delete.factory, {
              id: entry.data.id,
              entry: {
                relations: {
                  peakHours: deletedPeakHours,
                },
              },
            });
          } catch (e) {
            console.error(e);
          }
        }

        try {
          const resp = await call<OfferUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                peakHours,
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
  };
};

const useAudienceForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const { renderedForm, state, dispatch } = useGenericFormStructure(offerAudience, {});
  const call = useApiCall();
  const formRef = useRef<HTMLFormElement>(null);
  const [valid, setValid] = useState(true);

  const initialAudienceFields = useMemo(
    () => entry?.data?.relations?.audience?.relations?.fields,
    [entry?.data?.relations?.audience?.relations?.fields]
  );
  const [accessibilityFromApi, setAudienceFromApi] = useState<AudienceField[]>([]);

  // const [pristine, setPristine] = useState(true);

  const accessibilityFieldsState = useMemo(
    () =>
      state
        ? Object.entries(state as GenericFormState).map<AudienceField>(([key, value]) => {
            const type =
              typeof value === 'number'
                ? 'number'
                : typeof value === 'string'
                ? 'string'
                : typeof value === 'boolean'
                ? 'boolean'
                : Array.isArray(value)
                ? 'string'
                : 'string';

            return {
              attributes: {
                type,
                key,
                value: String(value),
              },
            };
          })
        : [],
    [state]
  );

  useEffect(() => {
    if (
      initialAudienceFields &&
      JSON.stringify(initialAudienceFields) !== JSON.stringify(accessibilityFromApi)
    ) {
      setAudienceFromApi(initialAudienceFields);

      dispatch(
        genericFormActionInit(
          initialAudienceFields.reduce((combined, field) => {
            return {
              ...combined,
              [field.attributes.key]: field.attributes.value,
            };
          }, {})
        )
      );
    }
  }, [accessibilityFromApi, dispatch, initialAudienceFields]);

  useEffect(() => {
    if (accessibilityFieldsState) {
      setValid(formRef?.current ? formRef?.current?.checkValidity() : true);
    }
  }, [accessibilityFieldsState]);

  const pristine = useMemo(
    () =>
      JSON.stringify(
        accessibilityFromApi
          .map((field) => ({
            attributes: {
              key: field.attributes.key,
              value: field.attributes.value,
            },
          }))
          .sort((a, b) => {
            if (a.attributes.key > b.attributes.key) {
              return 1;
            } else if (a.attributes.key > b.attributes.key) {
              return -1;
            }
            return 0;
          })
      ) ===
      JSON.stringify(
        accessibilityFieldsState
          .map((field) => ({
            attributes: {
              key: field.attributes.key,
              value: field.attributes.value,
            },
          }))
          .sort((a, b) => {
            if (a.attributes.key > b.attributes.key) {
              return 1;
            } else if (a.attributes.key > b.attributes.key) {
              return -1;
            }
            return 0;
          })
      ),
    [accessibilityFieldsState, accessibilityFromApi]
  );

  return {
    renderedForm: (
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <EntryFormWrapper>{renderedForm}</EntryFormWrapper>
      </form>
    ),
    submit: async () => {
      if (valid && !pristine) {
        try {
          const resp = await call<OfferAudienceUpdate>(offerAudienceUpdateFactory, {
            id: entry.data.id,
            entry: {
              relations: {
                fields: accessibilityFieldsState,
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
    valid,
    reset: () => undefined,
    state,
  };
};

export const OfferAudiencePage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const { entry } = useEntry<Offer, OfferShow>(category, query);
  const [loaded, setLoaded] = useState(false);
  const { rendered } = useContext(WindowContext);
  const formattedDate = useSaveDate(entry);
  const [valid, setValid] = useState(true);
  const t = useT();

  const {
    renderedForm: audienceForm,
    valid: audienceValid,
    submit: audienceSubmit,
    pristine: audiencePristine,
  } = useAudienceForm({ category, query, loaded });

  const {
    renderedForm: peakHoursForm,
    submit: peakHoursSubmit,
    pristine: peakHoursPristine,
    valid: peakHoursValid,
    reset: peakHoursReset,
  } = usePeakHoursForm({
    category,
    query,
    loaded,
  });

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  useEffect(() => {
    setValid(![audienceValid, peakHoursValid].includes(false));
  }, [audienceValid, peakHoursValid]);

  const pristine = useMemo(
    () => ![audiencePristine, peakHoursPristine].includes(false),
    [audiencePristine, peakHoursPristine]
  );

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    peakHoursReset();
  });

  const onSave = useCallback(async () => {
    audienceSubmit();
    peakHoursSubmit();
  }, [audienceSubmit, peakHoursSubmit]);

  const { renderedPublish } = usePublish({
    category,
    query,
    onPublish: onSave,
  });

  return (
    <>
      {renderedPublish}
      {renderedEntryHeader}
      <div role="tabpanel">
        <div role="form" aria-invalid={!valid}>
          <Save
            onClick={onSave}
            date={formattedDate}
            active={!pristine}
            valid={loaded === false || valid}
          />

          {audienceForm}
          <EntryFormWrapper>
            <EntryFormContainer>{peakHoursForm}</EntryFormContainer>
          </EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
