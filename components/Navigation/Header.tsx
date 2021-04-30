import styled from '@emotion/styled';
import { Breakpoint, useBreakpoint, useBreakpointOrWider } from '../../lib/WindowService';

const HeaderContainer = styled.header`
  width: 100%;
  background: var(--grey-200);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid var(--grey-400);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const HeaderLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

const Hamburger = styled.button``;

interface HeaderProps {
  title: string;
  Link: React.FC<{ content: React.ReactElement }>;
}

export const Header: React.FC<HeaderProps> = ({ title, Link }: HeaderProps) => {
  const breakpoint = useBreakpoint();
  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);

  return (
    <>
      <HeaderContainer>
        {!isWideOrWider ? <Hamburger>=</Hamburger> : ''}

        <Link content={<HeaderLink>{title}</HeaderLink>} />
      </HeaderContainer>
      <div>
        <div>Current breakpoint: {breakpoint}</div>
        <div>Mid or wider: {isWideOrWider.toString()}</div>
      </div>
    </>
  );
};
