import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { ArrowRight, ArrowUpRight, Plus } from 'react-feather';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { StandardLink, StandardLinkInternal, StandardLinkType } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';

const StyledDashboardTileLink = styled.a<{ disabled?: boolean }>`
  color: inherit;
  text-decoration: none;
  display: flex;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  column-gap: 0.625rem;
  border: none;
  border-top: 1px solid var(--grey-400);
  padding: 0.75rem 1.125rem;
  display: flex;
  justify-content: flex-end;
  transition: background var(--transition-duration-fast);
  appearance: none;
  margin: 0;
  cursor: pointer;
  background: var(--white);

  &:hover {
    background: var(--grey-200);
  }

  ${mq(Breakpoint.mid)} {
    column-gap: 0.75rem;
    padding: 1.125rem 1.5rem;
    font-size: var(--font-size-400);
    line-height: var(--line-height-400);
  }

  svg {
    display: inline-block;
    padding: 0;
    flex-shrink: 0;
    width: 1.125rem;
    height: 1.125rem;
    padding: 0.1875rem 0;
    color: inherit;

    ${mq(Breakpoint.mid)} {
      padding: 0;
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.3;
    `}
`;

interface InternalDashboardTileLinkProps extends StandardLinkInternal {
  disabled?: boolean;
}

const InternalDashboardTileLink: React.FC<InternalDashboardTileLinkProps> = ({
  title,
  href,
  disabled,
}: InternalDashboardTileLinkProps) => {
  const t = useT();
  const linkIconAltText = t('links.internal.iconAltText') as string;
  return (
    <Link href={href} passHref>
      <StyledDashboardTileLink title={linkIconAltText + ' ' + title} disabled={disabled}>
        <span>{title}</span>
        <ArrowRight aria-hidden />
      </StyledDashboardTileLink>
    </Link>
  );
};

interface DashboardTileLinkProps extends StandardLink {
  disabled?: boolean;
}

export const DashboardTileLink: React.FC<DashboardTileLinkProps> = (
  props: DashboardTileLinkProps
) => {
  const { type = StandardLinkType.internal } = props;
  const t = useT();

  switch (type) {
    case StandardLinkType.internal: {
      return <InternalDashboardTileLink {...props} />;
    }

    case StandardLinkType.external: {
      const { title, href } = props;;
      return (
        <StyledDashboardTileLink href={href} rel="noopener noreferrer" target="_blank">
          <span>{title}</span>
          <ArrowUpRight aria-label={t('links.external.iconAltText') as string}/>
        </StyledDashboardTileLink>
      );
    }

    default: {
      throw new Error(`DashboardTileLink type "${type}" is not valid`);
    }
  }
};

interface DashboardTileButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

export const DashboardTileButton: React.FC<DashboardTileButtonProps> = ({
  title,
  onClick,
  disabled,
}: DashboardTileButtonProps) => {
  return (
    <StyledDashboardTileLink as="button" onClick={onClick} disabled={disabled}>
      <span>{title}</span>
      <Plus />
    </StyledDashboardTileLink>
  );
};
