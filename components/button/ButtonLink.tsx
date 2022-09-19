import styled from '@emotion/styled';
import React, { RefObject } from 'react';
import { Button, ButtonProps } from '.';
import { focusStyles } from '../globals/Constants'

const StyledA = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  ${focusStyles}
`;

interface ButtonLinkProps extends ButtonProps {
  href?: string;
}

// eslint-disable-next-line react/display-name
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (props: ButtonLinkProps, ref: RefObject<HTMLAnchorElement>) => (
    <StyledA ref={ref} href={props?.href}>
      <Button {...props} />
    </StyledA>
  )
);
