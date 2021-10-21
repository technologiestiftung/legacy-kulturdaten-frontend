import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { Link } from 'react-feather';
import { Categories } from '../../../config/categories';
import { ApiCall } from '../../../lib/api';
import { CategoryEntry, PublishedStatus, Translation } from '../../../lib/api/types/general';
import { useDeleteEntry, useEntry, useTabs } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useLanguage, useLocale } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { useOrganizerId } from '../../../lib/useOrganizer';
import { Button, ButtonColor, ButtonSize, ButtonVariant, IconPosition } from '../../button';
import { DropdownMenu, DropdownMenuForm } from '../../DropdownMenu';
import { EntryHeader } from '../../EntryHeader';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { Publish } from '../../Publish';
import { EntryFormProps } from './form';

const StyledA = styled.a`
  text-decoration: none;
`;

export const useEntryHeader = (
  { category, query }: EntryFormProps,
  title?: string,
  wideLayout?: boolean,
  minimalVariant?: boolean
): React.ReactElement => {
  const tabs = useTabs(category);
  const router = useRouter();
  const language = useLanguage();

  const { entry } = useEntry<CategoryEntry, ApiCall>(category, query);

  const currentTranslation = entry?.data?.relations?.translations
    ? getTranslation<Translation>(language, entry?.data?.relations?.translations)
    : undefined;

  const mainTitle = title || currentTranslation?.attributes.name;
  const subTitle = title ? currentTranslation?.attributes.name : undefined;

  const locale = useLocale();

  const t = useT();
  const organizerId = useOrganizerId();
  const loadingScreen = useLoadingScreen();

  const deleteOrganizer = useDeleteEntry(Categories.organizer);
  const deleteOffer = useDeleteEntry(Categories.offer);
  const deleteLocation = useDeleteEntry(Categories.location);

  const titleBarLink = (
    <Link href={category?.routes.list({ locale, query: { organizer: organizerId } })}>
      <StyledA>
        <Button icon="ArrowLeft" iconPosition={IconPosition.left} variant={ButtonVariant.minimal}>
          {t('general.back')}
        </Button>
      </StyledA>
    </Link>
  );

  return (
    <EntryHeader
      wideLayout={wideLayout}
      backButton={titleBarLink}
      title={mainTitle}
      subTitle={subTitle}
      tabs={minimalVariant ? undefined : tabs}
      actions={
        minimalVariant ? undefined : (
          <DropdownMenu
            icon="Sliders"
            text={t('general.options') as string}
            form={DropdownMenuForm.rounded}
            buttonAriaLabels={{
              open: t('general.optionsOpen') as string,
              close: t('general.optionsClose') as string,
            }}
          >
            <Button
              variant={ButtonVariant.minimal}
              size={ButtonSize.default}
              color={ButtonColor.white}
              onClick={() => alert('Download startet')}
            >
              {category?.options?.exportCsv}
            </Button>
            <Button
              variant={ButtonVariant.minimal}
              size={ButtonSize.default}
              color={ButtonColor.white}
              onClick={() => alert('Download startet')}
            >
              {category?.options?.exportXls}
            </Button>
            <Button
              variant={ButtonVariant.minimal}
              size={ButtonSize.default}
              color={ButtonColor.black}
              onClick={async () => {
                if (confirm(category?.options?.deleteConfirm)) {
                  loadingScreen(category?.options?.deleting, async () => {
                    switch (category.name) {
                      case Categories.organizer: {
                        return await deleteOrganizer(entry?.data?.id);
                      }
                      case Categories.offer: {
                        return await deleteOffer(entry?.data?.id);
                      }
                      case Categories.location: {
                        return await deleteLocation(entry?.data?.id);
                      }
                    }
                  });
                }
              }}
            >
              {category?.options?.delete}
            </Button>
          </DropdownMenu>
        )
      }
      publish={
        category?.requirements &&
        entry?.data?.attributes?.status &&
        entry?.data?.attributes?.status !== PublishedStatus.published ? (
          <Publish
            category={category}
            query={router?.query}
            requirements={category?.requirements}
          />
        ) : undefined
      }
      status={entry?.data?.attributes?.status}
      minimalVariant={minimalVariant}
    />
  );
};
