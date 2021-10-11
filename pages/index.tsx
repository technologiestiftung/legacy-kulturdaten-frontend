import { NextPage } from 'next';
import Link from 'next/link';
import styled from '@emotion/styled';
import { routes, useLocale } from '../lib/routing';
import { LocaleSwitch } from '../components/navigation/LocaleSwitch';
import { useT } from '../lib/i18n';
import { useOrganizerId } from '../lib/useOrganizer';

const StyledUl = styled.ul`
  list-style: disc inside;
  padding: 1rem;
`;

const StyledLi = styled.li`
  padding-bottom: 1rem;
`;

export const StyledTestContainer = styled.div`
  max-width: 25rem;
  padding: 1.5rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
`;

const IndexPage: NextPage = () => {
  const locale = useLocale();
  const t = useT();
  const organizerId = useOrganizerId();

  return (
    <StyledTestContainer>
      <h1>Kulturdaten.Berlin</h1>
      <StyledUl>
        <StyledLi>
          <Link href={routes.login({ locale })}>
            <a>{t('start.login')}</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link href={routes.register({ locale })}>
            <a>{t('start.register')}</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link href={routes.dashboard({ locale, query: { organizer: organizerId } })}>
            <a>{t('start.dashboard')}</a>
          </Link>
        </StyledLi>
        <StyledLi>
          <Link href={routes.imprint({ locale })}>
            <a>{t('start.imprint')}</a>
          </Link>
        </StyledLi>
      </StyledUl>
      <div>
        <LocaleSwitch />
      </div>
    </StyledTestContainer>
  );
};

export default IndexPage;
