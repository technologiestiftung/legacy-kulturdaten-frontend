import styled from '@emotion/styled';
import { contentLanguages, languageTranslationKeys } from '../../config/locales';
import { Contact } from '../../lib/api/types/contact';

import { useT } from '../../lib/i18n';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor } from '../button';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';

const StyledContacts = styled.div`
  display: grid;
  grid-template-columns: 100%;
  row-gap: 0.75rem;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 1fr;
    column-gap: 1.5rem;
    row-gap: 1.5rem;
  }
`;

const StyledContactsAdd = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: span 2;
  }
`;

const StyledContactsItem = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  align-items: flex-end;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem;
  }
`;

const StyledContactsItemField = styled.div`
  align-self: stretch;
`;

const StyledContactsItemRemove = styled.div`
  text-align: right;

  ${mq(Breakpoint.mid)} {
    grid-column: span 2;
  }
`;

interface ContactsProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

export const Contacts: React.FC<ContactsProps> = ({ contacts, onChange }: ContactsProps) => {
  const t = useT();

  return (
    <StyledContacts>
      {contacts?.map((contact, index) => (
        <StyledContactsItem key={index}>
          {contentLanguages.map((language, languageIndex) => {
            const translation = getTranslation(language, contact.relations?.translations, false);

            return (
              <StyledContactsItemField key={`${index}-${languageIndex}`}>
                <Input
                  type={InputType.text}
                  value={translation?.attributes?.name || ''}
                  label={`${t('forms.name')} (${t(languageTranslationKeys[language])})`}
                  onChange={(e) => {
                    const filteredTranslations = contact.relations?.translations?.filter(
                      (transl) => transl.attributes.language !== language
                    );

                    const newTranslation = {
                      ...translation,
                      attributes: {
                        ...translation?.attributes,
                        language,
                        name: e.target.value,
                      },
                    };

                    onChange([
                      ...contacts.slice(0, index),
                      {
                        ...contact,
                        relations: {
                          ...contact.relations,
                          translations: [
                            ...filteredTranslations?.slice(0, languageIndex),
                            newTranslation,
                            ...filteredTranslations?.slice(languageIndex),
                          ],
                        },
                      },
                      ...contacts.slice(index + 1),
                    ]);
                  }}
                />
              </StyledContactsItemField>
            );
          })}
          <StyledContactsItemField>
            <Input
              type={InputType.tel}
              value={contact.attributes.phone || ''}
              label={t('forms.tel') as string}
              onChange={(e) =>
                onChange([
                  ...contacts.slice(0, index),
                  {
                    ...contact,
                    attributes: {
                      ...contact.attributes,
                      phone: e.target.value,
                    },
                  },
                  ...contacts.slice(index + 1),
                ])
              }
            />
          </StyledContactsItemField>
          <StyledContactsItemField>
            <Input
              type={InputType.email}
              value={contact.attributes.email || ''}
              label={t('forms.email') as string}
              onChange={(e) =>
                onChange([
                  ...contacts.slice(0, index),
                  {
                    ...contact,
                    attributes: {
                      ...contact.attributes,
                      email: e.target.value,
                    },
                  },
                  ...contacts.slice(index + 1),
                ])
              }
            />
          </StyledContactsItemField>
          <StyledContactsItemRemove>
            <Button
              onClick={() =>
                onChange(contacts.filter((contact, contactIndex) => contactIndex !== index))
              }
            >
              {t('contacts.remove')}
            </Button>
          </StyledContactsItemRemove>
        </StyledContactsItem>
      ))}
      <StyledContactsAdd>
        <Button
          color={ButtonColor.black}
          onClick={() =>
            onChange([
              ...contacts,
              {
                attributes: {
                  phone: '',
                  email: '',
                },
                relations: {
                  translations: contentLanguages.map((language) => ({
                    attributes: { language, name: '' },
                  })),
                },
              },
            ])
          }
        >
          {t('contacts.add')}
        </Button>
      </StyledContactsAdd>
    </StyledContacts>
  );
};
