import styled from '@emotion/styled';
import { useCallback } from 'react';

const CodeFormatter = styled.div``;

interface FormatterProps {
  children: React.ReactNode;
}

export const Formatter: React.FC<FormatterProps> = ({ children }: FormatterProps) => {
  const prettify = useCallback(() => console.log(children), []);

  return <CodeFormatter>{children}</CodeFormatter>;
};
