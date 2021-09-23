import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { Link } from 'react-feather';
import { ApiCall } from '../../../lib/api';
import { CategoryEntry, PublishedStatus, Translation } from '../../../lib/api/types/general';
import { useEntry, useMetaLinks, useTabs } from '../../../lib/categories';
import { DateFormat, useDate } from '../../../lib/date';
import { useT } from '../../../lib/i18n';
import { useLanguage, useLocale } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { Button, ButtonVariant, IconPosition } from '../../button';
import { EntryHeader } from '../../EntryHeader';
import { Publish } from '../../Publish';
import { StatusBar } from '../../statusbar';
import { EntryFormProps } from './form';

const StyledA = styled.a`
  text-decoration: none;
`;

export const useEntryHeader = ({ category, query }: EntryFormProps): React.ReactElement => {
  const tabs = useTabs(category);
  const router = useRouter();
  const language = useLanguage();

  const { entry } = useEntry<CategoryEntry, ApiCall>(category, router?.query);

  const currentTranslation = entry?.data?.relations?.translations
    ? getTranslation<Translation>(language, entry?.data?.relations?.translations)
    : undefined;

  const title = currentTranslation?.attributes.name;

  const locale = useLocale();
  const metaLinks = useMetaLinks(category);

  const date = useDate();
  const t = useT();

  const formattedDate = entry?.data?.attributes?.updatedAt
    ? date(new Date(entry?.data?.attributes.updatedAt), DateFormat.dateTime)
    : undefined;

  const renderedStatusBar = (
    <StatusBar status={entry?.data?.attributes?.status} date={formattedDate} />
  );

  const titleBarLink = (
    <Link href={category?.routes.list({ locale, query: { organizer: '1' } })}>
      <StyledA>
        <Button icon="ArrowLeft" iconPosition={IconPosition.left} variant={ButtonVariant.minimal}>
          {t('general.back')}
        </Button>
      </StyledA>
    </Link>
  );

  return (
    <EntryHeader
      backButton={titleBarLink}
      title={title}
      tabs={tabs}
      statusBar={renderedStatusBar}
      actions={metaLinks}
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
    />
  );
};
