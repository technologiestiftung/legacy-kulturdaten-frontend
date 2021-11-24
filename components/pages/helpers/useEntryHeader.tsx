import styled from '@emotion/styled';
import { Link } from 'react-feather';
import { Categories } from '../../../config/categories';
import { ApiCall } from '../../../lib/api';
import { CategoryEntry, Translation } from '../../../lib/api/types/general';
import { useDeleteEntry, useEntry, useTabs } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useLanguage, useLocale } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { useOrganizerId } from '../../../lib/useOrganizer';
import { useUserIsOwner } from '../../../lib/useUserIsOwner';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { useAdminMode } from '../../Admin/AdminContext';
import { Button, ButtonColor, ButtonSize, ButtonVariant, IconPosition } from '../../button';
import { DropdownMenu, DropdownMenuForm } from '../../DropdownMenu';
import { EntryHeader } from '../../EntryHeader';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
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
  const language = useLanguage();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const userIsOwner = useUserIsOwner();
  const t = useT();

  const { entry } = useEntry<CategoryEntry, ApiCall>(category, query);

  const currentTranslation = entry?.data?.relations?.translations
    ? getTranslation<Translation>(language, entry?.data?.relations?.translations)
    : undefined;

  const mainTitle =
    title ||
    (entry?.data?.id
      ? currentTranslation?.attributes.name || category?.placeholderName
      : undefined);
  const subTitle = title
    ? currentTranslation?.attributes.name || category?.placeholderName
    : undefined;

  const locale = useLocale();
  const { quit } = useAdminMode();

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
    <>
      <EntryHeader
        wideLayout={wideLayout}
        backButton={titleBarLink}
        title={mainTitle}
        subTitle={subTitle}
        tabs={minimalVariant ? undefined : tabs}
        menu={
          minimalVariant ? undefined : (
            <DropdownMenu
              icon="MoreVertical"
              text={t('general.actions') as string}
              form={DropdownMenuForm.rounded}
              buttonAriaLabels={{
                open: t('general.actionsOpen') as string,
                close: t('general.actionsClose') as string,
              }}
              stretch={!isMidOrWider}
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
              {userIsOwner && (
                <Button
                  variant={ButtonVariant.minimal}
                  size={ButtonSize.default}
                  color={ButtonColor.black}
                  onClick={async () => {
                    if (confirm(category?.options?.deleteConfirm)) {
                      loadingScreen(category?.options?.deleting, async () => {
                        switch (category.name) {
                          case Categories.organizer: {
                            const deleteResp = await deleteOrganizer(entry?.data?.id);
                            quit();

                            return deleteResp;
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
              )}
            </DropdownMenu>
          )
        }
        minimalVariant={minimalVariant}
      />
    </>
  );
};
