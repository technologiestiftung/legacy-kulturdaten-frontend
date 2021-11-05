import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EntryFormHook, EntryFormProps } from '.';
import { Language } from '../../../../config/locale';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { Translation } from '../../../../lib/api/types/general';
import { CategoryEntry, PublishedStatus } from '../../../../lib/api/types/general';
import { useEntry } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { getTranslation } from '../../../../lib/translations';
import { WindowContext } from '../../../../lib/WindowService';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { Label } from '../../../label';
import { emptyRichTextValue, useRichText } from '../../../richtext';
import { htmlToMarkdown, markdownToSlate } from '../../../richtext/parser';
import { FormContainer, FormWrapper } from '../formComponents';

const StyledDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
`;

const StyledDescriptionTitle = styled.div`
  margin-bottom: 0.375rem;
`;

const StyledDescriptionTitleStatus = styled.div`
  display: flex;
`;

const errorShadow = '0px 0px 0px 0.1125rem var(--error-o50)';
const hintShadow = '0px 0px 0px 0.1125rem rgba(10, 47, 211, 0.4)';

const StyledDescriptionRichTextWrapper = styled.div<{ valid?: boolean; hint?: boolean }>`
  border: 1px solid var(--grey-600);
  border-radius: 0.375rem;
  overflow: hidden;

  ${({ hint }) =>
    hint
      ? css`
          box-shadow: ${hintShadow};
          border-color: rgb(10, 47, 211);
        `
      : ''}

  ${({ valid }) =>
    valid
      ? ''
      : css`
          box-shadow: ${errorShadow};
          border-color: var(--error);
        `}
`;

const StyledDescriptionRichTextContainer = styled.div`
  position: relative;

  max-height: calc(var(--app-height) - var(--header-height) - 8rem);
  overflow-y: auto;
  overflow-x: hidden;
  mask-image: -webkit-radial-gradient(white, black);
  box-shadow: var(--shadow-inset);

  @media screen and (min-height: 75rem) {
    max-height: 63.25rem;
  }
`;

interface DescriptionProps extends EntryFormProps {
  language: Language;
  title: string;
  required?: boolean;
  softRequired?: boolean;
  key?: string;
}

export const useDescription = ({
  category,
  query,
  language,
  title,
  required,
  softRequired,
  key = 'description',
}: DescriptionProps): {
  renderedDescription: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
  valid: boolean;
  textLength: number;
} => {
  const { entry, mutate } = useEntry<
    {
      data: {
        relations: {
          translations: [{ attributes: { description: string; teaser: string } } & Translation];
        };
      };
    } & CategoryEntry,
    ApiCall
  >(category, query);
  const call = useApiCall();
  const [cachedApiText, setCachedApiText] = useState<string>();
  const { rendered } = useContext(WindowContext);
  const t = useT();

  const entryTranslation = getTranslation<
    { attributes: { description: string; teaser: string } } & Translation
  >(language, entry?.data?.relations?.translations, false);

  const textFromApi = useMemo(() => {
    return entryTranslation?.attributes[key] || '';
  }, [entryTranslation, key]);

  const richTextRef = useRef<HTMLDivElement>(null);

  const [serializedMarkdown, setSerializedMarkdown] = useState<string>('');

  const {
    renderedRichText,
    init: initRichText,
    valid,
    textLength,
  } = useRichText({
    onChange: () => {
      if (richTextRef.current) {
        setSerializedMarkdown(htmlToMarkdown(richTextRef.current));
      }
    },
    contentRef: richTextRef,
    required,
    softRequired,
  });

  const pristine = useMemo(() => {
    return (
      (serializedMarkdown && cachedApiText && serializedMarkdown === cachedApiText) ||
      (!cachedApiText && !serializedMarkdown)
    );
  }, [cachedApiText, serializedMarkdown]);

  useEffect(() => {
    if (textFromApi !== cachedApiText) {
      setCachedApiText(textFromApi);
      requestAnimationFrame(() =>
        initRichText(
          textFromApi && textFromApi.length > 0 ? markdownToSlate(textFromApi) : emptyRichTextValue
        )
      );
    }
  }, [initRichText, textFromApi, cachedApiText]);

  return {
    renderedDescription: (
      <StyledDescription>
        {rendered && (
          <>
            <StyledDescriptionTitleStatus>
              <StyledDescriptionTitle>
                <Label>
                  {title}
                  {(required || softRequired) && ` (${t('forms.required')})`}
                </Label>
              </StyledDescriptionTitle>
            </StyledDescriptionTitleStatus>
            <StyledDescriptionRichTextWrapper
              valid={softRequired ? valid && textLength > 0 : valid}
            >
              <StyledDescriptionRichTextContainer>
                {renderedRichText}
              </StyledDescriptionRichTextContainer>
            </StyledDescriptionRichTextWrapper>
          </>
        )}
      </StyledDescription>
    ),
    submit: async () => {
      if (valid && !pristine) {
        try {
          const resp = await call(category.api.update.factory, {
            entry: {
              relations: {
                translations: [
                  {
                    attributes: {
                      [key]: serializedMarkdown,
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
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    valid,
    textLength,
  };
};

export const useDescriptionForm: EntryFormHook = ({
  category,
  query,
  loaded,
  tooltip,
  title,
  required,
}) => {
  const t = useT();

  const {
    renderedDescription: renderedDescriptionGerman,
    submit: submitGerman,
    pristine: pristineGerman,
    valid: validGerman,
    textLength: textLengthGerman,
  } = useDescription({
    category,
    query,
    language: Language.de,
    title: t('forms.labelGerman') as string,
    required,
    softRequired: true,
  });

  const {
    renderedDescription: renderedDescriptionEnglish,
    submit: submitEnglish,
    pristine: pristineEnglish,
    valid: validEnglish,
  } = useDescription({
    category,
    query,
    language: Language.en,
    title: t('forms.labelEnglish') as string,
    required: false,
  });

  const {
    renderedDescription: renderedDescriptionGermanEasy,
    submit: submitGermanEasy,
    pristine: pristineGermanEasy,
    valid: validGermanEasy,
  } = useDescription({
    category,
    query,
    language: 'de-easy' as Language,
    title: t('forms.labelGermanEasy') as string,
    required: false,
  });

  const pristine = useMemo(
    () => pristineEnglish && pristineGerman && pristineGermanEasy,
    [pristineEnglish, pristineGerman, pristineGermanEasy]
  );

  const valid = useMemo(
    () => !loaded || (validGerman && validEnglish && validGermanEasy),
    [loaded, validEnglish, validGerman, validGermanEasy]
  );

  const fulfilled = useMemo(
    () => textLengthGerman > 0 && validGerman,
    [textLengthGerman, validGerman]
  );

  return {
    renderedForm: (
      <FormWrapper requirement={{ fulfilled }}>
        <FormContainer>
          <EntryFormHead
            title={title || `${t('forms.description') as string}`}
            valid={valid}
            tooltip={tooltip}
          />
          {renderedDescriptionGerman}
          {renderedDescriptionEnglish}
          {renderedDescriptionGermanEasy}
        </FormContainer>
      </FormWrapper>
    ),
    submit: async () => {
      submitGerman();
      submitEnglish();
      submitGermanEasy();
    },
    pristine,
    reset: () => undefined,
    valid,
    requirementFulfillment: {
      requirementKey: 'description',
      fulfilled,
    },
  };
};

export const useTeaserForm: EntryFormHook = ({ category, query, loaded }) => {
  const t = useT();
  const { entry } = useEntry(category, query);

  const isPublished = entry?.data?.attributes?.status === PublishedStatus.published;

  const {
    renderedDescription: renderedTeaserGerman,
    submit: submitGerman,
    pristine: pristineGerman,
    valid: validGerman,
  } = useDescription({
    category,
    query,
    language: Language.de,
    title: t('forms.labelGerman') as string,
    required: isPublished,
  });

  const {
    renderedDescription: renderedTeaserEnglish,
    submit: submitEnglish,
    pristine: pristineEnglish,
    valid: validEnglish,
  } = useDescription({
    category,
    query,
    language: Language.en,
    title: t('forms.labelEnglish') as string,
    required: false,
    key: 'teaser',
  });

  const pristine = useMemo(
    () => pristineEnglish && pristineGerman,
    [pristineEnglish, pristineGerman]
  );

  const valid = useMemo(
    () => !loaded || (validGerman && validEnglish),
    [loaded, validEnglish, validGerman]
  );

  return {
    renderedForm: (
      <FormContainer>
        <EntryFormHead title={`${t('forms.teaser') as string}`} valid={valid} />
        {renderedTeaserGerman}
        {renderedTeaserEnglish}
      </FormContainer>
    ),
    submit: async () => {
      submitGerman();
      submitEnglish();
    },
    pristine,
    reset: () => undefined,
    valid,
  };
};
