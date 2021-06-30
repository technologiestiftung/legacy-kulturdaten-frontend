import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import { ButtonColor } from '../../../components/button';
import { contentGrid, mq } from '../../../components/globals/Constants';
import { Input, InputType } from '../../../components/input';
import { CategoryPage } from '../../../lib/categories';
import { Routes, routes } from '../../../config/routes';
import { useApiCall } from '../../../lib/api';
import { OrganizerCreate } from '../../../lib/api/routes/organizer/create';
import { useT } from '../../../lib/i18n';
import { useLocale } from '../../../lib/routing';
import { Breakpoint } from '../../../lib/WindowService';
import { TitleBar } from '../../navigation/TitleBar';
import { AppWrapper } from '../../wrappers/AppWrapper';

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
const StyledH3 = styled.h3`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
`;

export const OrganizerCreatePage: React.FC<CategoryPage> = ({ category }: CategoryPage) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const call = useApiCall();

  const [formState, setFormState] = useState<{
    name: string;
  }>();

  return (
    <AppWrapper>
      <CreateWrapper>
        <CreateForm
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            e.stopPropagation();

            try {
              const resp = await call<OrganizerCreate>(category.api.create.factory, {
                organizer: {
                  attributes: { name: formState.name },
                },
              });

              if (resp.status === 200) {
                const id = resp.body.data.id;

                router.push(routes[Routes.organizer]({ locale, query: { id, sub: 'info' } }));
              }
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <StyledH2>{t('categories.organizer.form.create')}</StyledH2>
          <StyledH3>{t('categories.organizer.form.baseInfo')}</StyledH3>
          <CreateFormCluster>
            <Input
              type={InputType.text}
              label={t('categories.organizer.form.name') as string}
              id="create-name"
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              required
            />
          </CreateFormCluster>
          <div />
          <CreateFormCluster>
            <Input
              type={InputType.submit}
              value={t('categories.organizer.form.submit') as string}
              color={ButtonColor.green}
            />
          </CreateFormCluster>
        </CreateForm>
      </CreateWrapper>
    </AppWrapper>
  );
};
