import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { Link } from 'react-feather';
import { ApiCall } from '../../../lib/api';
import { CategoryEntry, PublishedStatus, Translation } from '../../../lib/api/types/general';
import { useEntry, useMetaLinks, useTabs } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useLanguage, useLocale } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { useOrganizerId } from '../../../lib/useOrganizer';
import { Button, ButtonVariant, IconPosition } from '../../button';
import { EntryHeader } from '../../EntryHeader';
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
  const metaLinks = useMetaLinks(category);

  const t = useT();
  const organizerId = useOrganizerId();

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
      actions={minimalVariant ? undefined : metaLinks}
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
