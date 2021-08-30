import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { Categories, useCategories } from '../../config/categories';
import { useEntry } from '../../lib/categories';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { EntryListContextProvider } from '../EntryList/EntryListContext';
import { useOverlay } from '../overlay';
import { OverlayContainer } from '../overlay/OverlayContainer';
import { OverlayTitleBar } from '../overlay/OverlayTitleBar';

const StyledEntryPicker = styled.div``;

const StyledEntryPickerSlot = styled.div``;

const StyledEntryPickerSlotActiveEntry = styled.div``;
const StyledEntryPickerSlotActiveEntryTitle = styled.div``;

const StyledEntryPickerSlotEdit = styled.div``;

const StyledEntryPickerSlotChoose = styled.div``;

interface EntryPickerProps {
  chooseText: string;
  editText: string;
  overlayTitle: string;
  value: string;
  list: React.ReactElement;
  categoryName: Categories;
  onChange: (value: string) => void;
}

export const EntryPicker: React.FC<EntryPickerProps> = ({
  chooseText,
  editText,
  overlayTitle,
  categoryName,
  value,
  list,
  onChange,
}: EntryPickerProps) => {
  const categories = useCategories();
  const language = useLanguage();
  const category = useMemo(() => categories[categoryName], [categories, categoryName]);

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
      <StyledEntryPickerSlot>
        {value ? (
          <>
            <StyledEntryPickerSlotActiveEntry>
              <StyledEntryPickerSlotActiveEntryTitle>
                {translation?.attributes?.name}
              </StyledEntryPickerSlotActiveEntryTitle>
            </StyledEntryPickerSlotActiveEntry>
            <StyledEntryPickerSlotEdit onClick={() => setIsOpen(true)}>
              {editText}
            </StyledEntryPickerSlotEdit>
          </>
        ) : (
          <StyledEntryPickerSlotChoose onClick={() => setIsOpen(true)}>
            {chooseText}
          </StyledEntryPickerSlotChoose>
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
