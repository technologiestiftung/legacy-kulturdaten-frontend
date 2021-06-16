import { FormEvent, useEffect, useMemo, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { ParsedUrlQuery } from 'node:querystring';

import { getApiUrlString, useApiCall } from '../../../lib/api';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Organizer } from '../../../lib/api/types/organizer';
import { Category, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { css, SerializedStyles } from '@emotion/react';
import { insetBorder, mq } from '../../globals/Constants';
import { Breakpoint } from '../../../lib/WindowService';
import styled from '@emotion/styled';
import { Button, ButtonColor, ButtonType } from '../../button';

export interface EntryFormProps {
  children?: React.ReactNode;
  category: Category;
  entry: Organizer;
  formState: Partial<OrganizerUpdate['request']['body']>;
  mutate: any;
  setPristine: (pristine: boolean) => void;
}

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

export const FormItem = styled.div<{ width: FormItemWidth }>`
  ${({ width }) => formItemWidthMap[width]}
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
            organizer: makeFormState(entry, formState),
            id: entry.id,
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

export const makeFormState = (
  entry: Organizer,
  data: Partial<OrganizerUpdate['request']['body']>
): OrganizerUpdate['request']['body'] => ({
  ...{
    name: entry.attributes.name,
    address: entry.relations.address.attributes,
    type: entry?.relations?.type?.id,
    subjects: entry?.relations?.subjects?.map((subject) => subject.id),
  },
  ...data,
});

export const useEntryForm = (
  category: Category,
  query: ParsedUrlQuery
): {
  formState: Partial<OrganizerUpdate['request']['body']>;
  setFormState: (partialFormState: Partial<OrganizerUpdate['request']['body']>) => void;
  resetFormState: () => void;
  pristine: boolean;
  setPristine: (pristine: boolean) => void;
  formProps: EntryFormProps;
  entry: Organizer;
  formButtons: React.ReactElement[];
} => {
  const t = useT();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);

  const initialFormState = useMemo(
    () => ({
      name: entry?.attributes.name,
      address: entry?.relations?.address?.attributes,
      type: entry?.relations?.type?.id,
      subjects: entry?.relations?.subjects?.map((subject) => String(subject.id)),
    }),
    [entry]
  );

  const [pristine, setPristine] = useState<boolean>(true);
  const [formState, setFormState] = useState<Partial<OrganizerUpdate['request']['body']>>(
    initialFormState
  );

  useEffect(() => {
    setFormState(initialFormState);
  }, [initialFormState]);

  const resetFormState = () => setFormState(initialFormState);

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
