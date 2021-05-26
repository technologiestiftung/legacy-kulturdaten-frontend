import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonVariant } from '../button';
import { useCollapsable } from '../collapsable';
import { contentGrid, insetBorder, mq } from '../globals/Constants';

const StyledAccordion = styled.div`
  display: flex;
  flex-direction: column;

  border-bottom: 1px solid var(--grey-400);
`;

const StyledAccordionItem = styled.div`
  width: 100%;
`;

const accordionContentGrid = css`
  ${contentGrid(4)}

  ${mq(Breakpoint.mid)} {
    ${contentGrid(9)}
  }

  ${mq(Breakpoint.wide)} {
    ${contentGrid(8)}
  }
`;

const StyledAccordionItemHead = styled.div`
  ${accordionContentGrid} /* border-top: 2px solid var(--black); */
  box-shadow: ${insetBorder(true, false, false)};
`;

const StyledAccordionItemHeadContainer = styled.div`
  grid-column: 1 / -1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
  padding: 0.75rem 0.75rem;
  box-shadow: ${insetBorder(false, true)};

  ${mq(Breakpoint.mid)} {
    box-shadow: ${insetBorder(false, true, false, false)};
  }

  ${mq(Breakpoint.ultra)} {
    box-shadow: ${insetBorder(false, true)};
    grid-column: 2 / -2;
  }
`;

const StyledAccordionItemTitle = styled.div`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  padding: 0.4375rem 0.75rem 0.4375rem 0;
`;
const StyledAccordionItemButton = styled.div``;
const StyledAccordionItemContent = styled.div`
  ${accordionContentGrid}
  box-shadow: ${insetBorder(true, false, false)};
`;
const StyledAccordionItemContentContainer = styled.div`
  grid-column: 1 / -1;
  box-shadow: ${insetBorder(false, true)};

  ${mq(Breakpoint.mid)} {
    box-shadow: ${insetBorder(false, true, false, false)};
  }

  ${mq(Breakpoint.ultra)} {
    box-shadow: ${insetBorder(false, true)};
    grid-column: 2 / -2;
  }
`;

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  initiallyCollapsed?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  initiallyCollapsed,
}: AccordionItemProps) => {
  const { renderedCollapsable, isCollapsed, setIsCollapsed } = useCollapsable(
    content,
    initiallyCollapsed
  );
  const t = useT();

  const buttonLabel = isCollapsed ? t('accordion.open') : t('accordion.close');
  const buttonIcon = isCollapsed ? 'ChevronDown' : 'ChevronUp';

  return (
    <StyledAccordionItem>
      <StyledAccordionItemHead>
        <StyledAccordionItemHeadContainer>
          <StyledAccordionItemTitle>{title}</StyledAccordionItemTitle>
          <StyledAccordionItemButton>
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={buttonIcon}
              variant={ButtonVariant.minimal}
            >
              {buttonLabel}
            </Button>
          </StyledAccordionItemButton>
        </StyledAccordionItemHeadContainer>
      </StyledAccordionItemHead>
      <StyledAccordionItemContent>
        <StyledAccordionItemContentContainer>
          {renderedCollapsable}
        </StyledAccordionItemContentContainer>
      </StyledAccordionItemContent>
    </StyledAccordionItem>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
  initiallyCollapsed?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  initiallyCollapsed = true,
}: AccordionProps) => (
  <StyledAccordion>
    {items.map((item, index) => (
      <AccordionItem {...item} key={index} initiallyCollapsed={initiallyCollapsed} />
    ))}
  </StyledAccordion>
);
