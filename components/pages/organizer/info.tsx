import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ApiCall, useApiCall } from '../../../lib/api';
import { OrganizerDelete } from '../../../lib/api/routes/organizer/delete';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Contact } from '../../../lib/api/types/contact';
import { CategoryEntry, PublishedStatus } from '../../../lib/api/types/general';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { useUserIsOwner } from '../../../lib/useUserIsOwner';
import { isEmail, isPhoneNumber, isUrl } from '../../../lib/validations';
import { WindowContext } from '../../../lib/WindowService';
import { Contacts } from '../../Contacts';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { Save } from '../../EntryForm/Save';
import { StyledEntryFormContainer, EntryFormWrapper, StyledRequiredInfoText } from '../../EntryForm/wrappers';
import { Input, InputType } from '../../input';
import { usePublish } from '../../Publish';
import { EntryFormHook } from '../helpers/form';
import { useDescriptionForm } from '../helpers/form/Description';
import { useLinksForm } from '../helpers/form/Links';
import { useMainContactForm } from '../helpers/form/MainContact';
import { useNameForm } from '../helpers/form/Name';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';

const useContactForm: EntryFormHook = ({ category, query, loaded }) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();

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
              autoComplete="email"
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
              error={
                attributes?.email?.length && !isEmail(attributes?.email)
                  ? (t('forms.emailInvalid') as string)
                  : undefined
              }
            />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input
              label={t('categories.organizer.form.tel') as string}
              type={InputType.tel}
              autoComplete="tel"
              placeholder={t('general.telPlaceholder') as string}
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
              error={
                attributes?.phone?.length && !isPhoneNumber(attributes?.phone)
                  ? (t('forms.phoneInvalid') as string)
                  : undefined
              }
            />
          </FormItem>
          <FormItem width={FormItemWidth.full}>
            <Input
              label={t('categories.organizer.form.website') as string}
              type={InputType.url}
              autoComplete="url"
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
              error={
                attributes?.homepage?.length && !isUrl(attributes?.homepage)
                  ? (t('forms.urlInvalid') as string)
                  : undefined
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
              attributes: {
                email: attributes?.email,
                homepage: attributes?.homepage,
                phone: attributes?.phone,
              },
            },
          });

          if (resp.status === 200) {
            mutate();
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

const useAdditionalContactsForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [contacts, setContacts] = useState<Contact[]>();
  const call = useApiCall();
  const t = useT();

  const [contactsFromApi, setContactsFromApi] = useState<Contact[]>();

  const initialContacts = useMemo(
    () => entry?.data?.relations?.contacts,
    [entry?.data?.relations?.contacts]
  );

  const pristine = useMemo(
    () => JSON.stringify(contacts) === JSON.stringify(contactsFromApi),
    [contacts, contactsFromApi]
  );

  const valid = useMemo(() => {
    if (pristine) {
      return true;
    }

    for (let i = 0; i < contacts?.length; i += 1) {
      if (contacts[i]?.attributes?.email?.length > 0 && !isEmail(contacts[i].attributes.email)) {
        return false;
      }
    }

    return true;
  }, [pristine, contacts]);

  useEffect(() => {
    if (JSON.stringify(initialContacts) !== JSON.stringify(contactsFromApi)) {
      setContactsFromApi(initialContacts);
      setContacts(initialContacts);
    }
  }, [initialContacts, contactsFromApi]);

  const renderedForm = (
    <div>
      <EntryFormHead
        title={t('categories.organizer.form.additionalContacts') as string}
        tooltip={t('categories.organizer.form.additionalContactsTooltip')}
        valid={valid}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <Contacts
            contacts={contacts || []}
            onChange={(updatedContacts) => setContacts(updatedContacts)}
          />
        </FormItem>
      </FormGrid>
    </div>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        const contactsIds = contacts.map((contact) => contact.id);
        const deletedContacts = contactsFromApi
          .filter((contact) => !contactsIds.includes(contact.id))
          .map((contact) => contact.id);

        if (deletedContacts.length > 0) {
          try {
            await call<OrganizerDelete>(category.api.delete.factory, {
              id: entry.data.id,
              entry: {
                relations: {
                  contacts: deletedContacts,
                },
              },
            });
          } catch (e) {
            console.error(e);
          }
        }

        try {
          const resp = await call<OrganizerUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                contacts: contacts,
              },
            },
          });

          if (resp.status === 200) {
            mutate();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    reset: () => {
      setContacts(initialContacts);
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
  const userIsOwner = useUserIsOwner();

  const [valid, setValid] = useState(true);

  const isPublished = useMemo(
    () => entry?.data?.attributes?.status === PublishedStatus.published,
    [entry?.data?.attributes?.status]
  );

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
    requirementFulfillment: nameRequirementFulfillment,
  } = useNameForm({
    category,
    query,
    loaded,
    title: t('categories.organizer.form.name') as string,
    tooltip: t('categories.organizer.form.nameTooltip') as string,
    id: 'organizer-name',
  });

  const {
    renderedForm: addressForm,
    submit: addressSubmit,
    pristine: addressPristine,
    reset: addressReset,
    valid: addressValid,
    requirementFulfillment: addressRequirementFulfillment,
  } = useMainContactForm({
    category,
    query,
    loaded,
    customRequired: isPublished || undefined,
    title: t('categories.organizer.form.address') as string,
    tooltip: t('categories.organizer.form.addressTooltip') as string,
    id: 'organizer-internal-contact',
  });

  const {
    renderedForm: linksForm,
    submit: linksSubmit,
    pristine: linksPristine,
    reset: linksReset,
    valid: linksValid,
  } = useLinksForm({
    category,
    query,
    loaded,
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
    loaded,
  });

  const {
    renderedForm: additionalContactsForm,
    submit: additionalContactsSubmit,
    pristine: additionalContactsPristine,
    reset: additionalContactsReset,
    valid: additionalContactsValid,
  } = useAdditionalContactsForm({
    category,
    query,
    loaded,
  });

  const {
    renderedForm: descriptionForm,
    submit: descriptionSubmit,
    pristine: descriptionPristine,
    reset: descriptionReset,
    valid: descriptionValid,
    requirementFulfillment: descriptionRequirementFulfillment,
  } = useDescriptionForm({
    category,
    query,
    loaded,
    required: isPublished,
    title: t('categories.organizer.form.description') as string,
    tooltip: t('categories.organizer.form.descriptionTooltip') as string,
    id: 'organizer-description',
  });
  const renderedEntryHeader = useEntryHeader(
    { category, query },
    t('menu.start.items.profile') as string,
    true
  );

  const formattedDate = useSaveDate(entry);

  const pristine = useMemo(() => {
    const pristineConditions = [
      namePristine,
      linksPristine,
      contactPristine,
      descriptionPristine,
      additionalContactsPristine,
    ];

    if (userIsOwner) {
      pristineConditions.push(addressPristine);
    }
    return !pristineConditions.includes(false);
  }, [
    userIsOwner,
    addressPristine,
    contactPristine,
    descriptionPristine,
    linksPristine,
    namePristine,
    additionalContactsPristine,
  ]);

  useEffect(() => {
    const validations = [
      nameValid,
      contactValid,
      descriptionValid,
      linksValid,
      additionalContactsValid,
    ];

    if (userIsOwner) {
      validations.push(addressValid);
    }

    setValid(!validations.includes(false));
  }, [
    userIsOwner,
    addressValid,
    contactValid,
    descriptionValid,
    linksValid,
    nameValid,
    additionalContactsValid,
  ]);

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    nameReset();
    if (userIsOwner) {
      addressReset();
    }
    descriptionReset();
    contactReset();
    additionalContactsReset();
    linksReset();
  });

  const formRequirementFulfillments = useMemo(() => {
    const requirementFulfillments = [nameRequirementFulfillment, descriptionRequirementFulfillment];

    if (userIsOwner) {
      requirementFulfillments.push(addressRequirementFulfillment);
    }

    return requirementFulfillments;
  }, [
    userIsOwner,
    nameRequirementFulfillment,
    addressRequirementFulfillment,
    descriptionRequirementFulfillment,
  ]);

  const onSave = useCallback(async () => {
    nameSubmit();
    if (userIsOwner) {
      addressSubmit();
    }
    descriptionSubmit();
    linksSubmit();
    contactSubmit();
    additionalContactsSubmit();
  }, [
    userIsOwner,
    nameSubmit,
    addressSubmit,
    descriptionSubmit,
    linksSubmit,
    contactSubmit,
    additionalContactsSubmit,
  ]);

  const { renderedPublish } = usePublish({
    category,
    query,
    formRequirementFulfillments,
    onPublish: onSave,
  });

  return (
    <>
      {renderedPublish}
      {renderedEntryHeader}
      <div role="tabpanel">
        <div role="form">
          <Save
            onClick={onSave}
            date={formattedDate}
            active={!pristine}
            valid={loaded === false || valid}
          />
          <EntryFormWrapper>
            <StyledRequiredInfoText />
            <StyledEntryFormContainer>{nameForm}</StyledEntryFormContainer>
            <StyledEntryFormContainer>{descriptionForm}</StyledEntryFormContainer>
            <StyledEntryFormContainer>{contactForm}</StyledEntryFormContainer>
            <StyledEntryFormContainer>{additionalContactsForm}</StyledEntryFormContainer>
            <StyledEntryFormContainer>{linksForm}</StyledEntryFormContainer>
            {userIsOwner && <StyledEntryFormContainer>{addressForm}</StyledEntryFormContainer>}
          </EntryFormWrapper>
        </div>
      </div>
    </>
  );
};
