import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { EntryFormWrapper } from '../../EntryForm/wrappers';
import { locationAccessibility } from '../../../config/accessibility';
import {
  a11yActionInit,
  A11yState,
  useAccessibilityStructure,
} from '../../Accessibility/useAccessibilityStructure';
import { EntryFormHook } from '../helpers/form';
import { useContext, useEffect, useMemo, useState } from 'react';
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

const useAccessibilityForm: EntryFormHook = ({ category, query }, loaded) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const { renderedForm, state, dispatch } = useAccessibilityStructure(locationAccessibility, {});
  const call = useApiCall();

  const initialAccessibilityFields = useMemo(
    () => entry?.data?.relations?.accessibility?.relations?.fields,
    [entry?.data?.relations?.accessibility?.relations?.fields]
  );
  const [accessibilityFromApi, setAccessibilityFromApi] = useState<AccessibilityField[]>([]);

  // const [pristine, setPristine] = useState(true);

  const accessibilityFieldsState = useMemo(
    () =>
      state
        ? Object.entries(state as A11yState).map<AccessibilityField>(([key, value]) => {
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
                value: Array.isArray(value) ? `[${value.toString()}]` : String(value),
              },
            };
          })
        : [],
    [state]
  );

  useEffect(() => {
    console.log('ejo');
    if (
      initialAccessibilityFields &&
      JSON.stringify(initialAccessibilityFields) !== JSON.stringify(accessibilityFromApi)
    ) {
      setAccessibilityFromApi(initialAccessibilityFields);

      const transformed = initialAccessibilityFields.reduce((combined, field) => {
        console.log(combined, field);
        return {
          ...combined,
          [field.attributes.key]:
            field.attributes.value?.charAt(0) === '[' &&
            field.attributes.value?.charAt(field.attributes.value.length - 1) === ']'
              ? field.attributes.value.replace('[', '').replace(']', '').split(',')
              : field.attributes.value,
        };
      }, {});

      console.log(transformed);

      dispatch(a11yActionInit(transformed));
    }
  }, [accessibilityFromApi, dispatch, initialAccessibilityFields]);

  // useEffect(() => {
  //   if (pristine && accessibilityFieldsState) {
  //     setPristine(false);
  //   }
  // }, [pristine, accessibilityFieldsState]);

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
    renderedForm,
    submit: async () => {
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
    },
    pristine,
    valid: true,
    reset: () => undefined,
    hint: false,
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

  const { renderedForm, valid, submit, hint, pristine } = useAccessibilityForm(
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
          <EntryFormWrapper>{renderedForm}</EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
