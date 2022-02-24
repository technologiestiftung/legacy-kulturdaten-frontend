import { useEffect, useMemo, useRef, useState } from 'react';
import { useApiCall } from '../../../../lib/api';
import { useEntry } from '../../../../lib/categories';
import { EntryFormHook } from '../form';
import { locationArrival } from '../../../../config/arrival';
import {
  genericFormActionInit,
  GenericFormState,
  useGenericFormStructure,
} from '../../../GenericForm/useGenericFormStructure';
import { Location } from '../../../../lib/api/types/location';
import { LocationShow } from '../../../../lib/api/routes/location/show';
import { ServiceField } from '../../../../lib/api/types/service';
import {
  LocationServiceUpdate,
  locationServiceUpdateFactory,
} from '../../../../lib/api/routes/location/service/update';

export const useArrivalForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const { renderedForm, state, dispatch } = useGenericFormStructure(locationArrival, {});
  const call = useApiCall();
  const formRef = useRef<HTMLFormElement>(null);
  const [valid, setValid] = useState(true);

  const initialServiceFields = useMemo(
    () => entry?.data?.relations?.service?.relations?.fields,
    [entry?.data?.relations?.service?.relations?.fields]
  );
  const [serviceFromApi, setServiceFromApi] = useState<ServiceField[]>([]);

  const serviceFieldsState = useMemo(
    () =>
      state
        ? Object.entries(state as GenericFormState).map<ServiceField>(([key, value]) => {
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
      initialServiceFields &&
      JSON.stringify(initialServiceFields) !== JSON.stringify(serviceFromApi)
    ) {
      setServiceFromApi(initialServiceFields);

      dispatch(
        genericFormActionInit(
          initialServiceFields.reduce((combined, field) => {
            return {
              ...combined,
              [field.attributes.key]: field.attributes.value,
            };
          }, {})
        )
      );
    }
  }, [serviceFromApi, dispatch, initialServiceFields]);

  useEffect(() => {
    if (serviceFieldsState) {
      setValid(formRef?.current ? formRef?.current?.checkValidity() : true);
    }
  }, [serviceFieldsState]);

  const pristine = useMemo(
    () =>
      JSON.stringify(
        serviceFromApi
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
        serviceFieldsState
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
    [serviceFieldsState, serviceFromApi]
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
        {renderedForm}
      </form>
    ),
    submit: async () => {
      if (valid) {
        try {
          const resp = await call<LocationServiceUpdate>(locationServiceUpdateFactory, {
            id: entry.data.id,
            entry: {
              relations: {
                fields: serviceFieldsState,
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
