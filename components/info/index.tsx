import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Info as InfoIcon } from 'react-feather';
import { insetBorderColored } from '../globals/Constants';

export enum InfoColor {
  yellow = 'yellow',
  grey = 'grey',
  white = 'white',
  green = 'green',
}

const infoColorMap: {
  [key in InfoColor]: {
    background: string;
    color: string;
    borderColor: string;
  };
} = {
  yellow: {
    background: 'var(--mustard)',
    color: 'var(--black)',
    borderColor: 'var(--black-o25)',
  },
  green: {
    background: 'var(--green-light)',
    color: 'var(--black)',
    borderColor: 'var(--black-o25)',
  },
  grey: {
    background: 'var(--grey-200)',
    color: 'var(--black)',
    borderColor: 'var(--black-o25)',
  },
  white: {
    background: 'var(--white)',
    color: 'var(--black)',
    borderColor: 'transparent',
  },
};

const StyledInfo = styled.div<{ color: InfoColor }>`
  border-radius: 0.375rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.75rem;
  display: flex;
  a {
    color: inherit;
  }

  ${({ color }) => css`
    box-shadow: ${insetBorderColored(infoColorMap[color].borderColor, true)};
    background: ${infoColorMap[color].background};
    color: ${infoColorMap[color].color};
  `}
`;

const StyledInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
`;

const StyledInfoIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  margin-right: 0.75rem;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const StyledInfoText = styled.p<{ noMaxWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  ${({ noMaxWidth }) => (noMaxWidth ? '' : 'max-width: 64ch;')}
`;

export const InfoUl = styled.ul`
  list-style: disc;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding-left: 0.875rem;
`;

export const InfoLi = styled.li``;

export const InfoP = styled.p``;

export interface InfoProps {
  children: React.ReactNode;
  color?: InfoColor;
  title?: string;
  noMaxWidth?: boolean;
}

export const Info: React.FC<InfoProps> = ({
  children,
  color = InfoColor.yellow,
  title,
  noMaxWidth,
}: InfoProps) => (
  <StyledInfo color={color}>
    <StyledInfoIcon>
      <InfoIcon />
    </StyledInfoIcon>
    <StyledInfoContent>
      {title && <StyledInfoText noMaxWidth={noMaxWidth}>{title}</StyledInfoText>}
      <StyledInfoText noMaxWidth={noMaxWidth}>{children}</StyledInfoText>
    </StyledInfoContent>
  </StyledInfo>
);
