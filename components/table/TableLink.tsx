import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { insetBorder } from '../globals/Constants';

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

  box-shadow: ${insetBorder(false, false, true, false)};

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
    background: var(--grey-350);
  }

  ${({ isActive }) =>
    isActive
      ? css`
          background: var(--black);
          color: var(--white);

          &:hover {
            background: var(--black);
            color: var(--white);
          }

          ${StyledTableLinkText} {
            text-decoration: underline;
          }
        `
      : ''}
`;

interface TableLinkProps {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const TableLink: React.FC<TableLinkProps> = ({
  children,
  href,
  isActive,
  onClick,
}: TableLinkProps) => {
  return (
    <Link href={href} passHref>
      <StyledTableLink isActive={isActive} onClick={onClick}>
        <div>{children}</div>
      </StyledTableLink>
    </Link>
  );
};
