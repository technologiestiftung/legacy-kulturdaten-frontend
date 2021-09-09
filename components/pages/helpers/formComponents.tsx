import { css, SerializedStyles } from '@emotion/react';
import { insetBorder, mq } from '../../globals/Constants';
import { Breakpoint } from '../../../lib/WindowService';
import styled from '@emotion/styled';
import React, { PropsWithChildren } from 'react';

export const FormGrid = styled.div`
  display: grid;
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;
  padding: 1.5rem 0;
  grid-template-columns: repeat(4, 1fr);
`;

export enum FormItemWidth {
  quarter = 'quarter',
  half = 'half',
  full = 'full',
}

export const formItemWidthMap: { [key in FormItemWidth]: SerializedStyles } = {
  quarter: css`
    grid-column: span 2;

    ${mq(Breakpoint.mid)} {
      grid-column: span 1;
    }
  `,
  half: css`
    grid-column: span 4;

    ${mq(Breakpoint.mid)} {
      grid-column: span 2;
    }
  `,
  full: css`
    grid-column: span 4;
  `,
};

const StyledFormItem = styled.div<{
  width: FormItemWidth;
  alignSelf?: string;
  customCss?: SerializedStyles;
}>`
  ${({ width }) => formItemWidthMap[width]}
  align-self: ${({ alignSelf }) => alignSelf || 'stretch'};

  display: flex;
  flex-direction: row;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  align-items: flex-start;
  flex-wrap: wrap;

  ${({ customCss }) => customCss}
`;

const StyledFormItemChild = styled.div<{ flexGrow?: string }>`
  flex-grow: ${({ flexGrow }) => flexGrow || '1'};
`;

interface FormItemProps {
  width: FormItemWidth;
  alignSelf?: string;
  childrenFlexGrow?: string;
  css?: SerializedStyles;
}

export const FormItem: React.FC<PropsWithChildren<FormItemProps>> = ({
  children,
  width,
  alignSelf,
  childrenFlexGrow,
  css,
}: PropsWithChildren<FormItemProps>) => (
  <StyledFormItem width={width} alignSelf={alignSelf} customCss={css}>
    {React.Children.toArray(children).map((child, index) => (
      <StyledFormItemChild key={index} flexGrow={childrenFlexGrow}>
        {child}
      </StyledFormItemChild>
    ))}
  </StyledFormItem>
);

export const FormButtons = styled.div`
  padding: 0.75rem 0;
  box-shadow: ${insetBorder(false, false, true)};
  display: flex;
  justify-content: flex-start;

  & > :last-of-type {
    margin-left: 0.75rem;
  }
`;
