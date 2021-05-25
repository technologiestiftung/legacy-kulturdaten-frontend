import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCategory, useEntry, useList, useTabs } from '../../../../lib/categories';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';
import { TitleBar } from '../../../../components/navigation/TitleBar';
import { useOrganizerMenu } from '../../../../components/pages/organizer/list';
import { OrganizerList } from '../../../../lib/api';
import { Organizer } from '../../../../lib/api/types/organizer';
import { Breakpoint, useBreakpointOrWider } from '../../../../lib/WindowService';
import { OrganizerShow } from '../../../../lib/api/routes/organizer/show';
import { Button, ButtonSize, IconPosition } from '../../../../components/button';
import { useT } from '../../../../lib/i18n';
import Link from 'next/link';
import { useLocale } from '../../../../lib/routing';
import styled from '@emotion/styled';

const StyledA = styled.a`
  text-decoration: none;
`;

const EntrySubPage: NextPage = () => {
  const router = useRouter();
  const category = useCategory();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const tabs = useTabs(category);
  const list = useList<OrganizerList, Organizer[]>(category, null, isMidOrWider);
  const secMenu = useOrganizerMenu(category, list);
  const { entry } = useEntry<Organizer, OrganizerShow>(category, router?.query);
  const title = entry?.attributes?.name;
  const t = useT();
  const locale = useLocale();

  const subPath = router?.query.sub as string;

  const mobileButton = (
    <Button size={ButtonSize.small} icon="ArrowLeft" iconPosition={IconPosition.left}>
      {t('general.back')}
    </Button>
  );

  const tabletDesktopButton = (
    <Button size={ButtonSize.small} icon="X" iconPosition={IconPosition.right}>
      {t('general.close')}
    </Button>
  );

  const titleBarLink = (
    <Link href={category?.routes.list({ locale })}>
      <StyledA css="text-decoration: none;">
        {isMidOrWider ? tabletDesktopButton : mobileButton}
      </StyledA>
    </Link>
  );

  if (category) {
    return (
      <AppWrapper
        titleBar={<TitleBar title={title} action={titleBarLink} secondaryPresent={true} />}
        secondaryMenu={secMenu}
      >
        {tabs}
        {React.createElement(category?.pages[subPath], { category, query: router?.query })}
      </AppWrapper>
    );
  }

  return <AppWrapper titleBar={<TitleBar title="TBD" />}>TBD</AppWrapper>;
};

export default EntrySubPage;
