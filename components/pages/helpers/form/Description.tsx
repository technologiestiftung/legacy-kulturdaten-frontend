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
import { Tooltip } from '../../../tooltip';
import { TooltipP } from '../../../tooltip/TooltipContent';

const defaultMaxLength = 1500;

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
  position: relative;

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

const StyledMaxLengthDisplay = styled.div<{ textLength: number; maxLength: number }>`
  font-size: var(--font-size-200);
  line-height: var(--line-height-200);
  text-align: right;

  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0.375rem;

  pointer-events: none;
  display: flex;
  justify-content: flex-end;

  ${({ textLength, maxLength }) =>
    css`
      ${textLength > maxLength ? 'color: var(--error);' : ''}
    `}
`;

const StyledMaxLengthDisplayText = styled.div`
  background: var(--white-o85);
  border-radius: 0.375rem;
  padding: 0.1875rem 0.375rem;

  @supports (backdrop-filter: blur(16px)) {
    background: var(--white-o50);
    backdrop-filter: blur(16px);
  }

  @supports (-webkit-backdrop-filter: blur(16px)) {
    background: var(--white-o50);
    -webkit-backdrop-filter: blur(16px);
  }
`;

const StyledTooltip = styled.div`
  margin-left: 0.5rem;
`;

interface DescriptionProps extends EntryFormProps {
  language: Language;
  title: string;
  tooltip?: string;
  required?: boolean;
  softRequired?: boolean;
  key?: string;
  maxLength?: number;
}

export const useDescription = ({
  category,
  query,
  language,
  title,
  tooltip,
  required,
  softRequired,
  key = 'description',
  maxLength,
}: DescriptionProps): {
  renderedDescription: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
  valid: boolean;
  textLength: number;
  reset: () => void;
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
  const [touched, setTouched] = useState(false);

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
        setTouched(true);
        setSerializedMarkdown(htmlToMarkdown(richTextRef.current));
      }
    },
    contentRef: richTextRef,
    required,
    softRequired,
    maxLength,
  });

  const pristine = useMemo(() => {
    if (typeof cachedApiText === 'undefined' || typeof serializedMarkdown === 'undefined') {
      return true;
    }

    if (
      typeof cachedApiText === 'string' &&
      typeof serializedMarkdown === 'string' &&
      cachedApiText.length === 0 &&
      serializedMarkdown.length === 0
    ) {
      return true;
    }

    if (serializedMarkdown != cachedApiText) {
      return false;
    }

    return true;
  }, [cachedApiText, serializedMarkdown]);

  useEffect(() => {
    if (!touched && serializedMarkdown === '' && cachedApiText) {
      setSerializedMarkdown(cachedApiText);
    }

    return () => setTouched(false);
  }, [touched, cachedApiText, serializedMarkdown]);

  useEffect(() => {
    if (textFromApi !== cachedApiText) {
      setTouched(false);
      setCachedApiText(textFromApi);
      setSerializedMarkdown(textFromApi);
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
        <fieldset>
          {rendered && (
            <>
              <StyledDescriptionTitleStatus>
                <StyledDescriptionTitle>
                  <legend>
                    <Label ariaLabel={t('richText.maxCharacters') as string}>
                      {title}
                      {(required || softRequired) && ` (${t('forms.required')})`}
                      {tooltip && (
                        <StyledTooltip>
                          <Tooltip>
                            {typeof tooltip === 'string' ? <TooltipP>{tooltip}</TooltipP> : tooltip}
                          </Tooltip>
                        </StyledTooltip>
                      )}
                    </Label>
                  </legend>
                </StyledDescriptionTitle>
              </StyledDescriptionTitleStatus>
              <StyledDescriptionRichTextWrapper
                valid={softRequired ? valid && textLength > 0 && textLength <= maxLength : valid}
              >
                <StyledDescriptionRichTextContainer>
                  {renderedRichText}
                </StyledDescriptionRichTextContainer>
                {maxLength && (
                  <StyledMaxLengthDisplay textLength={textLength} maxLength={maxLength}>
                    <StyledMaxLengthDisplayText>
                      {textLength} / {maxLength}
                    </StyledMaxLengthDisplayText>
                  </StyledMaxLengthDisplay>
                )}
              </StyledDescriptionRichTextWrapper>
            </>
          )}
        </fieldset>
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
    reset: () => {
      setSerializedMarkdown('');
      setCachedApiText(undefined);
      setTouched(false);
    },
  };
};

export const useDescriptionForm: EntryFormHook = ({
  category,
  query,
  loaded,
  tooltip,
  title,
  required,
  id,
}) => {
  const t = useT();

  const {
    renderedDescription: renderedDescriptionGerman,
    submit: submitGerman,
    pristine: pristineGerman,
    valid: validGerman,
    textLength: textLengthGerman,
    reset: resetGerman,
  } = useDescription({
    category,
    query,
    language: Language.de,
    title: t('forms.labelGerman') as string,
    required,
    softRequired: true,
    maxLength: defaultMaxLength,
  });

  const {
    renderedDescription: renderedDescriptionEnglish,
    submit: submitEnglish,
    pristine: pristineEnglish,
    valid: validEnglish,
    reset: resetEnglish,
  } = useDescription({
    category,
    query,
    language: Language.en,
    title: t('forms.labelEnglish') as string,
    required: false,
    maxLength: defaultMaxLength,
  });

  const {
    renderedDescription: renderedDescriptionGermanEasy,
    submit: submitGermanEasy,
    pristine: pristineGermanEasy,
    valid: validGermanEasy,
    reset: resetGermanEasy,
  } = useDescription({
    category,
    query,
    language: 'de-easy' as Language,
    title: t('forms.labelGermanEasy') as string,
    tooltip: t('forms.labelGermanEasyTooltip') as string,
    required: false,
    maxLength: defaultMaxLength,
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
    () => textLengthGerman > 0 && textLengthGerman <= defaultMaxLength && validGerman,
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
            id={id}
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
    reset: () => {
      resetGerman();
      resetEnglish();
      resetGermanEasy();
    },
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
