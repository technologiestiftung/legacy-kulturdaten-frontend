import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { Categories, useCategories } from '../../config/categories';
import { Location, LocationType } from '../../lib/api/types/location';
import { useEntry } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { Button, ButtonColor, ButtonSize, ButtonVariant } from '../button';
import { EntryListContextProvider } from '../EntryList/EntryListContext';
import { useOverlay } from '../overlay';
import { OverlayContainer } from '../overlay/OverlayContainer';
import { OverlayTitleBar } from '../overlay/OverlayTitleBar';

const StyledEntryPicker = styled.div`
  position: relative;
`;
const defaultShadow = '0px 0px 0px 0.125rem rgba(0, 0, 0, 0.25)';
const hintShadow = '0px 0px 0px 0.125rem rgba(10, 47, 211, 0.4)';

const StyledEntryPickerSlot = styled.button<{ showHint?: boolean; variant: EntryPickerVariant }>`
  color: var(--black);
  appearance: none;
  margin: 0;
  background: var(--white);
  text-align: left;
  border: 1px solid var(--grey-600);
  width: 100%;
  display: block;
  position: relative;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 400;
  transition: box-shadow var(--transition-duration-fast);
  box-shadow: ${defaultShadow};

  ${({ showHint }) =>
    showHint
      ? css`
          box-shadow: ${hintShadow};
          border-color: rgb(10, 47, 211);
        `
      : ''}

  &:hover {
    box-shadow: var(--shadow-sharp-hover);
    border-color: var(--grey-600);
  }

  ${({ variant }) =>
    variant === EntryPickerVariant.button &&
    css`
      width: auto;
      font-weight: 700;
      background: var(--black);
      color: var(--white);
      border-radius: 0.75rem;
      border-color: var(--black);
      box-shadow: var(--shadow);
      padding: 0.375rem 0.75rem;
      font-size: var(--font-size-300);
      line-height: var(--line-height-300);
      transition: box-shadow var(--transition-duration-fast),
        transform var(--transition-duration-fast);

      &:hover {
        box-shadow: var(--shadow-hover);
        border-color: var(--black);
      }

      &:active {
        box-shadow: var(--shadow-active);
        transform: translateY(0.125rem);
      }
    `}
`;

const StyledEntryPickerSlotActiveEntry = styled.div`
  padding: 0.75rem 1rem;
  background: var(--grey-200);
`;

const StyledEntryPickerSlotActiveEntryTitle = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
`;

const StyledEntryPickerSlotActiveEntryMeta = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  word-break: break-all;
`;

const StyledEntryPickerSlotEdit = styled.div<{ hasRemove?: boolean }>`
  text-align: ${({ hasRemove }) => (hasRemove ? 'left' : 'right')};
  text-decoration: underline;
  padding: 0.75rem 1rem;
`;

const StyledEntryPickerSlotRemove = styled.div`
  text-align: right;
  padding: 0;
  position: absolute;
  right: calc(0.75rem - 2px);
  bottom: calc(0.75rem - 2px);
`;

const StyledEntryPickerSlotChoose = styled.div``;

export enum EntryPickerVariant {
  default = 'default',
  button = 'button',
}

interface EntryPickerProps {
  chooseText: string;
  editText: string;
  overlayTitle: string;
  value: string;
  list: React.ReactElement;
  categoryName: Categories;
  onChange: (value: string) => void;
  remove?: {
    onRemove: () => void;
    text: string;
  };
  showHint?: boolean;
  error?: boolean;
  variant?: EntryPickerVariant;
}

export const EntryPicker: React.FC<EntryPickerProps> = ({
  chooseText,
  editText,
  overlayTitle,
  categoryName,
  value,
  list,
  onChange,
  showHint,
  remove,
  variant = EntryPickerVariant.default,
}: EntryPickerProps) => {
  const categories = useCategories();
  const language = useLanguage();
  const category = useMemo(() => categories[categoryName], [categories, categoryName]);
  const t = useT();

  const { entry } = useEntry(category, { id: value, organizer: value });

  const translation = useMemo(
    () => getTranslation(language, entry?.data?.relations?.translations, true),
    [language, entry?.data?.relations?.translations]
  );

  const { renderedOverlay, setIsOpen } = useOverlay(
    <OverlayContainer>
      <OverlayTitleBar title={overlayTitle} />
      <div>
        {React.cloneElement(list, {
          customEntryOnClick: (category: Categories, id: string) => {
            onChange(id);
            setIsOpen(false);
          },
        })}
      </div>
    </OverlayContainer>,
    false
  );

  const address = useMemo<string>(() => {
    if (entry?.data?.type === Categories.location) {
      const data = entry.data as Location['data'];

      const entryAddress = data.relations.address;
      if (data.attributes.type === LocationType.physical && entryAddress) {
        return [
          entryAddress.attributes.street1,
          entryAddress.attributes.street2,
          entryAddress.attributes.zipCode,
          entryAddress.attributes.city,
        ]
          .filter((text) => text?.length > 0)
          .join(', ');
      } else if (data.attributes.url) {
        return data.attributes.url;
      } else {
        return t('categories.location.list.addressPlaceholder') as string;
      }
    }

    return undefined;
  }, [entry?.data, t]);

  return (
    <StyledEntryPicker>
      <StyledEntryPickerSlot
        onClick={() => setIsOpen(true)}
        showHint={showHint}
        aria-label={typeof value !== 'undefined' ? editText : chooseText}
        variant={variant}
      >
        {value ? (
          <>
            <StyledEntryPickerSlotActiveEntry>
              <StyledEntryPickerSlotActiveEntryTitle>
                {entry?.data?.id
                  ? translation?.attributes?.name || categories[categoryName].placeholderName
                  : `${t('general.loading')}...`}
              </StyledEntryPickerSlotActiveEntryTitle>
              {address && (
                <StyledEntryPickerSlotActiveEntryMeta>
                  {t('categories.location.list.address')}: {address}
                </StyledEntryPickerSlotActiveEntryMeta>
              )}
            </StyledEntryPickerSlotActiveEntry>
            <StyledEntryPickerSlotEdit hasRemove={typeof remove !== 'undefined'}>
              {editText}
            </StyledEntryPickerSlotEdit>
          </>
        ) : (
          <StyledEntryPickerSlotChoose>{chooseText}</StyledEntryPickerSlotChoose>
        )}
      </StyledEntryPickerSlot>
      <EntryListContextProvider
        listNames={[Categories.organizer, Categories.location, Categories.offer]}
      >
        {renderedOverlay}
      </EntryListContextProvider>
      {remove && (
        <StyledEntryPickerSlotRemove>
          <Button
            onClick={remove.onRemove}
            size={ButtonSize.small}
            color={ButtonColor.white}
            variant={ButtonVariant.minimal}
            icon="Trash2"
            css={css`
              border: 1px solid var(--grey-600);
              border-radius: 0.375rem;
            `}
          >
            {remove.text}
          </Button>
        </StyledEntryPickerSlotRemove>
      )}
    </StyledEntryPicker>
  );
};
