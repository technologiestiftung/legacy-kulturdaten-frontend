import { ParsedUrlQuery } from 'node:querystring';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { defaultLanguage, Language } from '../../../../config/locale';
import { getApiUrlString, useApiCall } from '../../../../lib/api';
import { OrganizerShow } from '../../../../lib/api/routes/organizer/show';
import { OrganizerTranslationCreate } from '../../../../lib/api/routes/organizer/translation/create';
import { PublishedStatus } from '../../../../lib/api/types/general';
import { Organizer, OrganizerTranslation } from '../../../../lib/api/types/organizer';
import { Category, useEntry } from '../../../../lib/categories';
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

export const useName = (props: {
  category: Category;
  query: ParsedUrlQuery;
  language: Language;
  label: string;
}): {
  form: React.ReactElement;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  reset: () => void;
} => {
  const { category, query, language, label } = props;

  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const entryTranslation = getTranslation<OrganizerTranslation>(
    language,
    entry?.data?.relations?.translations,
    false
  );
  const name = useMemo(() => entryTranslation?.attributes?.name, [
    entryTranslation?.attributes?.name,
  ]);
  const [value, setValue] = useState(name || '');
  const [pristine, setPristine] = useState(true);

  const required = useMemo(
    () =>
      entry?.data?.attributes?.status === PublishedStatus.published && language === defaultLanguage,
    [entry?.data?.attributes?.status, language]
  );

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!pristine) {
      try {
        const resp = await call<OrganizerTranslationCreate>(
          category.api.translationCreate.factory,
          {
            organizerTranslation: {
              ...entryTranslation,
              attributes: {
                name: value,
                language,
              },
            },
            translationId: entryTranslation?.id,
            organizerId: entry?.data?.id,
          }
        );

        if (resp.status === 200) {
          mutate();
          mutateSwr(getApiUrlString(category.api.list.route));
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
        }}
      />
    ),
    onSubmit,
    pristine,
    reset: () => {
      setValue(name);
      setPristine(true);
    },
  };
};
