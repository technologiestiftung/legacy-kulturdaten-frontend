import React, { useEffect, useMemo, useState } from 'react';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { Address } from '../../../../lib/api/types/address';
import { CategoryEntry, PublishedStatus } from '../../../../lib/api/types/general';
import { useEntry, useMutateList } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { Input, InputType } from '../../../input';
import { EntryFormHook } from '../form';
import { FormGrid, FormItem, FormItemWidth } from '../formComponents';

export const useAddressForm: EntryFormHook = (
  { category, query },
  loaded,
  showHint,
  customRequired?: boolean,
  customTitle?: string
) => {
  const { entry, mutate } = useEntry<
    {
      data: {
        relations: {
          address: Address;
        } & CategoryEntry['data']['relations'];
      } & CategoryEntry['data'];
    } & CategoryEntry,
    ApiCall
  >(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);

  const initialAddress = useMemo(
    () => entry?.data?.relations?.address,
    [entry?.data?.relations?.address]
  );

  const [address, setAddress] = useState<Address>(initialAddress);
  const [pristine, setPristine] = useState(true);

  const required = useMemo(
    () =>
      typeof customRequired !== 'undefined'
        ? customRequired
        : entry?.data?.attributes?.status === PublishedStatus.published,
    [entry?.data?.attributes?.status, customRequired]
  );

  useEffect(() => {
    if (pristine) {
      setAddress(initialAddress);
    }
  }, [pristine, initialAddress]);

  const t = useT();

  const valid = useMemo(
    () =>
      !loaded ||
      !required ||
      (address?.attributes?.street1?.length > 0 &&
        address?.attributes?.zipCode?.length > 0 &&
        address?.attributes?.city?.length > 0),
    [
      loaded,
      address?.attributes?.city?.length,
      address?.attributes?.street1?.length,
      address?.attributes?.zipCode?.length,
      required,
    ]
  );

  const hint = useMemo(
    () =>
      showHint &&
      loaded &&
      (!address?.attributes?.street1 ||
        address.attributes.street1.length < 1 ||
        !address?.attributes?.zipCode ||
        address.attributes.zipCode?.length < 1 ||
        !address?.attributes?.city ||
        address.attributes.city?.length < 1),
    [
      showHint,
      loaded,
      address?.attributes?.street1,
      address?.attributes?.zipCode,
      address?.attributes?.city,
    ]
  );

  return {
    renderedForm: (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <EntryFormHead
          title={`${customTitle || (t('forms.address') as string)}`}
          valid={valid}
          hint={hint}
        />
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('forms.street1') as string}
              type={InputType.text}
              value={address?.attributes?.street1 || ''}
              onChange={(e) => {
                setPristine(false);
                setAddress({
                  ...address,
                  attributes: {
                    ...address?.attributes,
                    street1: e.target.value,
                  },
                });
              }}
              required={required}
              hint={
                showHint &&
                (!address?.attributes?.street1 || address?.attributes?.street1.length < 1)
              }
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('forms.street2') as string}
              type={InputType.text}
              value={address?.attributes?.street2 || ''}
              onChange={(e) => {
                setPristine(false);
                setAddress({
                  ...address,
                  attributes: {
                    ...address?.attributes,
                    street2: e.target.value,
                  },
                });
              }}
            />
          </FormItem>
          <FormItem width={FormItemWidth.quarter}>
            <Input
              label={t('forms.zipCode') as string}
              type={InputType.text}
              value={address?.attributes?.zipCode || ''}
              onChange={(e) => {
                setPristine(false);
                setAddress({
                  ...address,
                  attributes: {
                    ...address?.attributes,
                    zipCode: e.target.value,
                  },
                });
              }}
              required={required}
              hint={
                showHint &&
                (!address?.attributes?.zipCode || address?.attributes?.zipCode.length < 1)
              }
            />
          </FormItem>
          <FormItem width={FormItemWidth.quarter} alignSelf="flex-end">
            <Input
              label={t('forms.city') as string}
              type={InputType.text}
              value={address?.attributes?.city || ''}
              onChange={(e) => {
                setPristine(false);
                setAddress({
                  ...address,
                  attributes: {
                    ...address?.attributes,
                    city: e.target.value,
                  },
                });
              }}
              required={required}
              hint={
                showHint && (!address?.attributes?.city || address?.attributes?.city.length < 1)
              }
            />
          </FormItem>
        </FormGrid>
      </form>
    ),
    submit: async () => {
      if (valid && !pristine) {
        try {
          const resp = await call(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                address,
              },
            },
          });

          if (resp.status === 200) {
            mutate();
            mutateList();
            setTimeout(() => setPristine(true), 500);
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    reset: () => {
      setAddress(initialAddress);
      setPristine(true);
    },
    valid,
    hint,
  };
};
