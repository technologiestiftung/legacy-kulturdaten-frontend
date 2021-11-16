import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { EntryFormWrapper } from '../../EntryForm/wrappers';
import { locationAccessibility } from '../../../config/accessibility';
import {
  genericFormActionInit,
  GenericFormState,
  useGenericFormStructure,
} from '../../GenericForm/useGenericFormStructure';
import { EntryFormHook } from '../helpers/form';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { WindowContext } from '../../../lib/WindowService';
import { useSaveDate } from '../helpers/useSaveDate';
import { Location } from '../../../lib/api/types/location';
import { LocationShow } from '../../../lib/api/routes/location/show';
import { Save } from '../../EntryForm/Save';
import { AccessibilityField } from '../../../lib/api/types/accessibility';
import { useApiCall } from '../../../lib/api';
import {
  LocationAccessibilityUpdate,
  locationAccessibilityUpdateFactory,
} from '../../../lib/api/routes/location/accessibility/update';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { usePublish } from '../../Publish';

const useAccessibilityForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const { renderedForm, state, dispatch } = useGenericFormStructure(locationAccessibility, {});
  const call = useApiCall();
  const formRef = useRef<HTMLFormElement>(null);
  const [valid, setValid] = useState(true);

  const initialAccessibilityFields = useMemo(
    () => entry?.data?.relations?.accessibility?.relations?.fields,
    [entry?.data?.relations?.accessibility?.relations?.fields]
  );
  const [accessibilityFromApi, setAccessibilityFromApi] = useState<AccessibilityField[]>([]);

  // const [pristine, setPristine] = useState(true);

  const accessibilityFieldsState = useMemo(
    () =>
      state
        ? Object.entries(state as GenericFormState).map<AccessibilityField>(([key, value]) => {
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
      initialAccessibilityFields &&
      JSON.stringify(initialAccessibilityFields) !== JSON.stringify(accessibilityFromApi)
    ) {
      setAccessibilityFromApi(initialAccessibilityFields);

      dispatch(
        genericFormActionInit(
          initialAccessibilityFields.reduce((combined, field) => {
            return {
              ...combined,
              [field.attributes.key]: field.attributes.value,
            };
          }, {})
        )
      );
    }
  }, [accessibilityFromApi, dispatch, initialAccessibilityFields]);

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
          const resp = await call<LocationAccessibilityUpdate>(locationAccessibilityUpdateFactory, {
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

export const LocationAccessibilityPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const { entry } = useEntry<Location, LocationShow>(category, query);
  const [loaded, setLoaded] = useState(false);
  const { rendered } = useContext(WindowContext);
  const formattedDate = useSaveDate(entry);
  const t = useT();

  const { renderedForm, valid, submit, pristine, reset } = useAccessibilityForm({
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

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    reset();
  });

  const onSave = useCallback(async () => {
    submit();
  }, [submit]);

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
        <div role="form">
          <Save
            onClick={onSave}
            date={formattedDate}
            active={!pristine}
            valid={loaded === false || valid}
          />

          {renderedForm}
        </div>
      </div>
    </>
  );
};
