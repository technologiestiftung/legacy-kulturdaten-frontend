import styled from '@emotion/styled';
import { FormEvent, useEffect, useState } from 'react';
import { useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { Breakpoint } from '../../../lib/WindowService';
import { Button, ButtonColor } from '../../button';
import { contentGrid, mq } from '../../globals/Constants';
import { Input, InputType } from '../../input';

const CreateWrapper = styled.div`
  padding: 0 0.75rem;
  ${contentGrid(4)}

  ${mq(Breakpoint.mid)} {
    padding: 0;
    ${contentGrid(8)}
  }

  ${mq(Breakpoint.mid)} {
    ${contentGrid(10)}
  }
`;

const InfoHead = styled.div`
  grid-column: 1 / -1;
  padding: 0;

  ${mq(Breakpoint.mid)} {
    padding: 5.25rem 0 0;
    grid-column: 2 / -2;
  }
`;

const CreateForm = styled.form`
  display: grid;
  grid-template-columns: auto;
  row-gap: 1.5rem;
  grid-column: 1 / -1;
  padding: 3rem 0;

  ${mq(Breakpoint.mid)} {
    padding: 2.25rem 0;
    grid-column: 2 / -2;
  }
`;

const CreateFormCluster = styled.div`
  display: grid;
  grid-template-columns: auto;
  row-gap: 1.5rem;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 1fr;
    column-gap: 1.5rem;
  }
`;

const StyledH3 = styled.h3`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
`;

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const t = useT();

  const [formState, setFormState] = useState<Organizer['attributes']>(entry?.attributes);
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    setFormState(entry?.attributes);
  }, [entry]);

  return (
    <CreateWrapper>
      <InfoHead>
        <Button
          onClick={() => {
            if (editing) {
              setFormState(entry?.attributes);
            }
            setEditing(!editing);
          }}
        >
          {editing
            ? (t('categories.organizer.form.editCancel') as string)
            : (t('categories.organizer.form.edit') as string)}
        </Button>
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
              mutate(
                {
                  status: 200,
                  body: {
                    data: {
                      ...entry,
                      attributes: formState,
                    },
                  },
                },
                false
              );
              setEditing(false);
            }
          } catch (e) {
            console.error(e);
          }
        }}
      >
        {/* <StyledH2>{t('categories.organizer.form.create')}</StyledH2> */}
        <StyledH3>{t('categories.organizer.form.baseInfo')}</StyledH3>
        <CreateFormCluster>
          <Input
            type={InputType.text}
            label={t('categories.organizer.form.name') as string}
            id="create-name"
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            value={formState?.name}
            required
            disabled={!editing}
          />
        </CreateFormCluster>
        <StyledH3>{t('categories.organizer.form.address')}</StyledH3>
        <CreateFormCluster>
          <Input
            type={InputType.text}
            label={t('categories.organizer.form.street1') as string}
            id="create-street"
            value={formState?.address.street1}
            onChange={(e) =>
              setFormState({
                ...formState,
                address: { ...formState.address, street1: e.target.value },
              })
            }
            required
            disabled={!editing}
          />
          <Input
            type={InputType.text}
            label={t('categories.organizer.form.street2') as string}
            id="create-street2"
            value={formState?.address.street2}
            onChange={(e) =>
              setFormState({
                ...formState,
                address: { ...formState.address, street2: e.target.value },
              })
            }
            disabled={!editing}
          />
          <Input
            type={InputType.text}
            label={t('categories.organizer.form.zipCode') as string}
            id="create-zip"
            value={formState?.address.zipCode}
            onChange={(e) =>
              setFormState({
                ...formState,
                address: { ...formState.address, zipCode: e.target.value },
              })
            }
            required
            disabled={!editing}
          />
          <Input
            type={InputType.text}
            label={t('categories.organizer.form.city') as string}
            id="create-city"
            value={formState?.address.city}
            onChange={(e) =>
              setFormState({
                ...formState,
                address: { ...formState.address, city: e.target.value },
              })
            }
            required
            disabled={!editing}
          />
        </CreateFormCluster>
        <div />
        <CreateFormCluster>
          <Input
            type={InputType.submit}
            value={t('categories.organizer.form.save') as string}
            color={ButtonColor.green}
            disabled={!editing}
          />
        </CreateFormCluster>
      </CreateForm>
    </CreateWrapper>
  );
};
