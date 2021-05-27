import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { SerializedStyles } from '@emotion/utils';
import { FormEvent, useEffect, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { getApiUrlString, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry, useOrganizerTypeList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { Breakpoint } from '../../../lib/WindowService';
import { Accordion } from '../../accordion';
import { Button, ButtonColor } from '../../button';
import { Checkbox } from '../../checkbox';
import { CheckboxList } from '../../checkbox/CheckboxList';
import { contentGrid, insetBorder, mq } from '../../globals/Constants';
import { Input, InputType } from '../../input';
import { Select } from '../../select';

const CreateWrapper = styled.div``;

const InfoHead = styled.div`
  background: var(--white);
  box-shadow: ${insetBorder(false, true, false, true)}, 0px 1px 0px var(--grey-400);
  padding: 0.375rem 0;
  position: relative;
  z-index: 1;

  ${contentGrid(4)}

  ${mq(Breakpoint.mid)} {
    box-shadow: ${insetBorder(false, true, false, false)}, 0px 1px 0px var(--grey-400);
    position: sticky;
    top: 0;
    left: 0;
    ${contentGrid(8)}
  }
`;

const InfoHeadContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  grid-column: 1 / -1;
  flex-wrap: wrap;

  padding: 0 0.75rem;

  ${mq(Breakpoint.ultra)} {
    padding: 0;
    grid-column: 2 / -2;
  }
`;

const InfoHeadButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const InfoHeadButton = styled.div`
  margin-right: 0.75rem;
  padding: 0.375rem 0;

  &:last-of-type {
    margin-right: 0;
  }
`;

const InfoH2 = styled.h2`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;
  padding: 0.375rem 0;
`;

const CreateForm = styled.form``;

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

  ${({ width }) => formItemWidthMap[width]}/* box-shadow: ${insetBorder(true, true, false)}; */
`;

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const t = useT();

  const organizerTypes = useOrganizerTypeList();

  const initialSubjects = entry?.relations?.subjects?.map((subject) => subject.id) || [];

  const [chosenSubjects, setChosenSubjects] = useState<{ [key: string]: string[] }>(
    entry?.relations?.type ? { [String(entry.relations.type.id)]: initialSubjects } : undefined
  );
  const [formState, setFormState] = useState<OrganizerUpdate['request']['body']>({
    name: entry?.attributes.name,
    address: entry?.relations?.address?.attributes,
    type: String(entry?.relations?.type?.id),
    subjects: initialSubjects,
  });
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    setFormState(
      entry
        ? {
            name: entry.attributes.name,
            address: entry.relations.address.attributes,
          }
        : undefined
    );
  }, [entry]);

  const editButtonLabel = editing
    ? (t('categories.organizer.form.editCancel') as string)
    : (t('categories.organizer.form.edit') as string);
  const editButtonIcon = editing ? 'XOctagon' : 'Edit';
  const editButtonColor = editing ? ButtonColor.yellow : ButtonColor.blue;

  const organizerSubjects = formState?.type
    ? organizerTypes?.find((type) => String(type.id) === formState.type)?.relations?.subjects
    : undefined;

  const items = [
    {
      title: t('categories.organizer.form.name') as string,
      content: (
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.nameGerman') as string}
              type={InputType.text}
              value={formState?.name || ''}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.nameEnglish') as string}
              type={InputType.text}
              value={formState?.name || ''}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.nameGermanSimple') as string}
              type={InputType.text}
              value={formState?.name || ''}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.nameEnglishSimple') as string}
              type={InputType.text}
              value={formState?.name || ''}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              disabled={!editing}
            />
          </FormItem>
        </FormGrid>
      ),
    },
    {
      title: t('categories.organizer.form.classification') as string,
      content: (
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Select
              label={t('categories.organizer.form.type') as string}
              id="ff1"
              value={formState?.type}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  type: String(e.target.value),
                  subjects:
                    chosenSubjects && chosenSubjects[String(e.target.value)]
                      ? chosenSubjects[String(e.target.value)]
                      : [],
                })
              }
              disabled={!editing}
            >
              {typeof formState?.type === 'undefined' && <option>{t('general.choose')}</option>}
              {organizerTypes?.map((type, index) => (
                <option key={index} value={String(type.id)}>
                  {type.attributes.name}
                </option>
              ))}
            </Select>
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <CheckboxList label={t('categories.organizer.form.subjects') as string}>
              {organizerSubjects
                ? organizerSubjects.map((subject, index) => (
                    <Checkbox
                      key={index}
                      id={`ofs-${index}`}
                      label={subject.attributes.name}
                      checked={
                        chosenSubjects &&
                        chosenSubjects[formState?.type]?.includes(String(subject.id))
                      }
                      onChange={(e) => {
                        const cleanSubjects =
                          chosenSubjects && chosenSubjects[formState?.type]
                            ? chosenSubjects[formState?.type].filter(
                                (id) => id !== String(subject.id)
                              )
                            : [];
                        if (e.target.checked) {
                          const newSubjects = cleanSubjects.concat([String(subject.id)]);
                          setChosenSubjects({ ...chosenSubjects, [formState.type]: newSubjects });
                          setFormState({ ...formState, subjects: newSubjects });
                        } else {
                          setChosenSubjects({ ...chosenSubjects, [formState.type]: cleanSubjects });
                          setFormState({ ...formState, subjects: cleanSubjects });
                        }
                      }}
                      disabled={!editing}
                    />
                  ))
                : undefined}
            </CheckboxList>
          </FormItem>
          <FormItem width={FormItemWidth.full}>
            <Input
              label={t('categories.organizer.form.tags') as string}
              type={InputType.text}
              disabled={!editing}
            />
          </FormItem>
        </FormGrid>
      ),
    },
    {
      title: t('categories.organizer.form.description') as string,
      content: (
        <FormGrid>
          <FormItem width={FormItemWidth.full}>
            <Input
              label={t('categories.organizer.form.descriptionGerman') as string}
              type={InputType.text}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.full}>
            <Input
              label={t('categories.organizer.form.descriptionEnglish') as string}
              type={InputType.text}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.full}>
            <Input
              label={t('categories.organizer.form.descriptionGermanSimple') as string}
              type={InputType.text}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.full}>
            <Input
              label={t('categories.organizer.form.descriptionEnglishSimple') as string}
              type={InputType.text}
              disabled={!editing}
            />
          </FormItem>
        </FormGrid>
      ),
    },
    {
      title: t('categories.organizer.form.address') as string,
      content: (
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.street1') as string}
              type={InputType.text}
              value={formState?.address?.street1 || ''}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  address: { ...formState?.address, street1: e.target.value },
                })
              }
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.street2') as string}
              type={InputType.text}
              value={formState?.address?.street2 || ''}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  address: { ...formState?.address, street2: e.target.value },
                })
              }
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.quarter}>
            <Input
              label={t('categories.organizer.form.zipCode') as string}
              type={InputType.text}
              value={formState?.address?.zipCode || ''}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  address: { ...formState?.address, zipCode: e.target.value },
                })
              }
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.quarter}>
            <Input
              label={t('categories.organizer.form.city') as string}
              type={InputType.text}
              value={formState?.address?.city || ''}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  address: { ...formState?.address, city: e.target.value },
                })
              }
              disabled={!editing}
            />
          </FormItem>
        </FormGrid>
      ),
    },
    {
      title: t('categories.organizer.form.contact') as string,
      content: (
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.tel') as string}
              type={InputType.tel}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.email') as string}
              type={InputType.email}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.website') as string}
              type={InputType.url}
              disabled={!editing}
            />
          </FormItem>
          <FormItem width={FormItemWidth.full}>
            <Input
              label={t('categories.organizer.form.social') as string}
              type={InputType.text}
              disabled={!editing}
            />
          </FormItem>
        </FormGrid>
      ),
    },
  ];

  return (
    <CreateWrapper>
      <InfoHead>
        <InfoHeadContainer>
          <InfoH2>{t('categories.organizer.tabs.info')}</InfoH2>
          <InfoHeadButtons>
            <InfoHeadButton>
              <Button
                onClick={() => {
                  if (editing) {
                    setFormState({
                      name: entry?.attributes.name,
                      address: entry?.relations.address.attributes,
                    });
                  }
                  setEditing(!editing);
                }}
                icon={editButtonIcon}
                color={editButtonColor}
              >
                {editButtonLabel}
              </Button>
            </InfoHeadButton>
            <InfoHeadButton>
              <Button
                onClick={async () => {
                  try {
                    const resp = await call<OrganizerUpdate>(category.api.update.factory, {
                      organizer: formState,
                      id: entry.id,
                    });

                    if (resp.status === 200) {
                      mutate();
                      mutateSwr(getApiUrlString(category.api.list.route));
                      setEditing(false);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
                icon="CheckSquare"
                color={ButtonColor.green}
                disabled={!editing}
              >
                {t('categories.organizer.form.save')}
              </Button>
            </InfoHeadButton>
          </InfoHeadButtons>
        </InfoHeadContainer>
      </InfoHead>
      <CreateForm
        aria-disabled={!editing}
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Accordion initiallyCollapsed={false} items={items} />
      </CreateForm>
    </CreateWrapper>
  );
};
