import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, insetBorder, mq } from '../globals/Constants';
import { TabsProps } from '../navigation/tabs';

const StyledEntryHeader = styled.div`
  background: var(--white);
  box-shadow: ${insetBorder(false, false, true)};
  grid-row-gap: 1.5rem;
  position: relative;
  z-index: 20;

  ${contentGrid(1)}

  ${mq(Breakpoint.mid)} {
    grid-row-gap: 2.25rem;

    ${contentGrid(8)}
  }

  ${mq(Breakpoint.widish)} {
    padding: 0;
    justify-items: center;
  }
`;

const StyledEntryHeaderHead = styled.div<{ minimalVariant?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2.25rem;
  margin-bottom: ${({ minimalVariant }) => (minimalVariant ? '2.25rem' : '0')};
  padding: 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    align-items: flex-start;
    margin-top: 3rem;
    margin-bottom: ${({ minimalVariant }) => (minimalVariant ? '3rem' : '0.75rem')};
    padding: 0 1.5rem;
    flex-direction: row;
    justify-content: space-between;
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    margin-top: 4.5rem;
    margin-bottom: ${({ minimalVariant }) => (minimalVariant ? '4.5rem' : '2.25rem')};
    padding: 0;
    grid-column: 2 / -2;
    max-width: var(--max-content-width);
  }
`;

const StyledEntryHeaderMenu = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: flex-start;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  padding-top: 2.25rem;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  position: relative;
  z-index: 10;

  ${mq(Breakpoint.mid)} {
    align-items: flex-start;
    display: flex;
    padding-top: 0;
    justify-content: flex-start;
  }

  ${mq(Breakpoint.wide)} {
    flex-wrap: nowrap;
  }
`;

const StyledEntryHeaderTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding-right: 0.75rem;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.widish)} {
    padding-right: 1.5rem;
    grid-column: 2 / -2;
    max-width: var(--max-content-width);
  }
`;

const StyledEntryHeaderTitle = styled.h1<{ skeleton: boolean }>`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;

  ${mq(Breakpoint.mid)} {
    font-size: var(--font-size-600);
    line-height: var(--line-height-600);
  }

  ${({ skeleton }) =>
    skeleton
      ? css`
          &:after {
            content: '';
            display: block;
            position: relative;
            height: var(--line-height-700);
            width: 20rem;
            background: var(--grey-350);

            ${mq(Breakpoint.mid)} {
              height: var(--line-height-600);
            }
          }
        `
      : ''}
`;

const StyledEntryHeaderSubTitle = styled.h2`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 400;
`;

const StyledEntryHeaderTabsSlot = styled.div`
  width: 100%;

  ${mq(Breakpoint.mid)} {
    grid-column: 1 / -1;
  }

  ${contentGrid(8)}

  justify-items: center;
`;

const tabsSlotWideLayout = css`
  grid-column: 2 / -2;
  padding: 0;
`;

const StyledEntryHeaderTabsSlotContainer = styled.div<{ wideLayout?: boolean }>`
  min-width: 0;
  grid-column: 1 / -1;
  padding: 0;
  width: 100%;
  max-width: var(--max-content-width);

  ${mq(Breakpoint.widish)} {
    grid-column: 1 / -1;
    padding: 0 1.5rem;
  }

  ${({ wideLayout }) =>
    wideLayout
      ? css`
          ${mq(Breakpoint.widish)} {
            ${tabsSlotWideLayout}
          }
        `
      : css`
          @media screen and (min-width: calc(78.125rem + var(--organizer-band-width))) {
            ${tabsSlotWideLayout}
          }
        `}

  ${mq(Breakpoint.ultra)} {
    ${tabsSlotWideLayout}
  }
`;

interface EntryHeaderProps {
  title: string;
  subTitle?: string;
  backButton?: React.ReactElement;
  menu?: React.ReactElement;
  tabs?: React.ReactElement<TabsProps>;
  wideLayout?: boolean;
  minimalVariant?: boolean;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({
  title,
  subTitle,
  menu,
  tabs,
  wideLayout,
  minimalVariant,
}: EntryHeaderProps) => (
  <StyledEntryHeader>
    <StyledEntryHeaderHead minimalVariant={minimalVariant}>
      <StyledEntryHeaderTitleWrapper>
        <StyledEntryHeaderTitle skeleton={typeof title === 'undefined' || title.length === 0}>
          {title}
        </StyledEntryHeaderTitle>
        {subTitle && (
          <StyledEntryHeaderSubTitle>
            <span>{subTitle}</span>
          </StyledEntryHeaderSubTitle>
        )}
      </StyledEntryHeaderTitleWrapper>
      {menu && <StyledEntryHeaderMenu>{menu}</StyledEntryHeaderMenu>}
    </StyledEntryHeaderHead>
    {!minimalVariant && tabs && (
      <StyledEntryHeaderTabsSlot>
        <StyledEntryHeaderTabsSlotContainer wideLayout={wideLayout}>
          {tabs}
        </StyledEntryHeaderTabsSlotContainer>
      </StyledEntryHeaderTabsSlot>
    )}
  </StyledEntryHeader>
);
