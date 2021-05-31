import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { SerializedStyles } from '@emotion/utils';
import { ParsedUrlQuery } from 'node:querystring';
import React, { FormEvent, Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { getApiUrlString, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Organizer, OrganizerSubject } from '../../../lib/api/types/organizer';
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
  /* padding: 0 0.75rem; */

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

const NameForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const call = useApiCall();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [pristine, setPristine] = useState<boolean>(true);

  const initialFormState = useMemo(
    () => ({
      name: entry?.attributes.name,
      address: entry?.relations?.address?.attributes,
      type: entry?.relations?.type?.id || '2',
      subjects:
        Array.isArray(entry?.relations?.subjects) && entry?.relations?.subjects.length > 0
          ? entry?.relations?.subjects?.map((subject) => subject.id)
          : ['2'],
    }),
    [entry]
  );

  const [formState, setFormState] = useState<OrganizerUpdate['request']['body']>(initialFormState);

  useEffect(() => {
    const updatedState =
      typeof formState.name !== 'undefined'
        ? { ...initialFormState, name: formState.name }
        : initialFormState;
    setFormState(updatedState);
  }, [initialFormState, formState.name]);

  const t = useT();

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            organizer: formState,
            id: entry.id,
          });

          if (resp.status === 200) {
            mutate({ ...entry, attributes: { ...entry.attributes, name: formState.name } }, false);
            mutateSwr(getApiUrlString(category.api.list.route));
            setPristine(true);
          }
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <FormButtons>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFormState(initialFormState);
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
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameGerman') as string}
            type={InputType.text}
            value={formState?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ ...formState, name: e.target.value });
            }}
            // disabled={!editing}
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
              setFormState({ ...formState, name: e.target.value });
            }}
            // disabled={!editing}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameGermanSimple') as string}
            type={InputType.text}
            value={formState?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ ...formState, name: e.target.value });
            }}
            // disabled={!editing}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameEnglishSimple') as string}
            type={InputType.text}
            value={formState?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ ...formState, name: e.target.value });
            }}
            // disabled={!editing}
          />
        </FormItem>
      </FormGrid>
    </form>
  );
};

const ContactForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const call = useApiCall();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [pristine, setPristine] = useState<boolean>(true);

  const initialFormState = useMemo(
    () => ({
      name: entry?.attributes.name,
      address: entry?.relations?.address?.attributes,
      type: entry?.relations?.type?.id || '2',
      subjects: entry?.relations?.subjects?.map((subject) => subject.id) || ['2'],
    }),
    [entry]
  );

  const [formState, setFormState] = useState<OrganizerUpdate['request']['body']>(initialFormState);

  useEffect(() => {
    setFormState(initialFormState);
  }, [initialFormState]);

  const t = useT();

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // try {
        //   const resp = await call<OrganizerUpdate>(category.api.update.factory, {
        //     organizer: formState,
        //     id: entry.id,
        //   });

        //   if (resp.status === 200) {
        //     mutate();
        //     mutateSwr(getApiUrlString(category.api.list.route));
        //     setPristine(true);
        //   }
        // } catch (e) {
        //   console.error(e);
        // }
      }}
    >
      <FormButtons>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFormState(initialFormState);
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
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.tel') as string}
            type={InputType.tel}
            // disabled={!editing}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.email') as string}
            type={InputType.email}
            // disabled={!editing}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.website') as string}
            type={InputType.url}
            // disabled={!editing}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-social"
            label={t('categories.organizer.form.social') as string}
            // disabled={!editing}
            rows={3}
          />
        </FormItem>
      </FormGrid>
    </form>
  );
};

const DescriptionForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const call = useApiCall();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [pristine, setPristine] = useState<boolean>(true);

  const initialFormState = useMemo(
    () => ({
      name: entry?.attributes.name,
      address: entry?.relations?.address?.attributes,
      type: entry?.relations?.type?.id || '2',
      subjects: entry?.relations?.subjects?.map((subject) => subject.id) || ['2'],
    }),
    [entry]
  );

  const [formState, setFormState] = useState<OrganizerUpdate['request']['body']>(initialFormState);

  useEffect(() => {
    setFormState(initialFormState);
  }, [initialFormState]);

  const t = useT();

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // try {
        //   const resp = await call<OrganizerUpdate>(category.api.update.factory, {
        //     organizer: formState,
        //     id: entry.id,
        //   });

        //   if (resp.status === 200) {
        //     mutate();
        //     mutateSwr(getApiUrlString(category.api.list.route));
        //     setPristine(true);
        //   }
        // } catch (e) {
        //   console.error(e);
        // }
      }}
    >
      <FormButtons>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFormState(initialFormState);
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
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-g"
            label={t('categories.organizer.form.descriptionGerman') as string}
            rows={5}
            onChange={() => setPristine(false)}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-e"
            label={t('categories.organizer.form.descriptionEnglish') as string}
            rows={5}
            onChange={() => setPristine(false)}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-gs"
            label={t('categories.organizer.form.descriptionGermanSimple') as string}
            rows={5}
            onChange={() => setPristine(false)}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-es"
            label={t('categories.organizer.form.descriptionEnglishSimple') as string}
            rows={5}
            onChange={() => setPristine(false)}
          />
        </FormItem>
      </FormGrid>
    </form>
  );
};

const AddressForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const call = useApiCall();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [pristine, setPristine] = useState<boolean>(true);

  const initialFormState = useMemo(
    () => ({
      name: entry?.attributes.name,
      address: entry?.relations?.address?.attributes,
      type: entry?.relations?.type?.id || '2',
      subjects: entry?.relations?.subjects?.map((subject) => subject.id) || ['2'],
    }),
    [entry]
  );

  const [formState, setFormState] = useState<OrganizerUpdate['request']['body']>(initialFormState);

  useEffect(() => {
    const updatedState =
      typeof formState.address !== 'undefined'
        ? { ...initialFormState, address: formState.address }
        : initialFormState;
    setFormState(updatedState);
  }, [initialFormState, formState.address]);

  const t = useT();

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            organizer: formState,
            id: entry.id,
          });

          if (resp.status === 200) {
            mutate(
              {
                ...entry,
                relations: {
                  ...entry.relations,
                  address: {
                    ...entry.relations.address,
                    attributes: { ...entry.relations.address.attributes, ...formState.address },
                  },
                },
              },
              false
            );
            mutateSwr(getApiUrlString(category.api.list.route));
            setPristine(true);
          }
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <FormButtons>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFormState(initialFormState);
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
            // disabled={!editing}
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
            // disabled={!editing}
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
            // disabled={!editing}
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
            // disabled={!editing}
            required
          />
        </FormItem>
      </FormGrid>
    </form>
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
  const call = useApiCall();
  const t = useT();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [pristine, setPristine] = useState<boolean>(true);

  const organizerTypes = useOrganizerTypeList();

  const initialSubjects = useMemo(
    () => entry?.relations?.subjects?.map((subject) => String(subject.id)) || undefined,
    [entry]
  );

  const initialChosenSubjects = useMemo<{ [key: string]: string[] }>(
    () =>
      entry?.relations?.type ? { [String(entry.relations.type.id)]: initialSubjects } : undefined,
    [entry, initialSubjects]
  );

  const initialFormState = useMemo(
    () => ({
      name: entry?.attributes.name,
      address: entry?.relations?.address?.attributes,
      type: entry?.relations?.type?.id ? String(entry?.relations?.type?.id) : undefined,
    }),
    [entry]
  );

  const [formState, setFormState] = useState<OrganizerUpdate['request']['body']>(initialFormState);

  const organizerSubjects = formState?.type
    ? organizerTypes?.find((type) => String(type.id) === formState.type)?.relations?.subjects
    : undefined;

  const [userSubjects, dispatchSubjects] = useReducer(subjectsReducer, initialChosenSubjects);

  useEffect(() => {
    const updatedState =
      typeof formState.type !== 'undefined'
        ? { ...initialFormState, type: formState.type }
        : initialFormState;
    setFormState(updatedState);
  }, [initialFormState, formState.type]);

  useEffect(() => {
    if (formState?.type) {
      if (!userSubjects) {
        dispatchSubjects({
          type: SubjectsAction.update,
          payload: { id: formState.type, subjects: initialSubjects },
        });
      }
    }
  }, [formState?.type, initialSubjects, userSubjects]);

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            organizer: { ...formState, subjects: userSubjects[formState.type] },
            id: entry.id,
          });

          if (resp.status === 200) {
            mutate(
              {
                ...entry,
                relations: {
                  ...entry.relations,
                  type: { ...entry.relations.type, id: formState.type },
                  subjects: (userSubjects[formState.type] as unknown) as OrganizerSubject[],
                },
              },
              false
            );
            mutateSwr(getApiUrlString(category.api.list.route));
            setPristine(true);
          }
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <FormButtons>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFormState(initialFormState);
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
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Select
            label={t('categories.organizer.form.type') as string}
            id="ff1"
            value={formState?.type || ''}
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
            // disabled={!editing}
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
                // setChosenSubjects({ ...chosenSubjects, [formState?.type]: val });
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
            // disabled={!editing}
          />
        </FormItem>
      </FormGrid>
    </form>
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
