import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import { ButtonColor } from '../../../button';
import { Input, InputType } from '../../../input';
import { Category, useMutateList } from '../../../../lib/categories';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { useT } from '../../../../lib/i18n';
import { useLocale } from '../../../../lib/routing';
import { Breakpoint } from '../../../../lib/WindowService';
import { contentGrid, mq } from '../../../globals/Constants';
import { useOrganizerId } from '../../../../lib/useOrganizer';
import { Language } from '../../../../config/locale';

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

const CreateForm = styled.form`
  display: grid;
  grid-template-columns: auto;
  row-gap: 1.5rem;
  grid-column: 1 / -1;
  padding: 3rem 0;

  ${mq(Breakpoint.mid)} {
    padding: 5.25rem 0;
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

const StyledH2 = styled.h2`
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);
  font-weight: 700;
`;

interface CreateEntryFormProps {
  category: Category;
  title: string;
}

export const CreateEntryForm: React.FC<CreateEntryFormProps> = ({
  category,
  title,
}: CreateEntryFormProps) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const call = useApiCall();
  const mutateList = useMutateList(category);
  const organizerId = useOrganizerId();

  const [formState, setFormState] = useState<{
    name: string;
  }>();

  return (
    <CreateWrapper>
      <CreateForm
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();
          e.stopPropagation();

          try {
            const resp = await call<ApiCall>(category.api.create.factory, {
              entry: {
                relations: {
                  translations: [{ language: Language.de, name: formState.name }],
                },
              },
            });

            if (resp.status === 200) {
              const id = resp.body.data.id;

              mutateList();
              router.push(
                category.routes.list({ locale, query: { id, sub: 'info', organizer: organizerId } })
              );
            }
          } catch (e) {
            console.error(e);
          }
        }}
      >
        <StyledH2>{title}</StyledH2>
        <CreateFormCluster>
          <Input
            type={InputType.text}
            label={t('categories.location.form.name') as string}
            id="create-name"
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            required
          />
        </CreateFormCluster>
        <div />
        <CreateFormCluster>
          <Input
            type={InputType.submit}
            value={t('categories.location.form.submit') as string}
            color={ButtonColor.green}
          />
        </CreateFormCluster>
      </CreateForm>
    </CreateWrapper>
  );
};
