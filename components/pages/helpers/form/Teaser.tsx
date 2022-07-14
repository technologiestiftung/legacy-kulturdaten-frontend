import { ParsedUrlQuery } from 'node:querystring';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { EntryFormHook } from '.';
import { Language } from '../../../../config/locale';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { CategoryEntry } from '../../../../lib/api/types/general';
import { OfferTranslation } from '../../../../lib/api/types/offer';
import { Category, useEntry } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { getTranslation } from '../../../../lib/translations';
import { usePseudoUID } from '../../../../lib/uid';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { Textarea } from '../../../textarea';
import { FormGrid, FormItem, FormItemWidth } from '../formComponents';

export const defaultTeaserTextLimit = 150;

interface SetTeaserProps {
  label: string;
  tooltip?: string;
  ariaLabel?: string;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  setPristine: (pristine: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  teaser: string;
  required?: boolean;
  valid?: boolean;
  hint?: boolean;
}

const Teaser: React.FC<SetTeaserProps> = ({
  label,
  tooltip,
  ariaLabel,
  onSubmit,
  pristine,
  setPristine,
  setValue,
  teaser,
  value,
  required,
}: SetTeaserProps) => {
  const uid = usePseudoUID();
  // set initial value
  useEffect(() => {
    if (pristine) {
      setValue(teaser);
    }
  }, [pristine, teaser, setValue]);

  return (
    <form onSubmit={onSubmit}>
      <Textarea
        id={`${uid}-textarea`}
        label={label}
        ariaLabel={ariaLabel}
        tooltip={tooltip}
        value={value || ''}
        onChange={(e) => {
          setPristine(false);
          setValue(e.target.value);
        }}
        required={required}
        rows={5}
        maxLength={defaultTeaserTextLimit}
      />
    </form>
  );
};

export const useTeaser = <
  EntryType extends CategoryEntry,
  EntryShowCallType extends ApiCall,
  TranslationType extends OfferTranslation
>(props: {
  category: Category;
  query: ParsedUrlQuery;
  language: Language;
  label: string;
  tooltip?: string;
  ariaLabel?: string;
  loaded: boolean;
}): {
  form: React.ReactElement;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  reset: () => void;
  valid: boolean;
  value: string;
} => {
  const { category, query, language, label, tooltip, ariaLabel } = props;

  const { entry, mutate } = useEntry<EntryType, EntryShowCallType>(category, query);

  const call = useApiCall();
  const entryTranslation = getTranslation<TranslationType>(
    language,
    entry?.data?.relations?.translations as TranslationType[],
    false
  );
  const teaser = useMemo(
    () => entryTranslation?.attributes?.teaser,
    [entryTranslation?.attributes?.teaser]
  );
  const [value, setValue] = useState(teaser || '');
  const [pristine, setPristine] = useState(true);

  useEffect(() => {
    if (pristine && teaser !== value) {
      setValue(teaser);
    }
  }, [pristine, teaser, value]);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!pristine) {
      try {
        const resp = await call(category.api.update.factory, {
          entry: {
            relations: {
              translations: [
                {
                  attributes: {
                    teaser: value,
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
          setTimeout(() => setPristine(true), 500);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
  return {
    form: (
      <Teaser
        {...{
          pristine,
          setPristine,
          value,
          setValue,
          label,
          tooltip,
          ariaLabel,
          onSubmit,
          teaser,
        }}
      />
    ),
    onSubmit,
    pristine,
    reset: () => {
      setValue(teaser);
      setPristine(true);
    },
    valid: true,
    value,
  };
};

export const useTeaserForm: EntryFormHook = ({ category, query, loaded, title }) => {
  const t = useT();

  const {
    form: setTeaserGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
    valid: validGerman,
  } = useTeaser({
    category,
    query,
    language: Language.de,
    label: t('forms.labelGerman') as string,
    ariaLabel: title
      ? `${title} ${t('forms.labelGerman')}`
      : `${t('forms.teaser')} ${t('forms.labelGerman')}`,
    loaded,
  });

  const {
    form: setTeaserGermanEasy,
    onSubmit: onSubmitGermanEasy,
    pristine: pristineGermanEasy,
    reset: resetGermanEasy,
    valid: validGermanEasy,
  } = useTeaser({
    category,
    query,
    language: 'de-easy' as Language,
    label: t('forms.labelGermanEasy') as string,
    tooltip: t('forms.labelGermanEasyTooltip') as string,
    ariaLabel: title
      ? `${title} ${t('forms.labelGermanEasy')}`
      : `${t('forms.teaser')} ${t('forms.labelGermanEasy')}`,
    loaded,
  });

  const {
    form: setTeaserEnglish,
    onSubmit: onSubmitEnglish,
    pristine: pristineEnglish,
    reset: resetEnglish,
    valid: validEnglish,
  } = useTeaser({
    category,
    query,
    language: Language.en,
    label: t('forms.labelEnglish') as string,
    ariaLabel: title
      ? `${title} ${t('forms.labelEnglish')}`
      : `${t('forms.teaser')} ${t('forms.labelEnglish')}`,
    loaded,
  });

  const pristine = useMemo(
    () => Boolean(pristineGerman && pristineEnglish && pristineGermanEasy),
    [pristineEnglish, pristineGerman, pristineGermanEasy]
  );

  const valid = useMemo(
    () => !loaded || Boolean(validGerman && validEnglish && validGermanEasy),
    [loaded, validEnglish, validGerman, validGermanEasy]
  );

  return {
    renderedForm: (
      <div>
        <EntryFormHead title={title || `${t('forms.teaser') as string}`} valid={valid} />
        <FormGrid>
          <FormItem width={FormItemWidth.full} lang="de">{setTeaserGerman}</FormItem>
          <FormItem width={FormItemWidth.full} lang="en">{setTeaserEnglish}</FormItem>
          <FormItem width={FormItemWidth.full} lang="de">{setTeaserGermanEasy}</FormItem>
        </FormGrid>
      </div>
    ),
    submit: async () => {
      onSubmitEnglish();
      onSubmitGerman();
      onSubmitGermanEasy();
    },
    pristine,
    reset: () => {
      resetGerman();
      resetEnglish();
      resetGermanEasy();
    },
    valid,
  };
};
