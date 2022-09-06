import styled from '@emotion/styled';

export const StyledError = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  color: var(--error);
  padding-top: 0.75rem;
  flex-basis: 0;
`;

export const StyledFormListError = styled(StyledError)`
  padding-bottom: 0.75rem;
  padding-left: 0.75rem;
`;
