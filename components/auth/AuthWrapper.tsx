import styled from '@emotion/styled';
import Image from 'next/image';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

const StyledAuthWrapper = styled.div`
  display: grid;
  grid-template-columns: 100%;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 50% 50%;
  }
`;

const StyledAuthWrapperContent = styled.div``;

const StyledAuthWrapperImage = styled.div`
  width: 100%;
  background: var(--grey-200);
  position: relative;
  height: 30rem;

  ${mq(Breakpoint.mid)} {
    position: sticky;
    top: var(--header-height);
    height: calc(var(--app-height) - var(--header-height));
  }
`;

export const AuthFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
`;

export const AuthFormItem = styled.div<{
  justifyContent?:
    | 'center'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'normal'
    | 'flex-start'
    | 'flex-end'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | 'stretch';
}>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  column-gap: 1.5rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

export const AuthHead = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
`;

export const AuthHeadline = styled.h1`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;
`;

export const AuthSubline = styled.h2`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
`;

export const AuthContent = styled.div`
  padding: 2.25rem 0.75rem;
  ${contentGrid(1)}
  row-gap: 2.25rem;

  > * {
    width: 100%;
    grid-column: 1 / -1;
  }

  ${mq(Breakpoint.mid)} {
    padding: 4.5rem 0;
    justify-items: center;
    ${contentGrid(6)}
    row-gap: 3rem;

    > * {
      grid-column: 2 / -2;
      max-width: 36rem;
    }
  }

  ${mq(Breakpoint.widish)} {
    padding: 6rem 0;
  }

  ${mq(Breakpoint.wide)} {
    padding: 7rem 0;
  }

  ${mq(Breakpoint.ultra)} {
    padding: 8rem 0;
  }
`;

interface AuthWrapperProps {
  children: React.ReactNode;
  image: {
    src: StaticImageData;
    credits?: {
      name: string;
      url: string;
    };
  };
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, image }: AuthWrapperProps) => {
  return (
    <StyledAuthWrapper>
      <StyledAuthWrapperContent>{children}</StyledAuthWrapperContent>
      <StyledAuthWrapperImage>
        <Image src={image.src} layout="fill" objectFit="cover" alt="" />
      </StyledAuthWrapperImage>
    </StyledAuthWrapper>
  );
};
