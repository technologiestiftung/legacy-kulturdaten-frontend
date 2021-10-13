import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ApiCall, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { CategoryEntry } from '../../../lib/api/types/general';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry, useMutateList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { WindowContext } from '../../../lib/WindowService';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { Input, InputType } from '../../input';
import { EntryFormHook } from '../helpers/form';
import { useAddressForm } from '../helpers/form/Address';
import { useDescriptionForm } from '../helpers/form/Description';
import { useLinksForm } from '../helpers/form/Links';
import { useNameForm } from '../helpers/form/Name';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';

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
  } = useAddressForm(
    {
      category,
      query,
    },
    loaded,
    valid,
    true,
    t('categories.organizer.form.address')
  );

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
