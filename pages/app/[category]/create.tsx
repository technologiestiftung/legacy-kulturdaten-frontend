import styled from '@emotion/styled';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { contentGrid, mq } from '../../../components/globals/Constants';
import { Input, InputType } from '../../../components/input';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { Categories, useCategories } from '../../../config/categories';
import { Routes, routes } from '../../../config/routes';
import { useApiCall } from '../../../lib/api';
import { OrganizerCreate, organizerCreateFactory } from '../../../lib/api/routes/organizer/create';
import { useT } from '../../../lib/i18n';
import { useLocale } from '../../../lib/routing';
import { Breakpoint } from '../../../lib/WindowService';

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

  ${mq(Breakpoint.mid)} {
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

const EntryIndexPage: NextPage = () => {
  const router = useRouter();
  const categories = useCategories();
  const locale = useLocale();
  const t = useT();
  const [formState, setFormState] = useState<{
    name: string;
    street: string;
    street2: string;
    zip: string;
    city: string;
  }>();
  const call = useApiCall();

  const category = router?.query?.category as Categories;
  const categoryStructure = categories[category];

  const categoryTitle = categoryStructure?.title.singular;

  return (
    <AppWrapper
      titleBar={<TitleBar title={`${t('general.create')} ${categoryTitle ? categoryTitle : ''}`} />}
    >
      <CreateWrapper>
        <CreateForm
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            e.stopPropagation();

            console.log(e);
            console.log(formState);

            try {
              const resp = await call<OrganizerCreate>(organizerCreateFactory, {
                organizer: {
                  name: formState.name,
                  address: {
                    street1: formState.street,
                    street2: formState.street2,
                    zipCode: formState.zip,
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
          <h2>Create Entry</h2>
          <h3>Base info</h3>
          <CreateFormCluster>
            <Input
              type={InputType.text}
              label="Name"
              id="create-name"
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              required
            />
          </CreateFormCluster>
          <h3>Address</h3>
          <CreateFormCluster>
            <Input
              type={InputType.text}
              label="Street"
              id="create-street"
              onChange={(e) => setFormState({ ...formState, street: e.target.value })}
              required
            />
            <Input
              type={InputType.text}
              label="House number"
              id="create-street2"
              onChange={(e) => setFormState({ ...formState, street2: e.target.value })}
              required
            />
            <Input
              type={InputType.text}
              label="Zip code"
              id="create-zip"
              onChange={(e) => setFormState({ ...formState, zip: e.target.value })}
              required
            />
            <Input
              type={InputType.text}
              label="City"
              id="create-city"
              onChange={(e) => setFormState({ ...formState, city: e.target.value })}
              required
            />
          </CreateFormCluster>
          <CreateFormCluster>
            <Input type={InputType.submit} value="Create" />
          </CreateFormCluster>
        </CreateForm>
      </CreateWrapper>
    </AppWrapper>
  );
};

export default EntryIndexPage;
