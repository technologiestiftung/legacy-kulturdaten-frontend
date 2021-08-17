import { useEffect, useMemo, useState } from 'react';
import { Language } from '../../../config/locale';
import { useApiCall } from '../../../lib/api';
import { Address } from '../../../lib/api/types/address';
import { PublishedStatus } from '../../../lib/api/types/general';
import { Location, LocationTranslation } from '../../../lib/api/types/location';
import { CategoryEntryPage, useEntry, useMutateList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { Button, ButtonColor, ButtonType } from '../../button';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { Input, InputType } from '../../input';
import { useName } from '../helpers/form/Name';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { LocationShow } from '../../../lib/api/routes/location/show';
import { EntryFormProps } from '../helpers/form';
import { LocationTranslationCreate } from '../../../lib/api/routes/location/translation/create';
import { LocationUpdate } from '../../../lib/api/routes/location/update';
import { Select } from '../../select';
import { useEntryHeader } from '../helpers/useEntryHeader';

const NameForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
  } = useName<Location, LocationShow, LocationTranslation, LocationTranslationCreate>({
    category,
    query,
    language: Language.de,
    label: t('categories.location.form.nameGerman') as string,
  });

  const {
    form: setNameEnglish,
    onSubmit: onSubmitEnglish,
    pristine: pristineEnglish,
    reset: resetEnglish,
  } = useName<Location, LocationShow, LocationTranslation, LocationTranslationCreate>({
    category,
    query,
    language: Language.en,
    label: t('categories.location.form.nameEnglish') as string,
  });

  return (
    <div>
      <EntryFormHead
        title={t('categories.location.form.name') as string}
        actions={[
          <Button
            key={0}
            onClick={() => {
              resetGerman();
              resetEnglish();
            }}
            disabled={pristineEnglish && pristineGerman}
            icon="XOctagon"
            color={ButtonColor.yellow}
          >
            {t('categories.location.form.editCancel')}
          </Button>,
          <Button
            key={1}
            icon="CheckSquare"
            color={ButtonColor.green}
            onClick={() => {
              onSubmitEnglish();
              onSubmitGerman();
            }}
            disabled={pristineEnglish && pristineGerman}
          >
            {t('categories.location.form.save')}
          </Button>,
        ]}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>{setNameGerman}</FormItem>
        <FormItem width={FormItemWidth.half}>{setNameEnglish}</FormItem>
      </FormGrid>
    </div>
  );
};

const AddressForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);

  const initialAddress = useMemo(() => entry?.data?.relations?.address, [
    entry?.data?.relations?.address,
  ]);

  const [address, setAddress] = useState<Address>(initialAddress);
  const [pristine, setPristine] = useState(true);

  const required = useMemo(() => entry?.data?.attributes?.status === PublishedStatus.published, [
    entry?.data?.attributes?.status,
  ]);

  useEffect(() => {
    if (pristine) {
      setAddress(initialAddress);
    }
  }, [pristine, initialAddress]);

  const t = useT();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          const resp = await call<LocationUpdate>(category.api.update.factory, {
            id: entry.data.id,
            location: {
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
      }}
    >
      <EntryFormHead
        title={t('categories.location.form.address') as string}
        actions={[
          <Button
            key={0}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setAddress(initialAddress);
              setPristine(true);
            }}
            icon="XOctagon"
            color={ButtonColor.yellow}
            disabled={pristine}
          >
            {t('categories.location.form.editCancel')}
          </Button>,
          <Button
            key={1}
            type={ButtonType.submit}
            icon="CheckSquare"
            color={ButtonColor.green}
            disabled={pristine}
          >
            {t('categories.location.form.save')}
          </Button>,
        ]}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.location.form.street1') as string}
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
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.location.form.street2') as string}
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
            label={t('categories.location.form.zipCode') as string}
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
          />
        </FormItem>
        <FormItem width={FormItemWidth.quarter} alignSelf="flex-end">
          <Input
            label={t('categories.location.form.city') as string}
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
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Select
            disabled
            label={t('categories.location.form.district') as string}
            id="tbd-district"
          >
            <option>tbd</option>
          </Select>
        </FormItem>
      </FormGrid>
    </form>
  );
};

export const LocationInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });

  return (
    <>
      {renderedEntryHeader}
      <EntryFormWrapper>
        <EntryFormContainer>
          <NameForm category={category} query={query} />
        </EntryFormContainer>
        <EntryFormContainer>
          <AddressForm category={category} query={query} />
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};
