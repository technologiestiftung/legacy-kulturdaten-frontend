import styled from '@emotion/styled';
import Link from 'next/link';

import { StandardLinkType } from '../../lib/generalTypes';

const StyledStandardLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

interface StandardLinkInternalProps {
  href: string;
  children: React.ReactNode;
}

const InternalStandardLink: React.FC<StandardLinkInternalProps> = ({
  children,
  href,
}: StandardLinkInternalProps) => {
  return (
    <Link href={href} passHref>
      <StyledStandardLink>{children}</StyledStandardLink>
    </Link>
  );
};

interface StandardLinkProps {
  type: StandardLinkType;
  href: string;
  children: React.ReactNode;
}

export const StandardLink: React.FC<StandardLinkProps> = (props: StandardLinkProps) => {
  const { type = StandardLinkType.internal } = props;

  switch (type) {
    case StandardLinkType.internal: {
      return <InternalStandardLink {...props} />;
    }

    case StandardLinkType.external: {
      const { href } = props;
      return (
        <StyledStandardLink href={href} rel="noopener noreferrer" target="_blank">
          {props.children}
        </StyledStandardLink>
      );
    }

    default: {
      throw new Error(`StandardLink type "${type}" is not valid`);
    }
  }
};
