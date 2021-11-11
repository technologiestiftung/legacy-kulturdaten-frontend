import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { contentLanguages, languageTranslationKeys } from '../../config/locales';
import { Contact } from '../../lib/api/types/contact';

import { useT } from '../../lib/i18n';
import { getTranslation } from '../../lib/translations';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonSize, ButtonVariant } from '../button';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';

const StyledContacts = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
`;

const StyledContactsAdd = styled.div`
  padding: 0.75rem;

  > * {
    width: 100%;
  }

  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 1.5rem;
    grid-column: span 2;
    text-align: right;

    > * {
      width: auto;
    }
  }
`;

const StyledContactsPlaceholder = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.5rem;
  }
`;

const StyledContactsItem = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid var(--grey-400);
  align-items: stretch;
`;

const StyledContactsItemIndex = styled.div<{ first: boolean }>`
  padding: 0.375rem 0.375rem 0.75rem;
  text-align: center;
  font-size: var(--font-size-650);
  line-height: var(--line-height-650);
  font-weight: 700;
  background: var(--grey-200);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${({ first }) => first && 'border-top-left-radius: 0.75rem;'}

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 0.75rem 1.5rem;
  }
`;

const StyledContactsItemContent = styled.div`
  display: grid;
  grid-template-columns: 100%;
  row-gap: 0.75rem;
  align-items: flex-end;
  padding: 0.75rem;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    column-gap: 1.5rem;
    grid-template-columns: calc(50% - 0.75rem) calc(50% - 0.75rem);
    padding: 1.5rem;
  }
`;

const StyledContactsItemField = styled.div`
  align-self: stretch;
`;

const StyledContactsItemRemove = styled.div`
  position: relative;
  line-height: 0;
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
          <StyledContactsItemIndex first={index === 0}>
            <div>{index + 1}</div>
            <StyledContactsItemRemove>
              <Button
                variant={ButtonVariant.minimal}
                ariaLabel={t('contacts.remove') as string}
                tooltip={t('contacts.remove') as string}
                css={css`
                  padding: 0.375rem;
                  border-radius: 0.375rem;
                `}
                onClick={() =>
                  onChange(contacts.filter((contact, contactIndex) => contactIndex !== index))
                }
                icon="Trash2"
              />
            </StyledContactsItemRemove>
          </StyledContactsItemIndex>
          <StyledContactsItemContent>
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
                placeholder={t('general.telPlaceholder') as string}
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
          </StyledContactsItemContent>
        </StyledContactsItem>
      ))}
      {!contacts ||
        (contacts.length === 0 && (
          <StyledContactsItem>
            <StyledContactsPlaceholder>{t('contacts.placeholder')}</StyledContactsPlaceholder>
          </StyledContactsItem>
        ))}
      <StyledContactsAdd>
        <Button
          color={ButtonColor.black}
          size={ButtonSize.big}
          icon="Plus"
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
