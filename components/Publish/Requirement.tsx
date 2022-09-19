import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Check } from 'react-feather';
import Link from 'next/link';
import React from 'react';

const StyledRequirement = styled.span<{ fulfilled: boolean; hasLink?: boolean }>`
  background: ${({ fulfilled }) => (fulfilled ? 'var(--white-green-o50)' : 'var(--white-red)')};
  color: ${({ fulfilled }) => (fulfilled ? 'var(--black-o70)' : 'var(--black)')};
  border-radius: 0.1875rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  display: flex;
  justify-content: flex-start;
  column-gap: 0.1875rem;
  padding: 0.1875rem 0.5625rem 0.1875rem 0.1875rem;

  ${({ hasLink }) =>
    hasLink &&
    css`
      box-shadow: none;
      transform: translateZ(0);
      transform-origin: 50% 50%;
      transition: color var(--transition-duration-fast), background var(--transition-duration-fast),
        box-shadow var(--transition-duration-fast), transform var(--transition-duration-fast);

      &:hover {
        background: var(--white);
        box-shadow: 0 0 1.5rem -0.5rem rgba(0, 0, 0, 0.25);
        transform: perspective(40px) translateZ(1px);
        color: var(--black);
      }

      &:active {
        background: var(--white);
        box-shadow: 0 0 0.75rem -0.5rem rgba(0, 0, 0, 0.25);
        transform: translateZ(0);
      }
    `}
`;

const StyledRequirementText = styled.span`
  flex-grow: 1;
`;

export const StyledRequirementMark = styled.span<{ fulfilled: boolean }>`
  flex-shrink: 0;
  flex-grow: 0;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    padding: 0.1875rem;
    width: 1.125rem;
    height: 1.125rem;
  }

  ${({ fulfilled }) =>
    !fulfilled
      ? css`
          &::after {
            content: '';
            position: relative;
            background: var(--red-publish);
            width: 0.625rem;
            height: 0.625rem;
            border-radius: 2rem;
            margin: 0.4375rem;
          }
        `
      : ''}
`;

const StyledRequirementLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

export interface RequirementProps {
  text: string | React.ReactNode;
  fulfilled: boolean;
  link?: {
    href: string;
    ariaLabel: string;
    targetId?: string;
    targetRef?: any;
  };
}

export const Requirement: React.FC<RequirementProps> = ({
  text,
  fulfilled,
  link
}: RequirementProps) => {
  const hasLink = typeof link !== 'undefined';

  const renderedRequirement = (
    <StyledRequirement fulfilled={fulfilled} hasLink={hasLink}>
      <StyledRequirementMark fulfilled={fulfilled}>
        {fulfilled && <Check color="var(--green-publish)"/>}
      </StyledRequirementMark>
      <StyledRequirementText>{text}</StyledRequirementText>
    </StyledRequirement>
  );

  const handleClick = () => {
    link.targetRef?.current?.focus()
  }

  return hasLink ? (
    <li>
      <Link href={link.href} passHref>
        <StyledRequirementLink 
          aria-label={link.ariaLabel}
          onClick={handleClick}
        >
          {renderedRequirement}
        </StyledRequirementLink>
      </Link>
    </li>
  ) : (
    renderedRequirement
  );
};
