import styled from '@emotion/styled';

export const StyledAnchor = styled.a`
  display: inline-block;
  color: inherit;
`;

interface AnchorProps {
  children: React.ReactNode;
  htmlHref?: string;
}

export const Anchor: React.FC<AnchorProps> = ({ children, htmlHref }: AnchorProps) => (
  <StyledAnchor href={htmlHref}>{children}</StyledAnchor>
);
