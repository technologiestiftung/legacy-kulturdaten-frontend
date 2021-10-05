import { Language } from '../../../config/locale';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import {
  EntryFormContainer,
  EntryFormContainerColumns,
  EntryFormWrapper,
} from '../../EntryForm/wrappers';
import { useName } from '../helpers/form/Name';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { EntryFormProps } from '../helpers/form';
import { Offer, OfferTranslation } from '../../../lib/api/types/offer';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { EntryPicker } from '../../EntryPicker';
import { OrganizerList } from '../../EntryList/OrganizerList';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { getTranslation } from '../../../lib/translations';
import { useLanguage } from '../../../lib/routing';
import { useState } from 'react';
import { Categories } from '../../../config/categories';
import { LocationList } from '../../EntryList/LocationList';

const NameForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
  } = useName<Offer, OfferShow, OfferTranslation>({
    category,
    query,
    language: Language.de,
    label: t('categories.location.form.nameGerman') as string,
    loaded: true,
    showHint: false,
  });

  const {
    form: setNameEnglish,
    onSubmit: onSubmitEnglish,
    pristine: pristineEnglish,
    reset: resetEnglish,
  } = useName<Offer, OfferShow, OfferTranslation>({
    category,
    query,
    language: Language.en,
    label: t('categories.location.form.nameEnglish') as string,
    loaded: true,
    showHint: false,
  });

  return (
    <div>
      <EntryFormHead
        title={t('categories.location.form.name') as string}
        // actions={[
        //   <Button
        //     key={0}
        //     onClick={() => {
        //       resetGerman();
        //       resetEnglish();
        //     }}
        //     disabled={pristineEnglish && pristineGerman}
        //     icon="XOctagon"
        //     color={ButtonColor.yellow}
        //   >
        //     {t('categories.location.form.editCancel')}
        //   </Button>,
        //   <Button
        //     key={1}
        //     icon="CheckSquare"
        //     color={ButtonColor.green}
        //     onClick={() => {
        //       onSubmitEnglish();
        //       onSubmitGerman();
        //     }}
        //     disabled={pristineEnglish && pristineGerman}
        //   >
        //     {t('categories.location.form.save')}
        //   </Button>,
        // ]}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>{setNameGerman}</FormItem>
        <FormItem width={FormItemWidth.half}>{setNameEnglish}</FormItem>
      </FormGrid>
    </div>
  );
};

export const OfferInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const { entry } = useEntry<Offer, OfferShow>(category, query);
  const language = useLanguage();
  const t = useT();
  const [organizerId, setOrganizerId] = useState<string>();
  const [locationId, setLocationId] = useState<string>();

  const translation = getTranslation(language, entry?.data?.relations?.translations, true);

  return (
    <>
      {renderedEntryHeader}
      <EntryFormWrapper>
        <EntryFormContainer>
          <NameForm category={category} query={query} />
        </EntryFormContainer>
        <EntryFormContainer>
          <EntryFormContainerColumns>
            <div>
              <EntryFormHead
                title={t('categories.offer.form.organizer.label') as string}
                hint={typeof organizerId === 'undefined'}
              />
              <FormGrid>
                <FormItem width={FormItemWidth.full}>
                  <EntryPicker
                    chooseText={t('categories.offer.form.organizer.choose') as string}
                    editText={t('categories.offer.form.organizer.edit') as string}
                    overlayTitle={
                      t('categories.offer.form.organizer.title', {
                        name: translation?.attributes?.name,
                      }) as string
                    }
                    value={organizerId}
                    onChange={(value) => setOrganizerId(value)}
                    categoryName={Categories.organizer}
                    showHint={typeof organizerId === 'undefined'}
                    list={
                      <OrganizerList
                        expanded={isMidOrWider}
                        expandable={false}
                        enableUltraWideLayout={false}
                        activeEntryId={organizerId}
                      />
                    }
                  />
                </FormItem>
              </FormGrid>
            </div>
            <div>
              <EntryFormHead
                title={t('categories.offer.form.location.label') as string}
                hint={typeof locationId === 'undefined'}
                showHintInline
              />
              <FormGrid>
                <FormItem width={FormItemWidth.full}>
                  <EntryPicker
                    chooseText={t('categories.offer.form.location.choose') as string}
                    editText={t('categories.offer.form.location.edit') as string}
                    overlayTitle={
                      t('categories.offer.form.location.title', {
                        name: translation?.attributes?.name,
                      }) as string
                    }
                    value={locationId}
                    onChange={(value) => setLocationId(value)}
                    categoryName={Categories.location}
                    showHint={typeof locationId === 'undefined'}
                    list={
                      <LocationList
                        expanded={isMidOrWider}
                        expandable={false}
                        enableUltraWideLayout={false}
                        activeEntryId={locationId}
                      />
                    }
                  />
                </FormItem>
              </FormGrid>
            </div>
          </EntryFormContainerColumns>
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};
