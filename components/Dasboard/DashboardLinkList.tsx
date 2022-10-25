import styled from '@emotion/styled';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'react-feather';
import { useT } from '../../lib/i18n';

import { StandardLink, StandardLinkInternal, StandardLinkType } from '../../lib/generalTypes';
import { Breakpoint } from '../../lib/WindowService';
import { mq,focusStyles } from '../globals/Constants';

const StyledDashboardLinkList = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  color: inherit;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;

  ${mq(Breakpoint.mid)} {
    row-gap: 2.25rem;
    grid-column: span 6;
    font-size: var(--font-size-400);
    line-height: var(--line-height-400);
  }

  ${mq(Breakpoint.widish)} {
    grid-column: span 4;
  }
`;

const StyledDashboardLinkListTitle = styled.h2`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-600);
    line-height: var(--line-height-600);
  }
`;

const StyledDashboardLinkListText = styled.div``;

const StyledDashboardLinkListList = styled.ul`
  appearance: none;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  align-items: flex-start;
`;

const StyledDashboardLinkListListItem = styled.li`
  appearance: none;
  flex-grow: 0;
`;

const StyledDashboardLinkListLink = styled.a`
  color: inherit;
  text-decoration: none;
  display: flex;
  column-gap: 0.375rem;
  flex-grow: 0;
  position: relative;
  ${focusStyles}

  @media screen and (pointer: fine) {
    &:hover {
      &::before {
        opacity: 1;
      }
    }

    &::before {
      content: '';
      opacity: 0;
      transition: opacity var(--transition-duration-fast);
      background: var(--grey-200);
      position: absolute;
      left: -0.375rem;
      top: -0.1875rem;
      width: calc(100% + 0.75rem);
      height: calc(100% + 0.375rem);
      border-radius: 0.375rem;
      pointer-events: none;
    }
  }

  > span {
    text-decoration: underline;
    position: relative;
  }

  > svg {
    position: relative;
    padding: 0.1875rem 0;
    width: 1.125rem;
    height: 1.125rem;
  }
`;


const InternalDashboardLinkListLink: React.FC<StandardLinkInternal> = ({
  title,
  href
}: StandardLinkInternal) => {
  const t = useT();
  const linkIconAltText = t('links.internal.iconAltText') as string;
  return (
    <Link href={href} passHref>
      <StyledDashboardLinkListLink title={title}>
        <span>{title}</span>
        <ArrowRight aria-label={linkIconAltText + ' ' + title} />
      </StyledDashboardLinkListLink>
    </Link>
  );
};

export const DashboardLinkListLink: React.FC<StandardLink> = (props: StandardLink) => {
  const { type = StandardLinkType.internal } = props;
  const t = useT();

  switch (type) {
    case StandardLinkType.internal: {
      return <InternalDashboardLinkListLink {...props} />;
    }

    case StandardLinkType.external: {
      const { title, href } = props;
      return (
        <StyledDashboardLinkListLink href={href} rel="noopener noreferrer" target="_blank">
          <span>{title}</span>
          <ArrowUpRight aria-label={t('links.external.iconAltText') as string} />
        </StyledDashboardLinkListLink>
      );
    }

    default: {
      throw new Error(`DashboardTileLink type "${type}" is not valid`);
    }
  }
};

interface DashboardLinkListProps {
  links: StandardLink[];
  title?: string;
  text?: React.ReactElement;
  id?: string;
}

export const DashboardLinkList: React.FC<DashboardLinkListProps> = ({
  title,
  links,
  text,
  id,
}: DashboardLinkListProps) => {
  return (
    <StyledDashboardLinkList>
      {title && <StyledDashboardLinkListTitle id={id}>{title}</StyledDashboardLinkListTitle>}
      {text && <StyledDashboardLinkListText>{text}</StyledDashboardLinkListText>}
      <StyledDashboardLinkListList>
        {links?.map((link, index) => (
          <StyledDashboardLinkListListItem key={index}>
            <DashboardLinkListLink {...link} />
          </StyledDashboardLinkListListItem>
        ))}
      </StyledDashboardLinkListList>
    </StyledDashboardLinkList>
  );
};
