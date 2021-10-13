import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EntryFormHook, EntryFormProps } from '.';
import { Language } from '../../../../config/locale';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { Translation } from '../../../../lib/api/types/general';
import { CategoryEntry, PublishedStatus } from '../../../../lib/api/types/general';
import { useEntry, useMutateList } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { getTranslation } from '../../../../lib/translations';
import { WindowContext } from '../../../../lib/WindowService';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { Label } from '../../../label';
import { emptyRichTextValue, useRichText } from '../../../richtext';
import { htmlToMarkdown, markdownToSlate } from '../../../richtext/parser';
import { FormContainer } from '../formComponents';

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

const StyledDescriptionRichTextContainer = styled.div<{ valid?: boolean }>`
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
  showHint: boolean;
  required?: boolean;
}

export const useDescription = ({
  category,
  query,
  language,
  title,
  required,
  showHint,
}: DescriptionProps): {
  renderedDescription: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
  valid: boolean;
  hint: boolean;
} => {
  const { entry, mutate } = useEntry<
    {
      data: {
        relations: { translations: [{ attributes: { description: string } } & Translation] };
      };
    } & CategoryEntry,
    ApiCall
  >(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);
  const [cachedApiText, setCachedApiText] = useState<string>();
  const { rendered } = useContext(WindowContext);
  const t = useT();

  const entryTranslation = getTranslation<{ attributes: { description: string } } & Translation>(
    language,
    entry?.data?.relations?.translations,
    false
  );

  const textFromApi = useMemo(() => {
    return entryTranslation?.attributes?.description || '';
  }, [entryTranslation]);

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

  const hint = useMemo(() => showHint && textLength < 1, [showHint, textLength]);

  return {
    renderedDescription: (
      <StyledDescription>
        {rendered && (
          <>
            <StyledDescriptionTitleStatus>
              <StyledDescriptionTitle>
                <Label>
                  {title}
                  {required && ` (${t('forms.required')})`}
                </Label>
              </StyledDescriptionTitle>
            </StyledDescriptionTitleStatus>
            <StyledDescriptionRichTextWrapper valid={valid} hint={hint}>
              <StyledDescriptionRichTextContainer valid={valid}>
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
                    description: serializedMarkdown,
                    language,
                  },
                ],
              },
            },
            id: entry?.data?.id,
          });

          if (resp.status === 200) {
            mutate();
            mutateList();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    valid,
    hint,
  };
};

export const useDescriptionForm: EntryFormHook = ({ category, query }, loaded, showHint) => {
  const t = useT();
  const { entry } = useEntry(category, query);

  const isPublished = entry?.data?.attributes?.status === PublishedStatus.published;

  const {
    renderedDescription: renderedDescriptionGerman,
    submit: submitGerman,
    pristine: pristineGerman,
    valid: validGerman,
    hint: hintGerman,
  } = useDescription({
    category,
    query,
    language: Language.de,
    title: t('forms.descriptionGerman') as string,
    required: isPublished,
    showHint,
  });

  const {
    renderedDescription: renderedDescriptionEnglish,
    submit: submitEnglish,
    pristine: pristineEnglish,
    valid: validEnglish,
    hint: hintEnglish,
  } = useDescription({
    category,
    query,
    language: Language.en,
    title: t('forms.descriptionEnglish') as string,
    required: false,
    showHint,
  });

  const pristine = useMemo(
    () => pristineEnglish && pristineGerman,
    [pristineEnglish, pristineGerman]
  );

  const valid = useMemo(
    () => !loaded || (validGerman && validEnglish),
    [loaded, validEnglish, validGerman]
  );

  const hint = useMemo(
    () => showHint && loaded && (hintGerman || hintEnglish),
    [showHint, loaded, hintEnglish, hintGerman]
  );

  return {
    renderedForm: (
      <FormContainer>
        <EntryFormHead title={`${t('forms.description') as string}`} valid={valid} hint={hint} />
        {renderedDescriptionGerman}
        {renderedDescriptionEnglish}
      </FormContainer>
    ),
    submit: async () => {
      submitGerman();
      submitEnglish();
    },
    pristine,
    reset: () => undefined,
    valid,
    hint,
  };
};
