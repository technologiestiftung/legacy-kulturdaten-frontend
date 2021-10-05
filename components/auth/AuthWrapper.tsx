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

export const AuthHeadline = styled.h1`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;
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
    padding: 3rem 0;
    justify-items: center;
    ${contentGrid(6)}
    row-gap: 3rem;

    > * {
      grid-column: 2 / -2;
      max-width: 36rem;
    }
  }

  ${mq(Breakpoint.widish)} {
    padding: 5rem 0;
  }

  ${mq(Breakpoint.wide)} {
    padding: 7rem 0;
  }

  ${mq(Breakpoint.ultra)} {
    padding: 10rem 0;
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
        <Image src={image.src} layout="fill" objectFit="cover" />
      </StyledAuthWrapperImage>
    </StyledAuthWrapper>
  );
};
