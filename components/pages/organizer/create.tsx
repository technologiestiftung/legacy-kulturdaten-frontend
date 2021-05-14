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
  /* padding-bottom: var(--line-height-600); */
`;
const StyledH3 = styled.h3`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OrganizerCreatePageProps extends CategoryPage {}

export const OrganizerCreatePage: React.FC<OrganizerCreatePageProps> = ({
  category,
}: OrganizerCreatePageProps) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const call = useApiCall();

  const [formState, setFormState] = useState<{
    name: string;
    street1: string;
    street2: string;
    zipCode: string;
    city: string;
  }>();

  return (
    <AppWrapper
      titleBar={
        <TitleBar
          title={`${t('categories.organizer.form.create') as string}${
            formState?.name && formState.name.length > 0 ? ` – ${formState.name}` : ''
          }`}
        />
      }
    >
      <CreateWrapper>
        <CreateForm
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            e.stopPropagation();

            console.log(e);
            console.log(formState);

            try {
              const resp = await call<OrganizerCreate>(category.api.create.factory, {
                organizer: {
                  name: formState.name,
                  address: {
                    street1: formState.street1,
                    street2: formState.street2 || ' ',
                    zipCode: formState.zipCode,
                    city: formState.city,
                  },
                },
              });

              if (resp.status === 200) {
                const id = resp.body.data.id;

                router.push(routes[Routes.organizer]({ locale, query: { entry: id } }));
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
          <StyledH3>{t('categories.organizer.form.address')}</StyledH3>
          <CreateFormCluster>
            <Input
              type={InputType.text}
              label={t('categories.organizer.form.street1') as string}
              id="create-street"
              onChange={(e) => setFormState({ ...formState, street1: e.target.value })}
              required
            />
            <Input
              type={InputType.text}
              label={t('categories.organizer.form.street2') as string}
              id="create-street2"
              onChange={(e) => setFormState({ ...formState, street2: e.target.value })}
            />
            <Input
              type={InputType.text}
              label={t('categories.organizer.form.zipCode') as string}
              id="create-zip"
              onChange={(e) => setFormState({ ...formState, zipCode: e.target.value })}
              required
            />
            <Input
              type={InputType.text}
              label={t('categories.organizer.form.city') as string}
              id="create-city"
              onChange={(e) => setFormState({ ...formState, city: e.target.value })}
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