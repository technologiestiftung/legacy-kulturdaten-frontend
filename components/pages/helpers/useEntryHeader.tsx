import styled from '@emotion/styled';
import { Link } from 'react-feather';
import { Categories } from '../../../config/categories';
import { ApiCall } from '../../../lib/api';
import { useDownload } from '../../../lib/api/download';
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
import { useConfirmScreen } from '../../Confirm/ConfirmScreen';
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
  const { quit, adminModeActive } = useAdminMode();

  const organizerId = useOrganizerId();
  const loadingScreen = useLoadingScreen();
  const confirmScreen = useConfirmScreen();
  const deleteOrganizer = useDeleteEntry(Categories.organizer);
  const deleteOffer = useDeleteEntry(Categories.offer);
  const deleteLocation = useDeleteEntry(Categories.location);
  const download = useDownload();

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
                onClick={() =>
                  download(
                    category?.options?.export.xls.entry.route({
                      id: entry?.data?.id,
                      format: 'xls',
                    }),
                    `${currentTranslation?.attributes?.name || category?.placeholderName}.xls`
                  )
                }
              >
                {category?.options?.export?.xls?.entry?.title}
              </Button>
              {userIsOwner && (
                <Button
                  variant={ButtonVariant.minimal}
                  size={ButtonSize.default}
                  color={ButtonColor.black}
                  onClick={() => {
                    confirmScreen({
                      title: category?.options?.deletion.title,
                      confirmButtonText: category?.options?.deletion.button,
                      message: category?.options?.deletion.message(
                        currentTranslation?.attributes?.name || category.placeholderName
                      ),
                      condition: category?.options?.deletion?.condition
                        ? {
                            label: category?.options?.deletion?.condition.label,
                            value: currentTranslation?.attributes?.name || category.placeholderName,
                            error: category?.options?.deletion?.condition.error,
                          }
                        : undefined,
                      onConfirm: async () => {
                        loadingScreen(category?.options?.deletion.deleting, async () => {
                          switch (category.name) {
                            case Categories.organizer: {
                              const deleteResp = await deleteOrganizer(entry?.data?.id);
                              if (adminModeActive) {
                                quit();
                              }

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
                      },
                    });
                  }}
                >
                  {category?.options?.deletion.title}
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
