import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { PublishedStatus } from '../../lib/api/types/general';
import { DateFormat, useDate } from '../../lib/date';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import { StatusFlag } from '../Status/StatusFlag';

const StyledEntryCardLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

const StyledEntryCard = styled.div<{ menuExpanded: boolean; active: boolean }>`
  border: 1px solid rgba(0, 0, 0, 0.25);
  background: var(--white);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: box-shadow var(--transition-duration-fast);

  &:hover {
    box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
    border-color: rgba(0, 0, 0, 0.5);
  }

  ${({ active }) =>
    active
      ? css`
          box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.5);
          border-color: rgba(0, 0, 0, 1);

          &:hover {
            box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.5);
            border-color: rgba(0, 0, 0, 1);
          }
        `
      : ''}
`;

const StyledEntryCardTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledEntryCardTopLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
`;

const StyledEntryCardTitle = styled.div<{ menuExpanded: boolean; active: boolean }>`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: var(--font-weight-bold);
  padding: 0.75rem;
  word-wrap: break-word;

  ${mq(Breakpoint.widish)} {
    ${({ menuExpanded }) =>
      menuExpanded
        ? css`
            padding: 1.5rem 1.5rem 0.75rem;
            font-size: var(--font-size-600);
            line-height: var(--line-height-600);
          `
        : ''}
  }

  ${({ active }) =>
    active
      ? css`
          text-decoration: underline;
        `
      : ''}
`;

const StyledEntryCardMeta = styled.div<{ menuExpanded: boolean }>`
  padding: 0 0.75rem;

  ${mq(Breakpoint.widish)} {
    ${({ menuExpanded }) =>
      menuExpanded
        ? css`
            padding: 0 1.5rem;
          `
        : ''}
  }
`;
const StyledEntryCardImage = styled.div<{ menuExpanded: boolean }>`
  width: 25%;
  max-width: 6rem;
  height: 6rem;
  flex-grow: 0;
  flex-shrink: 0;

  ${mq(Breakpoint.widish)} {
    ${({ menuExpanded }) =>
      menuExpanded
        ? css`
            max-width: 9.75rem;
            height: 9.75rem;
          `
        : ''}
  }
`;

const StyledEntryCardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const StyledEntryCardStatus = styled.div<{ status: PublishedStatus; menuExpanded: boolean }>`
  padding: 0.75rem;

  ${mq(Breakpoint.widish)} {
    ${({ menuExpanded }) =>
      menuExpanded
        ? css`
            padding: 1.5rem;
          `
        : ''}
  }
`;

const StyledEntryCardDates = styled.div<{ menuExpanded: boolean }>`
  font-size: var(--font-size-200);
  line-height: 1.125rem;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;

  ${mq(Breakpoint.widish)} {
    ${({ menuExpanded }) =>
      menuExpanded
        ? css`
            font-size: var(--font-size-300);
            line-height: var(--line-height-300);
            padding: 1.5rem;
            flex-direction: row;

            div:first-of-type {
              &::after {
                content: '|';
                padding: 0 0.375rem;
                color: var(--grey-400);
              }
            }
          `
        : ''}
  }
`;

const StyledEntryCardDate = styled.div`
  text-transform: capitalize;
`;

export const EntryCardGrid = styled.div<{ expanded: boolean }>`
  display: grid;
  grid-template-columns: auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.75rem;
  padding: 1.5rem 0.75rem 2.25rem;

  ${mq(Breakpoint.wide)} {
    padding: 2.25rem 1.5rem 2.25rem;
    grid-row-gap: 1.5rem;
  }

  ${({ expanded }) =>
    expanded
      ? css`
          grid-template-columns: 1fr 1fr;

          ${mq(Breakpoint.widish)} {
            grid-column-gap: 1.5rem;
            grid-row-gap: 1.5rem;
          }

          ${mq(Breakpoint.ultra)} {
            grid-template-columns: 1fr 1fr 1fr;
          }
        `
      : ''}
`;

interface EntryCardProps {
  title: string;
  status: PublishedStatus;
  createdDate: Date;
  updatedDate: Date;
  menuExpanded: boolean;
  href: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
  meta?: React.ReactElement;
  image?: string;
  active?: boolean;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  title,
  status,
  createdDate,
  updatedDate,
  meta,
  menuExpanded,
  href,
  active,
  onClick,
}: EntryCardProps) => {
  const date = useDate();
  const t = useT();

  return (
    <Link href={href} passHref>
      <StyledEntryCardLink onClick={onClick}>
        <StyledEntryCard menuExpanded={menuExpanded} active={active}>
          <StyledEntryCardTop>
            <StyledEntryCardTopLeft>
              <StyledEntryCardTitle menuExpanded={menuExpanded} active={active}>
                {title}
              </StyledEntryCardTitle>
              <StyledEntryCardMeta menuExpanded={menuExpanded}>{meta}</StyledEntryCardMeta>
            </StyledEntryCardTopLeft>
            <StyledEntryCardImage menuExpanded={menuExpanded}></StyledEntryCardImage>
          </StyledEntryCardTop>
          <StyledEntryCardBottom>
            <StyledEntryCardDates menuExpanded={menuExpanded}>
              <StyledEntryCardDate>
                {t('general.updated')}: {updatedDate ? date(updatedDate, DateFormat.date) : ''}
              </StyledEntryCardDate>
              <StyledEntryCardDate>
                {t('general.created')}: {createdDate ? date(createdDate, DateFormat.date) : ''}
              </StyledEntryCardDate>
            </StyledEntryCardDates>
            <StyledEntryCardStatus status={status} menuExpanded={menuExpanded}>
              <StatusFlag status={status} />
            </StyledEntryCardStatus>
          </StyledEntryCardBottom>
        </StyledEntryCard>
      </StyledEntryCardLink>
    </Link>
  );
};

const StyledEntryCardTypesSubjects = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

const StyledEntryCardTypesSubjectsTypes = styled.span<{ hasSubjects: boolean }>`
  ${({ hasSubjects }) =>
    hasSubjects
      ? css`
          &::after {
            content: ' | ';
            color: var(--grey-400);
          }
        `
      : ''}
`;
const StyledEntryCardTypesSubjectsSubjects = styled.span``;

interface EntryCardTypesSubjectsProps {
  types?: string[];
  subjects?: string[];
}

export const EntryCardTypesSubjects: React.FC<EntryCardTypesSubjectsProps> = ({
  types,
  subjects,
}: EntryCardTypesSubjectsProps) => (
  <StyledEntryCardTypesSubjects>
    {types && (
      <StyledEntryCardTypesSubjectsTypes
        hasSubjects={Array.isArray(subjects) && subjects.length > 0}
      >
        {types.join(', ')}
      </StyledEntryCardTypesSubjectsTypes>
    )}
    {subjects && (
      <StyledEntryCardTypesSubjectsSubjects>
        {subjects.join(', ')}
      </StyledEntryCardTypesSubjectsSubjects>
    )}
  </StyledEntryCardTypesSubjects>
);
