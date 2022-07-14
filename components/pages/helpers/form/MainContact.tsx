import React, { useEffect, useMemo, useState } from 'react';
import { Categories } from '../../../../config/categories';
import { defaultLanguage } from '../../../../config/locale';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { CategoryEntry, PublishedStatus } from '../../../../lib/api/types/general';
import { OrganizerMainContact } from '../../../../lib/api/types/organizer';
import { useEntry, useMutateList } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { useOrganizerId } from '../../../../lib/useOrganizer';
import { isEmail } from '../../../../lib/validations';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { Input, InputType } from '../../../input';
import { EntryFormHook, EntryFormHookProps } from '../form';
import { FormGrid, FormItem, FormItemWidth, FormWrapper } from '../formComponents';

interface MainContactFormHookProps extends EntryFormHookProps {
  customRequired?: boolean;
}

const defaultMainContact: OrganizerMainContact = {
  attributes: {
    email: undefined,
  },
  relations: {
    address: {
      attributes: {
        city: undefined,
        street1: undefined,
        street2: undefined,
        zipCode: undefined,
      },
    },
    translations: [
      {
        attributes: {
          language: defaultLanguage,
          name: undefined,
        },
      },
    ],
  },
};

export const useMainContactForm: EntryFormHook<MainContactFormHookProps> = ({
  category,
  query,
  loaded,
  customRequired,
  id,
}) => {
  const { entry, mutate } = useEntry<
    {
      data: {
        relations: {
          mainContact: OrganizerMainContact;
        } & CategoryEntry['data']['relations'];
      } & CategoryEntry['data'];
    } & CategoryEntry,
    ApiCall
  >(category, query);
  const call = useApiCall();

  const initialMainContact = useMemo(
    () => entry?.data?.relations?.mainContact || defaultMainContact,
    [entry?.data?.relations?.mainContact]
  );

  const organizerId = useOrganizerId();
  const [mainContact, setMainContact] = useState<OrganizerMainContact>(initialMainContact);
  const [mainContactFromApi, setMainContactFromApi] =
    useState<OrganizerMainContact>(initialMainContact);
  const mutateList = useMutateList(
    category,
    category.name === Categories.location
      ? [['organizer', organizerId]]
      : category.name === Categories.offer
      ? [['organizers', organizerId]]
      : undefined
  );

  const required = useMemo(
    () =>
      typeof customRequired !== 'undefined'
        ? customRequired
        : entry?.data?.attributes?.status === PublishedStatus.published,
    [entry?.data?.attributes?.status, customRequired]
  );

  const softRequired = useMemo(
    () => (typeof customRequired !== 'undefined' ? customRequired : true),
    [customRequired]
  );

  const defaultTranslation = useMemo(
    () =>
      mainContact?.relations.translations.find(
        ({ attributes }) => attributes?.language === defaultLanguage
      ),
    [mainContact?.relations?.translations]
  );

  useEffect(() => {
    if (JSON.stringify(initialMainContact) !== JSON.stringify(mainContactFromApi)) {
      setMainContact(initialMainContact);
      setMainContactFromApi(initialMainContact);
    }
  }, [mainContactFromApi, initialMainContact]);

  const pristine = useMemo(
    () => JSON.stringify(mainContact) === JSON.stringify(mainContactFromApi),
    [mainContact, mainContactFromApi]
  );

  const t = useT();

  const valid = useMemo(
    () =>
      !loaded ||
      !required ||
      Boolean(
        mainContact?.attributes?.email?.length > 0 &&
          isEmail(mainContact.attributes.email) &&
          mainContact.relations.translations?.find(({ attributes }) => attributes.name?.length > 0)
      ),
    [loaded, mainContact?.attributes?.email, mainContact?.relations?.translations, required]
  );

  const fulfilled = useMemo(
    () =>
      !softRequired ||
      Boolean(
        mainContact?.attributes?.email?.length > 0 &&
          isEmail(mainContact.attributes.email) &&
          mainContact.relations.translations?.find(({ attributes }) => attributes.name?.length > 0)
      ),
    [mainContact?.attributes?.email, mainContact?.relations?.translations, softRequired]
  );

  return {
    renderedForm: (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <FormWrapper
          requirement={
            softRequired
              ? {
                  fulfilled,
                }
              : undefined
          }
        >
          <EntryFormHead
            title={t('categories.organizer.form.address') as string}
            tooltip={t('categories.organizer.form.addressTooltip') as string}
            id={id}
            valid={valid}
          />
          <FormGrid>
            <FormItem width={FormItemWidth.half}>
              <Input
                label={t('categories.organizer.form.mainContact.name') as string}
                type={InputType.text}
                value={defaultTranslation?.attributes?.name || ''}
                required={required}
                softRequired={softRequired}
                onChange={(e) => {
                  setMainContact({
                    ...mainContact,
                    relations: {
                      ...mainContact.relations,
                      translations: [
                        {
                          ...defaultTranslation,
                          attributes: {
                            ...defaultTranslation.attributes,
                            name: e.target.value,
                          },
                        },
                      ],
                    },
                  });
                }}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                label={t('categories.organizer.form.mainContact.email') as string}
                type={InputType.email}
                autoComplete="email"
                value={mainContact?.attributes?.email || ''}
                required={required}
                softRequired={softRequired}
                error={
                  mainContact?.attributes?.email?.length > 0 &&
                  !isEmail(mainContact?.attributes?.email)
                    ? (t('forms.emailInvalid') as string)
                    : undefined
                }
                onChange={(e) => {
                  setMainContact({
                    ...mainContact,
                    attributes: {
                      ...mainContact.attributes,
                      email: e.target.value,
                    },
                  });
                }}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                label={t('forms.street1') as string}
                type={InputType.text}
                value={mainContact?.relations?.address?.attributes?.street1 || ''}
                onChange={(e) => {
                  setMainContact({
                    ...mainContact,
                    relations: {
                      ...mainContact.relations,
                      address: {
                        ...mainContact.relations.address,
                        attributes: {
                          ...mainContact.relations.address.attributes,
                          street1: e.target.value,
                        },
                      },
                    },
                  });
                }}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                label={t('forms.street2') as string}
                type={InputType.text}
                value={mainContact?.relations?.address?.attributes?.street2 || ''}
                onChange={(e) => {
                  setMainContact({
                    ...mainContact,
                    relations: {
                      ...mainContact.relations,
                      address: {
                        ...mainContact.relations.address,
                        attributes: {
                          ...mainContact.relations.address.attributes,
                          street2: e.target.value,
                        },
                      },
                    },
                  });
                }}
              />
            </FormItem>
            <FormItem width={FormItemWidth.quarter}>
              <Input
                label={t('forms.zipCode') as string}
                type={InputType.text}
                value={mainContact?.relations?.address?.attributes?.zipCode || ''}
                onChange={(e) => {
                  setMainContact({
                    ...mainContact,
                    relations: {
                      ...mainContact.relations,
                      address: {
                        ...mainContact.relations.address,
                        attributes: {
                          ...mainContact.relations.address.attributes,
                          zipCode: e.target.value,
                        },
                      },
                    },
                  });
                }}
              />
            </FormItem>
            <FormItem width={FormItemWidth.quarter} alignSelf="flex-end">
              <Input
                label={t('forms.city') as string}
                type={InputType.text}
                value={mainContact?.relations?.address?.attributes?.city || ''}
                onChange={(e) => {
                  setMainContact({
                    ...mainContact,
                    relations: {
                      ...mainContact.relations,
                      address: {
                        ...mainContact.relations.address,
                        attributes: {
                          ...mainContact.relations.address.attributes,
                          city: e.target.value,
                        },
                      },
                    },
                  });
                }}
              />
            </FormItem>
          </FormGrid>
        </FormWrapper>
      </form>
    ),
    submit: async () => {
      if (valid && !pristine) {
        try {
          const resp = await call(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                mainContact,
              },
            },
          });

          if (resp.status === 200) {
            mutate();

            if (category.name === Categories.location) {
              mutateList();
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    reset: () => {
      setMainContact(initialMainContact);
    },
    valid,
    requirementFulfillment: {
      requirementKey: 'mainContact',
      fulfilled,
    },
  };
};
