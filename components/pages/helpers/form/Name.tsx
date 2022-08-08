import { ParsedUrlQuery } from 'node:querystring';
import { FormEvent, useEffect, useMemo, useState, RefObject } from 'react';
import { EntryFormHook } from '.';
import { Categories, locationNameRef, offerNameRef } from '../../../../config/categories';
import { defaultLanguage, Language } from '../../../../config/locale';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { CategoryEntry, PublishedStatus, Translation } from '../../../../lib/api/types/general';
import { Category, useEntry, useMutateList } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { getTranslation } from '../../../../lib/translations';
import { useOrganizerId } from '../../../../lib/useOrganizer';
import { Input, InputType } from '../../../input';
import { useUser } from '../../../user/useUser';
import { FormGrid, FormItem, FormItemWidth, FormWrapper, FormRequiredInfo, Anchor } from '../formComponents';
import { organizerNameRef } from '../../../../config/categories';
import React from 'react';

const defaultMaxLength = 100;

interface SetNameProps {
  label: string;
  ariaLabel?: string;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  value: string;
  setValue: (value: string) => void;
  name: string;
  required?: boolean;
  softRequired?: boolean;
  valid?: boolean;
  hint?: boolean;
  tooltip?: string;
  id?: string;
  placeholder?: string;
}

// eslint-disable-next-line react/display-name
const Name = React.forwardRef<HTMLElement, SetNameProps>(
  (props: SetNameProps, ref: RefObject<HTMLInputElement>) => {
  // set initial value
  useEffect(() => {
    if (props.pristine) {
      props.setValue(props.name);
    }
  }, [props]);

  return (
    <form onSubmit={props.onSubmit}>
      <Anchor id={props.id}/>
      <Input
        label={props.label}
        ariaLabel={props.ariaLabel}
        type={InputType.text}
        ref={ref}
        placeholder={props.placeholder}
        value={props.value || ''}
        onChange={(e) => {
          props.setValue(e.target.value);
        }}
        required={props.required}
        hint={props.hint}
        softRequired={props.softRequired}
        maxLength={defaultMaxLength}
        tooltip={props.tooltip}
      />
      {props.required && <FormRequiredInfo fulfilled={props.value !== ''}/>}
    </form>
  );
});

export const useName = <
  EntryType extends CategoryEntry,
  EntryShowCallType extends ApiCall,
  TranslationType extends Translation
>(props: {
  category: Category;
  query: ParsedUrlQuery;
  language: Language;
  label: string;
  ariaLabel?: string;
  loaded: boolean;
  tooltip?: any;
  id?: string;
  placeholder?: string;
}): {
  form: React.ReactElement;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  reset: () => void;
  valid: boolean;
  value: string;
  organizerInternalContactRef?: RefObject<unknown>;
} => {
  const { category, query, language, label, ariaLabel, tooltip } = props;

  const { entry, mutate } = useEntry<EntryType, EntryShowCallType>(category, query);
  const isPublished = useMemo(
    () => entry?.data?.attributes?.status === PublishedStatus.published,
    [entry?.data?.attributes?.status]
  );

  const organizerId = useOrganizerId();
  const mutateList = useMutateList(
    category,
    category.name === Categories.location
      ? [['organizer', organizerId]]
      : category.name === Categories.offer
      ? [['organizers', organizerId]]
      : undefined
  );
  const call = useApiCall();
  const entryTranslation = getTranslation<TranslationType>(
    language,
    entry?.data?.relations?.translations as TranslationType[],
    false
  );
  const name = useMemo(
    () => entryTranslation?.attributes?.name,
    [entryTranslation?.attributes?.name]
  );
  const [value, setValue] = useState(name || '');
  const [valueFromApi, setValueFromApi] = useState(name || '');
  const { mutateUserInfo } = useUser();

  const pristine = useMemo(() => value === valueFromApi, [value, valueFromApi]);

  useEffect(() => {
    if (JSON.stringify(name) !== JSON.stringify(valueFromApi)) {
      setValueFromApi(name);
      setValue(name);
    }
  }, [pristine, name, value, valueFromApi]);

  const required = useMemo(
    () => isPublished && language === defaultLanguage,
    [isPublished, language]
  );

  const softRequired = useMemo(() => language === defaultLanguage, [language]);

  const valid = useMemo(() => required !== true || (value && value.length > 0), [required, value]);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (valid && !pristine) {
      try {
        const resp = await call(category.api.update.factory, {
          entry: {
            relations: {
              translations: [
                {
                  attributes: {
                    name: value,
                    language,
                  },
                },
              ],
            },
          },
          id: entry?.data?.id,
        });

        if (resp.status === 200) {
          mutate();
          mutateList();
          mutateUserInfo();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getRef = ():any => {
    switch(props.id) {
      case "organizer-name":
        return organizerNameRef
        break;
      case "offer-name":
        return offerNameRef
        break;
      case "location-name":
        return locationNameRef
        break;
      default:
        return
        }
  }

  return {
    form: (
      <Name ref={getRef()}
        {...{
          pristine,
          value,
          setValue,
          label,
          ariaLabel,
          onSubmit,
          name,
          required,
          valid,
          tooltip,
          softRequired,
          id: props.id,
          placeholder: props.placeholder
        }}
      />
    ),
    onSubmit,
    pristine,
    reset: () => {
      setValue(name);
    },
    valid,
    value,
  };
};

export const useNameForm: EntryFormHook = ({ category, query, loaded, title, tooltip, placeholder, id }) => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
    valid: validGerman,
    value: valueGerman,
  } = useName({
    category,
    query,
    language: Language.de,
    label: `${title} ${t('forms.labelGerman') as string}`,
    loaded,
    tooltip,
    id: id,
    placeholder
  });

  const {
    form: setNameEnglish,
    onSubmit: onSubmitEnglish,
    pristine: pristineEnglish,
    reset: resetEnglish,
    valid: validEnglish,
  } = useName({
    category,
    query,
    language: Language.en,
    label: `${title} ${t('forms.labelEnglish') as string}`,
    loaded,
  });

  const pristine = useMemo(
    () => Boolean(pristineGerman && pristineEnglish),
    [pristineEnglish, pristineGerman]
  );

  const valid = useMemo(
    () => !loaded || Boolean(validGerman && validEnglish),
    [loaded, validEnglish, validGerman]
  );

  const fulfilled = useMemo(
    () => validGerman && valueGerman?.length > 0,
    [validGerman, valueGerman]
  );

  return {
    renderedForm: (
      <FormWrapper requirement={{ fulfilled }}>
        <FormGrid noTopPadding>
          <FormItem width={FormItemWidth.half} lang="de">{setNameGerman}</FormItem>
          <FormItem width={FormItemWidth.half} lang="en">{setNameEnglish}</FormItem>
        </FormGrid>
      </FormWrapper>
    ),
    submit: async () => {
      onSubmitEnglish();
      onSubmitGerman();
    },
    pristine,
    reset: () => {
      resetGerman();
      resetEnglish();
    },
    valid,
    requirementFulfillment: {
      requirementKey: 'name',
      fulfilled,
    }
  };
};
