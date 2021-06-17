import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCategory, useEntry, useList, useMetaLinks, useTabs } from '../../../../lib/categories';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';
import { TitleBar } from '../../../../components/navigation/TitleBar';
import { useOrganizerMenu } from '../../../../components/pages/organizer/list';
import { OrganizerList } from '../../../../lib/api';
import { Organizer } from '../../../../lib/api/types/organizer';
import { Breakpoint, useBreakpointOrWider } from '../../../../lib/WindowService';
import { OrganizerShow } from '../../../../lib/api/routes/organizer/show';
import { Button, ButtonVariant, IconPosition } from '../../../../components/button';
import { useT } from '../../../../lib/i18n';
import Link from 'next/link';
import { useLocale } from '../../../../lib/routing';
import styled from '@emotion/styled';
import { EntryHeader } from '../../../../components/EntryHeader';
import { StatusBar } from '../../../../components/statusbar';
import { DateFormat, useDate } from '../../../../lib/date';

const StyledA = styled.a`
  text-decoration: none;
`;

const EntrySubPage: NextPage = () => {
  const router = useRouter();
  const category = useCategory();
  const date = useDate();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const tabs = useTabs(category);
  const list = useList<OrganizerList, Organizer>(category, null, isMidOrWider);
  const secMenu = useOrganizerMenu(category, list);
  const { entry } = useEntry<Organizer, OrganizerShow>(category, router?.query);
  const title = entry?.data?.attributes?.name;
  const t = useT();
  const locale = useLocale();
  const metaLinks = useMetaLinks(category);

  const subPath = router?.query.sub as string;

  const formattedDate = entry?.data?.attributes.updatedAt
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
      <AppWrapper secondaryMenu={secMenu}>
        <EntryHeader
          backButton={titleBarLink}
          title={title}
          tabs={tabs}
          statusBar={renderedStatusBar}
          actions={metaLinks}
        />
        {React.createElement(category?.pages[subPath], { category, query: router?.query })}
      </AppWrapper>
    );
  }

  return <AppWrapper titleBar={<TitleBar title="TBD" />}>TBD</AppWrapper>;
};

export default EntrySubPage;
