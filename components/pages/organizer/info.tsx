import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language } from '../../../config/locale';
import { ApiCall, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerTranslationCreate } from '../../../lib/api/routes/organizer/translation/create';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Address } from '../../../lib/api/types/address';
import { CategoryEntry, PublishedStatus } from '../../../lib/api/types/general';
import { Organizer, OrganizerTranslation } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry, useMutateList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
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
import { useSaveDate } from '../helpers/useSaveDate';

type EntryFormHook = (
  props: EntryFormProps
) => {
  renderedForm: React.ReactElement;
  submit: () => Promise<void>;
  pristine: boolean;
  reset: () => void;
  valid: boolean;
};

const useNameForm: EntryFormHook = ({ category, query }) => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
    valid: validGerman,
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
    valid: validEnglish,
  } = useName<Organizer, OrganizerShow, OrganizerTranslation, OrganizerTranslationCreate>({
    category,
    query,
    language: Language.en,
    label: t('categories.organizer.form.nameEnglish') as string,
  });

  const pristine = useMemo(() => Boolean(pristineGerman && pristineEnglish), [
    pristineEnglish,
    pristineGerman,
  ]);

  const valid = useMemo(() => Boolean(validGerman && validEnglish), [validEnglish, validGerman]);

  return {
    renderedForm: (
      <div>
        <EntryFormHead title={`${t('categories.organizer.form.name') as string}`} valid={valid} />
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
    reset: () => {
      resetGerman();
      resetEnglish();
    },
    valid,
  };
};

const StyledDescriptionForm = styled.div`
  padding: 0 0 1.5rem;
`;

const useDescriptionForm: EntryFormHook = ({ category, query }) => {
  const t = useT();
  const { entry } = useEntry(category, query);

  const isPublished = entry?.data?.attributes?.status === PublishedStatus.published;

  const {
    renderedDescription: renderedDescriptionGerman,
    submit: submitGerman,
    pristine: pristineGerman,
    valid: validGerman,
  } = useDescription({
    category,
    query,
    language: Language.de,
    title: t('categories.organizer.form.descriptionGerman') as string,
    required: isPublished,
  });

  const {
    renderedDescription: renderedDescriptionEnglish,
    submit: submitEnglish,
    pristine: pristineEnglish,
    valid: validEnglish,
  } = useDescription({
    category,
    query,
    language: Language.en,
    title: t('categories.organizer.form.descriptionEnglish') as string,
    required: false,
  });

  const pristine = useMemo(() => pristineEnglish && pristineGerman, [
    pristineEnglish,
    pristineGerman,
  ]);

  const valid = useMemo(() => validGerman && validEnglish, [validEnglish, validGerman]);

  return {
    renderedForm: (
      <StyledDescriptionForm>
        <EntryFormHead
          title={`${t('categories.organizer.form.description') as string}`}
          valid={valid}
        />
        {renderedDescriptionGerman}
        {renderedDescriptionEnglish}
      </StyledDescriptionForm>
    ),
    submit: async () => {
      submitGerman();
      submitEnglish();
    },
    pristine,
    reset: () => undefined,
    valid,
  };
};

const useLinksForm: EntryFormHook = ({ category, query }) => {
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

  const { renderedLinkList, init, valid } = useLinkList({
    links: links || [],
    onChange: (updatedLinks) => {
      setLinks(updatedLinks);
    },
    maxLinks: 20,
    required: false,
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
        <EntryFormHead title={`${t('categories.organizer.form.links') as string}`} valid={valid} />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>{renderedLinkList}</FormItem>
        </FormGrid>
      </StyledDescriptionForm>
    ),
    submit: async () => {
      if (valid && !pristine) {
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
    reset: () => undefined,
    valid,
  };
};

const useAddressForm: EntryFormHook = ({ category, query }) => {
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

  const valid = useMemo(
    () =>
      !required ||
      (address?.attributes?.street1?.length > 0 &&
        address?.attributes?.zipCode?.length > 0 &&
        address?.attributes?.city?.length > 0),
    [
      address?.attributes?.city?.length,
      address?.attributes?.street1?.length,
      address?.attributes?.zipCode?.length,
      required,
    ]
  );

  return {
    renderedForm: (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <EntryFormHead
          title={`${t('categories.organizer.form.address') as string}`}
          valid={valid}
        />
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
      if (valid && !pristine) {
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
    reset: () => {
      setAddress(initialAddress);
      setPristine(true);
    },
    valid,
  };
};

const useContactForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);

  const initialAttributes = useMemo(() => entry?.data?.attributes, [entry?.data?.attributes]);

  const [attributes, setAttributes] = useState<Organizer['data']['attributes']>(initialAttributes);
  const [pristine, setPristine] = useState(true);

  const [validity, setValidity] = useState<{ [key: string]: boolean }>();

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  const valid = useMemo(() => (validity ? !Object.values(validity).includes(false) : true), [
    validity,
  ]);

  useEffect(() => {
    if (pristine) {
      setAttributes(initialAttributes);
      setValidity({
        email: emailRef.current?.checkValidity(),
        phone: phoneRef.current?.checkValidity(),
        website: websiteRef.current?.checkValidity(),
      });
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
        <EntryFormHead
          title={`${t('categories.organizer.form.contact') as string}`}
          valid={valid}
        />
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
                requestAnimationFrame(() =>
                  setValidity({ ...validity, email: emailRef.current?.checkValidity() })
                );
              }}
              ref={emailRef}
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
                requestAnimationFrame(() =>
                  setValidity({ ...validity, phone: phoneRef.current?.checkValidity() })
                );
              }}
              ref={phoneRef}
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
                requestAnimationFrame(() =>
                  setValidity({ ...validity, website: websiteRef.current?.checkValidity() })
                );
              }}
              ref={websiteRef}
            />
          </FormItem>
        </FormGrid>
      </form>
    ),
    submit: async () => {
      if (valid && !pristine) {
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
    reset: () => {
      setAttributes(initialAttributes);
      setPristine(true);
    },
    valid,
  };
};

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const {
    renderedForm: nameForm,
    submit: nameSubmit,
    pristine: namePristine,
    reset: nameReset,
    valid: nameValid,
  } = useNameForm({
    category,
    query,
  });
  const {
    renderedForm: addressForm,
    submit: addressSubmit,
    pristine: addressPristine,
    reset: addressReset,
    valid: addressValid,
  } = useAddressForm({ category, query });
  const { renderedForm: linksForm, submit: linksSubmit, pristine: linksPristine } = useLinksForm({
    category,
    query,
  });
  const {
    renderedForm: contactForm,
    submit: contactSubmit,
    pristine: contactPristine,
    reset: contactReset,
    valid: contactValid,
  } = useContactForm({
    category,
    query,
  });
  const {
    renderedForm: descriptionForm,
    submit: descriptionSubmit,
    pristine: descriptionPristine,
    reset: descriptionReset,
    valid: descriptionValid,
  } = useDescriptionForm({
    category,
    query,
  });
  const router = useRouter();

  const { entry } = useEntry<CategoryEntry, ApiCall>(category, router?.query);

  const renderedEntryHeader = useEntryHeader({ category, query });

  const formattedDate = useSaveDate(entry);

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

  const valid = useMemo(
    () => ![nameValid, addressValid, contactValid, descriptionValid].includes(false),
    [addressValid, contactValid, descriptionValid, nameValid]
  );

  const message = "Sure 'bout that bra?";

  useConfirmExit(!pristine, message, () => {
    nameReset();
    addressReset();
    descriptionReset();
    contactReset();
  });

  return (
    <>
      <Save
        onClick={async () => {
          nameSubmit();
          addressSubmit();
          descriptionSubmit();
          linksSubmit();
          contactSubmit();
        }}
        date={formattedDate}
        active={!pristine}
        valid={valid}
      />

      {renderedEntryHeader}
      <EntryFormWrapper>
        <EntryFormContainer>{nameForm}</EntryFormContainer>
        <EntryFormContainer>{descriptionForm}</EntryFormContainer>
        <EntryFormContainer>{contactForm}</EntryFormContainer>
        <EntryFormContainer>{linksForm}</EntryFormContainer>
        <EntryFormContainer>{addressForm}</EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};
