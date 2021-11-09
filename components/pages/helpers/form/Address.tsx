import React, { useEffect, useMemo, useState } from 'react';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { Address } from '../../../../lib/api/types/address';
import { CategoryEntry, PublishedStatus } from '../../../../lib/api/types/general';
import { useDistrictList, useEntry } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { usePseudoUID } from '../../../../lib/uid';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { Input, InputType } from '../../../input';
import { Select, SelectSize } from '../../../select';
import { EntryFormHook, EntryFormHookProps } from '../form';
import { FormGrid, FormItem, FormItemWidth, FormWrapper } from '../formComponents';

interface AddressFormHookProps extends EntryFormHookProps {
  customRequired?: boolean;
  district?: boolean;
}

export const useAddressForm: EntryFormHook<AddressFormHookProps> = ({
  category,
  query,
  loaded,
  tooltip,
  customRequired,
  title,
  district,
  id,
}) => {
  const uid = usePseudoUID();
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

  const initialAddress = useMemo(
    () => entry?.data?.relations?.address,
    [entry?.data?.relations?.address]
  );

  const [address, setAddress] = useState<Address>(initialAddress);
  const [pristine, setPristine] = useState(true);
  const districtList = useDistrictList();

  const required = useMemo(
    () =>
      typeof customRequired !== 'undefined'
        ? customRequired
        : entry?.data?.attributes?.status === PublishedStatus.published,
    [entry?.data?.attributes?.status, customRequired]
  );

  const softRequired = useMemo(
    () => (typeof customRequired !== 'undefined' ? customRequired : true),
    [customRequired]
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
        (district ? address?.attributes?.district?.length > 0 : true) &&
        address?.attributes?.city?.length > 0),
    [
      loaded,
      address?.attributes?.city?.length,
      address?.attributes?.street1?.length,
      address?.attributes?.district?.length,
      address?.attributes?.zipCode?.length,
      required,
      district,
    ]
  );

  const fulfilled = useMemo(
    () =>
      !softRequired ||
      (address?.attributes?.street1?.length > 0 &&
        address?.attributes?.zipCode?.length > 0 &&
        (district ? address?.attributes?.district?.length > 0 : true) &&
        address?.attributes?.city?.length > 0),
    [
      softRequired,
      address?.attributes?.city?.length,
      address?.attributes?.street1?.length,
      address?.attributes?.district?.length,
      address?.attributes?.zipCode?.length,
      district,
    ]
  );

  return {
    renderedForm: (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <FormWrapper
          requirement={
            softRequired
              ? {
                  fulfilled,
                }
              : undefined
          }
        >
          <EntryFormHead
            title={`${title || (t('forms.address') as string)}`}
            tooltip={tooltip}
            id={id}
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
                softRequired={softRequired}
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
                softRequired={softRequired}
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
                softRequired={softRequired}
              />
            </FormItem>
            {district && (
              <FormItem width={FormItemWidth.half} alignSelf="flex-end">
                <Select
                  value={
                    address?.attributes?.district?.length > 1
                      ? address?.attributes?.district
                      : 'undefined'
                  }
                  id={`${uid}-district`}
                  label={t('categories.location.form.district') as string}
                  size={SelectSize.big}
                  required={required}
                  onChange={(e) => {
                    setPristine(false);
                    setAddress({
                      ...address,
                      attributes: {
                        ...address?.attributes,
                        district: e.target.value !== 'undefined' ? e.target.value : ' ',
                      },
                    });
                  }}
                >
                  <option value="undefined">
                    {t('categories.location.form.districtPlaceholder')}
                  </option>
                  {districtList?.map((district, index) => (
                    <option value={district.attributes.name} key={index}>
                      {district.attributes.name}
                    </option>
                  ))}
                </Select>
              </FormItem>
            )}
          </FormGrid>
        </FormWrapper>
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
    requirementFulfillment: {
      requirementKey: 'address',
      fulfilled,
    },
  };
};
