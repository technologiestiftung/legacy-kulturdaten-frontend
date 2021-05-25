import styled from '@emotion/styled';
import { FormEvent, useEffect, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { getApiUrlString, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Address } from '../../../lib/api/types/address';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { Breakpoint } from '../../../lib/WindowService';
import { Accordion } from '../../accordion';
import { Button, ButtonColor } from '../../button';
import { contentGrid, insetBorder, mq } from '../../globals/Constants';
import { Input, InputType } from '../../input';
import { Select } from '../../select';

const CreateWrapper = styled.div``;

const InfoHead = styled.div`
  background: var(--white);
  box-shadow: ${insetBorder(false, true, false, true)}, 0px 1px 0px var(--grey-400);
  padding: 0.375rem 0;

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

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 1fr;
  }
`;

export enum FormItemWidth {
  half = 'half',
  full = 'full',
}

const FormItem = styled.div<{ width: FormItemWidth }>`
  /* padding: 0 0.75rem; */

  grid-column: ${({ width }) => (width === FormItemWidth.full ? '1 / -1' : '')};
  /* box-shadow: ${insetBorder(true, true, false)}; */
`;

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const t = useT();

  const [formState, setFormState] = useState<{ name: string; address: Address['attributes'] }>({
    name: entry?.attributes.name,
    address: entry?.relations.address.attributes,
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

  const items = [
    {
      title: 'Bezeichnung',
      content: (
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Input label="Deutsch" type={InputType.text} value=" " />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input label="Englisch" type={InputType.text} value=" " />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input label="Deutsch: Einfache Sprache" type={InputType.text} value=" " />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input label="Englisch: Einfache Sprache" type={InputType.text} value=" " />
          </FormItem>
        </FormGrid>
      ),
    },
    {
      title: 'Einordnung',
      content: (
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Select label="Typ" id="ff1">
              <option>Museum</option>
            </Select>
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Select label="Sparte" id="ff2">
              <option>Geschichte</option>
            </Select>
          </FormItem>
          <FormItem width={FormItemWidth.full}>
            <Input label="Tags" type={InputType.text} value=" " />
          </FormItem>
        </FormGrid>
      ),
    },
  ];

  return (
    <CreateWrapper>
      <InfoHead>
        <InfoHeadContainer>
          <InfoH2>Informationen</InfoH2>
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
                color={ButtonColor.yellow}
              >
                {editButtonLabel}
              </Button>
            </InfoHeadButton>
            <InfoHeadButton>
              <Button
                onClick={() => {
                  console.log('save');
                }}
                icon="CheckSquare"
                color={ButtonColor.green}
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
      >
        <Accordion initiallyCollapsed={true} items={items} />
      </CreateForm>
    </CreateWrapper>
  );
};
