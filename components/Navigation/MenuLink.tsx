import Link from 'next/link';
import styled from '@emotion/styled';

import { ArrowRightSvg } from './ArrowRightSvg';

const StyledA = styled.a<{ active?: boolean }>`
  color: inherit;
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    display: inline-block;
    margin: 0 0.375rem 0 0;
    padding: 0;
  }
`;

export interface MenuLinkProps {
  title: string;
  href: string;
  active?: boolean;
}

export const MenuLink: React.FC<MenuLinkProps> = ({ title, href, active }: MenuLinkProps) => {
  return (
    <Link href={href} passHref>
      <StyledA title={title} active={active}>
        {active ? <ArrowRightSvg /> : ''}
        {title}
      </StyledA>
    </Link>
  );
};
