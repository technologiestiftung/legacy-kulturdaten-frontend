import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { EntryFormWrapper } from '../../EntryForm/wrappers';
import { offerAudience } from '../../../config/audience';
import {
  genericFormActionInit,
  GenericFormState,
  useGenericFormStructure,
} from '../../GenericForm/useGenericFormStructure';
import { EntryFormHook } from '../helpers/form';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
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

const useAudienceForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const { renderedForm, state, dispatch } = useGenericFormStructure(offerAudience, {});
  const call = useApiCall();
  const formRef = useRef<HTMLFormElement>(null);
  const [valid, setValid] = useState(true);

  const initialAudienceFields = useMemo(() => entry?.data?.relations?.audience?.relations?.fields, [
    entry?.data?.relations?.audience?.relations?.fields,
  ]);
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
      if (valid) {
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
    hint: false,
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

  const { renderedForm, valid, submit, hint, pristine } = useAudienceForm(
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
      <div role="tabpanel">
        <div role="form" aria-invalid={!valid}>
          <Save
            onClick={async () => {
              submit();
            }}
            date={formattedDate}
            active={!pristine}
            valid={loaded === false || valid}
            hint={loaded === true && hint}
          />

          {renderedForm}
        </div>
      </div>
    </>
  );
};
