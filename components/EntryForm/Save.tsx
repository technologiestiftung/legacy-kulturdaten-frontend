import styled from '@emotion/styled';

const StyledSave = styled.div`
  min-height: 10rem;
  width: 15rem;
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 1.5rem;
  border-radius: 1.125rem;
  margin: 0;
  background: var(--white);
  /* background: red; */
  box-shadow: 0.125rem 0.125rem 2rem -0.25rem var(--black-o25);
  display: block;
  z-index: 2;

  div {
    word-break: break-all;
  }
`;

interface SaveProps {
  children: React.ReactNode;
}

export const Save: React.FC<SaveProps> = ({ children }: SaveProps) => {
  return <StyledSave>{children}</StyledSave>;
};
