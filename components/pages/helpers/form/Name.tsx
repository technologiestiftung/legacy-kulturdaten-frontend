import { ParsedUrlQuery } from 'node:querystring';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { defaultLanguage, Language } from '../../../../config/locale';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { CategoryEntry, PublishedStatus, Translation } from '../../../../lib/api/types/general';
import { Category, useEntry, useMutateList } from '../../../../lib/categories';
import { getTranslation } from '../../../../lib/translations';
import { Input, InputType } from '../../../input';

interface SetNameProps {
  label: string;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  setPristine: (pristine: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  name: string;
  required?: boolean;
  valid?: boolean;
}

const Name: React.FC<SetNameProps> = ({
  label,
  onSubmit,
  pristine,
  setPristine,
  setValue,
  name,
  value,
  required,
}: SetNameProps) => {
  // set initial value
  useEffect(() => {
    if (pristine) {
      setValue(name);
    }
  }, [pristine, name, setValue]);

  return (
    <form onSubmit={onSubmit}>
      <Input
        label={label}
        type={InputType.text}
        value={value || ''}
        onChange={(e) => {
          setPristine(false);
          setValue(e.target.value);
        }}
        required={required}
      />
    </form>
  );
};

export const useName = <
  EntryType extends CategoryEntry,
  EntryShowCallType extends ApiCall,
  TranslationType extends Translation,
  TranslationCreateCallType extends ApiCall
>(props: {
  category: Category;
  query: ParsedUrlQuery;
  language: Language;
  label: string;
}): {
  form: React.ReactElement;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  reset: () => void;
  valid: boolean;
} => {
  const { category, query, language, label } = props;

  const { entry, mutate } = useEntry<EntryType, EntryShowCallType>(category, query);
  const mutateList = useMutateList(category);
  const call = useApiCall();
  const entryTranslation = getTranslation<TranslationType>(
    language,
    entry?.data?.relations?.translations as TranslationType[],
    false
  );
  const name = useMemo(() => entryTranslation?.attributes?.name, [
    entryTranslation?.attributes?.name,
  ]);
  const [value, setValue] = useState(name || '');
  const [pristine, setPristine] = useState(true);

  useEffect(() => {
    if (pristine && name !== value) {
      setValue(name);
    }
  }, [pristine, name, value]);

  const required = useMemo(() => language === defaultLanguage, [language]);

  const valid = useMemo(() => required !== true || (value && value.length > 0), [required, value]);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (valid && !pristine) {
      try {
        const resp = await call<TranslationCreateCallType>(category.api.translationCreate.factory, {
          translation: {
            ...entryTranslation,
            attributes: {
              name: value,
              language,
            },
          },
          translationId: entryTranslation?.id,
          id: entry?.data?.id,
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
  };

  return {
    form: (
      <Name
        {...{
          pristine,
          setPristine,
          value,
          setValue,
          label,
          onSubmit,
          name,
          required,
          valid,
        }}
      />
    ),
    onSubmit,
    pristine,
    reset: () => {
      setValue(name);
      setPristine(true);
    },
    valid,
  };
};
