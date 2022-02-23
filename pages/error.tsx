import React from 'react';
import { NextPage } from 'next';
import { AppWrapper } from '../components/wrappers/AppWrapper';
import { ContentContainer, ContentWrapper } from '../components/wrappers/ContentWrappers';
import { useT } from '../lib/i18n';
import styled from '@emotion/styled';

const StyledError = styled.div`
  padding: 5rem 0;
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
`;

const StyledErrorHeadline = styled.h1`
  font-size: var(--font-size-700);
  line-height: var(--line-height-700);
  font-weight: 700;
`;

const StyledErrorText = styled.p`
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
`;

const TeamPage: NextPage = () => {
  const t = useT();

  return (
    <AppWrapper>
      <ContentWrapper>
        <ContentContainer>
          <StyledError>
            <StyledErrorHeadline>{t('errors.server.headline')}</StyledErrorHeadline>
            <StyledErrorText>{t('errors.server.text')}</StyledErrorText>
          </StyledError>
        </ContentContainer>
      </ContentWrapper>
    </AppWrapper>
  );
};

export default TeamPage;
