import styled from '@emotion/styled';
import React, { Ref } from 'react';
import { Button, ButtonProps } from '.';

const StyledA = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
`;

interface ButtonLinkProps extends ButtonProps {
  href?: string;
}

// eslint-disable-next-line react/display-name
export const ButtonLink: React.FC<ButtonLinkProps> = React.forwardRef(
  (props: ButtonLinkProps, ref: Ref<HTMLAnchorElement>) => (
    <StyledA ref={ref} href={props?.href}>
      <Button {...props} />
    </StyledA>
  )
);
