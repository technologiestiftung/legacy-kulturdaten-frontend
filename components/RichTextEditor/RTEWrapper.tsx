import React, { RefObject } from 'react';

interface RTEWrapperProps {
  href?: string;
  children,
  tabIndex,
  role
}

// eslint-disable-next-line react/display-name
export const RTEWrapper = React.forwardRef<HTMLDivElement, RTEWrapperProps>((props: RTEWrapperProps, forwardedRef: RefObject<HTMLDivElement>) => (
  <div {...props} ref={forwardedRef}>
    {props.children}
  </div>
));