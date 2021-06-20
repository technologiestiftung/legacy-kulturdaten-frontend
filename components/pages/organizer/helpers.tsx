import { FormEvent, useEffect, useMemo, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { ParsedUrlQuery } from 'node:querystring';

import { getApiUrlString, useApiCall } from '../../../lib/api';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { CreateOrganizer, Organizer, OrganizerTranslation } from '../../../lib/api/types/organizer';
import { Category, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { css, SerializedStyles } from '@emotion/react';
import { insetBorder, mq } from '../../globals/Constants';
import { Breakpoint } from '../../../lib/WindowService';
import styled from '@emotion/styled';
import { Button, ButtonColor, ButtonType } from '../../button';
import { OrganizerTranslationUpdate } from '../../../lib/api/routes/organizer/translation/update';
import { Language } from '../../../config/locales';

export const FormGrid = styled.div`
  display: grid;
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;
  padding: 1.5rem 0;
  grid-template-columns: repeat(4, 1fr);
`;

export enum FormItemWidth {
  quarter = 'quarter',
  half = 'half',
  full = 'full',
}

export const formItemWidthMap: { [key in FormItemWidth]: SerializedStyles } = {
  quarter: css`
    grid-column: span 2;

    ${mq(Breakpoint.mid)} {
      grid-column: span 1;
    }
  `,
  half: css`
    grid-column: span 4;

    ${mq(Breakpoint.mid)} {
      grid-column: span 2;
    }
  `,
  full: css`
    grid-column: span 4;
  `,
};

export const FormItem = styled.div<{ width: FormItemWidth; alignSelf?: string }>`
  ${({ width }) => formItemWidthMap[width]}
  ${({ alignSelf }) => (alignSelf ? `align-self: ${alignSelf};` : '')}
`;

export const FormButtons = styled.div`
  padding: 0.75rem 0;
  box-shadow: ${insetBorder(false, false, true)};
  display: flex;
  justify-content: flex-start;

  & > :last-of-type {
    margin-left: 0.75rem;
  }
`;

interface EntryTranslationFormProps {
  children?: React.ReactNode;
  category: Category;
  entry: Organizer;
  formState: OrganizerTranslation;
  mutate: any;
  setPristine: (pristine: boolean) => void;
}

export const EntryTranslationForm: React.FC<EntryTranslationFormProps> = ({
  children,
  category,
  entry,
  formState,
  mutate,
  setPristine,
}: EntryTranslationFormProps) => {
  const call = useApiCall();

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
          const resp = await call<OrganizerTranslationUpdate>(
            category.api.translationUpdate.factory,
            {
              organizerTranslation: formState,
              translationId: formState?.id,
              organizerId: entry?.data?.id,
            }
          );

          if (resp.status === 200) {
            mutate();
            mutateSwr(getApiUrlString(category.api.list.route));
            setPristine(true);
          }
        } catch (e) {
          console.error(e);
        }
      }}
    >
      {children}
    </form>
  );
};

export const useEntryTranslationForm = (
  category: Category,
  query: ParsedUrlQuery,
  language: Language
): {
  formState: OrganizerTranslation;
  setFormState: (formState: OrganizerTranslation) => void;
  resetFormState: () => void;
  pristine: boolean;
  setPristine: (pristine: boolean) => void;
  formProps: EntryTranslationFormProps;
  entry: Organizer;
  formButtons: React.ReactElement[];
} => {
  const t = useT();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);

  const [initFormState, setInitFormState] = useState<OrganizerTranslation>();

  const [pristine, setPristine] = useState<boolean>(true);
  const [formState, setFormState] = useState<OrganizerTranslation>(initFormState);

  useEffect(() => {
    if (!initFormState && Array.isArray(entry?.data?.relations?.translations)) {
      setInitFormState(
        entry.data.relations.translations.find(
          (translation) => translation.attributes.language === language
        )
      );
    }
  }, [entry?.data?.relations?.translations, language, initFormState]);

  useEffect(() => {
    setFormState(initFormState);
  }, [initFormState]);

  const resetFormState = () => setFormState(initFormState);

  return {
    formState,
    setFormState,
    resetFormState,
    pristine,
    setPristine,
    entry,
    formProps: { category, entry, mutate, setPristine, formState },
    formButtons: [
      <Button
        key={0}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          resetFormState();
          setPristine(true);
        }}
        icon="XOctagon"
        color={ButtonColor.yellow}
        disabled={pristine}
      >
        {t('categories.organizer.form.editCancel')}
      </Button>,
      <Button
        key={1}
        type={ButtonType.submit}
        icon="CheckSquare"
        color={ButtonColor.green}
        disabled={pristine}
      >
        {t('categories.organizer.form.save')}
      </Button>,
    ],
  };
};

interface EntryFormProps {
  children?: React.ReactNode;
  category: Category;
  entry: Organizer;
  formState: CreateOrganizer;
  mutate: any;
  setPristine: (pristine: boolean) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  children,
  category,
  entry,
  formState,
  mutate,
  setPristine,
}: EntryFormProps) => {
  const call = useApiCall();

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            organizer: formState,
            id: entry?.data?.id,
          });

          if (resp.status === 200) {
            mutate(resp.body.data, false);
            mutateSwr(getApiUrlString(category.api.list.route));
            setPristine(true);
          }
        } catch (e) {
          console.error(e);
        }
      }}
    >
      {children}
    </form>
  );
};

// const makeFormState = (entryData: Organizer['data'], data: CreateOrganizer): CreateOrganizer => ({
//   ...{
//     relations: {
//       translations: entryData.relations?.translations,
//       address: entryData.relations?.address,
//       type: entryData.relations?.type?.id,
//       subjects: entryData.relations?.subjects?.map((subject) => subject.id),
//     },
//   },
//   ...data,
// });

export const useEntryForm = (
  category: Category,
  query: ParsedUrlQuery
): {
  formState: CreateOrganizer;
  setFormState: (partialFormState: CreateOrganizer) => void;
  resetFormState: () => void;
  pristine: boolean;
  setPristine: (pristine: boolean) => void;
  formProps: EntryFormProps;
  entry: Organizer;
  formButtons: React.ReactElement[];
} => {
  const t = useT();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);

  const [initFormState, setInitFormState] = useState<CreateOrganizer>();
  const [pristine, setPristine] = useState<boolean>(true);
  const [formState, setFormState] = useState<CreateOrganizer>(initFormState);

  useEffect(() => {
    if (!initFormState && entry?.data?.relations) {
      setInitFormState({
        relations: {
          address: entry?.data?.relations?.address,
          type: entry?.data?.relations?.type?.id,
          subjects: entry?.data?.relations?.subjects?.map((subject) => subject.id),
        },
      });
    }
  }, [entry?.data?.relations, initFormState]);

  useEffect(() => {
    setFormState(initFormState);
  }, [initFormState]);

  const resetFormState = () => setFormState(initFormState);

  return {
    formState,
    setFormState,
    resetFormState,
    pristine,
    setPristine,
    entry,
    formProps: { category, entry, mutate, setPristine, formState },
    formButtons: [
      <Button
        key={0}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          resetFormState();
          setPristine(true);
        }}
        icon="XOctagon"
        color={ButtonColor.yellow}
        disabled={pristine}
      >
        {t('categories.organizer.form.editCancel')}
      </Button>,
      <Button
        key={1}
        type={ButtonType.submit}
        icon="CheckSquare"
        color={ButtonColor.green}
        disabled={pristine}
      >
        {t('categories.organizer.form.save')}
      </Button>,
    ],
  };
};
