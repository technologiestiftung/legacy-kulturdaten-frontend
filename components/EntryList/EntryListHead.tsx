import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Maximize2, Minimize2 } from 'react-feather';
import { useT } from '../../lib/i18n';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { mq,focusBlackStyles } from '../globals/Constants';

const StyledEntryListHead = styled.div`
  position: relative;
  z-index: 1;
  background: var(--white);
`;

const StyledEntryListHeadTop = styled.div``;

const StyledEntryListHeadTitleRow = styled.div`
  font-size: var(--font-size-600);
  line-height: var(--line-height-600);
  font-weight: 600;
  padding: 1.5rem 0 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${mq(Breakpoint.wide)} {
    padding: 1.875rem 0 0.75rem;
  }
`;

const StyledEntryListHeadTitleRowRight = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledEntryListHeadMenu = styled.div`
  padding: 0 0.75rem;
`;

const StyledEntryListHeadTitle = styled.div<{ noPadding?: boolean }>`
  margin: 0 0.75rem;

  ${({ noPadding }) => css`
    margin: ${noPadding ? '0' : '0 0.75rem'};

    ${mq(Breakpoint.wide)} {
    margin: ${noPadding ? '0' : '0 1.5rem'};
  `}
`;

const StyledEntryListHeadActions = styled.div``;
const StyledEntryListHeadAction = styled.div``;

const StyledEntryListHeadActionButton = styled.div<{ expanded: boolean }>`
  ${({ expanded }) =>
    expanded
      ? css`
          margin-right: 1.5rem;
        `
      : css`
          padding: 0.75rem 0.75rem 1.875rem;
          display: flex;
          flex-direction: column;

          ${mq(Breakpoint.wide)} {
            padding: 1.125rem 1.5rem 2.25rem;
          }
        `}
`;

const StyledExpandableButton = styled.button`
  appearance: none;
  border: none;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--black);
  align-self: stretch;
  cursor: pointer;
  color: var(--white);
  padding: 0.75rem;
  border-radius: 0.75rem 0 0 0.75rem;

  ${focusBlackStyles}

  &:hover {
    background: var(--grey-600);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

interface EntryListHeadProps {
  title: string;
  expanded: boolean;
  setExpanded?: (expanded: boolean) => void;
  expandable?: boolean;
  actionButton?: React.ReactNode;
  actions?: React.ReactElement[];
  noPadding?: boolean;
  menu?: React.ReactElement;
}

export const EntryListHead: React.FC<EntryListHeadProps> = ({
  title,
  actionButton,
  actions,
  expanded,
  setExpanded,
  expandable,
  noPadding,
  menu,
}: EntryListHeadProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const t = useT();

  return (
    <StyledEntryListHead>
      <StyledEntryListHeadTop>
        <StyledEntryListHeadTitleRow>
          <StyledEntryListHeadTitle noPadding={noPadding} role="heading" aria-label={title}>
            <span>{title}</span>
          </StyledEntryListHeadTitle>
          <StyledEntryListHeadTitleRowRight>
            {menu && <StyledEntryListHeadMenu>{menu}</StyledEntryListHeadMenu>}
            {expanded && actionButton && (
              <StyledEntryListHeadActionButton expanded={expanded}>
                {actionButton}
              </StyledEntryListHeadActionButton>
            )}
            {isMidOrWider && expandable && (
              <div>
                <StyledExpandableButton
                  onClick={() => (setExpanded ? setExpanded(!expanded) : undefined)}
                  aria-label={
                    expanded
                      ? (t('general.minimizeList') as string)
                      : (t('general.expandList') as string)
                  }
                >
                  {expanded ? <Minimize2 /> : <Maximize2 />}
                </StyledExpandableButton>
              </div>
            )}
          </StyledEntryListHeadTitleRowRight>
        </StyledEntryListHeadTitleRow>
        {expanded && actions && (
          <StyledEntryListHeadActions>
            {actions.map((action, index) => (
              <StyledEntryListHeadAction key={index}>{action}</StyledEntryListHeadAction>
            ))}
          </StyledEntryListHeadActions>
        )}
      </StyledEntryListHeadTop>
      {!expanded && actionButton && (
        <StyledEntryListHeadActionButton expanded={expanded}>
          {actionButton}
        </StyledEntryListHeadActionButton>
      )}
    </StyledEntryListHead>
  );
};
