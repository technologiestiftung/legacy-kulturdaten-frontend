import styled from '@emotion/styled';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EntryFormProps } from '.';
import { defaultLanguage, Language } from '../../../../config/locale';
import { useApiCall } from '../../../../lib/api';
import { OrganizerShow } from '../../../../lib/api/routes/organizer/show';
import { OrganizerTranslationCreate } from '../../../../lib/api/routes/organizer/translation/create';
import { Organizer, OrganizerTranslation } from '../../../../lib/api/types/organizer';
import { useEntry, useMutateList } from '../../../../lib/categories';
import { getTranslation } from '../../../../lib/translations';
import { WindowContext } from '../../../../lib/WindowService';
import { Label } from '../../../label';
import { emptyRichTextValue, useRichText } from '../../../richtext';
import { htmlToMarkdown, markdownToSlate } from '../../../richtext/parser';

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

const StyledDescriptionRichTextWrapper = styled.div`
  position: relative;
  border: 1px solid var(--grey-600);
  border-radius: 0.375rem;
  max-height: calc(var(--app-height) - var(--header-height) - 8rem);
  overflow-y: auto;
  overflow-x: hidden;
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
}: DescriptionProps): {
  renderedDescription: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
} => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);
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
                <Label>{title}</Label>
              </StyledDescriptionTitle>
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
    pristine,
  };
};
