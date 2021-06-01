import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { SerializedStyles } from '@emotion/utils';
import { ParsedUrlQuery } from 'node:querystring';
import React, { FormEvent, Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { getApiUrlString, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Organizer } from '../../../lib/api/types/organizer';
import {
  Category,
  CategoryEntryPage,
  useEntry,
  useOrganizerTypeList,
} from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { Breakpoint } from '../../../lib/WindowService';
import { Accordion } from '../../accordion';
import { Button, ButtonColor, ButtonType } from '../../button';
import { CheckboxList } from '../../checkbox/CheckboxList';
import { insetBorder, mq } from '../../globals/Constants';
import { Input, InputType } from '../../input';
import { PlaceholderField } from '../../placeholderfield';
import { Select } from '../../select';
import { Textarea } from '../../textarea';

const CreateWrapper = styled.div``;

const FormGrid = styled.div`
  display: grid;
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;
  padding: 1.5rem 0.75rem;
  grid-template-columns: repeat(4, 1fr);
`;

export enum FormItemWidth {
  quarter = 'quarter',
  half = 'half',
  full = 'full',
}

const formItemWidthMap: { [key in FormItemWidth]: SerializedStyles } = {
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

const FormItem = styled.div<{ width: FormItemWidth }>`
  ${({ width }) => formItemWidthMap[width]}
`;

const FormButtons = styled.div`
  width: calc(100% - 2 * 0.75rem);
  padding: 0.75rem 0;
  margin: 0 0.75rem;
  box-shadow: ${insetBorder(false, false, true)};
  display: flex;
  justify-content: flex-start;

  & > :last-of-type {
    margin-left: 0.75rem;
  }
`;

interface OrganizerFormProps {
  category: Category;
  query: ParsedUrlQuery;
}

interface EntryFormProps {
  children?: React.ReactNode;
  category: Category;
  entry: Organizer;
  formState: Partial<OrganizerUpdate['request']['body']>;
  mutate: any;
  setPristine: (pristine: boolean) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({
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

const makeFormState = (
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

const useEntryForm = (
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
  formButtons: React.ReactElement;
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
    formButtons: (
      <FormButtons>
        <Button
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
        </Button>
        <Button
          type={ButtonType.submit}
          icon="CheckSquare"
          color={ButtonColor.green}
          disabled={pristine}
        >
          {t('categories.organizer.form.save')}
        </Button>
      </FormButtons>
    ),
  };
};

const NameForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { formState, setFormState, setPristine, formProps, formButtons } = useEntryForm(
    category,
    query
  );

  const t = useT();

  return (
    <EntryForm {...formProps}>
      {formButtons}
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameGerman') as string}
            type={InputType.text}
            value={formState?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ name: e.target.value });
            }}
            required
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameEnglish') as string}
            type={InputType.text}
            value={formState?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ name: e.target.value });
            }}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameGermanSimple') as string}
            type={InputType.text}
            value={formState?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ name: e.target.value });
            }}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameEnglishSimple') as string}
            type={InputType.text}
            value={formState?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ name: e.target.value });
            }}
          />
        </FormItem>
      </FormGrid>
    </EntryForm>
  );
};

const ContactForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { formButtons } = useEntryForm(category, query);

  const t = useT();

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {formButtons}
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input label={t('categories.organizer.form.tel') as string} type={InputType.tel} />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input label={t('categories.organizer.form.email') as string} type={InputType.email} />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input label={t('categories.organizer.form.website') as string} type={InputType.url} />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-social"
            label={t('categories.organizer.form.social') as string}
            rows={3}
          />
        </FormItem>
      </FormGrid>
    </form>
  );
};

const DescriptionForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { formButtons } = useEntryForm(category, query);
  const t = useT();

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {formButtons}
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-g"
            label={t('categories.organizer.form.descriptionGerman') as string}
            rows={5}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-e"
            label={t('categories.organizer.form.descriptionEnglish') as string}
            rows={5}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-gs"
            label={t('categories.organizer.form.descriptionGermanSimple') as string}
            rows={5}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-es"
            label={t('categories.organizer.form.descriptionEnglishSimple') as string}
            rows={5}
          />
        </FormItem>
      </FormGrid>
    </form>
  );
};

const AddressForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { formState, setFormState, setPristine, formProps, formButtons } = useEntryForm(
    category,
    query
  );

  const t = useT();

  return (
    <EntryForm {...formProps}>
      {formButtons}
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.street1') as string}
            type={InputType.text}
            value={formState?.address?.street1 || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                address: { ...formState?.address, street1: e.target.value },
              });
            }}
            required
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.street2') as string}
            type={InputType.text}
            value={formState?.address?.street2 || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                address: { ...formState?.address, street2: e.target.value },
              });
            }}
          />
        </FormItem>
        <FormItem width={FormItemWidth.quarter}>
          <Input
            label={t('categories.organizer.form.zipCode') as string}
            type={InputType.text}
            value={formState?.address?.zipCode || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                address: { ...formState?.address, zipCode: e.target.value },
              });
            }}
            required
          />
        </FormItem>
        <FormItem width={FormItemWidth.quarter}>
          <Input
            label={t('categories.organizer.form.city') as string}
            type={InputType.text}
            value={formState?.address?.city || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                address: { ...formState?.address, city: e.target.value },
              });
            }}
            required
          />
        </FormItem>
      </FormGrid>
    </EntryForm>
  );
};

enum SubjectsAction {
  update = 'update',
}

const subjectsReducer: Reducer<
  { [key: string]: string[] },
  { type: SubjectsAction; payload: { id: string; subjects: string[] } }
> = (state, action) => {
  switch (action.type) {
    case SubjectsAction.update: {
      return { ...state, [action.payload.id]: action.payload.subjects };
    }

    default: {
      break;
    }
  }
};

const ClassificationForm: React.FC<OrganizerFormProps> = ({
  category,
  query,
}: OrganizerFormProps) => {
  const t = useT();

  const { formState, setFormState, setPristine, formProps, formButtons } = useEntryForm(
    category,
    query
  );

  const organizerTypes = useOrganizerTypeList();

  const initialSubjects = useMemo(() => formState?.subjects?.map((subject) => String(subject)), [
    formState,
  ]);

  const organizerSubjects = useMemo(
    () =>
      formState?.type
        ? organizerTypes?.find((type) => String(type.id) === String(formState.type))?.relations
            ?.subjects
        : undefined,
    [formState, organizerTypes]
  );

  const [userSubjects, dispatchSubjects] = useReducer(
    subjectsReducer,
    initialSubjects && initialSubjects[formState?.type]
      ? { [formState.type]: initialSubjects }
      : undefined
  );

  useEffect(() => {
    if (formState?.type && initialSubjects) {
      if (!userSubjects) {
        dispatchSubjects({
          type: SubjectsAction.update,
          payload: { id: formState.type, subjects: initialSubjects },
        });
      }
    }
  }, [formState?.type, initialSubjects, userSubjects]);

  return (
    <EntryForm {...formProps}>
      {formButtons}
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Select
            label={t('categories.organizer.form.type') as string}
            id="ff1"
            value={String(formState?.type) || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                type: String(e.target.value),
                subjects:
                  userSubjects && userSubjects[String(e.target.value)]
                    ? userSubjects[String(e.target.value)]
                    : [],
              });
            }}
            placeholder={t('general.choose') as string}
            required
          >
            {organizerTypes?.map((type, index) => (
              <option key={index} value={String(type.id)}>
                {type.attributes.name}
              </option>
            ))}
          </Select>
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          {organizerSubjects ? (
            <CheckboxList
              label={t('categories.organizer.form.subjects') as string}
              checkboxes={
                organizerSubjects.map((subject) => ({
                  id: `ff-subject-select-${subject.id}`,
                  label: subject.attributes.name,
                  value: String(subject.id),
                })) || []
              }
              onChange={(val) => {
                setPristine(false);
                dispatchSubjects({
                  type: SubjectsAction.update,
                  payload: { id: formState.type, subjects: val },
                });
                setFormState({ ...formState, subjects: val });
              }}
              value={userSubjects && formState?.type ? userSubjects[formState.type] : []}
              required
            />
          ) : (
            <PlaceholderField
              label={`${t('categories.organizer.form.subjects')} (${t('forms.required')})`}
              text={t('categories.organizer.form.chooseTypeFirst') as string}
            />
          )}
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-tags"
            label={`${t('categories.organizer.form.tags') as string} (TBD)`}
            rows={3}
            onChange={() => setPristine(false)}
          />
        </FormItem>
      </FormGrid>
    </EntryForm>
  );
};

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const t = useT();

  const items = [
    {
      title: t('categories.organizer.form.name') as string,
      content: <NameForm category={category} query={query} />,
    },
    {
      title: t('categories.organizer.form.classification') as string,
      content: <ClassificationForm category={category} query={query} />,
    },
    {
      title: `${t('categories.organizer.form.description') as string} (TBD)`,
      content: <DescriptionForm category={category} query={query} />,
    },
    {
      title: t('categories.organizer.form.address') as string,
      content: <AddressForm category={category} query={query} />,
    },
    {
      title: `${t('categories.organizer.form.contact') as string} (TBD)`,
      content: <ContactForm category={category} query={query} />,
    },
  ];

  return (
    <CreateWrapper>
      <Accordion initiallyCollapsed={true} items={items} />
    </CreateWrapper>
  );
};
