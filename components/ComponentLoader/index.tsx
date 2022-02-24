import styled from '@emotion/styled';
import { useT } from '../../lib/i18n';
import { StyledLoadingScreenWobbler } from '../Loading/LoadingScreen';

const StyledLoader = styled.div`
  width: 100%;
  height: 6rem;
  padding-bottom: 15%;
  background: var(--grey-200);
  display: flex;
  align-items: stretch;
  position: relative;
  border-radius: 0.75rem;
`;

const StyledLoaderInner = styled.div`
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledLoaderInnerText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  position: absolute;
  bottom: 0.75rem;
  color: var(--grey-600);
`;

export const ComponentLoader: React.FC = () => {
  const t = useT();

  return (
    <StyledLoader>
      <StyledLoaderInner>
        <StyledLoadingScreenWobbler invert />
        <StyledLoaderInnerText>{t('loader.loading')}</StyledLoaderInnerText>
      </StyledLoaderInner>
    </StyledLoader>
  );
};
