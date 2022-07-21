import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';
import { useT } from '../../lib/i18n';

export const EntryFormWrapper = styled.div<{
  fullWidth?: boolean;
  reducedVerticalPadding?: boolean;
}>`
  padding: ${({ reducedVerticalPadding }) => (reducedVerticalPadding ? '0.75rem' : '1.5rem')} 0;
  ${contentGrid(1)}
  row-gap: 1.5rem;

  ${mq(Breakpoint.mid)} {
    padding: ${({ reducedVerticalPadding }) => (reducedVerticalPadding ? '1.5rem' : '3rem')} 0;
    row-gap: 3rem;
    ${contentGrid(8)}
    justify-items: center;
  }

  ${({ fullWidth }) =>
    fullWidth
      ? ''
      : css`
          ${mq(Breakpoint.widish)} {
            padding: 3rem 0;
          }
        `}
`;

const RequiredInfoText = styled.p<{ wrapped?: boolean}>`
  grid-column: 1 / -1;
  ${({wrapped}) => 
    wrapped
      ? ''
      : css`
        padding-left: 1rem;
        
        ${mq(Breakpoint.mid)} {
          padding-left: 1.5rem;
        }
        
        ${mq(Breakpoint.widish)} {
          grid-column: 2 / -2;
          padding-left: 0;
        }
      `}
  
  width: 100%;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
`;

interface StyledRequiredInfoTextProps {
  wrapped?: boolean;
}

export const StyledRequiredInfoText: React.FC<StyledRequiredInfoTextProps> = ({wrapped}) => {
  const t = useT();
  return(
    <RequiredInfoText wrapped={wrapped}>{`${t('forms.requiredInfoText')}`}</RequiredInfoText>
  )
}

export const EntryFormContainer = styled.div<{ fullWidth?: boolean; noPadding?: boolean }>`
  width: 100%;
  max-width: var(--max-content-width);
  padding: 0 ${({ noPadding }) => (noPadding ? '0' : '0.75rem')};

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
    padding: 0 ${({ noPadding }) => (noPadding ? '0' : '1.5rem')};
  }

  ${({ fullWidth }) =>
    fullWidth
      ? ''
      : css`
          ${mq(Breakpoint.widish)} {
            grid-column: 2 / -2;
            padding: 0;
          }
        `}
`;

export const EntryFormContainerColumns = styled.div`
  display: grid;
  grid-template-columns: 100%;
  column-gap: 1.5rem;
  row-gap: 1.5rem;
  align-items: flex-start;
  justify-items: stretch;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 1fr;
    row-gap: 3rem;
  }
`;

interface StyledEntryFormContainerProps {
  children: React.ReactNode;
  noPadding?,
  fullWidth?
}

export const StyledEntryFormContainer: React.FC<StyledEntryFormContainerProps> = ({ children, noPadding, fullWidth }: StyledEntryFormContainerProps) => {
  return (
    <EntryFormContainer noPadding={noPadding} fullWidth={fullWidth}>
      <fieldset>
        {children}
      </fieldset>
    </EntryFormContainer>
  );
};