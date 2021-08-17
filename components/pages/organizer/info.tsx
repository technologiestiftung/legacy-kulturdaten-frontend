import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Language } from '../../../config/locale';
import { ApiCall, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerTranslationCreate } from '../../../lib/api/routes/organizer/translation/create';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Address } from '../../../lib/api/types/address';
import { CategoryEntry, PublishedStatus } from '../../../lib/api/types/general';
import { Organizer, OrganizerTranslation } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry, useMutateList } from '../../../lib/categories';
import { DateFormat, useDate } from '../../../lib/date';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { Input, InputType } from '../../input';
import { useLinkList } from '../../linklist';
import { EntryFormProps } from '../helpers/form';
import { useDescription } from '../helpers/form/Description';
import { useName } from '../helpers/form/Name';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';

const useNameForm = ({
  category,
  query,
}: EntryFormProps): {
  renderedNameForm: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
} => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
  } = useName<Organizer, OrganizerShow, OrganizerTranslation, OrganizerTranslationCreate>({
    category,
    query,
    language: Language.de,
    label: t('categories.organizer.form.nameGerman') as string,
  });

  const {
    form: setNameEnglish,
    onSubmit: onSubmitEnglish,
    pristine: pristineEnglish,
    reset: resetEnglish,
  } = useName<Organizer, OrganizerShow, OrganizerTranslation, OrganizerTranslationCreate>({
    category,
    query,
    language: Language.en,
    label: t('categories.organizer.form.nameEnglish') as string,
  });

  const pristine = useMemo(() => pristineEnglish && pristineGerman, [
    pristineEnglish,
    pristineGerman,
  ]);

  return {
    renderedNameForm: (
      <div>
        <EntryFormHead title={t('categories.organizer.form.name') as string} />
        <FormGrid>
          <FormItem width={FormItemWidth.half}>{setNameGerman}</FormItem>
          <FormItem width={FormItemWidth.half}>{setNameEnglish}</FormItem>
        </FormGrid>
      </div>
    ),
    submit: async () => {
      onSubmitEnglish();
      onSubmitGerman();
    },
    pristine,
  };
};

const StyledDescriptionForm = styled.div`
  padding: 0 0 1.5rem;
`;

const useDescriptionForm = ({
  category,
  query,
}: EntryFormProps): {
  renderedDescriptionForm: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
} => {
  const t = useT();

  const {
    renderedDescription: renderedDescriptionGerman,
    submit: submitGerman,
    pristine: pristineGerman,
  } = useDescription({
    category,
    query,
    language: Language.de,
    title: t('categories.organizer.form.descriptionGerman') as string,
  });
  const {
    renderedDescription: renderedDescriptionEnglish,
    submit: submitEnglish,
    pristine: pristineEnglish,
  } = useDescription({
    category,
    query,
    language: Language.en,
    title: t('categories.organizer.form.descriptionEnglish') as string,
  });

  const pristine = useMemo(() => pristineEnglish && pristineGerman, [
    pristineEnglish,
    pristineGerman,
  ]);

  return {
    renderedDescriptionForm: (
      <StyledDescriptionForm>
        <EntryFormHead title={t('categories.organizer.form.description') as string} />
        {renderedDescriptionGerman}
        {renderedDescriptionEnglish}
      </StyledDescriptionForm>
    ),
    submit: async () => {
      submitGerman();
      submitEnglish();
    },
    pristine,
  };
};

const useLinksForm = ({
  category,
  query,
}: EntryFormProps): {
  renderedForm: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
} => {
  const t = useT();
  const call = useApiCall();
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const mutateList = useMutateList(category);

  const initialLinks = useMemo(
    () => entry?.data?.relations?.links?.map((link) => link.attributes?.url),
    [entry?.data?.relations?.links]
  );

  const [links, setLinks] = useState<string[]>(initialLinks);

  const [linksFromApi, setLinksFromApi] = useState<string[]>();

  const pristine = useMemo(
    () =>
      links === initialLinks ||
      (Array.isArray(links) &&
        Array.isArray(initialLinks) &&
        links.length === initialLinks.length &&
        links.reduce((allLinksEqual, link, index) => {
          if (link !== initialLinks[index]) {
            return false;
          }
          return allLinksEqual;
        }, true)),
    [links, initialLinks]
  );

  const { renderedLinkList, init } = useLinkList({
    links: links || [],
    onChange: (updatedLinks) => {
      setLinks(updatedLinks);
    },
    maxLinks: 20,
  });

  useEffect(() => {
    if (initialLinks !== linksFromApi) {
      setLinksFromApi(initialLinks);
      setLinks(initialLinks);
      init(initialLinks);
    }
  }, [init, linksFromApi, initialLinks]);

  return {
    renderedForm: (
      <StyledDescriptionForm>
        <EntryFormHead title={t('categories.organizer.form.links') as string} />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>{renderedLinkList}</FormItem>
        </FormGrid>
      </StyledDescriptionForm>
    ),
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            id: entry.data.id,
            organizer: {
              relations: {
                links,
              },
            },
          });

          if (resp.status === 200) {
            mutate();
            mutateList();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
  };
};

const useAddressForm = ({
  category,
  query,
}: EntryFormProps): {
  renderedAddressForm: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
} => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);

  const initialAddress = useMemo(() => entry?.data?.relations?.address, [
    entry?.data?.relations?.address,
  ]);

  const [address, setAddress] = useState<Address>(initialAddress);
  const [pristine, setPristine] = useState(true);

  const required = useMemo(() => entry?.data?.attributes?.status === PublishedStatus.published, [
    entry?.data?.attributes?.status,
  ]);

  useEffect(() => {
    if (pristine) {
      setAddress(initialAddress);
    }
  }, [pristine, initialAddress]);

  const t = useT();

  return {
    renderedAddressForm: (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <EntryFormHead title={t('categories.organizer.form.address') as string} />
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.street1') as string}
              type={InputType.text}
              value={address?.attributes?.street1 || ''}
              onChange={(e) => {
                setPristine(false);
                setAddress({
                  ...address,
                  attributes: {
                    ...address?.attributes,
                    street1: e.target.value,
                  },
                });
              }}
              required={required}
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.street2') as string}
              type={InputType.text}
              value={address?.attributes?.street2 || ''}
              onChange={(e) => {
                setPristine(false);
                setAddress({
                  ...address,
                  attributes: {
                    ...address?.attributes,
                    street2: e.target.value,
                  },
                });
              }}
            />
          </FormItem>
          <FormItem width={FormItemWidth.quarter}>
            <Input
              label={t('categories.organizer.form.zipCode') as string}
              type={InputType.text}
              value={address?.attributes?.zipCode || ''}
              onChange={(e) => {
                setPristine(false);
                setAddress({
                  ...address,
                  attributes: {
                    ...address?.attributes,
                    zipCode: e.target.value,
                  },
                });
              }}
              required={required}
            />
          </FormItem>
          <FormItem width={FormItemWidth.quarter} alignSelf="flex-end">
            <Input
              label={t('categories.organizer.form.city') as string}
              type={InputType.text}
              value={address?.attributes?.city || ''}
              onChange={(e) => {
                setPristine(false);
                setAddress({
                  ...address,
                  attributes: {
                    ...address?.attributes,
                    city: e.target.value,
                  },
                });
              }}
              required={required}
            />
          </FormItem>
        </FormGrid>
      </form>
    ),
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            id: entry.data.id,
            organizer: {
              relations: {
                address,
              },
            },
          });

          if (resp.status === 200) {
            mutate();
            mutateList();
            setTimeout(() => setPristine(true), 500);
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
  };
};

const useContactForm = ({
  category,
  query,
}: EntryFormProps): {
  renderedForm: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
} => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);

  const initialAttributes = useMemo(() => entry?.data?.attributes, [entry?.data?.attributes]);

  const [attributes, setAttributes] = useState<Organizer['data']['attributes']>(initialAttributes);
  const [pristine, setPristine] = useState(true);

  useEffect(() => {
    if (pristine) {
      setAttributes(initialAttributes);
    }
  }, [pristine, initialAttributes]);

  const t = useT();

  return {
    renderedForm: (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <EntryFormHead title={t('categories.organizer.form.contact') as string} />
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.email') as string}
              type={InputType.email}
              value={attributes?.email || ''}
              onChange={(e) => {
                setPristine(false);
                setAttributes({
                  ...attributes,
                  email: e.target.value,
                });
              }}
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.tel') as string}
              type={InputType.tel}
              value={attributes?.phone || ''}
              onChange={(e) => {
                setPristine(false);
                setAttributes({
                  ...attributes,
                  phone: e.target.value,
                });
              }}
            />
          </FormItem>
          <FormItem width={FormItemWidth.full}>
            <Input
              label={t('categories.organizer.form.website') as string}
              type={InputType.url}
              value={attributes?.homepage || ''}
              onChange={(e) => {
                setPristine(false);
                setAttributes({
                  ...attributes,
                  homepage: e.target.value,
                });
              }}
            />
          </FormItem>
        </FormGrid>
      </form>
    ),
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            id: entry.data.id,
            organizer: {
              attributes: {
                email: attributes?.email,
                homepage: attributes?.homepage,
                phone: attributes?.phone,
              },
            },
          });

          if (resp.status === 200) {
            mutate();
            mutateList();
            setTimeout(() => setPristine(true), 500);
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
  };
};

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { renderedNameForm, submit: submitNameForm, pristine: namePristine } = useNameForm({
    category,
    query,
  });
  const {
    renderedAddressForm,
    submit: submitAddressForm,
    pristine: addressPristine,
  } = useAddressForm({ category, query });
  const {
    renderedForm: renderedLinksForm,
    submit: submitLinksForm,
    pristine: linksPristine,
  } = useLinksForm({
    category,
    query,
  });
  const {
    renderedForm: renderedContactForm,
    submit: submitContactForm,
    pristine: contactPristine,
  } = useContactForm({
    category,
    query,
  });
  const {
    renderedDescriptionForm,
    submit: submitDescriptionForm,
    pristine: descriptionPristine,
  } = useDescriptionForm({
    category,
    query,
  });
  const router = useRouter();

  const { entry } = useEntry<CategoryEntry, ApiCall>(category, router?.query);

  const renderedEntryHeader = useEntryHeader({ category, query });

  const date = useDate();

  const formattedDate = entry?.data?.attributes?.updatedAt
    ? date(new Date(entry?.data?.attributes.updatedAt), DateFormat.dateTime)
    : undefined;

  const pristine = useMemo(
    () =>
      ![
        namePristine,
        addressPristine,
        linksPristine,
        contactPristine,
        descriptionPristine,
      ].includes(false),
    [addressPristine, contactPristine, descriptionPristine, linksPristine, namePristine]
  );

  return (
    <>
      <Save
        onClick={async () => {
          submitNameForm();
          submitAddressForm();
          submitDescriptionForm();
          submitLinksForm();
          submitContactForm();
        }}
        date={formattedDate}
        active={!pristine}
      />

      {renderedEntryHeader}
      <EntryFormWrapper>
        <EntryFormContainer>{renderedNameForm}</EntryFormContainer>
        <EntryFormContainer>{renderedDescriptionForm}</EntryFormContainer>
        <EntryFormContainer>{renderedContactForm}</EntryFormContainer>
        <EntryFormContainer>{renderedLinksForm}</EntryFormContainer>
        <EntryFormContainer>{renderedAddressForm}</EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};
