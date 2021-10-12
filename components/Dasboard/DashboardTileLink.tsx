import Link from 'next/link';
import styled from '@emotion/styled';
import { ArrowRight, ArrowUpRight } from 'react-feather';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';

const StyledDashboardTileLink = styled.a<{ active?: boolean }>`
  color: inherit;
  text-decoration: none;
  display: flex;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  column-gap: 0.75rem;
  border-top: 1px solid var(--grey-400);
  padding: 0.75rem 1.125rem;
  display: flex;
  justify-content: flex-end;
  transition: background var(--transition-duration-fast);

  &:hover {
    background: var(--grey-200);
  }

  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 1.5rem;
    font-size: var(--font-size-400);
    line-height: var(--line-height-400);
  }

  svg {
    display: inline-block;
    padding: 0;
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    color: inherit;
  }
`;

export enum DashboardTileLinkType {
  internal = 'internal',
  external = 'external',
}

interface InternalDashboardTileLinkProps {
  title: string;
  href: string;
  active?: boolean;
}

export interface DashboardTileLinkProps extends InternalDashboardTileLinkProps {
  type?: DashboardTileLinkType;
}

const InternalDashboardTileLink: React.FC<DashboardTileLinkProps> = ({
  title,
  href,
}: DashboardTileLinkProps) => {
  return (
    <Link href={href} passHref>
      <StyledDashboardTileLink title={title}>
        <span>{title}</span>
        <ArrowRight />
      </StyledDashboardTileLink>
    </Link>
  );
};

export const DashboardTileLink: React.FC<DashboardTileLinkProps> = (
  props: DashboardTileLinkProps
) => {
  const { type = DashboardTileLinkType.internal } = props;

  switch (type) {
    case DashboardTileLinkType.internal: {
      return <InternalDashboardTileLink {...props} />;
    }

    case DashboardTileLinkType.external: {
      const { title, href } = props;
      return (
        <StyledDashboardTileLink href={href} rel="noopener noreferrer" target="_blank">
          <span>{title}</span>
          <ArrowUpRight />
        </StyledDashboardTileLink>
      );
    }

    default: {
      throw new Error(`DashboardTileLink type "${type}" is not valid`);
    }
  }
};
