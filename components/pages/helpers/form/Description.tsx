import styled from '@emotion/styled';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Check, X } from 'react-feather';
import { EntryFormProps } from '.';
import { defaultLanguage, Language } from '../../../../config/locale';
import { useApiCall } from '../../../../lib/api';
import { OrganizerShow } from '../../../../lib/api/routes/organizer/show';
import { OrganizerTranslationCreate } from '../../../../lib/api/routes/organizer/translation/create';
import { Organizer, OrganizerTranslation } from '../../../../lib/api/types/organizer';
import { useEntry, useMutateList } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { getTranslation } from '../../../../lib/translations';
import { WindowContext } from '../../../../lib/WindowService';
import { emptyRichTextValue, useRichText } from '../../../richtext';
import { htmlToMarkdown, markdownToSlate } from '../../../richtext/parser';

const StyledDescription = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--grey-400);
  padding: 0.375rem 0;
  /* position: sticky; */
  /* top: 0; */
`;

const StyledDescriptionTitle = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.75rem 0;
`;

const StyledDescriptionTitleStatus = styled.div`
  display: flex;
`;

const StyledDescriptionStatus = styled.div<{ descriptionExists: boolean }>`
  padding: 0.5625rem 0;
  margin-left: 0.375rem;
`;

const StyledDescriptionStatusFlag = styled.div<{ descriptionExists: boolean }>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  display: inline-flex;
  align-items: center;
  padding: calc(0.1875rem - 1px) calc(0.375rem - 1px);
  border-radius: 0.375rem;
  border: 1px solid
    ${({ descriptionExists }) => (descriptionExists ? 'var(--green-mid)' : 'var(--error)')};
  background: ${({ descriptionExists }) =>
    descriptionExists ? 'var(--green-light)' : 'var(--error-light)'};

  svg {
    height: 1.125rem;
    width: 1.125rem;
    margin-left: 0.1875rem;
  }
`;

const StyledDescriptionRichTextWrapper = styled.div`
  position: relative;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  max-height: calc(var(--app-height) - var(--header-height) - 8rem);
  overflow-y: auto;
  overflow-x: hidden;
  /* box-shadow: inset 2px 2px 10px var(--black-o25); */
  box-shadow: var(--shadow-inset);

  @media screen and (min-height: 75rem) {
    max-height: 63.25rem;
  }
`;

interface DescriptionProps extends EntryFormProps {
  language: Language;
  title: string;
}

export const useDescription = ({
  category,
  query,
  language,
  title,
}: DescriptionProps): { renderedDescription: React.ReactElement; submit: () => Promise<void> } => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);
  const t = useT();
  const [cachedApiText, setCachedApiText] = useState<string>();
  const { rendered } = useContext(WindowContext);

  const entryTranslation = getTranslation<OrganizerTranslation>(
    language,
    entry?.data?.relations?.translations,
    false
  );

  const defaultTranslation = getTranslation<OrganizerTranslation>(
    defaultLanguage,
    entry?.data?.relations?.translations,
    false
  );

  const textFromApi = useMemo(() => {
    return entryTranslation?.attributes?.description || '';
  }, [entryTranslation]);

  const richTextRef = useRef<HTMLDivElement>(null);

  const [serializedMarkdown, setSerializedMarkdown] = useState<string>('');

  const { renderedRichText, init: initRichText } = useRichText({
    onChange: () => {
      if (richTextRef.current) {
        setSerializedMarkdown(htmlToMarkdown(richTextRef.current));
      }
    },
    contentRef: richTextRef,
  });

  const pristine = useMemo(() => {
    return serializedMarkdown && cachedApiText && serializedMarkdown === cachedApiText;
  }, [cachedApiText, serializedMarkdown]);

  const descriptionExists = useMemo(
    () => (typeof cachedApiText === 'undefined' ? undefined : cachedApiText.length > 0),
    [cachedApiText]
  );

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
              <StyledDescriptionTitle>{title}: </StyledDescriptionTitle>
              <StyledDescriptionStatus descriptionExists={descriptionExists}>
                {typeof descriptionExists !== 'undefined' && (
                  <StyledDescriptionStatusFlag descriptionExists={descriptionExists}>
                    <span>
                      {t(
                        descriptionExists
                          ? 'categories.organizer.form.descriptionExists'
                          : 'categories.organizer.form.descriptionExistsNot'
                      )}
                    </span>
                    {descriptionExists ? (
                      <Check color="var(--black)" />
                    ) : (
                      <X color="var(--black)" />
                    )}
                  </StyledDescriptionStatusFlag>
                )}
              </StyledDescriptionStatus>
            </StyledDescriptionTitleStatus>
            <div>
              <StyledDescriptionRichTextWrapper>
                {renderedRichText}
              </StyledDescriptionRichTextWrapper>
            </div>
          </>
        )}
      </StyledDescription>
    ),
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<OrganizerTranslationCreate>(
            category.api.translationCreate.factory,
            {
              translation: {
                ...entryTranslation,
                attributes: {
                  description: serializedMarkdown,
                  // set translation name in case it is not present. Necessary for API validation
                  name:
                    typeof entryTranslation?.attributes?.name === 'undefined'
                      ? defaultTranslation?.attributes?.name
                      : undefined,
                  language,
                },
              },
              translationId: entryTranslation?.id,
              id: entry?.data?.id,
            }
          );

          if (resp.status === 200) {
            mutate();
            mutateList();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
  };
};
