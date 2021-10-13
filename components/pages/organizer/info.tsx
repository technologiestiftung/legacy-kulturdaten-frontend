import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ApiCall, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Address } from '../../../lib/api/types/address';
import { CategoryEntry, PublishedStatus } from '../../../lib/api/types/general';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry, useMutateList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { WindowContext } from '../../../lib/WindowService';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { Input, InputType } from '../../input';
import { useLinkList } from '../../linklist';
import { EntryFormHook } from '../helpers/form';
import { useDescriptionForm } from '../helpers/form/Description';
import { useNameForm } from '../helpers/form/Name';
import { FormContainer, FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';

const useLinksForm: EntryFormHook = ({ category, query }, loaded) => {
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
    maxLinks: 3,
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
      <FormContainer>
        <EntryFormHead
          title={`${t('categories.organizer.form.links') as string}`}
          valid={!loaded || valid}
        />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>{renderedLinkList}</FormItem>
        </FormGrid>
      </FormContainer>
    ),
    submit: async () => {
      if (valid && !pristine) {
        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
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
    reset: () => {
      setLinksFromApi(initialLinks);
      setLinks(initialLinks);
      init(initialLinks);
    },
    valid: !loaded || valid,
    hint: false,
  };
};

const useAddressForm: EntryFormHook = ({ category, query }, loaded, showHint) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const mutateList = useMutateList(category);

  const initialAddress = useMemo(
    () => entry?.data?.relations?.address,
    [entry?.data?.relations?.address]
  );

  const [address, setAddress] = useState<Address>(initialAddress);
  const [pristine, setPristine] = useState(true);

  const required = useMemo(
    () => entry?.data?.attributes?.status === PublishedStatus.published,
    [entry?.data?.attributes?.status]
  );

  useEffect(() => {
    if (pristine) {
      setAddress(initialAddress);
    }
  }, [pristine, initialAddress]);

  const t = useT();

  const valid = useMemo(
    () =>
      !loaded ||
      !required ||
      (address?.attributes?.street1?.length > 0 &&
        address?.attributes?.zipCode?.length > 0 &&
        address?.attributes?.city?.length > 0),
    [
      loaded,
      address?.attributes?.city?.length,
      address?.attributes?.street1?.length,
      address?.attributes?.zipCode?.length,
      required,
    ]
  );

  const hint = useMemo(
    () =>
      showHint &&
      loaded &&
      (!address?.attributes?.street1 ||
        address.attributes.street1.length < 1 ||
        !address?.attributes?.zipCode ||
        address.attributes.zipCode?.length < 1 ||
        !address?.attributes?.city ||
        address.attributes.city?.length < 1),
    [
      showHint,
      loaded,
      address?.attributes?.street1,
      address?.attributes?.zipCode,
      address?.attributes?.city,
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
          hint={hint}
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
              hint={
                showHint &&
                (!address?.attributes?.street1 || address?.attributes?.street1.length < 1)
              }
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
              hint={
                showHint &&
                (!address?.attributes?.zipCode || address?.attributes?.zipCode.length < 1)
              }
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
              hint={
                showHint && (!address?.attributes?.city || address?.attributes?.city.length < 1)
              }
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
            entry: {
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
    hint,
  };
};

const useContactForm: EntryFormHook = ({ category, query }, loaded) => {
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

  const valid = useMemo(
    () => !loaded || (validity ? !Object.values(validity).includes(false) : true),
    [loaded, validity]
  );

  useEffect(() => {
    if (pristine) {
      setAttributes(initialAttributes);
      setValidity({
        email: emailRef.current?.value?.length === 0 || emailRef.current?.checkValidity(),
        phone: websiteRef.current?.value?.length === 0 || phoneRef.current?.checkValidity(),
        website: websiteRef.current?.value?.length === 0 || websiteRef.current?.checkValidity(),
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
            entry: {
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
    hint: false,
  };
};

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const router = useRouter();
  const { entry } = useEntry<CategoryEntry, ApiCall>(category, router?.query);
  const t = useT();

  const [loaded, setLoaded] = useState(false);
  const { rendered } = useContext(WindowContext);

  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const {
    renderedForm: nameForm,
    submit: nameSubmit,
    pristine: namePristine,
    reset: nameReset,
    valid: nameValid,
    hint: nameHint,
  } = useNameForm(
    {
      category,
      query,
    },
    loaded,
    valid
  );

  const {
    renderedForm: addressForm,
    submit: addressSubmit,
    pristine: addressPristine,
    reset: addressReset,
    valid: addressValid,
    hint: addressHint,
  } = useAddressForm({ category, query }, loaded, valid);

  const {
    renderedForm: linksForm,
    submit: linksSubmit,
    pristine: linksPristine,
    reset: linksReset,
    valid: linksValid,
    hint: linksHint,
  } = useLinksForm(
    {
      category,
      query,
    },
    loaded,
    valid
  );

  const {
    renderedForm: contactForm,
    submit: contactSubmit,
    pristine: contactPristine,
    reset: contactReset,
    valid: contactValid,
    hint: contactHint,
  } = useContactForm(
    {
      category,
      query,
    },
    loaded,
    valid
  );

  const {
    renderedForm: descriptionForm,
    submit: descriptionSubmit,
    pristine: descriptionPristine,
    reset: descriptionReset,
    valid: descriptionValid,
    hint: descriptionHint,
  } = useDescriptionForm(
    {
      category,
      query,
    },
    loaded,
    valid
  );

  const renderedEntryHeader = useEntryHeader(
    { category, query },
    t('menu.start.items.profile') as string,
    true
  );

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

  useEffect(() => {
    setValid(
      ![nameValid, addressValid, contactValid, descriptionValid, linksValid].includes(false)
    );
  }, [addressValid, contactValid, descriptionValid, linksValid, nameValid]);

  const hint = useMemo(
    () => addressHint || contactHint || linksHint || nameHint || descriptionHint,
    [addressHint, contactHint, descriptionHint, linksHint, nameHint]
  );

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    nameReset();
    addressReset();
    descriptionReset();
    contactReset();
    linksReset();
  });

  return (
    <>
      {renderedEntryHeader}
      <div role="tabpanel">
        <div role="form" aria-invalid={!valid}>
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
            valid={loaded === false || valid}
            hint={loaded === true && hint}
          />
          <EntryFormWrapper>
            <EntryFormContainer>{nameForm}</EntryFormContainer>
            <EntryFormContainer>{descriptionForm}</EntryFormContainer>
            <EntryFormContainer>{contactForm}</EntryFormContainer>
            <EntryFormContainer>{linksForm}</EntryFormContainer>
            <EntryFormContainer>{addressForm}</EntryFormContainer>
          </EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
