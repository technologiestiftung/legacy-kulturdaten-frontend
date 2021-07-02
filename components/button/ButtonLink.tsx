import React, { Ref } from 'react';
import { Button, ButtonProps } from '.';

interface ButtonLinkProps extends ButtonProps {
  href?: string;
}

// eslint-disable-next-line react/display-name
export const ButtonLink: React.FC<ButtonLinkProps> = React.forwardRef(
  (props: ButtonLinkProps, ref: Ref<HTMLAnchorElement>) => (
    <a ref={ref} href={props?.href}>
      <Button {...props} />
    </a>
  )
);
