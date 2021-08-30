import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { Categories, useCategories } from '../../config/categories';
import { useEntry } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { EntryListContextProvider } from '../EntryList/EntryListContext';
import { useOverlay } from '../overlay';
import { OverlayContainer } from '../overlay/OverlayContainer';
import { OverlayTitleBar } from '../overlay/OverlayTitleBar';

const StyledEntryPicker = styled.div``;
const hintShadow = '0px 0px 0px 0.125rem rgba(10, 47, 211, 0.4)';

const StyledEntryPickerSlot = styled.button<{ showHint?: boolean }>`
  appearance: none;
  margin: 0;
  background: var(--white);
  text-align: left;
  border: 1px solid var(--grey-600);
  width: 100%;
  display: block;
  position: relative;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 0.75rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 400;
  transition: box-shadow var(--transition-duration-fast);

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
`;

const StyledEntryPickerSlotActiveEntry = styled.div`
  border: 1px solid var(--grey-400);
  border-radius: 0.375rem;
  padding: 0.75rem;
  background: var(--grey-200);
`;
const StyledEntryPickerSlotActiveEntryTitle = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
`;

const StyledEntryPickerSlotEdit = styled.div`
  text-align: right;
  text-decoration: underline;
`;

const StyledEntryPickerSlotChoose = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
`;

interface EntryPickerProps {
  chooseText: string;
  editText: string;
  overlayTitle: string;
  value: string;
  list: React.ReactElement;
  categoryName: Categories;
  onChange: (value: string) => void;
  showHint?: boolean;
  error?: boolean;
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
  error,
}: EntryPickerProps) => {
  const categories = useCategories();
  const language = useLanguage();
  const category = useMemo(() => categories[categoryName], [categories, categoryName]);
  const t = useT();

  const { entry } = useEntry(category, { id: value });

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
            console.log(category, id);
            onChange(id);
            setIsOpen(false);
          },
        })}
      </div>
    </OverlayContainer>,
    false
  );

  return (
    <StyledEntryPicker>
      <StyledEntryPickerSlot
        onClick={() => setIsOpen(true)}
        showHint={showHint}
        aria-label={typeof value !== 'undefined' ? editText : chooseText}
      >
        {value ? (
          <>
            <StyledEntryPickerSlotActiveEntry>
              <StyledEntryPickerSlotActiveEntryTitle>
                {translation?.attributes?.name || `${t('general.loading')}...`}
              </StyledEntryPickerSlotActiveEntryTitle>
            </StyledEntryPickerSlotActiveEntry>
            <StyledEntryPickerSlotEdit>{editText}</StyledEntryPickerSlotEdit>
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
    </StyledEntryPicker>
  );
};
