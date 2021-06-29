import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { formatJSON } from '../../lib/format';

const CodeFormatter = styled.div`
  padding: 0.75rem;
  max-height: 50vh;
  overflow-y: scroll;
  background-color: var(--grey-200);
  pre {
    font-size: var(--font-size-100);
    span {
      white-space: normal;
      &.code--key {
        color: var(--red);
      }
      &.code--string {
        color: var(--green-light);
      }
      &.code--number {
        color: var(--blue);
      }
      &.code--boolean {
        color: var(--green-kelly);
      }
      &.code--null {
        color: var(--grey-400);
      }
      &.code--symbol {
        color: var(--black);
      }
    }
  }
`;

interface FormatterProps {
  content: unknown;
}

export const Formatter: React.FC<FormatterProps> = ({ content }: FormatterProps) => {
  const [formatted, setFormatted] = useState<string>('');
  useEffect(() => {
    if (typeof content === 'object' && content !== null) {
      setFormatted(formatJSON(content));
    }
  }, [content]);

  return (
    <CodeFormatter>
      <pre dangerouslySetInnerHTML={{ __html: formatted }}></pre>
    </CodeFormatter>
  );
};
