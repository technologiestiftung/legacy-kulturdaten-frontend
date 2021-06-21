import { ParsedUrlQuery } from 'node:querystring';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { Language } from '../../../config/locale';
import { getApiUrlString, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerTranslationUpdate } from '../../../lib/api/routes/organizer/translation/update';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Address } from '../../../lib/api/types/address';
import { Organizer, OrganizerTranslation } from '../../../lib/api/types/organizer';
import { Category, CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { getTranslation } from '../../../lib/translations';
import { Button, ButtonColor, ButtonType } from '../../button';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { Input, InputType } from '../../input';
import { LinkList } from '../../linklist';
import { useOverlay } from '../../overlay';
import { OverlayContainer } from '../../overlay/OverlayContainer';
import { OverlayTitleBar } from '../../overlay/OverlayTitleBar';
import { CustomDescendant, RichText } from '../../richtext';
import { markdownToSlate } from '../../richtext/parser';
import { Textarea } from '../../textarea';
import {
  // EntryForm,
  // EntryTranslationForm,
  FormGrid,
  FormItem,
  FormItemWidth,
  // useEntryForm,
  // useEntryTranslationForm,
} from './helpers';

interface OrganizerFormProps {
  category: Category;
  query: ParsedUrlQuery;
}

interface SetNameProps {
  label: string;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  setPristine: (pristine: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  name: string;
}

const SetName: React.FC<SetNameProps> = ({
  label,
  onSubmit,
  pristine,
  setPristine,
  setValue,
  name,
  value,
}: SetNameProps) => {
  // set initial value
  useEffect(() => {
    if (pristine) {
      setValue(name);
    }
  }, [pristine, name, setValue]);

  return (
    <form onSubmit={onSubmit}>
      <Input
        label={label}
        type={InputType.text}
        value={value || ''}
        onChange={(e) => {
          setPristine(false);
          setValue(e.target.value);
        }}
      />
    </form>
  );
};

const useSetName = (props: {
  category: Category;
  query: ParsedUrlQuery;
  language: Language;
  label: string;
}): {
  form: React.ReactElement;
  onSubmit: (e?: FormEvent) => Promise<void>;
  pristine: boolean;
  reset: () => void;
} => {
  const { category, query, language, label } = props;

  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();
  const entryTranslation = getTranslation<OrganizerTranslation>(
    language,
    entry?.data?.relations?.translations
  );
  const name = useMemo(() => entryTranslation?.attributes?.name, [
    entryTranslation?.attributes?.name,
  ]);
  const [value, setValue] = useState(name || '');
  const [pristine, setPristine] = useState(true);

  const onSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!pristine) {
      try {
        const resp = await call<OrganizerTranslationUpdate>(
          category.api.translationUpdate.factory,
          {
            organizerTranslation: {
              ...entryTranslation,
              attributes: {
                name: value,
              },
            },
            translationId: entryTranslation?.id,
            organizerId: entry?.data?.id,
          }
        );

        if (resp.status === 200) {
          mutate();
          mutateSwr(getApiUrlString(category.api.list.route));
          setTimeout(() => setPristine(true), 500);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return {
    form: <SetName {...{ pristine, setPristine, value, setValue, label, onSubmit, name }} />,
    onSubmit,
    pristine,
    reset: () => {
      setValue(name);
      setPristine(true);
    },
  };
};

const NameForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
  } = useSetName({
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
  } = useSetName({
    category,
    query,
    language: Language.en,
    label: t('categories.organizer.form.nameEnglish') as string,
  });

  return (
    <div>
      <EntryFormHead
        title={t('categories.organizer.form.name') as string}
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
            {t('categories.organizer.form.editCancel')}
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
            {t('categories.organizer.form.save')}
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

const testSocialLinks = [
  'https://www.technologiestiftung-berlin.de/',
  'https://www.kulturdaten.berlin/',
  'https://beta.api.kulturdaten.berlin/docs/',
];

// const ContactForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
//   const { formButtons } = useEntryForm(category, query);

//   const t = useT();

//   return (
//     <>
//       <form
//         onSubmit={async (e: FormEvent) => {
//           e.preventDefault();
//           e.stopPropagation();
//         }}
//       >
//         <EntryFormHead
//           title={t('categories.organizer.form.contact') as string}
//           actions={formButtons}
//         />
//         <FormGrid>
//           <FormItem width={FormItemWidth.half}>
//             <Input label={t('categories.organizer.form.tel') as string} type={InputType.tel} />
//           </FormItem>
//           <FormItem width={FormItemWidth.half}>
//             <Input label={t('categories.organizer.form.email') as string} type={InputType.email} />
//           </FormItem>
//           <FormItem width={FormItemWidth.half}>
//             <Input label={t('categories.organizer.form.website') as string} type={InputType.url} />
//           </FormItem>
//         </FormGrid>
//       </form>
//       <FormGrid>
//         <FormItem width={FormItemWidth.full}>
//           <LinkList
//             label={t('categories.organizer.form.social') as string}
//             links={testSocialLinks}
//             maxLinks={3}
//           />
//         </FormItem>
//       </FormGrid>
//     </>
//   );
// };

// const DescriptionForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
//   const { formButtons, formState, entry } = useEntryTranslationForm(category, query, Language.de);
//   const t = useT();

//   const [richTextState, setRichTextState] = useState<CustomDescendant[]>();

//   useEffect(() => {
//     const int = formState?.attributes?.description
//       ? markdownToSlate(formState.attributes.description)
//       : undefined;
//     if (int) {
//       setRichTextState(int);
//     }
//   }, [formState?.attributes?.description]);

//   const { renderedOverlay, setIsOpen } = useOverlay(
//     <OverlayContainer>
//       <OverlayTitleBar title="Beschreibung deutsch" />
//       {Array.isArray(richTextState) && (
//         <RichText value={richTextState} onChange={(val) => setRichTextState(val)} />
//       )}
//     </OverlayContainer>
//   );

//   return (
//     <div>
//       <EntryFormHead title={t('categories.organizer.form.description') as string} />
//       <Button onClick={() => setIsOpen(true)}>open RT</Button>
//       <div>{renderedOverlay}</div>
//     </div>
//   );
// };

const AddressForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const call = useApiCall();

  const initialAddress = useMemo(() => entry?.data?.relations?.address, [
    entry?.data?.relations?.address,
  ]);

  const [address, setAddress] = useState<Address>(initialAddress);
  const [pristine, setPristine] = useState(true);

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

        console.log(address);

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
            mutateSwr(getApiUrlString(category.api.list.route));
            setTimeout(() => setPristine(true), 500);
          }
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <EntryFormHead
        title={t('categories.organizer.form.address') as string}
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
            {t('categories.organizer.form.editCancel')}
          </Button>,
          <Button
            key={1}
            type={ButtonType.submit}
            icon="CheckSquare"
            color={ButtonColor.green}
            disabled={pristine}
          >
            {t('categories.organizer.form.save')}
          </Button>,
        ]}
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
                  ...address.attributes,
                  street1: e.target.value,
                },
              });
            }}
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
                  ...address.attributes,
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
                  ...address.attributes,
                  zipCode: e.target.value,
                },
              });
            }}
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
                  ...address.attributes,
                  city: e.target.value,
                },
              });
            }}
          />
        </FormItem>
      </FormGrid>
    </form>
  );
};

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
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
