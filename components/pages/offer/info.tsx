import { Language } from '../../../config/locale';
import { CategoryEntryPage } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { Button, ButtonColor } from '../../button';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useName } from '../helpers/form/Name';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { EntryFormProps } from '../helpers/form';
import { Offer, OfferTranslation } from '../../../lib/api/types/offer';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { OfferTranslationCreate } from '../../../lib/api/routes/offer/translation/create';
import { useEntryHeader } from '../helpers/useEntryHeader';

const NameForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
  const t = useT();

  const {
    form: setNameGerman,
    onSubmit: onSubmitGerman,
    pristine: pristineGerman,
    reset: resetGerman,
  } = useName<Offer, OfferShow, OfferTranslation, OfferTranslationCreate>({
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
  } = useName<Offer, OfferShow, OfferTranslation, OfferTranslationCreate>({
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

  return (
    <>
      {renderedEntryHeader}
      <EntryFormWrapper>
        <EntryFormContainer>
          <NameForm category={category} query={query} />
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};
