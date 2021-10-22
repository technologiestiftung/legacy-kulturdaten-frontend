import styled from '@emotion/styled';
import Link from 'next/link';
import { StandardLink, StandardLinkInternal, StandardLinkType } from '../../lib/generalTypes';

export const StyledAnchor = styled.a`
  display: inline-block;
  color: inherit;
`;

const InternalAnchor: React.FC<StandardLinkInternal> = ({ title, href }: StandardLinkInternal) => {
  return (
    <Link href={href} passHref>
      <StyledAnchor>
        <span>{title}</span>
      </StyledAnchor>
    </Link>
  );
};

export const Anchor: React.FC<StandardLink> = (props: StandardLink) => {
  if (props?.type === StandardLinkType.internal) {
    return <InternalAnchor {...props} />;
  } else {
    return (
      <StyledAnchor href={props.href} rel="noopener noreferrer" target="_blank">
        {props.title}
      </StyledAnchor>
    );
  }
};
