import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const StyledError = styled.div<{inFormList?: boolean}>`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  color: var(--error);
  padding-top: 0.75rem;
  flex-basis: 0;

  ${({ inFormList }) => inFormList 
  ? css`
    padding-bottom: 0.75rem;
    padding-left: 0.75rem;
  `
  : css``
}
`;
