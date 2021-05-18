import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { Breakpoint } from '../../lib/WindowService';
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

interface TableLinkProps {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
}

export const TableLink: React.FC<TableLinkProps> = ({
  children,
  href,
  isActive,
}: TableLinkProps) => (
  <Link href={href} passHref>
    <StyledTableLink isActive={isActive}>
      {isActive ? <ArrowRightSvg /> : ''}
      <div>{children}</div>
    </StyledTableLink>
  </Link>
);
