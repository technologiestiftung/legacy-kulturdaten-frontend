import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCategory, useEntry, useMetaLinks, useTabs } from '../../../../lib/categories';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';
import { Button, ButtonVariant, IconPosition } from '../../../../components/button';
import { useT } from '../../../../lib/i18n';
import Link from 'next/link';
import { useLanguage, useLocale } from '../../../../lib/routing';
import styled from '@emotion/styled';
import { EntryHeader } from '../../../../components/EntryHeader';
import { StatusBar } from '../../../../components/statusbar';
import { DateFormat, useDate } from '../../../../lib/date';
import { getTranslation } from '../../../../lib/translations';
import { Publish } from '../../../../components/Publish';
import { CategoryEntry, PublishedStatus, Translation } from '../../../../lib/api/types/general';
import { ApiCall } from '../../../../lib/api';

const StyledA = styled.a`
  text-decoration: none;
`;

const EntrySubPage: NextPage = () => {
  const router = useRouter();
  const category = useCategory();
  const language = useLanguage();
  const date = useDate();
  const tabs = useTabs(category);
  const { entry } = useEntry<CategoryEntry, ApiCall>(category, router?.query);

  const currentTranslation = entry?.data?.relations?.translations
    ? getTranslation<Translation>(language, entry?.data?.relations?.translations)
    : undefined;

  const title = currentTranslation?.attributes.name;
  const t = useT();
  const locale = useLocale();
  const metaLinks = useMetaLinks(category);

  const subPath = router?.query.sub as string;

  const formattedDate = entry?.data?.attributes?.updatedAt
    ? date(new Date(entry?.data?.attributes.updatedAt), DateFormat.dateTime)
    : undefined;

  const renderedStatusBar = (
    <StatusBar status={entry?.data?.attributes?.status} date={formattedDate} />
  );

  const titleBarLink = (
    <Link href={category?.routes.list({ locale })}>
      <StyledA css="text-decoration: none;">
        <Button icon="ArrowLeft" iconPosition={IconPosition.left} variant={ButtonVariant.minimal}>
          {t('general.back')}
        </Button>
      </StyledA>
    </Link>
  );

  if (category) {
    return (
      <AppWrapper subMenuKey={category.subMenuKey}>
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
        />

        {React.createElement(category?.pages[subPath], { category, query: router?.query })}
      </AppWrapper>
    );
  }

  return <AppWrapper>TBD</AppWrapper>;
};

export default EntrySubPage;
