import { ParsedUrlQuery } from 'node:querystring';
import React, { FormEvent, useEffect, useState } from 'react';
import { Category, CategoryEntryPage } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
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
import { EntryForm, FormGrid, FormItem, FormItemWidth, useEntryForm } from './helpers';

interface OrganizerFormProps {
  category: Category;
  query: ParsedUrlQuery;
}

const NameForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { formState, setFormState, setPristine, formProps, formButtons } = useEntryForm(
    category,
    query
  );

  const t = useT();

  return (
    <EntryForm {...formProps}>
      <EntryFormHead title={t('categories.organizer.form.name') as string} actions={formButtons} />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameGerman') as string}
            type={InputType.text}
            value={formState?.attributes?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ attributes: { name: e.target.value } });
            }}
            required
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameEnglish') as string}
            type={InputType.text}
            value={formState?.attributes?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ attributes: { name: e.target.value } });
            }}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameGermanSimple') as string}
            type={InputType.text}
            value={formState?.attributes?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ attributes: { name: e.target.value } });
            }}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.nameEnglishSimple') as string}
            type={InputType.text}
            value={formState?.attributes?.name || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({ attributes: { name: e.target.value } });
            }}
          />
        </FormItem>
      </FormGrid>
    </EntryForm>
  );
};

const testSocialLinks = [
  'https://www.technologiestiftung-berlin.de/',
  'https://www.kulturdaten.berlin/',
  'https://beta.api.kulturdaten.berlin/docs/',
];

const ContactForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { formButtons } = useEntryForm(category, query);

  const t = useT();

  return (
    <>
      <form
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <EntryFormHead
          title={t('categories.organizer.form.contact') as string}
          actions={formButtons}
        />
        <FormGrid>
          <FormItem width={FormItemWidth.half}>
            <Input label={t('categories.organizer.form.tel') as string} type={InputType.tel} />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input label={t('categories.organizer.form.email') as string} type={InputType.email} />
          </FormItem>
          <FormItem width={FormItemWidth.half}>
            <Input label={t('categories.organizer.form.website') as string} type={InputType.url} />
          </FormItem>
        </FormGrid>
      </form>
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <LinkList
            label={t('categories.organizer.form.social') as string}
            links={testSocialLinks}
            maxLinks={3}
          />
        </FormItem>
      </FormGrid>
    </>
  );
};

const DescriptionForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { formButtons, formState } = useEntryForm(category, query);
  const t = useT();

  const [richTextState, setRichTextState] = useState<CustomDescendant[]>();

  useEffect(() => {
    const int = formState?.attributes?.description
      ? markdownToSlate(formState.attributes.description)
      : undefined;
    if (int) {
      setRichTextState(int);
    }
  }, [formState?.attributes?.description]);

  const { renderedOverlay, setIsOpen } = useOverlay(
    <OverlayContainer>
      <OverlayTitleBar title="Beschreibung deutsch" />
      {Array.isArray(richTextState) && (
        <RichText value={richTextState} onChange={(val) => setRichTextState(val)} />
      )}
    </OverlayContainer>
  );

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <EntryFormHead
        title={t('categories.organizer.form.description') as string}
        actions={formButtons}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-g"
            label={t('categories.organizer.form.descriptionGerman') as string}
            rows={5}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-e"
            label={t('categories.organizer.form.descriptionEnglish') as string}
            rows={5}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-gs"
            label={t('categories.organizer.form.descriptionGermanSimple') as string}
            rows={5}
          />
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-desc-es"
            label={t('categories.organizer.form.descriptionEnglishSimple') as string}
            rows={5}
          />
        </FormItem>
      </FormGrid>
    </form>
  );
};

const AddressForm: React.FC<OrganizerFormProps> = ({ category, query }: OrganizerFormProps) => {
  const { formState, setFormState, setPristine, formProps, formButtons } = useEntryForm(
    category,
    query
  );

  const t = useT();

  return (
    <EntryForm {...formProps}>
      <EntryFormHead
        title={t('categories.organizer.form.address') as string}
        actions={formButtons}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.street1') as string}
            type={InputType.text}
            value={formState?.relations?.address?.attributes?.street1 || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                relations: {
                  ...formState.relations,
                  address: {
                    ...formState?.relations?.address,
                    attributes: {
                      ...formState?.relations?.address?.attributes,
                      street1: e.target.value,
                    },
                  },
                },
              });
            }}
            required
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            label={t('categories.organizer.form.street2') as string}
            type={InputType.text}
            value={formState?.relations?.address?.attributes?.street2 || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                relations: {
                  ...formState.relations,
                  address: {
                    ...formState?.relations?.address,
                    attributes: {
                      ...formState?.relations?.address?.attributes,
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
            label={t('categories.organizer.form.zipCode') as string}
            type={InputType.text}
            value={formState?.relations?.address?.attributes?.zipCode || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                relations: {
                  ...formState.relations,
                  address: {
                    ...formState?.relations?.address,
                    attributes: {
                      ...formState?.relations?.address?.attributes,
                      zipCode: e.target.value,
                    },
                  },
                },
              });
            }}
            required
          />
        </FormItem>
        <FormItem width={FormItemWidth.quarter}>
          <Input
            label={t('categories.organizer.form.city') as string}
            type={InputType.text}
            value={formState?.relations?.address?.attributes?.city || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                relations: {
                  ...formState.relations,
                  address: {
                    ...formState?.relations?.address,
                    attributes: {
                      ...formState?.relations?.address?.attributes,
                      city: e.target.value,
                    },
                  },
                },
              });
            }}
            required
          />
        </FormItem>
      </FormGrid>
    </EntryForm>
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
        <DescriptionForm category={category} query={query} />
      </EntryFormContainer>
      <EntryFormContainer>
        <AddressForm category={category} query={query} />
      </EntryFormContainer>
      <EntryFormContainer>
        <ContactForm category={category} query={query} />
      </EntryFormContainer>
    </EntryFormWrapper>
  );
};
