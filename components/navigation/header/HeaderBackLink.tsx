import Link from 'next/link';
import styled from '@emotion/styled';

import { ChevronLeft } from 'react-feather';

const StyledA = styled.a`
  text-decoration: none;
  margin: 0.375rem 0 0.375rem 0.375rem;
  padding: 0.375rem 0.375rem 0.375rem 0;
  display: flex;
  align-items: center;
  color: inherit;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  border-radius: 0.75rem;
  background: transparent;

  &:hover {
    background: var(--grey-400);
  }

  span {
    font-size: var(--font-size-300);
    line-height: calc(var(--line-height-300) - 1px);
    border-bottom: 1px solid currentColor;
  }

  svg {
    display: inline-block;
    margin: 0 0.375rem 0 0;
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export interface HeaderBackLinkProps {
  title: string;
  href: string;
}

export const HeaderBackLink: React.FC<HeaderBackLinkProps> = ({
  title,
  href,
}: HeaderBackLinkProps) => {
  return (
    <Link href={href} passHref>
      <StyledA title={title}>
        <ChevronLeft />
        <span>{title}</span>
      </StyledA>
    </Link>
  );
};
