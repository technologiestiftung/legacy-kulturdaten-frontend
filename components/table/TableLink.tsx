import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useContext } from 'react';
import { TableContext } from '.';
import { PublishedStatus } from '../../lib/api/types/general';
import { useT } from '../../lib/i18n';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { ArrowRightSvg } from '../assets/ArrowRightSvg';
import { insetBorder, mq } from '../globals/Constants';

export const StyledTableLinkText = styled.div<{ isActive?: boolean }>`
  ${({ isActive }) =>
    isActive
      ? css`
          text-decoration: underline;
        `
      : ''}
`;

const StyledTableLink = styled.a<{ isActive?: boolean }>`
  background: inherit;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: inherit;
  text-decoration: none;
  width: 100%;

  box-shadow: ${insetBorder(false, true, true, true)};

  ${mq(Breakpoint.wide)} {
    box-shadow: ${insetBorder(false, true, true)};
  }

  > div {
    width: 100%;
  }

  svg {
    display: block;
    margin: 0;
    padding: 0 0 0 0.75rem;
    flex-shrink: 0;
  }

  &:hover {
    background: var(--white);

    ${StyledTableLinkText} {
      text-decoration: underline;
    }
  }

  ${({ isActive }) =>
    isActive
      ? css`
          background: var(--white);
        `
      : ''}
`;

const StyledTableLinkWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: auto;
  pointer-events: none;
  display: flex;
  justify-content: flex-end;
`;

const StyledTableLinkStatus = styled.div`
  font-size: var(--font-size-100);
  line-height: var(--line-height-100);
  font-weight: 700;
  padding: 0.0625rem 0.1875rem;
  background: var(--mustard);
  margin-right: 1px;
  border-radius: 0 0 0 0.1875rem;
`;

interface TableLinkProps {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
  status?: PublishedStatus;
}

export const TableLink: React.FC<TableLinkProps> = ({
  children,
  href,
  isActive,
  status,
}: TableLinkProps) => {
  const t = useT();

  const isDefaultBreakpoint = !useBreakpointOrWider(Breakpoint.mid);

  const { narrow: isNarrowTable } = useContext(TableContext);

  return (
    <Link href={href} passHref>
      <StyledTableLink isActive={isActive}>
        {isActive ? <ArrowRightSvg /> : ''}
        <div>{children}</div>
        {(isDefaultBreakpoint || isNarrowTable) && status === PublishedStatus.draft && (
          <StyledTableLinkWrapper>
            <StyledTableLinkStatus>{t('statusBar.draft')}</StyledTableLinkStatus>
          </StyledTableLinkWrapper>
        )}
      </StyledTableLink>
    </Link>
  );
};
