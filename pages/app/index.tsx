import { NextPage } from 'next';
import Link from 'next/link';
import styled from '@emotion/styled';

import { routes, useLocale } from '../../lib/routing';
import { useUser } from '../../components/user/useUser';
import { AppWrapper } from '../../components/wrappers/AppWrapper';
import { TitleBar } from '../../components/navigation/TitleBar';
import { useT } from '../../lib/i18n';

const StyledUl = styled.ul`
  list-style: disc inside;
  padding: 1rem;
`;

const StyledLi = styled.li`
  padding-bottom: 1rem;
`;

const StyledTestContent = styled.div`
  width: 100%;
  display: grid;
  padding: 0.75rem;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 1.5rem;
  column-gap: 1.5rem;
`;

const StyledTestContentBox = styled.div`
  height: 20rem;
  width: 100%;
  border: 1px solid var(--grey-400);
  padding: 1.5rem;
  font-weight: 700;
  border-radius: 0.75rem;
`;

const DashboardPage: NextPage = () => {
  useUser();
  const locale = useLocale();
  const t = useT();

  const titleBar = <TitleBar title={t('menu.start.items.dashboard') as string} />;

  return (
    <AppWrapper titleBar={titleBar}>
      <StyledUl>
        <StyledLi>
          <Link href={routes.userProfile({ locale })}>
            <a>Link: {t('menu.user.items.profile')}</a>
          </Link>
        </StyledLi>
      </StyledUl>
      <StyledTestContent>
        {[...Array(10)].map((i, index) => (
          <StyledTestContentBox key={index}>{t('test.content')}</StyledTestContentBox>
        ))}
      </StyledTestContent>
    </AppWrapper>
  );
};

export default DashboardPage;
