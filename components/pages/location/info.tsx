import { useEffect, useMemo, useState } from 'react';
import { Language } from '../../../config/locale';
import { useApiCall } from '../../../lib/api';
import { Address } from '../../../lib/api/types/address';
import { PublishedStatus } from '../../../lib/api/types/general';
import { Location, LocationTranslation } from '../../../lib/api/types/location';
import { CategoryEntryPage, useEntry, useMutateList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { Button, ButtonColor, ButtonType } from '../../button';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { Input, InputType } from '../../input';
import { useName } from '../helpers/form/Name';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { LocationShow } from '../../../lib/api/routes/location/show';
import { EntryFormProps } from '../helpers/form';
import { LocationTranslationCreate } from '../../../lib/api/routes/location/translation/create';
import { LocationUpdate } from '../../../lib/api/routes/location/update';
import { Select } from '../../select';

const NameForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
  } = useName<Location, LocationShow, LocationTranslation, LocationTranslationCreate>({
    category,
    query,
    language: Language.de,
    label: t('categories.location.form.nameGerman') as string,
  });

  const {
    form: setNameEnglish,
    onSubmit: onSubmitEnglish,
    pristine: pristineEnglish,
    reset: resetEnglish,
  } = useName<Location, LocationShow, LocationTranslation, LocationTranslationCreate>({
    category,
    query,
    language: Language.en,
    label: t('categories.location.form.nameEnglish') as string,
  });

  return (
    <div>
      <EntryFormHead
        title={t('categories.location.form.name') as string}
        actions={[
          <Button
            key={0}
            onClick={() => {
              resetGerman();
              resetEnglish();
            }}
            disabled={pristineEnglish && pristineGerman}
            icon="XOctagon"
            color={ButtonColor.yellow}
          >
            {t('categories.location.form.editCancel')}
          </Button>,
          <Button
            key={1}
            icon="CheckSquare"
            color={ButtonColor.green}
            onClick={() => {
              onSubmitEnglish();
              onSubmitGerman();
            }}
            disabled={pristineEnglish && pristineGerman}
          >
            {t('categories.location.form.save')}
          </Button>,
        ]}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>{setNameGerman}</FormItem>
        <FormItem width={FormItemWidth.half}>{setNameEnglish}</FormItem>
      </FormGrid>
    </div>
  );
};

// const StyledDescriptionForm = styled.div`
//   padding: 0 0 1.5rem;
// `;

// const DescriptionForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
//   const t = useT();

//   return (
//     <StyledDescriptionForm>
//       <EntryFormHead title={t('categories.organizer.form.description') as string} />
//       <Description
//         category={category}
//         query={query}
//         language={Language.de}
//         title={t('categories.organizer.form.descriptionGerman') as string}
//       />
//       <Description
//         category={category}
//         query={query}
//         language={Language.en}
//         title={t('categories.organizer.form.descriptionEnglish') as string}
//       />
//     </StyledDescriptionForm>
//   );
// };

// const LinksForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
//   const t = useT();
//   const call = useApiCall();
//   const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
//   const mutateList = useMutateList(category);

//   const initialLinks = useMemo(
//     () => entry?.data?.relations?.links?.map((link) => link.attributes?.url),
//     [entry?.data?.relations?.links]
//   );

//   const [links, setLinks] = useState<string[]>(initialLinks);

//   const [linksFromApi, setLinksFromApi] = useState<string[]>();

//   const pristine = useMemo(
//     () =>
//       links === initialLinks ||
//       (Array.isArray(links) &&
//         Array.isArray(initialLinks) &&
//         links.length === initialLinks.length &&
//         links.reduce((allLinksEqual, link, index) => {
//           if (link !== initialLinks[index]) {
//             return false;
//           }
//           return allLinksEqual;
//         }, true)),
//     [links, initialLinks]
//   );

//   const { renderedLinkList, init } = useLinkList({
//     links: links || [],
//     onChange: (updatedLinks) => {
//       setLinks(updatedLinks);
//     },
//     maxLinks: 20,
//   });

//   useEffect(() => {
//     if (initialLinks !== linksFromApi) {
//       setLinksFromApi(initialLinks);
//       setLinks(initialLinks);
//       init(initialLinks);
//     }
//   }, [init, linksFromApi, initialLinks]);

//   return (
//     <StyledDescriptionForm>
//       <EntryFormHead
//         title={t('categories.organizer.form.links') as string}
//         actions={[
//           <Button
//             key={0}
//             onClick={(e) => {
//               e.stopPropagation();
//               e.preventDefault();
//               init(linksFromApi);
//             }}
//             icon="XOctagon"
//             color={ButtonColor.yellow}
//             disabled={pristine}
//           >
//             {t('categories.organizer.form.editCancel')}
//           </Button>,
//           <Button
//             key={1}
//             icon="CheckSquare"
//             color={ButtonColor.green}
//             disabled={pristine}
//             onClick={async (e) => {
//               e.preventDefault();

//               try {
//                 const resp = await call<OrganizerUpdate>(category.api.update.factory, {
//                   id: entry.data.id,
//                   organizer: {
//                     relations: {
//                       links,
//                     },
//                   },
//                 });

//                 if (resp.status === 200) {
//                   mutate();
//                   mutateList();
//                 }
//               } catch (e) {
//                 console.error(e);
//               }
//             }}
//           >
//             {t('categories.organizer.form.save')}
//           </Button>,
//         ]}
//       />
//       <FormGrid>
//         <FormItem width={FormItemWidth.full}>{renderedLinkList}</FormItem>
//       </FormGrid>
//     </StyledDescriptionForm>
//   );
// };

const AddressForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
  const { entry, mutate } = useEntry<Location, LocationShow>(category, query);
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

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          const resp = await call<LocationUpdate>(category.api.update.factory, {
            id: entry.data.id,
            location: {
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
      }}
    >
      <EntryFormHead
        title={t('categories.location.form.address') as string}
        actions={[
          <Button
            key={0}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setAddress(initialAddress);
              setPristine(true);
            }}
            icon="XOctagon"
            color={ButtonColor.yellow}
            disabled={pristine}
          >
            {t('categories.location.form.editCancel')}
          </Button>,
          <Button
            key={1}
            type={ButtonType.submit}
            icon="CheckSquare"
            color={ButtonColor.green}
            disabled={pristine}
          >
            {t('categories.location.form.save')}
          </Button>,
        ]}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.location.form.street1') as string}
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
            label={t('categories.location.form.street2') as string}
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
            label={t('categories.location.form.zipCode') as string}
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
            label={t('categories.location.form.city') as string}
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
        <FormItem width={FormItemWidth.half}>
          <Select
            disabled
            label={t('categories.location.form.district') as string}
            id="tbd-district"
          >
            <option>tbd</option>
          </Select>
        </FormItem>
      </FormGrid>
    </form>
  );
};

// const ContactForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
//   const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
//   const call = useApiCall();
//   const mutateList = useMutateList(category);

//   const initialAttributes = useMemo(() => entry?.data?.attributes, [entry?.data?.attributes]);

//   const [attributes, setAttributes] = useState<Organizer['data']['attributes']>(initialAttributes);
//   const [pristine, setPristine] = useState(true);

//   useEffect(() => {
//     if (pristine) {
//       setAttributes(initialAttributes);
//     }
//   }, [pristine, initialAttributes]);

//   const t = useT();

//   return (
//     <form
//       onSubmit={async (e) => {
//         e.preventDefault();

//         try {
//           const resp = await call<OrganizerUpdate>(category.api.update.factory, {
//             id: entry.data.id,
//             organizer: {
//               attributes: {
//                 email: attributes?.email,
//                 homepage: attributes?.homepage,
//                 phone: attributes?.phone,
//               },
//             },
//           });

//           if (resp.status === 200) {
//             mutate();
//             mutateList();
//             setTimeout(() => setPristine(true), 500);
//           }
//         } catch (e) {
//           console.error(e);
//         }
//       }}
//     >
//       <EntryFormHead
//         title={t('categories.organizer.form.contact') as string}
//         actions={[
//           <Button
//             key={0}
//             onClick={(e) => {
//               e.stopPropagation();
//               e.preventDefault();
//               setAttributes(initialAttributes);
//               setPristine(true);
//             }}
//             icon="XOctagon"
//             color={ButtonColor.yellow}
//             disabled={pristine}
//           >
//             {t('categories.organizer.form.editCancel')}
//           </Button>,
//           <Button
//             key={1}
//             type={ButtonType.submit}
//             icon="CheckSquare"
//             color={ButtonColor.green}
//             disabled={pristine}
//           >
//             {t('categories.organizer.form.save')}
//           </Button>,
//         ]}
//       />
//       <FormGrid>
//         <FormItem width={FormItemWidth.half}>
//           <Input
//             label={t('categories.organizer.form.email') as string}
//             type={InputType.email}
//             value={attributes?.email || ''}
//             onChange={(e) => {
//               setPristine(false);
//               setAttributes({
//                 ...attributes,
//                 email: e.target.value,
//               });
//             }}
//           />
//         </FormItem>
//         <FormItem width={FormItemWidth.half}>
//           <Input
//             label={t('categories.organizer.form.tel') as string}
//             type={InputType.tel}
//             value={attributes?.phone || ''}
//             onChange={(e) => {
//               setPristine(false);
//               setAttributes({
//                 ...attributes,
//                 phone: e.target.value,
//               });
//             }}
//           />
//         </FormItem>
//         <FormItem width={FormItemWidth.full}>
//           <Input
//             label={t('categories.organizer.form.website') as string}
//             type={InputType.url}
//             value={attributes?.homepage || ''}
//             onChange={(e) => {
//               setPristine(false);
//               setAttributes({
//                 ...attributes,
//                 homepage: e.target.value,
//               });
//             }}
//           />
//         </FormItem>
//       </FormGrid>
//     </form>
//   );
// };

export const LocationInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  return (
    <EntryFormWrapper>
      <EntryFormContainer>
        <NameForm category={category} query={query} />
      </EntryFormContainer>
      <EntryFormContainer>
        <AddressForm category={category} query={query} />
      </EntryFormContainer>
    </EntryFormWrapper>
  );
};
